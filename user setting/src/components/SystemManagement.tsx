import { Users, Building, UserCog, Shield, FileCheck, Gauge, Key, Wrench, Clock, ChevronRight } from 'lucide-react';
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
];

export function SystemManagement({ currentSubPage, onSubNavigate }: SystemManagementProps) {
  if (currentSubPage === 'permissions') {
    return <PermissionConfig onBack={() => onSubNavigate('')} />;
  }

  if (currentSubPage) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <button
            onClick={() => onSubNavigate('')}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-2"
          >
            ← 返回系统与管理
          </button>
        </div>
        <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
          功能开发中
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className="text-foreground mb-2">系统与管理</h2>
        <p className="text-muted-foreground">配置中心 - 管理用户、权限、资产和系统工具</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSubNavigate(item.id)}
              className={cn(
                'bg-card border border-border rounded-xl p-6',
                'hover:border-foreground/20 hover:shadow-sm transition-all',
                'flex items-center justify-between group text-left'
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}