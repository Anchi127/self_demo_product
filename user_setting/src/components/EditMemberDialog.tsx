import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { Info, Search, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';
import { getAvailableRoles, canSetRole, getRoleDisplayName, type UserRole } from '../lib/permissionUtils';

const mockAccounts = [
  { id: '1', name: '广告账户 A - Facebook' },
  { id: '2', name: '广告账户 B - Google Ads' },
  { id: '3', name: '广告账户 C - TikTok' },
  { id: '4', name: '广告账户 D - Twitter' },
];

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: any;
  onEdit: (data: any) => void;
  currentUserRole: UserRole;
}

export function EditMemberDialog({ open, onOpenChange, member, onEdit, currentUserRole }: EditMemberDialogProps) {
  const [role, setRole] = useState<UserRole>('Member');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [autoGrantSelfCreatedAccounts, setAutoGrantSelfCreatedAccounts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'id' | 'name'>('name');

  useEffect(() => {
    if (member) {
      setRole(member.role);
      // 回显当前已拥有的资产
      if (member.assets && Array.isArray(member.assets)) {
        setSelectedAccounts(member.assets);
      } else if (typeof member.accountCount === 'number' && member.accountCount > 0) {
        // 如果没有 assets 字段，根据 accountCount 模拟
        setSelectedAccounts(mockAccounts.slice(0, member.accountCount).map(a => a.id));
      } else {
        setSelectedAccounts([]);
      }
      // 回显自动拥有自己申请开户账户权限的设置
      setAutoGrantSelfCreatedAccounts(member.autoGrantSelfCreatedAccounts ?? false);
    }
  }, [member]);

  const handleSubmit = () => {
    // 验证角色设置权限
    if (!canSetRole(currentUserRole, member.role, role)) {
      toast.error('您没有权限进行此操作');
      return;
    }

    // 验证资产配置（如果未开启自动拥有自己申请开户账户权限，则必须至少选择一个账户）
    if (role !== 'Finance' && role !== 'Owner' && selectedAccounts.length === 0 && !autoGrantSelfCreatedAccounts) {
      toast.error('请至少选择一个广告账户，或开启自动拥有自己申请开户的账户权限');
      return;
    }

    onEdit({
      role,
      accounts: selectedAccounts,
      autoGrantSelfCreatedAccounts,
    });

    toast.success('权限更新成功');
    onOpenChange(false);
  };

  const toggleAccount = (accountId: string) => {
    setSelectedAccounts(prev =>
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  // 筛选账户列表
  const filteredAccounts = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockAccounts;
    }

    const query = searchQuery.toLowerCase().trim();
    return mockAccounts.filter(account => {
      if (searchMode === 'id') {
        return account.id.toLowerCase().includes(query);
      } else {
        // 'name' - 搜索名称
        return account.name.toLowerCase().includes(query);
      }
    });
  }, [searchQuery, searchMode]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (!member) return null;

  const availableRoles = getAvailableRoles(currentUserRole, member.role);
  const showAssetConfig = role !== 'Finance' && role !== 'Owner';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>编辑成员权限</DialogTitle>
          <DialogDescription>
            修改 {member.name} 的角色和访问权限
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 基本信息区（只读） */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
            <h4 className="text-sm font-medium text-foreground">基本信息</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">姓名</Label>
                <Input value={member.name || ''} disabled className="bg-background" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">账号</Label>
                <Input value={member.identifier || member.email || ''} disabled className="bg-background" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">加入时间</Label>
                <Input 
                  value={member.joinedAt ? new Date(member.joinedAt).toLocaleString('zh-CN') : '未知'} 
                  disabled 
                  className="bg-background" 
                />
              </div>
            </div>
          </div>

          {/* 角色设置 */}
          <div className="space-y-2">
            <Label htmlFor="role">角色</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger id="role">
                <SelectValue>{getRoleDisplayName(role)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {getRoleDisplayName(r)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentUserRole === 'Admin' && (
              <p className="text-xs text-muted-foreground">
                注：管理员不可修改项目负责人角色，也不可将他人修改为项目负责人
              </p>
            )}
          </div>

          {/* 资产配置 */}
          {showAssetConfig ? (
            <div className="space-y-4">
              {/* 自动拥有自己申请开户账户权限开关 */}
              <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="auto-grant" className="text-sm font-medium cursor-pointer">
                      自动拥有自己申请开户的账户权限
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>开启后，该用户申请开户时获得的账户将自动分配权限。如果之前已有账户但未分配，开启后也会自动分配。</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    开启后，用户申请开户获得的账户将自动拥有访问权限
                  </p>
                </div>
                <Switch
                  id="auto-grant"
                  checked={autoGrantSelfCreatedAccounts}
                  onCheckedChange={setAutoGrantSelfCreatedAccounts}
                />
              </div>

              {/* 可访问广告账户列表 */}
              <div className="space-y-2">
                <Label>可访问广告账户</Label>
                
                {/* 搜索框和模式切换 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Select value={searchMode} onValueChange={(value) => setSearchMode(value as 'id' | 'name')}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">账户名称</SelectItem>
                        <SelectItem value="id">账户ID</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder={searchMode === 'id' ? '搜索账户ID...' : '搜索账户名称...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-8"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={handleClearSearch}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto bg-muted/30">
                  {filteredAccounts.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-4">
                      未找到匹配的账户
                    </div>
                  ) : (
                    filteredAccounts.map((account) => (
                      <div key={account.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={`edit-account-${account.id}`}
                          checked={selectedAccounts.includes(account.id)}
                          onCheckedChange={() => toggleAccount(account.id)}
                        />
                        <label
                          htmlFor={`edit-account-${account.id}`}
                          className="flex-1 text-foreground cursor-pointer text-sm"
                        >
                          <span className="font-medium">{account.name}</span>
                          <span className="text-muted-foreground ml-2">(ID: {account.id})</span>
                        </label>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">
                    已选择 {selectedAccounts.length} 个账户
                  </p>
                  {searchQuery && (
                    <p className="text-muted-foreground">
                      找到 {filteredAccounts.length} 个结果
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : role === 'Finance' ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-900 text-sm">
                财务角色不需要分配广告账户访问权限，仅可访问财务相关功能
              </p>
            </div>
          ) : role === 'Owner' ? (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-900 text-sm">
                项目负责人角色默认拥有全部账户的访问权限
              </p>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>保存更改</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}