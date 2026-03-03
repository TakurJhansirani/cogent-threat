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
        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
          <TabsList className="bg-secondary/50 border border-border w-max sm:w-auto">
            <TabsTrigger value="siem" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Plug className="h-3.5 w-3.5" /> <span className="hidden sm:inline">SIEM</span> <span className="sm:hidden">SIEM</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Brain className="h-3.5 w-3.5" /> <span className="hidden sm:inline">AI Models</span> <span className="sm:hidden">AI</span>
            </TabsTrigger>
            <TabsTrigger value="escalation" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Bell className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Escalation Rules</span> <span className="sm:hidden">Rules</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Users className="h-3.5 w-3.5" /> <span className="hidden sm:inline">User Roles</span> <span className="sm:hidden">Roles</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="siem"><SIEMIntegrationSettings /></TabsContent>
        <TabsContent value="ai"><AIModelSettings /></TabsContent>
        <TabsContent value="escalation"><EscalationRulesSettings /></TabsContent>
        <TabsContent value="roles"><UserRoleSettings /></TabsContent>
      </Tabs>
    </div>
  );
};
