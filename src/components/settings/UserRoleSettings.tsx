import { useState, useEffect } from 'react';
import { Users, Shield, MoreHorizontal, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface UserEntry {
  id: string;
  display_name: string | null;
  role: AppRole;
}

const roleConfig: Record<AppRole, { label: string; className: string }> = {
  admin: { label: 'Admin', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  analyst: { label: 'Analyst', className: 'bg-primary/10 text-primary border-primary/20' },
  viewer: { label: 'Viewer', className: 'bg-muted text-muted-foreground border-border' },
};

const allRoles: AppRole[] = ['admin', 'analyst', 'viewer'];

export const UserRoleSettings = () => {
  const { isAdmin } = useUserRole();
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: roles, error: rolesErr } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesErr) {
      toast.error('Failed to load users');
      setLoading(false);
      return;
    }

    const userIds = (roles || []).map(r => r.user_id);

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', userIds);

    const profileMap = new Map((profiles || []).map(p => [p.id, p.display_name]));

    setUsers(
      (roles || []).map(r => ({
        id: r.user_id,
        display_name: profileMap.get(r.user_id) || 'Unknown',
        role: r.role,
      }))
    );
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const changeRole = async (userId: string, newRole: AppRole) => {
    setUpdating(userId);
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId);

    if (error) {
      toast.error('Failed to update role');
    } else {
      toast.success(`Role updated to ${roleConfig[newRole].label}`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    setUpdating(null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">User & Role Management</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Manage analyst access levels and permissions</p>
          </div>
        </div>

        {/* Role summary */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {allRoles.map(role => (
            <div key={role} className="rounded-lg border border-border bg-secondary/50 p-3 text-center">
              <p className="text-lg font-bold text-foreground">{users.filter(u => u.role === role).length}</p>
              <p className={cn('text-[10px] font-semibold uppercase tracking-wider', roleConfig[role].className.split(' ').find(c => c.startsWith('text-')))}>{roleConfig[role].label}s</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                  {isAdmin && <th className="px-4 py-2.5 w-10"></th>}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-foreground">{user.display_name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{user.id.slice(0, 8)}…</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-md border px-2 py-0.5 text-[10px] font-semibold', roleConfig[user.role].className)}>
                        {roleConfig[user.role].label}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-muted-foreground hover:text-foreground transition-colors" disabled={updating === user.id}>
                              {updating === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {allRoles.filter(r => r !== user.role).map(r => (
                              <DropdownMenuItem key={r} onClick={() => changeRole(user.id, r)}>
                                Set as {roleConfig[r].label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
