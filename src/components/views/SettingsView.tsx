import { useState } from 'react';
import { Settings, Plug, Brain, Bell, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SIEMIntegrationSettings } from '@/components/settings/SIEMIntegrationSettings';
import { AIModelSettings } from '@/components/settings/AIModelSettings';
import { EscalationRulesSettings } from '@/components/settings/EscalationRulesSettings';
import { UserRoleSettings } from '@/components/settings/UserRoleSettings';

export const SettingsView = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure integrations, AI models, escalation policies, and user access
        </p>
      </div>

      <Tabs defaultValue="siem" className="space-y-4">
        <TabsList className="bg-secondary/50 border border-border">
          <TabsTrigger value="siem" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Plug className="h-3.5 w-3.5" /> SIEM Integrations
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Brain className="h-3.5 w-3.5" /> AI Models
          </TabsTrigger>
          <TabsTrigger value="escalation" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Bell className="h-3.5 w-3.5" /> Escalation Rules
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Users className="h-3.5 w-3.5" /> User Roles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="siem"><SIEMIntegrationSettings /></TabsContent>
        <TabsContent value="ai"><AIModelSettings /></TabsContent>
        <TabsContent value="escalation"><EscalationRulesSettings /></TabsContent>
        <TabsContent value="roles"><UserRoleSettings /></TabsContent>
      </Tabs>
    </div>
  );
};
