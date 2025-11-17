import { Users, Building, UserCog, Shield, FileCheck, Gauge, Key, Wrench, Clock, Settings } from 'lucide-react';
import { PermissionConfig } from './PermissionConfig';
import { cn } from '../lib/utils';

interface SystemManagementProps {
  currentSubPage: string;
  onSubNavigate: (subPage: string) => void;
}

const subMenuItems = [
  { id: 'users', icon: Users, label: '用户管理' },
  { id: 'departments', icon: Building, label: '部门管理' },
  { id: 'roles', icon: UserCog, label: '角色管理' },
  { id: 'permissions', icon: Shield, label: '权限配置' },
  { id: 'enterprise', icon: FileCheck, label: '企业认证' },
  { id: 'pixel', icon: Gauge, label: '像素管理' },
  { id: 'authorization', icon: Key, label: '授权管理' },
  { id: 'toolbox', icon: Wrench, label: '工具箱' },
  { id: 'tasks', icon: Clock, label: '任务管理' },
  { id: 'settings', icon: Settings, label: '系统设置' },
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

  // 权限配置页面特殊处理
  if (currentSubPage === 'permissions') {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="p-8 pb-0">
          <div className="mb-6">
            <h2 className="text-foreground mb-2">项目管理</h2>
            <p className="text-muted-foreground">配置中心 - 管理用户、权限、资产和系统工具</p>
          </div>
          <TabNavigation />
        </div>
        <div className="flex-1 overflow-auto">
          <PermissionConfig onBack={() => onSubNavigate('')} />
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
          <h2 className="text-foreground mb-2">项目管理</h2>
          <p className="text-muted-foreground">配置中心 - 管理用户、权限、资产和系统工具</p>
        </div>
        <TabNavigation />
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
          功能开发中
        </div>
      </div>
    </div>
  );
}