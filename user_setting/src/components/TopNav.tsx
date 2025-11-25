import { ProjectSwitcher } from './ProjectSwitcher';

interface TopNavProps {
  currentPage: string;
  currentSubPage?: string;
  onNavigate?: (page: string) => void;
  onSubNavigate?: (subPage: string) => void;
}

const pageNames: Record<string, string> = {
  workbench: '工作台',
  assets: '资产',
  marketing: '营销',
  creatives: '创意',
  partners: '合作',
  conversation: '对话工作台',
  system: '设置',
  inbox: '收件箱',
  help: '帮助',
  'project-settings': '项目设置',
  'user-info': '用户信息',
  'account-security': '账号安全',
  'system-settings': '系统设置',
};

export function TopNav({ currentPage, currentSubPage, onNavigate, onSubNavigate }: TopNavProps) {
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
    </header>
  );
}