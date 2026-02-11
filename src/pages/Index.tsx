import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardView } from '@/components/views/DashboardView';
import { IncidentsView } from '@/components/views/IncidentsView';
import { QueryView } from '@/components/views/QueryView';
import { TimelineView } from '@/components/views/TimelineView';
import { KnowledgeBaseView } from '@/components/views/KnowledgeBaseView';
import { ReportsView } from '@/components/views/ReportsView';
import { RootCauseView } from '@/components/views/RootCauseView';
import { SettingsView } from '@/components/views/SettingsView';
import { PlaceholderView } from '@/components/views/PlaceholderView';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'incidents':
        return <IncidentsView />;
      case 'query':
        return <QueryView />;
      case 'timeline':
        return <TimelineView />;
      case 'knowledge':
        return <KnowledgeBaseView />;
      case 'reports':
        return <ReportsView />;
      case 'analysis':
        return <RootCauseView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </DashboardLayout>
  );
};

export default Index;
