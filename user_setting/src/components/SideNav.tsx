import { Home, Wallet, Megaphone, Palette, Users, Settings, Inbox, HelpCircle, User, Building2, CreditCard, BookOpen, LogOut, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ProjectSwitcher } from './ProjectSwitcher';

interface SideNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onNavigateToUserInfo?: () => void;
  onNavigateToSystemSettings?: () => void;
  onLogout?: () => void;
}

// 主菜单项（5个）
const mainNavItems = [
  { id: 'workbench', icon: Home, label: '工作台' },
  { id: 'assets', icon: Wallet, label: '资产' },
  { id: 'marketing', icon: Megaphone, label: '营销' },
  { id: 'creatives', icon: Palette, label: '创意' },
  { id: 'partners', icon: Users, label: '合作' },
];

// 会话历史数据（示例数据）
const sessionHistory = [
  { id: '1', title: '素材一直进不去学习期,原因和处...' },
  { id: '2', title: '我们准备在东南亚上线一款新品...' },
  { id: '3', title: '我有美甲贴货源,我想在TT美区...' },
];

export function SideNav({ currentPage, onNavigate, onNavigateToUserInfo, onNavigateToSystemSettings, onLogout }: SideNavProps) {
  const [isSessionHistoryExpanded, setIsSessionHistoryExpanded] = useState(true);

  const handleUserInfoClick = () => {
    if (onNavigateToUserInfo) {
      onNavigateToUserInfo();
    }
  };

  const handleSystemSettingsClick = () => {
    if (onNavigateToSystemSettings) {
      onNavigateToSystemSettings();
    }
  };

  const handleEnterpriseCertificationClick = () => {
    onNavigate('system');
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleSessionClick = (sessionId: string) => {
    // 点击会话历史项，暂时不做任何操作
    // 后续可在此处添加会话恢复逻辑
  };

  return (
    <aside className="w-56 bg-card border-r border-border flex flex-col shrink-0">
      {/* 顶部区域：Logo + 项目选择器 */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
            <span className="text-background text-sm">T</span>
          </div>
          <span className="text-foreground text-sm font-medium">Taidong Agent</span>
        </div>
        <ProjectSwitcher />
      </div>

      {/* 「+ 会话 / 搜索 / 指令」按钮 */}
      <div className="p-3 border-b border-border">
        <button
          onClick={() => onNavigate('conversation')}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-colors',
            'bg-primary text-primary-foreground font-medium',
            'hover:bg-primary/90',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          )}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">会话 / 搜索 / 指令</span>
        </button>
      </div>

      {/* 区块A：主菜单区域（置顶） */}
      <nav className="p-3 space-y-1">
        {mainNavItems.map((item) => {
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

      {/* 区块B：会话历史（Session History） */}
      <div className="flex-1 overflow-hidden flex flex-col px-3 min-h-0">
        <div className="mb-2">
          <h3 className="text-xs font-medium text-muted-foreground px-3 py-2">会话历史</h3>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div 
            className="overflow-y-auto space-y-1"
            style={{ maxHeight: '280px' }}
          >
            {(isSessionHistoryExpanded ? sessionHistory : sessionHistory.slice(0, 3)).map((session) => (
              <button
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors truncate"
              >
                {session.title}
              </button>
            ))}
          </div>
          {sessionHistory.length > 3 && (
            <button
              onClick={() => setIsSessionHistoryExpanded(!isSessionHistoryExpanded)}
              className="text-xs text-muted-foreground hover:text-foreground px-3 py-2 transition-colors flex items-center gap-1 mt-1"
            >
              {isSessionHistoryExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  收起更多
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  展开更多...
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 区块C：底部系统菜单（固定在侧边栏底部） */}
      <div className="p-3 border-t border-border space-y-1 shrink-0">
        {/* 设置 */}
        <button
          onClick={() => onNavigate('system')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left text-sm',
            currentPage === 'system'
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
          )}
        >
          <Settings className="w-4 h-4" />
          <span>设置</span>
        </button>

        {/* 收件箱 */}
        <button
          onClick={() => onNavigate('inbox')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left text-sm',
            currentPage === 'inbox'
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
          )}
        >
          <Inbox className="w-4 h-4" />
          <span>收件箱</span>
        </button>

        {/* 帮助 */}
        <button
          onClick={() => onNavigate('help')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left text-sm',
            currentPage === 'help'
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
          )}
        >
          <HelpCircle className="w-4 h-4" />
          <span>帮助</span>
        </button>

        {/* 我的（用户头像菜单） */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="bg-foreground text-background cursor-pointer">
                  王
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-foreground">我的</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right" className="w-48">
            <DropdownMenuItem onClick={handleUserInfoClick}>
              <User className="w-4 h-4 mr-2" />
              用户信息
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEnterpriseCertificationClick}>
              <Building2 className="w-4 h-4 mr-2" />
              企业认证
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="w-4 h-4 mr-2" />
              钛动钱包
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSystemSettingsClick}>
              <Settings className="w-4 h-4 mr-2" />
              系统设置
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <BookOpen className="w-4 h-4 mr-2" />
              使用指南
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}