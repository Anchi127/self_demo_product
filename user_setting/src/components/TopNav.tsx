import { HelpCircle, User, Building2, CreditCard, Settings, BookOpen, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ProjectSwitcher } from './ProjectSwitcher';

interface TopNavProps {
  currentPage: string;
  currentSubPage?: string;
  onNavigate?: (page: string) => void;
  onNavigateToUserInfo?: () => void;
  onNavigateToSystemSettings?: () => void;
  onLogout?: () => void;
}

const pageNames: Record<string, string> = {
  conversation: '对话工作台',
  advertising: '广告与账户',
  materials: '素材与报告',
  finance: '财务与资产',
  system: '项目管理',
  'project-settings': '项目设置',
  'user-info': '用户信息',
  'account-security': '账号安全',
  'system-settings': '系统设置',
};

export function TopNav({ currentPage, currentSubPage, onNavigateToUserInfo, onNavigateToSystemSettings, onLogout }: TopNavProps) {
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

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // 根据当前页面显示正确的标题
  const getPageTitle = () => {
    return pageNames[currentPage] || '未知页面';
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
            <span className="text-background text-sm">T</span>
          </div>
          <span className="text-foreground">Taidong Agent</span>
        </div>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground">{getPageTitle()}</span>
        <span className="text-muted-foreground">/</span>
        <ProjectSwitcher />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <HelpCircle className="w-4 h-4 mr-2" />
          帮助
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-full p-0 h-8 w-8 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="bg-foreground text-background cursor-pointer">
                  王
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleUserInfoClick}>
              <User className="w-4 h-4 mr-2" />
              用户信息
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Building2 className="w-4 h-4 mr-2" />
              企业认证
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="w-4 h-4 mr-2" />
              账单与支付
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
    </header>
  );
}