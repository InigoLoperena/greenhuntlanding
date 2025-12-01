import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";

interface Submission {
  id: string;
  store_name: string;
  store_url: string;
  city: string;
  status: string;
  created_at: string;
  ambassador_id: string;
  commission_amount: number;
  ambassador_profiles?: {
    nickname: string;
    email: string;
  } | null;
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
        .select('user_id, nickname, email')
        .in('user_id', ambassadorIds);

      // Merge data
      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      const mergedData = submissionsData?.map(sub => ({
        ...sub,
        ambassador_profiles: profilesMap.get(sub.ambassador_id) || null
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

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/ambassador-program')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-permanent-marker" style={{ color: '#699e4b' }}>
            Admin Panel
          </h1>
        </div>

        <Card className="bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-permanent-marker">
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
                  <Card key={submission.id} className="bg-background/50 border-primary/10">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-permanent-marker text-lg" style={{ color: '#699e4b' }}>
                              {submission.store_name}
                            </h3>
                            {getStatusBadge(submission.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <strong>URL:</strong> <a href={submission.store_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{submission.store_url}</a>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong>City:</strong> {submission.city}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Ambassador:</strong> {submission.ambassador_profiles?.nickname} ({submission.ambassador_profiles?.email})
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Submitted: {new Date(submission.created_at).toLocaleDateString()}
                          </p>
                        </div>

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
                          <div className="text-right">
                            <p className="text-sm font-semibold text-green-500">
                              Commission: ${Number(submission.commission_amount || 0).toFixed(2)}
                            </p>
                          </div>
                        )}
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
