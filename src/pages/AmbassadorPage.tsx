import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import { z } from "zod";
import { StoreSubmissionForm } from "@/components/StoreSubmissionForm";
import { AmbassadorLeaderboard } from "@/components/AmbassadorLeaderboard";
import { Plus, CheckCircle, XCircle, Clock } from "lucide-react";
const ambassadorSchema = z.object({
  nickname: z.string().trim().min(2, "Nickname must be at least 2 characters").max(50, "Nickname must be less than 50 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
export default function AmbassadorPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [bankAccount, setBankAccount] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [profileNickname, setProfileNickname] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [iban, setIban] = useState("");
  const [accountType, setAccountType] = useState("USD");
  const navigate = useNavigate();
  const {
    t,
    language
  } = useLanguage();
  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (session?.user) {
        setUser(session.user);
        loadProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setTimeout(() => {
          loadProfile(session.user.id);
        }, 0);
      } else {
        setUser(null);
        setProfile(null);
        setRoles([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const loadProfile = async (userId: string) => {
    const {
      data: profileData,
      error: profileError
    } = await supabase.from('ambassador_profiles').select('*').eq('user_id', userId).maybeSingle();
    if (profileError) {
      console.error('Error loading profile:', profileError);
      return;
    }
    setProfile(profileData);
    setFullName(profileData?.full_name || "");
    setProfileNickname(profileData?.nickname || "");
    
    const {
      data: rolesData,
      error: rolesError
    } = await supabase.from('user_roles').select('role').eq('user_id', userId);
    if (rolesError) {
      console.error('Error loading roles:', rolesError);
      return;
    }
    setRoles(rolesData?.map(r => r.role) || []);

    // Load submissions
    loadSubmissions(userId);
    
    // Load bank account
    loadBankAccount(userId);
  };
  
  const loadBankAccount = async (userId: string) => {
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error loading bank account:', error);
      return;
    }
    
    if (data) {
      setBankAccount(data);
      setAccountNumber(data.account_number || "");
      setRoutingNumber(data.routing_number || "");
      setIban(data.iban || "");
      setAccountType(data.account_type || "USD");
    }
  };
  const loadSubmissions = async (userId: string) => {
    const {
      data,
      error
    } = await supabase.from('store_submissions').select('*').eq('ambassador_id', userId).order('created_at', {
      ascending: false
    });
    if (error) {
      console.error('Error loading submissions:', error);
      return;
    }
    setSubmissions(data || []);
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validatedData = ambassadorSchema.parse({
        nickname,
        email,
        password
      });
      const {
        data: authData,
        error: authError
      } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/ambassador-program`
        }
      });
      if (authError) throw authError;
      if (authData.user) {
        const {
          error: profileError
        } = await supabase.from('ambassador_profiles').insert({
          user_id: authData.user.id,
          nickname: validatedData.nickname,
          email: validatedData.email
        });
        if (profileError) throw profileError;
        toast.success(t('ambassador.accountCreated'));
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || t('ambassador.createError'));
      }
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      toast.success(t('ambassador.loginSuccess'));
    } catch (error: any) {
      toast.error(error.message || t('ambassador.loginError'));
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success(t('ambassador.logoutSuccess'));
  };
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!user) throw new Error('No user found');
      
      // Update profile
      const { error: profileError } = await supabase
        .from('ambassador_profiles')
        .update({
          full_name: fullName,
          nickname: profileNickname,
        })
        .eq('user_id', user.id);
      
      if (profileError) throw profileError;
      
      // Update or insert bank account using full_name as account_holder_name
      const bankData = {
        user_id: user.id,
        account_holder_name: fullName,
        account_number: accountType === 'USD' ? accountNumber : null,
        routing_number: accountType === 'USD' ? routingNumber : null,
        iban: accountType === 'EUR' ? iban : null,
        account_type: accountType,
      };
      
      if (bankAccount) {
        const { error } = await supabase
          .from('bank_accounts')
          .update(bankData)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bank_accounts')
          .insert(bankData);
        
        if (error) throw error;
      }
      
      toast.success(language === 'en' ? 'Profile saved successfully!' : '¡Perfil guardado exitosamente!');
      loadProfile(user.id);
    } catch (error: any) {
      toast.error(error.message || (language === 'en' ? 'Error saving profile' : 'Error al guardar perfil'));
    } finally {
      setLoading(false);
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return language === 'en' ? 'Confirmed +$50' : 'Confirmado +$50';
      case 'rejected':
        return t('ambassador.submissions.rejected');
      default:
        return language === 'en' ? 'Submitted' : 'Enviado';
    }
  };
  
  const totalEarnings = submissions
    .filter(s => s.status === 'confirmed')
    .reduce((sum, s) => sum + (Number(s.commission_amount) || 0), 0);
  const isPremium = roles.includes('premium_ambassador');
  return <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-4">
            <div className="w-full md:w-auto">
              <h1 className="text-3xl md:text-4xl font-permanent-marker mb-2" style={{
              color: '#699e4b'
            }}>
                {user && profile ? t('ambassador.dashboard') : language === 'en' ? 'Ambassador Program' : 'Programa de Embajadores'}
              </h1>
              {user && profile && <p className="text-subtitle-styled font-sedgwick-ave text-xl md:text-2xl">
                  {t('ambassador.welcome')}, {profile.nickname}!
                  {isPremium && <span className="ml-2 px-3 py-1 bg-accent text-primary rounded-full text-sm font-permanent-marker">
                      PREMIUM
                    </span>}
                </p>}
            </div>
            <div className="flex items-start gap-2 self-end md:self-start">
              {roles.includes('admin') && (
                <Button size="sm" onClick={() => navigate('/admin')} className="bg-accent hover:bg-accent/90 font-permanent-marker text-xs">
                  Admin Panel
                </Button>
              )}
              <Button size="sm" onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90 font-permanent-marker text-xs">
                Home
              </Button>
              {user && profile ? (
                <Button size="sm" onClick={handleLogout} className="bg-primary hover:bg-primary/90 font-permanent-marker text-xs">
                  {t('ambassador.logout')}
                </Button>
              ) : (
                <div className="flex flex-col gap-2 bg-black/80 p-4 rounded-lg border border-primary/20">
                  <div className="flex gap-2 mb-2">
                    <Button 
                      onClick={() => setIsLogin(true)} 
                      variant={isLogin ? "default" : "ghost"} 
                      size="sm"
                      className="font-permanent-marker text-xs h-8 px-3"
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => setIsLogin(false)} 
                      variant={!isLogin ? "default" : "ghost"} 
                      size="sm"
                      className="font-permanent-marker text-xs h-8 px-3"
                    >
                      Sign Up
                    </Button>
                  </div>
                  
                  <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-2 w-56">
                    {!isLogin && <div>
                        <Input 
                          id="nickname" 
                          type="text" 
                          placeholder={t('ambassador.nickname')}
                          value={nickname} 
                          onChange={e => setNickname(e.target.value)} 
                          required 
                          className="text-white bg-black/50 border-primary/40 text-sm h-9 px-3 placeholder:text-gray-400" 
                          maxLength={50} 
                        />
                      </div>}

                    <div>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Email"
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                        className="text-white bg-black/50 border-primary/40 text-sm h-9 px-3 placeholder:text-gray-400" 
                        maxLength={255} 
                      />
                    </div>

                    <div>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder={t('ambassador.password')}
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                        className="text-white bg-black/50 border-primary/40 text-sm h-9 px-3 placeholder:text-gray-400" 
                        minLength={6} 
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading} 
                      size="sm"
                      className="w-full bg-accent hover:bg-accent/90 font-permanent-marker text-sm h-9" 
                      style={{
                        color: '#611a5a'
                      }}
                    >
                      {loading ? t('ambassador.loading') : isLogin ? t('ambassador.loginBtn') : t('ambassador.signupBtn')}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Dashboard Section (only for authenticated users) */}
          {user && profile && <>
              {/* Action Buttons */}
              <div className="mb-8 flex gap-4">
                {!showForm && !showProfile && (
                  <>
                    <Button onClick={() => setShowForm(true)} className="bg-accent hover:bg-accent/90 font-permanent-marker text-lg px-8 py-4" style={{
                      color: '#611a5a'
                    }}>
                      <Plus className="mr-2 h-5 w-5" />
                      {t('ambassador.gotStore')}
                    </Button>
                    <Button onClick={() => setShowProfile(true)} className="bg-primary hover:bg-primary/90 font-permanent-marker text-lg px-8 py-4">
                      {language === 'en' ? 'My Profile' : 'Mi Perfil'}
                    </Button>
                  </>
                )}
              </div>

              {/* Store Submission Form */}
              {showForm && <div className="mb-8">
                  <StoreSubmissionForm onSuccess={() => {
                    setShowForm(false);
                    loadSubmissions(user.id);
                  }} onCancel={() => setShowForm(false)} />
                </div>}

              {/* My Profile Section */}
              {showProfile && (
                <Card className="bg-black/50 border-primary/20 mb-8">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl font-permanent-marker" style={{ color: '#699e4b' }}>
                        {language === 'en' ? 'My Profile' : 'Mi Perfil'}
                      </CardTitle>
                      <Button 
                        size="sm" 
                        onClick={() => setShowProfile(false)} 
                        variant="outline"
                        className="font-permanent-marker text-xs"
                      >
                        {language === 'en' ? 'Close' : 'Cerrar'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      {/* Personal Information Section */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-permanent-marker" style={{ color: '#699e4b' }}>
                          {language === 'en' ? 'Personal Information' : 'Información Personal'}
                        </h3>
                        
                        <div>
                          <Label htmlFor="fullName" className="font-sedgwick-ave text-subtitle-styled text-base">
                            {language === 'en' ? 'Full Name' : 'Nombre Completo'}
                          </Label>
                          <Input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder={language === 'en' ? 'John Doe' : 'Juan Pérez'}
                            required
                            className="mt-1 text-[#b4fa74] bg-black/50 border-primary/40 placeholder:text-gray-500"
                            maxLength={100}
                          />
                          <p className="text-xs mt-1 font-sedgwick-ave" style={{ color: '#97c26c' }}>
                            {language === 'en' 
                              ? 'Your legal name for payment processing' 
                              : 'Tu nombre legal para el procesamiento de pagos'
                            }
                          </p>
                        </div>
                        
                        <div>
                          <Label htmlFor="profileNickname" className="font-sedgwick-ave text-subtitle-styled text-base">
                            {language === 'en' ? 'Nickname (for leaderboard)' : 'Apodo (para el ranking)'}
                          </Label>
                          <Input
                            id="profileNickname"
                            type="text"
                            value={profileNickname}
                            onChange={(e) => setProfileNickname(e.target.value)}
                            placeholder={language === 'en' ? 'Your display name' : 'Tu nombre público'}
                            required
                            className="mt-1 text-[#b4fa74] bg-black/50 border-primary/40 placeholder:text-gray-500"
                            maxLength={50}
                          />
                          <p className="text-xs mt-1 font-sedgwick-ave" style={{ color: '#97c26c' }}>
                            {language === 'en' 
                              ? 'This name will appear on the public leaderboard showing top ambassadors' 
                              : 'Este nombre aparecerá en el ranking público mostrando los mejores embajadores'
                            }
                          </p>
                        </div>
                      </div>
                      
                      {/* Bank Account Section */}
                      <div className="space-y-4 pt-4 border-t border-primary/20">
                        <h3 className="text-xl font-permanent-marker" style={{ color: '#699e4b' }}>
                          {language === 'en' ? 'Bank Account (USD and EUR only)' : 'Cuenta Bancaria (solo USD y EUR)'}
                        </h3>
                        <p className="text-subtitle-styled font-sedgwick-ave text-base">
                          {language === 'en' 
                            ? 'Enter your bank account details to receive payments' 
                            : 'Ingresa los datos de tu cuenta bancaria para recibir pagos'
                          }
                        </p>
                        
                        <div>
                          <Label htmlFor="accountType" className="font-sedgwick-ave text-subtitle-styled text-base">
                            {language === 'en' ? 'Currency' : 'Moneda'}
                          </Label>
                          <select
                            id="accountType"
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-md border border-primary/40 bg-black/50 text-[#b4fa74] font-sedgwick-ave"
                            required
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                          </select>
                        </div>
                        
                        {accountType === 'USD' && (
                          <>
                            <div>
                              <Label htmlFor="accountNumber" className="font-sedgwick-ave text-subtitle-styled text-base">
                                {language === 'en' ? 'Account Number' : 'Número de Cuenta'}
                              </Label>
                              <Input
                                id="accountNumber"
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                placeholder="000123456789"
                                required
                                className="mt-1 text-[#b4fa74] bg-black/50 border-primary/40 placeholder:text-gray-500"
                                maxLength={17}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="routingNumber" className="font-sedgwick-ave text-subtitle-styled text-base">
                                {language === 'en' ? 'Routing Number (9 digits)' : 'Número de Ruta (9 dígitos)'}
                              </Label>
                              <Input
                                id="routingNumber"
                                type="text"
                                value={routingNumber}
                                onChange={(e) => setRoutingNumber(e.target.value)}
                                placeholder="021000021"
                                required
                                className="mt-1 text-[#b4fa74] bg-black/50 border-primary/40 placeholder:text-gray-500"
                                maxLength={9}
                                pattern="[0-9]{9}"
                              />
                            </div>
                          </>
                        )}
                        
                        {accountType === 'EUR' && (
                          <div>
                            <Label htmlFor="iban" className="font-sedgwick-ave text-subtitle-styled text-base">
                              IBAN
                            </Label>
                            <Input
                              id="iban"
                              type="text"
                              value={iban}
                              onChange={(e) => setIban(e.target.value.toUpperCase())}
                              placeholder="ES12 3456 7890 1234 5678 9012"
                              required
                              className="mt-1 text-[#b4fa74] bg-black/50 border-primary/40 placeholder:text-gray-500"
                              maxLength={34}
                            />
                            <p className="text-xs mt-1 font-sedgwick-ave" style={{ color: '#97c26c' }}>
                              {language === 'en' 
                                ? 'International Bank Account Number for EUR transfers' 
                                : 'Número de cuenta bancaria internacional para transferencias en EUR'
                              }
                            </p>
                          </div>
                        )}
                      
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-accent hover:bg-accent/90 font-permanent-marker"
                        style={{ color: '#611a5a' }}
                      >
                        {loading 
                          ? (language === 'en' ? 'Saving...' : 'Guardando...') 
                          : (language === 'en' ? 'Save Profile' : 'Guardar Perfil')
                        }
                      </Button>
                    </div>
                  </form>
                  </CardContent>
                </Card>
              )}

              {/* My Onboarded Stores */}
              <Card className="bg-black/50 border-primary/20 mb-8">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-permanent-marker" style={{
                      color: '#699e4b'
                    }}>
                      {language === 'en' ? 'My Onboarded Stores' : 'Mis Tiendas Incorporadas'}
                    </CardTitle>
                    {totalEarnings > 0 && (
                      <div className="text-right">
                    <p className="text-subtitle-styled font-sedgwick-ave text-base">
                          {language === 'en' ? 'Total Earnings' : 'Ganancias Totales'}
                        </p>
                        <p className="text-2xl font-permanent-marker text-accent">
                          ${totalEarnings.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {submissions.length === 0 ? <p className="text-center text-subtitle-styled font-sedgwick-ave text-xl py-8">
                      {language === 'en' ? 'No stores submitted yet' : 'Aún no has enviado ninguna tienda'}
                    </p> : <div className="space-y-4">
                      {submissions.map((submission) => (
                        <div
                          key={submission.id}
                          className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-primary/10"
                        >
                          <div className="flex-1">
                            <h3 className="font-permanent-marker text-lg" style={{ color: '#699e4b' }}>
                              {submission.store_name}
                            </h3>
                            <p className="text-subtitle-styled font-sedgwick-ave text-base mt-1">
                              {submission.city}
                            </p>
                            <a
                              href={submission.store_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-accent hover:underline font-sedgwick-ave"
                            >
                              {submission.store_url}
                            </a>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={submission.status === 'confirmed' ? 'default' : submission.status === 'rejected' ? 'destructive' : 'secondary'}
                              className="font-permanent-marker"
                            >
                              <span className="flex items-center gap-2">
                                {getStatusIcon(submission.status)}
                                {getStatusText(submission.status)}
                              </span>
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>}
                </CardContent>
              </Card>
            </>}

          {/* Earning Opportunities (visible to everyone) */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div>
              <img src="/lovable-uploads/ambassador-program.png" alt="GreenHunt Ambassador" className="w-full rounded-lg" />
            </div>
            <div className="space-y-6">
              <div className="bg-black/50 p-6 rounded-lg border border-primary/20">
                <h2 className="text-2xl font-permanent-marker mb-4" style={{
                color: '#699e4b'
              }}>
                  {language === 'en' ? 'Earning Opportunities' : 'Oportunidades de Ganar'}
                </h2>
                <div className="space-y-4 text-subtitle-styled font-sedgwick-ave text-lg md:text-xl">
                  <div className="border-l-4 border-accent pl-4">
                    <p className="font-bold text-accent">
                      {language === 'en' ? 'Get a thrift store on board in NYC, Brooklyn, or New Jersey' : 'Consigue una tienda de segunda mano en NYC, Brooklyn o New Jersey'}
                    </p>
                    <p className="mt-2 my-[20px]">
                      {language === 'en' ? 'Sign the agreement explained below and earn $50 and become a GreenHunt Premium Ambassador for life. Premium Ambassadors will earn more money in the future affiliate program by bringing in users, stores, or access to other exclusive promotions.' : 'Firma el acuerdo explicado abajo y gana $50 y conviértete en Embajador Premium de GreenHunt de por vida. Los Embajadores Premium ganarán más dinero en el futuro programa de afiliados trayendo usuarios, tiendas o acceso a otras promociones exclusivas.'}
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-bold" style={{
                    color: '#699e4b'
                  }}>
                      {language === 'en' ? 'Get a thrift store anywhere in the world' : 'Consigue una tienda de segunda mano en cualquier parte del mundo'}
                    </p>
                    <p className="mt-2 my-[11px]">
                      {language === 'en' ? 'Sign the agreement explained below and become a GreenHunt Premium Ambassador for life.' : 'Firma el acuerdo explicado abajo y conviértete en Embajador Premium de GreenHunt de por vida.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard (visible to everyone) */}
          <div className="mb-12">
            <AmbassadorLeaderboard />
          </div>

          {/* Agreement Section (visible to everyone) */}
          <div className="bg-black/50 p-6 rounded-lg border border-primary/20 mb-8">
            <h2 className="text-2xl font-permanent-marker mb-4" style={{
            color: '#699e4b'
          }}>
              {language === 'en' ? 'Pre-Launch Agreement - Thrift Stores' : 'Acuerdo de Pre-Lanzamiento - Tiendas de Segunda Mano'}
            </h2>
            <div className="space-y-4 text-subtitle-styled font-sedgwick-ave text-lg md:text-xl mb-6">
              <div>
                <h3 className="font-permanent-marker text-xl mb-2" style={{
                color: '#699e4b'
              }}>
                  {language === 'en' ? 'Obligations:' : 'Obligaciones:'}
                </h3>
                <p>
                  {language === 'en' ? 'Create a profile on the app, upload the store\'s catalog, and display a GreenHunt poster and sticker in the store before the app launch.' : 'Crear un perfil en la app, subir el catálogo de la tienda y mostrar un póster y pegatina de GreenHunt en la tienda antes del lanzamiento de la app.'}
                </p>
              </div>
              <div>
                <h3 className="font-permanent-marker text-xl mb-2" style={{
                color: '#699e4b'
              }}>
                  {language === 'en' ? 'Rights:' : 'Derechos:'}
                </h3>
                <p>
                  {language === 'en' ? 'The Partner has the right (but not the obligation) to invest in the company at a $5 million valuation, starting from $100 USD through SAFE notes. This right expires six (6) months after the app launch or once the $500,000 funding goal has been reached, whichever comes first.' : 'El Socio tiene el derecho (pero no la obligación) de invertir en la empresa con una valoración de $5 millones, comenzando desde $100 USD a través de notas SAFE. Este derecho expira seis (6) meses después del lanzamiento de la app o una vez que se haya alcanzado el objetivo de financiación de $500,000, lo que ocurra primero.'}
                </p>
              </div>
            </div>
            <a href="/GreenHunt_Prelaunch_Agreement.pdf" target="_blank" rel="noopener noreferrer" className="block">
              <img src="/lovable-uploads/agreement-preview.jpg" alt="Pre-Launch Agreement" className="w-full max-w-2xl mx-auto rounded-lg hover:opacity-80 transition-opacity cursor-pointer border-2 border-primary/30 hover:border-primary" />
            </a>
            <p className="text-center text-subtitle-styled font-sedgwick-ave text-lg mt-4">
              {language === 'en' ? 'Click the image above to view the full agreement' : 'Haz clic en la imagen de arriba para ver el acuerdo completo'}
            </p>
          </div>

        </div>
      </div>
    </div>;
}