import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, ArrowLeft, User, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BankAccount {
  account_holder_name: string;
  bank_name: string | null;
  account_number: string | null;
  routing_number: string | null;
  account_type: string;
  iban: string | null;
}

interface AmbassadorProfile {
  nickname: string;
  email: string;
  full_name: string | null;
  user_id: string;
}

interface Submission {
  id: string;
  store_name: string;
  store_url: string;
  city: string;
  status: string;
  created_at: string;
  ambassador_id: string;
  commission_amount: number;
  ambassador_profiles?: AmbassadorProfile | null;
  bank_account?: BankAccount | null;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast.error("You must be logged in");
      navigate('/ambassador-program');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id);

    const hasAdminRole = roles?.some(r => r.role === 'admin');
    
    if (!hasAdminRole) {
      toast.error("Access denied - Admin only");
      navigate('/ambassador-program');
      return;
    }

    setIsAdmin(true);
    loadSubmissions();
  };

  const loadSubmissions = async () => {
    try {
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('store_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      // Load ambassador profiles separately
      const ambassadorIds = [...new Set(submissionsData?.map(s => s.ambassador_id) || [])];
      const { data: profilesData } = await supabase
        .from('ambassador_profiles')
        .select('user_id, nickname, email, full_name')
        .in('user_id', ambassadorIds);

      // Load bank accounts for ambassadors
      const { data: bankAccountsData } = await supabase
        .from('bank_accounts')
        .select('user_id, account_holder_name, bank_name, account_number, routing_number, account_type, iban')
        .in('user_id', ambassadorIds);

      // Merge data
      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      const bankAccountsMap = new Map(bankAccountsData?.map(b => [b.user_id, b]) || []);
      
      const mergedData = submissionsData?.map(sub => ({
        ...sub,
        ambassador_profiles: profilesMap.get(sub.ambassador_id) || null,
        bank_account: bankAccountsMap.get(sub.ambassador_id) || null
      })) || [];

      setSubmissions(mergedData as Submission[]);
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast.error("Error loading submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: string, ambassadorId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error: updateError } = await supabase
        .from('store_submissions')
        .update({
          status: 'confirmed',
          commission_amount: 50.00,
          approved_at: new Date().toISOString(),
          approved_by: session?.user.id
        })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      toast.success("Store confirmed! Commission: $50.00");
      loadSubmissions();
    } catch (error) {
      console.error('Error confirming submission:', error);
      toast.error("Error confirming submission");
    }
  };

  const handleReject = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('store_submissions')
        .update({ status: 'rejected' })
        .eq('id', submissionId);

      if (error) throw error;

      toast.success("Store rejected");
      loadSubmissions();
    } catch (error) {
      console.error('Error rejecting submission:', error);
      toast.error("Error rejecting submission");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Submitted</Badge>;
    }
  };

  const AmbassadorDetailsDialog = ({ submission }: { submission: Submission }) => {
    const profile = submission.ambassador_profiles;
    const bankAccount = submission.bank_account;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="border-primary/40 hover:bg-primary/20">
            <User className="h-4 w-4 mr-2" />
            Ver Perfil
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-black/95 border-primary/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-permanent-marker text-xl" style={{ color: '#b4fa74' }}>
              Perfil del Embajador
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Profile Info */}
            <div className="space-y-3">
              <h3 className="font-sedgwick-ave text-lg flex items-center gap-2" style={{ color: '#97c26c' }}>
                <User className="h-5 w-5" />
                Información Personal
              </h3>
              <div className="bg-black/50 rounded-lg p-4 space-y-2 border border-primary/20">
                <div>
                  <span className="text-xs text-gray-400">Nombre completo:</span>
                  <p className="text-white font-medium">{profile?.full_name || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Nickname:</span>
                  <p className="text-white font-medium">{profile?.nickname || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Email:</span>
                  <p className="text-white font-medium">{profile?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Bank Account Info */}
            <div className="space-y-3">
              <h3 className="font-sedgwick-ave text-lg flex items-center gap-2" style={{ color: '#97c26c' }}>
                <CreditCard className="h-5 w-5" />
                Datos Bancarios
              </h3>
              {bankAccount ? (
                <div className="bg-black/50 rounded-lg p-4 space-y-2 border border-primary/20">
                  <div>
                    <span className="text-xs text-gray-400">Titular de la cuenta:</span>
                    <p className="text-white font-medium">{bankAccount.account_holder_name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Tipo de cuenta:</span>
                    <p className="text-white font-medium">{bankAccount.account_type}</p>
                  </div>
                  
                  {bankAccount.account_type === 'USD' ? (
                    <>
                      {bankAccount.bank_name && (
                        <div>
                          <span className="text-xs text-gray-400">Banco:</span>
                          <p className="text-white font-medium">{bankAccount.bank_name}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-xs text-gray-400">Número de cuenta:</span>
                        <p className="text-[#b4fa74] font-mono">{bankAccount.account_number || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">Routing number:</span>
                        <p className="text-[#b4fa74] font-mono">{bankAccount.routing_number || 'N/A'}</p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <span className="text-xs text-gray-400">IBAN:</span>
                      <p className="text-[#b4fa74] font-mono">{bankAccount.iban || 'N/A'}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                  <p className="text-red-400 text-sm">
                    ⚠️ Este embajador no ha configurado sus datos bancarios
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/ambassador-program')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-permanent-marker" style={{ color: '#b4fa74' }}>
            Admin Panel
          </h1>
        </div>

        <Card className="bg-black/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-permanent-marker" style={{ color: '#97c26c' }}>
              Store Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No submissions yet
                </p>
              ) : (
                submissions.map((submission) => (
                  <Card key={submission.id} className="bg-black/30 border-primary/10">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-permanent-marker text-lg" style={{ color: '#b4fa74' }}>
                              {submission.store_name}
                            </h3>
                            {getStatusBadge(submission.status)}
                          </div>
                          <p className="text-sm text-gray-400">
                            <strong className="text-gray-300">URL:</strong>{' '}
                            <a href={submission.store_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {submission.store_url}
                            </a>
                          </p>
                          <p className="text-sm text-gray-400">
                            <strong className="text-gray-300">City:</strong> {submission.city}
                          </p>
                          <p className="text-sm text-gray-400">
                            <strong className="text-gray-300">Ambassador:</strong>{' '}
                            <span className="text-white">{submission.ambassador_profiles?.nickname}</span>{' '}
                            <span className="text-gray-500">({submission.ambassador_profiles?.email})</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(submission.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 items-end">
                          <AmbassadorDetailsDialog submission={submission} />
                          
                          {submission.status === 'submitted' && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleApprove(submission.id, submission.ambassador_id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confirm ($50)
                              </Button>
                              <Button
                                onClick={() => handleReject(submission.id)}
                                variant="destructive"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          )}

                          {submission.status === 'confirmed' && (
                            <p className="text-sm font-semibold text-green-500">
                              Commission: ${Number(submission.commission_amount || 0).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}