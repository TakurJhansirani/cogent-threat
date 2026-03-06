import {
  LayoutDashboard,
  Shield,
  Search,
  Clock,
  FileText,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Brain,
  GitBranch,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserRole } from '@/hooks/useUserRole';
import type { Database as DB } from '@/integrations/supabase/types';

type AppRole = DB['public']['Enums']['app_role'];

interface SidebarProps {
  collapsed: boolean;
  activeView: string;
  onViewChange: (view: string) => void;
  onToggle: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  roles?: AppRole[]; // if undefined, all roles can see it
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'incidents', label: 'Incidents', icon: Shield },
  { id: 'query', label: 'AI Query', icon: Brain, roles: ['admin', 'analyst'] },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'knowledge', label: 'Knowledge Base', icon: Database, roles: ['admin', 'analyst'] },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'analysis', label: 'Root Cause', icon: GitBranch, roles: ['admin', 'analyst'] },
];

const bottomItems: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export const Sidebar = ({ collapsed, activeView, onViewChange, onToggle }: SidebarProps) => {
  const { role, loading } = useUserRole();

  const filterByRole = (items: NavItem[]) =>
    items.filter((item) => !item.roles || (role && item.roles.includes(role)));

  const visibleNav = filterByRole(navItems);
  const visibleBottom = filterByRole(bottomItems);

  return (
    <aside
      className={cn(
        'relative flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-sm font-bold tracking-wider text-foreground">RAGIS</h1>
            <p className="text-[10px] font-medium tracking-widest text-muted-foreground">SOC PLATFORM</p>
          </div>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && role && (
        <div className="mx-3 mt-3 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5">
          <Lock className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {role}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-3 sm:py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                isActive
                  ? 'bg-primary/10 text-primary glow-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-primary')} />
              {!collapsed && <span className="animate-fade-in">{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      {visibleBottom.length > 0 && (
        <div className="border-t border-sidebar-border px-2 py-4">
          {visibleBottom.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 sm:py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:scale-[0.98]"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 hidden lg:flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
};
