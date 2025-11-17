import { MessageSquare, Megaphone, Palette, Wallet, Settings, Folder } from 'lucide-react';
import { cn } from '../lib/utils';

interface SideNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'conversation', icon: MessageSquare, label: '对话工作台（暂定）' },
  { id: 'advertising', icon: Megaphone, label: '广告与账户（暂定）' },
  { id: 'materials', icon: Palette, label: '素材与报告（暂定）' },
  { id: 'finance', icon: Wallet, label: '财务与资产（暂定）' },
  { id: 'system', icon: Settings, label: '系统与管理（暂定）' },
];

export function SideNav({ currentPage, onNavigate }: SideNavProps) {
  return (
    <aside className="w-56 bg-card border-r border-border flex flex-col shrink-0">
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left',
                isActive
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={() => onNavigate('system')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left text-xs',
            currentPage === 'system'
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
          )}
        >
          <Folder className="w-4 h-4" />
          <span>项目管理</span>
        </button>
      </div>
    </aside>
  );
}