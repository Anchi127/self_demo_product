import { Shield, FileCheck, Key, Wrench, Clock, Settings } from 'lucide-react';
import { PermissionConfig } from './PermissionConfig';
import { EnterpriseCertificationPage } from './EnterpriseCertificationPage';
import { SystemSettingsPage } from './SystemSettingsPage';
import { cn } from '../lib/utils';

interface SystemManagementProps {
  currentSubPage: string;
  onSubNavigate: (subPage: string) => void;
}

const subMenuItems = [
  { id: 'permissions', icon: Shield, label: '成员与权限' },
  { id: 'enterprise', icon: FileCheck, label: '企业认证' },
  { id: 'settings', icon: Settings, label: '系统设置' },
  { id: 'authorization', icon: Key, label: '授权管理' },
  { id: 'toolbox', icon: Wrench, label: '工具箱' },
  { id: 'tasks', icon: Clock, label: '任务管理' },
];

export function SystemManagement({ currentSubPage, onSubNavigate }: SystemManagementProps) {
  // 标签页导航栏组件
  const TabNavigation = () => {
    const activeTab = currentSubPage || subMenuItems[0].id;
    
    return (
      <div className="bg-card rounded-t-lg border-b border-border overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max">
          {subMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSubNavigate(item.id)}
                className={cn(
                  'relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                  'flex items-center gap-2',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // 成员与权限页面特殊处理
  if (currentSubPage === 'permissions') {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="p-8 pb-0">
          <div className="mb-6">
            <h2 className="text-foreground mb-2">设置</h2>
            <p className="text-muted-foreground">管理项目成员、权限配置和系统设置</p>
          </div>
          <TabNavigation />
        </div>
        <div className="flex-1 overflow-auto">
          <PermissionConfig onBack={() => onSubNavigate('')} />
        </div>
      </div>
    );
  }

  // 企业认证页面特殊处理
  if (currentSubPage === 'enterprise') {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="p-8 pb-0">
          <div className="mb-6">
            <h2 className="text-foreground mb-2">设置</h2>
            <p className="text-muted-foreground">管理项目成员、权限配置和系统设置</p>
          </div>
          <TabNavigation />
        </div>
        <div className="flex-1 overflow-auto">
          <EnterpriseCertificationPage />
        </div>
      </div>
    );
  }

  // 系统设置页面特殊处理
  if (currentSubPage === 'settings') {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="p-8 pb-0">
          <div className="mb-6">
            <h2 className="text-foreground mb-2">设置</h2>
            <p className="text-muted-foreground">管理项目成员、权限配置和系统设置</p>
          </div>
          <TabNavigation />
        </div>
        <div className="flex-1 overflow-auto">
          <SystemSettingsPage />
        </div>
      </div>
    );
  }

  // 默认显示第一个标签页或选中的标签页
  const activeTab = currentSubPage || subMenuItems[0].id;

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-8 pb-0">
        <div className="mb-6">
          <h2 className="text-foreground mb-2">设置</h2>
          <p className="text-muted-foreground">管理项目成员、权限配置和系统设置</p>
        </div>
        <TabNavigation />
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
          <p className="mb-2">功能开发中</p>
          <p className="text-sm">此功能将在未来版本中推出</p>
        </div>
      </div>
    </div>
  );
}