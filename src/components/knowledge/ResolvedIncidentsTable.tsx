import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, ChevronDown, ChevronUp, Brain, Tag, User, Timer } from 'lucide-react';
import { resolvedIncidents } from '@/data/knowledgeBaseData';
import { SeverityBadge } from '@/components/dashboard/SeverityBadge';
import type { ResolvedIncident } from '@/data/knowledgeBaseData';
import { cn } from '@/lib/utils';

interface ResolvedIncidentsTableProps {
  onSelectIncident: (incident: ResolvedIncident) => void;
  selectedId?: string;
}

export const ResolvedIncidentsTable = ({ onSelectIncident, selectedId }: ResolvedIncidentsTableProps) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'resolvedAt' | 'severity' | 'aiAccuracy'>('resolvedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };

  const filtered = resolvedIncidents
    .filter((inc) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        inc.title.toLowerCase().includes(q) ||
        inc.id.toLowerCase().includes(q) ||
        inc.category.toLowerCase().includes(q) ||
        inc.tags.some((t) => t.includes(q)) ||
        inc.resolvedBy.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === 'resolvedAt') {
        cmp = new Date(a.resolvedAt).getTime() - new Date(b.resolvedAt).getTime();
      } else if (sortField === 'severity') {
        cmp = severityOrder[a.severity] - severityOrder[b.severity];
      } else if (sortField === 'aiAccuracy') {
        cmp = a.aiAccuracy - b.aiAccuracy;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />;
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Resolved Incidents
          </h2>
          <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-mono text-secondary-foreground">
            {filtered.length}
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resolved incidents..."
            className="h-8 w-56 rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 border-b border-border bg-secondary/30 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <div className="col-span-1">ID</div>
        <div className="col-span-3">Title</div>
        <button onClick={() => toggleSort('severity')} className="col-span-1 flex items-center gap-1 hover:text-foreground transition-colors">
          Severity <SortIcon field="severity" />
        </button>
        <div className="col-span-2">Category</div>
        <button onClick={() => toggleSort('resolvedAt')} className="col-span-2 flex items-center gap-1 hover:text-foreground transition-colors">
          Resolved <SortIcon field="resolvedAt" />
        </button>
        <div className="col-span-1">Analyst</div>
        <button onClick={() => toggleSort('aiAccuracy')} className="col-span-1 flex items-center gap-1 hover:text-foreground transition-colors">
          AI Acc. <SortIcon field="aiAccuracy" />
        </button>
        <div className="col-span-1">TTR</div>
      </div>

      {/* Rows */}
      <div className="max-h-[400px] overflow-y-auto">
        {filtered.map((inc, index) => (
          <motion.button
            key={inc.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => onSelectIncident(inc)}
            className={cn(
              'grid w-full grid-cols-12 gap-2 border-b border-border px-4 py-3 text-left text-xs transition-all duration-150',
              selectedId === inc.id
                ? 'bg-primary/5 border-l-2 border-l-primary'
                : 'hover:bg-secondary/40'
            )}
          >
            <span className="col-span-1 font-mono text-muted-foreground">{inc.id.split('-').pop()}</span>
            <span className="col-span-3 font-medium text-foreground truncate">{inc.title}</span>
            <div className="col-span-1">
              <SeverityBadge severity={inc.severity} />
            </div>
            <span className="col-span-2 text-muted-foreground">{inc.category}</span>
            <span className="col-span-2 font-mono text-muted-foreground">
              {new Date(inc.resolvedAt).toLocaleDateString()}
            </span>
            <span className="col-span-1 text-muted-foreground truncate">{inc.resolvedBy.split(' ')[0]}</span>
            <span className={cn('col-span-1 font-mono font-medium', inc.aiAccuracy >= 85 ? 'text-success' : inc.aiAccuracy >= 75 ? 'text-warning' : 'text-destructive')}>
              {inc.aiAccuracy}%
            </span>
            <span className="col-span-1 font-mono text-muted-foreground">{inc.ttr}m</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
