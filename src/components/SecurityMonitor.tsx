import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Eye, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecurityReport {
  timestamp: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'ERROR';
  health_check: any;
  recent_events: Array<{
    id: string;
    event_type: string;
    severity: string;
    created_at: string;
    details: any;
  }>;
  rate_limit_summary: Record<string, number>;
  wallet_summary: Record<string, any>;
  company_balance: number;
  suspicious_patterns: string[];
  system_checks: Record<string, boolean>;
  recommendations: string[];
}

export const SecurityMonitor = () => {
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchSecurityReport = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('enhanced-security-monitor');
      
      if (error) {
        throw error;
      }
      
      setReport(data);
      setLastUpdate(new Date());
      
      if (data.status === 'CRITICAL') {
        toast.error('Critical security issues detected!');
      } else if (data.status === 'WARNING') {
        toast.warning('Security warnings detected');
      }
    } catch (error) {
      console.error('Error fetching security report:', error);
      toast.error('Failed to fetch security report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityReport();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchSecurityReport, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'bg-green-100 text-green-800';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'ERROR': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY': return <CheckCircle className="h-4 w-4" />;
      case 'WARNING': return <AlertTriangle className="h-4 w-4" />;
      case 'CRITICAL': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!report && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitor
          </CardTitle>
          <CardDescription>Monitor system security status</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchSecurityReport}>
            Load Security Report
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Security Monitor</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto' : 'Manual'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSecurityReport}
                disabled={loading}
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh
              </Button>
            </div>
          </div>
          {lastUpdate && (
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last updated: {lastUpdate.toLocaleTimeString()}
            </CardDescription>
          )}
        </CardHeader>
        
        {report && (
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Badge className={getStatusColor(report.status)}>
                {getStatusIcon(report.status)}
                {report.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                System Status
              </span>
            </div>

            {/* System Checks */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {Object.entries(report.system_checks).map(([check, status]) => (
                <div key={check} className="flex items-center gap-1 text-xs">
                  {status ? 
                    <CheckCircle className="h-3 w-3 text-green-500" /> : 
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                  }
                  <span className={status ? 'text-green-700' : 'text-red-700'}>
                    {check.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            {report.recommendations.length > 0 && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Recommendations:</div>
                  <ul className="text-sm space-y-1">
                    {report.recommendations.map((rec, index) => (
                      <li key={index} className="list-disc list-inside">{rec}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Suspicious Patterns */}
            {report.suspicious_patterns.length > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Suspicious Patterns Detected:</div>
                  <ul className="text-sm space-y-1">
                    {report.suspicious_patterns.map((pattern, index) => (
                      <li key={index} className="list-disc list-inside">{pattern}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        )}
      </Card>

      {/* Recent Security Events */}
      {report && report.recent_events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {report.recent_events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(event.severity)} variant="outline">
                        {event.severity}
                      </Badge>
                      <span className="font-medium text-sm">{event.event_type}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(event.created_at).toLocaleString()}
                    </div>
                    {event.details && Object.keys(event.details).length > 0 && (
                      <div className="text-xs bg-gray-50 p-1 rounded mt-1">
                        {JSON.stringify(event.details, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rate Limiting & Wallet Summary */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rate Limiting Summary */}
          {Object.keys(report.rate_limit_summary).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Rate Limiting (Last Hour)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(report.rate_limit_summary).map(([action, count]) => (
                    <div key={action} className="flex justify-between text-sm">
                      <span>{action.replace(/_/g, ' ')}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wallet Summary */}
          {Object.keys(report.wallet_summary).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Wallet Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(report.wallet_summary).map(([currency, stats]: [string, any]) => (
                    <div key={currency} className="text-sm">
                      <div className="font-medium">{currency}</div>
                      <div className="text-xs text-muted-foreground ml-2">
                        Total: {stats.total?.toFixed(2)} | 
                        Count: {stats.count} | 
                        Max: {stats.max?.toFixed(2)}
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Company Balance:</span>
                      <Badge>${report.company_balance}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};