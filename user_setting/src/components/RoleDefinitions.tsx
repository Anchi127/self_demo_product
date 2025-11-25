import { Badge } from './ui/badge';
import { Crown, Shield, Wallet as WalletIcon, User } from 'lucide-react';
import { getRoleDisplayName, type UserRole } from '../lib/permissionUtils';

const roles: Array<{
  name: UserRole;
  displayName: string;
  icon: typeof Crown;
  priority: string;
  color: string;
  iconColor: string;
  badgeColor: string;
  description: string;
}> = [
  {
    name: 'Owner',
    displayName: '项目负责人',
    icon: Crown,
    priority: '最高',
    color: 'bg-purple-50 text-purple-900 border-purple-200',
    iconColor: 'text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-700',
    description: '广告主最高权限。可邀请成员、分配角色、分配广告账户、发起充值与管理钱包、转移所有权。',
  },
  {
    name: 'Admin',
    displayName: '管理员',
    icon: Shield,
    priority: '高',
    color: 'bg-blue-50 text-blue-900 border-blue-200',
    iconColor: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-700',
    description: '管理者。可邀请成员（Owner除外）、分配账户权限、编辑广告、发起投放。',
  },
  {
    name: 'Finance',
    displayName: '财务',
    icon: WalletIcon,
    priority: '中',
    color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    iconColor: 'text-emerald-600',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    description: '财务角色。仅处理钱包、账务、对账相关功能。',
  },
  {
    name: 'Member',
    displayName: '成员',
    icon: User,
    priority: '低',
    color: 'bg-slate-50 text-slate-900 border-slate-200',
    iconColor: 'text-slate-600',
    badgeColor: 'bg-slate-100 text-slate-700',
    description: '普通成员。仅能操作被分配的广告账户，不可访问钱包、不可邀请他人。',
  },
];

export function RoleDefinitions() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-foreground mb-5">角色定义说明</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <div
              key={role.name}
              className={`border rounded-lg p-4 ${role.color}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon className={`w-5 h-5 ${role.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{role.displayName}</span>
                  </div>
                  <p className="text-sm opacity-90">{role.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}