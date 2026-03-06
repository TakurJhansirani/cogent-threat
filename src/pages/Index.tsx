import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';
import { DashboardView } from '@/components/views/DashboardView';
import { IncidentsView } from '@/components/views/IncidentsView';
import { QueryView } from '@/components/views/QueryView';
import { TimelineView } from '@/components/views/TimelineView';
import { KnowledgeBaseView } from '@/components/views/KnowledgeBaseView';
import { ReportsView } from '@/components/views/ReportsView';
import { RootCauseView } from '@/components/views/RootCauseView';
import { SettingsView } from '@/components/views/SettingsView';
import { AccessDeniedView } from '@/components/views/AccessDeniedView';

const Index = () => {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading, isAdmin, canWrite } = useUserRole();
  const [activeView, setActiveView] = useState('dashboard');

  if (loading || roleLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'incidents':
        return <IncidentsView />;
      case 'query':
        return canWrite ? <QueryView /> : <AccessDeniedView onGoBack={() => setActiveView('dashboard')} />;
      case 'timeline':
        return <TimelineView />;
      case 'knowledge':
        return canWrite ? <KnowledgeBaseView /> : <AccessDeniedView onGoBack={() => setActiveView('dashboard')} />;
      case 'reports':
        return <ReportsView />;
      case 'analysis':
        return canWrite ? <RootCauseView /> : <AccessDeniedView onGoBack={() => setActiveView('dashboard')} />;
      case 'settings':
        return isAdmin ? <SettingsView /> : <AccessDeniedView onGoBack={() => setActiveView('dashboard')} />;
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
