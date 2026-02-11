import { useState } from 'react';
import { Users, Shield, Clock, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Role = 'admin' | 'analyst-t2' | 'analyst-t1' | 'viewer';

interface UserEntry {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastActive: string;
  status: 'online' | 'offline';
}

const roleConfig: Record<Role, { label: string; className: string }> = {
  admin: { label: 'Admin', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  'analyst-t2': { label: 'Tier 2 Analyst', className: 'bg-warning/10 text-warning border-warning/20' },
  'analyst-t1': { label: 'Tier 1 Analyst', className: 'bg-primary/10 text-primary border-primary/20' },
  viewer: { label: 'Viewer', className: 'bg-info/10 text-info border-info/20' },
};

const initialUsers: UserEntry[] = [
  { id: 'u1', name: 'Sarah Chen', email: 'sarah.chen@ragis.io', role: 'admin', lastActive: '2024-12-15T14:32:00Z', status: 'online' },
  { id: 'u2', name: 'Marcus Webb', email: 'marcus.webb@ragis.io', role: 'analyst-t2', lastActive: '2024-12-15T14:28:00Z', status: 'online' },
  { id: 'u3', name: 'Aiko Tanaka', email: 'aiko.tanaka@ragis.io', role: 'analyst-t2', lastActive: '2024-12-15T13:15:00Z', status: 'online' },
  { id: 'u4', name: 'James Rivera', email: 'james.rivera@ragis.io', role: 'analyst-t1', lastActive: '2024-12-15T12:00:00Z', status: 'offline' },
  { id: 'u5', name: 'Priya Sharma', email: 'priya.sharma@ragis.io', role: 'analyst-t1', lastActive: '2024-12-15T11:45:00Z', status: 'online' },
  { id: 'u6', name: 'David Kim', email: 'david.kim@ragis.io', role: 'viewer', lastActive: '2024-12-14T16:00:00Z', status: 'offline' },
];

export const UserRoleSettings = () => {
  const [users] = useState(initialUsers);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">User & Role Management</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Manage analyst access levels and permissions</p>
          </div>
          <button
            onClick={() => toast.info('Invite flow coming soon')}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
          >
            <Users className="h-3 w-3" /> Invite User
          </button>
        </div>

        {/* Role summary */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {(Object.entries(roleConfig) as [Role, typeof roleConfig[Role]][]).map(([role, config]) => (
            <div key={role} className="rounded-lg border border-border bg-secondary/50 p-3 text-center">
              <p className="text-lg font-bold text-foreground">{users.filter(u => u.role === role).length}</p>
              <p className={cn('text-[10px] font-semibold uppercase tracking-wider', config.className.split(' ').find(c => c.startsWith('text-')))}>{config.label}s</p>
            </div>
          ))}
        </div>

        {/* User table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Last Active</th>
                <th className="px-4 py-2.5 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-md border px-2 py-0.5 text-[10px] font-semibold', roleConfig[user.role].className)}>
                      {roleConfig[user.role].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={cn('h-2 w-2 rounded-full', user.status === 'online' ? 'bg-success' : 'bg-muted-foreground/40')} />
                      <span className="text-xs text-muted-foreground capitalize">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-muted-foreground">
                      {new Date(user.lastActive).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toast.info('User edit coming soon')}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
