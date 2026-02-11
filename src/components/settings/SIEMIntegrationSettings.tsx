import { useState } from 'react';
import { Plug, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SIEMIntegration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  eventsIngested?: number;
}

const initialIntegrations: SIEMIntegration[] = [
  { id: 'splunk', name: 'Splunk Enterprise', description: 'Forward alerts and logs from Splunk via HEC', status: 'connected', lastSync: '2024-12-15T14:30:00Z', eventsIngested: 142850 },
  { id: 'elastic', name: 'Elastic SIEM', description: 'Bi-directional sync with Elasticsearch indices', status: 'connected', lastSync: '2024-12-15T14:28:00Z', eventsIngested: 98420 },
  { id: 'sentinel', name: 'Microsoft Sentinel', description: 'Azure Sentinel workspace integration via API', status: 'disconnected' },
  { id: 'crowdstrike', name: 'CrowdStrike Falcon', description: 'EDR telemetry and detection feeds', status: 'error', lastSync: '2024-12-15T09:00:00Z', eventsIngested: 45200 },
  { id: 'paloalto', name: 'Palo Alto Cortex XSIAM', description: 'XDR alerts and network telemetry', status: 'disconnected' },
];

const statusConfig = {
  connected: { icon: CheckCircle, label: 'Connected', className: 'text-success' },
  disconnected: { icon: XCircle, label: 'Disconnected', className: 'text-muted-foreground' },
  error: { icon: XCircle, label: 'Error', className: 'text-destructive' },
};

export const SIEMIntegrationSettings = () => {
  const [integrations, setIntegrations] = useState(initialIntegrations);

  const toggleConnection = (id: string) => {
    setIntegrations(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newStatus = i.status === 'connected' ? 'disconnected' : 'connected';
      toast.success(`${i.name} ${newStatus === 'connected' ? 'connected' : 'disconnected'}`);
      return { ...i, status: newStatus, lastSync: newStatus === 'connected' ? new Date().toISOString() : i.lastSync };
    }));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-1">SIEM & EDR Integrations</h2>
        <p className="text-xs text-muted-foreground mb-4">Connect external security platforms for unified alert ingestion and correlation</p>

        <div className="space-y-3">
          {integrations.map((intg) => {
            const StatusIcon = statusConfig[intg.status].icon;
            return (
              <div key={intg.id} className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
                  <Plug className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{intg.name}</h3>
                    <StatusIcon className={cn('h-3.5 w-3.5', statusConfig[intg.status].className)} />
                    <span className={cn('text-[10px] font-medium uppercase tracking-wider', statusConfig[intg.status].className)}>
                      {statusConfig[intg.status].label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{intg.description}</p>
                  {intg.lastSync && (
                    <p className="text-[10px] font-mono text-muted-foreground mt-1">
                      Last sync: {new Date(intg.lastSync).toLocaleString()}
                      {intg.eventsIngested && ` • ${intg.eventsIngested.toLocaleString()} events`}
                    </p>
                  )}
                </div>
                <Switch
                  checked={intg.status === 'connected'}
                  onCheckedChange={() => toggleConnection(intg.id)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
