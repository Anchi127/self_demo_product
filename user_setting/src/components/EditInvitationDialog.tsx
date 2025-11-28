import { useState, useMemo, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
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
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { X, Info, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Switch } from './ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';
import { getRoleDisplayName, type UserRole } from '../lib/permissionUtils';
import { cn } from '../lib/utils';
import { PendingInvitation } from './PendingInvitationsList';

interface EditInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitation: PendingInvitation | null;
  onUpdate: (data: any) => void;
}

const mockAccounts = [
  { id: '1', name: '广告账户 A - Facebook' },
  { id: '2', name: '广告账户 B - Google Ads' },
  { id: '3', name: '广告账户 C - TikTok' },
  { id: '4', name: '广告账户 D - Twitter' },
];

// 判断输入是邮箱还是手机号
const isEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const isPhone = (value: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/; // 中国大陆手机号格式
  return phoneRegex.test(value);
};

export function EditInvitationDialog({ open, onOpenChange, invitation, onUpdate }: EditInvitationDialogProps) {
  const [identifier, setIdentifier] = useState<string>('');
  const [role, setRole] = useState('Member');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [autoGrantSelfCreatedAccounts, setAutoGrantSelfCreatedAccounts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'id' | 'name'>('name');
  const [allocationMode, setAllocationMode] = useState<'all' | 'partial'>('partial');
  const [isSending, setIsSending] = useState(false);

  // 回显邀请信息
  useEffect(() => {
    if (invitation) {
      setIdentifier(invitation.invitedIdentifier);
      setRole(invitation.invitedRole);
      
      // 回显账户分配信息
      if (invitation.allocationMode) {
        setAllocationMode(invitation.allocationMode);
      }
      
      if (invitation.accounts) {
        if (invitation.accounts === 'all') {
          setAllocationMode('all');
          setSelectedAccounts([]);
        } else if (Array.isArray(invitation.accounts)) {
          setAllocationMode('partial');
          setSelectedAccounts(invitation.accounts);
        }
      }
      
      if (invitation.autoGrantSelfCreatedAccounts !== undefined) {
        setAutoGrantSelfCreatedAccounts(invitation.autoGrantSelfCreatedAccounts);
      }
    }
  }, [invitation]);

  // 判断角色是否需要选择账户分配
  const needsAccountSelection = role === 'Member';

  const handleSendInvite = async () => {
    if (!identifier.trim()) {
      toast.error('请输入手机号或邮箱');
      return;
    }

    // 验证账号格式
    if (!isEmail(identifier) && !isPhone(identifier)) {
      toast.error('请输入有效的手机号或邮箱格式');
      return;
    }

    // 只有成员角色才需要验证账户配置
    if (needsAccountSelection && allocationMode === 'partial' && selectedAccounts.length === 0 && !autoGrantSelfCreatedAccounts) {
      toast.error('请至少选择一个广告账户，或选择"分配全部账户"，或开启自动拥有自己申请开户的账户权限');
      return;
    }

    setIsSending(true);

    try {
      // 为被邀请者生成7天有效期的唯一邀请链接
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7天后
      const token = `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 模拟发送邀请链接（通过短信或邮件）
      if (isEmail(identifier)) {
        // 发送邮件
        console.log(`发送邮件邀请到: ${identifier}`);
      } else if (isPhone(identifier)) {
        // 发送短信
        console.log(`发送短信邀请到: ${identifier}`);
      }

      // 通知父组件邀请已更新并重新发送
      onUpdate({
        invitationId: invitation?.id,
        identifier,
        role,
        token,
        expiresAt: expiresAt.toISOString(),
        accounts: needsAccountSelection ? (allocationMode === 'all' ? 'all' : selectedAccounts) : 'all',
        allocationMode: needsAccountSelection ? allocationMode : 'all',
        autoGrantSelfCreatedAccounts: needsAccountSelection ? autoGrantSelfCreatedAccounts : false,
      });

      toast.success('邀请已更新并重新发送');
      
      // 重置表单
      setIdentifier('');
      setRole('Member');
      setSelectedAccounts([]);
      setAutoGrantSelfCreatedAccounts(false);
      setAllocationMode('partial');
      setSearchQuery('');
      setSearchMode('name');
      onOpenChange(false);
    } catch (error) {
      toast.error('发送邀请失败，请重试');
      console.error('发送邀请失败:', error);
    } finally {
      setIsSending(false);
    }
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
        return account.name.toLowerCase().includes(query);
      }
    });
  }, [searchQuery, searchMode]);

  // 全选当前筛选结果
  const handleSelectAllFiltered = () => {
    const allFilteredIds = filteredAccounts.map(account => account.id);
    const allSelected = allFilteredIds.every(id => selectedAccounts.includes(id));
    
    if (allSelected) {
      setSelectedAccounts(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      setSelectedAccounts(prev => {
        const newSelection = [...prev];
        allFilteredIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  // 清除所有选择
  const handleClearAll = () => {
    setSelectedAccounts([]);
  };

  // 检查是否已全选当前筛选结果
  const isAllFilteredSelected = filteredAccounts.length > 0 && 
    filteredAccounts.every(account => selectedAccounts.includes(account.id));

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (!invitation) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        // 重置所有状态
        setIdentifier('');
        setRole('Member');
        setSelectedAccounts([]);
        setAutoGrantSelfCreatedAccounts(false);
        setAllocationMode('partial');
        setSearchQuery('');
        setSearchMode('name');
        setIsSending(false);
      }
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-6xl w-[95vw] sm:w-full max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>编辑并重新发送邀请</DialogTitle>
          <DialogDescription>
            修改邀请信息后重新发送邀请链接
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex flex-col py-4" style={{ maxHeight: 'calc(90vh - 14rem)' }}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 左侧：基本信息表单 */}
            <div className="w-full lg:w-[40%] flex-shrink-0 space-y-4 overflow-y-auto lg:pr-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">邀请账号（手机号或邮箱）</Label>
                <Input
                  id="identifier"
                  placeholder="请输入手机号或邮箱"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">设置角色</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">管理员</SelectItem>
                    <SelectItem value="Finance">财务</SelectItem>
                    <SelectItem value="Member">成员</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  注：邀请时不能直接设置为项目负责人，项目负责人需要通过转移所有权功能设置
                </p>
              </div>

              {(role === 'Admin' || role === 'Finance') && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 text-sm">
                    {role === 'Finance' 
                      ? '财务角色拥有全部账户数据访问权限，无需分配账户'
                      : '管理员角色拥有全部账户访问权限，无需分配账户'}
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">邀请有效期：7 天</p>
              </div>
            </div>

            {/* 右侧：配置资产区域 - 只有成员角色需要选择账户分配 */}
            {needsAccountSelection && (
              <div className="flex-1 flex flex-col min-w-0 lg:border-l lg:border-border lg:pl-6 lg:pt-0 pt-6 border-t lg:border-t-0">
                <div className="space-y-4 h-full flex flex-col">
                  <div className="space-y-2">
                    <Label>配置资产（选填）</Label>
                    
                    {/* 分配模式选择 */}
                    <RadioGroup
                      value={allocationMode}
                      onValueChange={(value) => {
                        const mode = value as 'all' | 'partial';
                        setAllocationMode(mode);
                        if (mode === 'all') {
                          setSelectedAccounts([]);
                        }
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      <div>
                        <RadioGroupItem
                          value="all"
                          id="allocation-all"
                          className="peer sr-only"
                        />
                        <label
                          htmlFor="allocation-all"
                          className={cn(
                            "flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer",
                            allocationMode === 'all'
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
                          )}
                        >
                          <div className={cn(
                            "mt-0.5 size-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
                            allocationMode === 'all'
                              ? "border-primary"
                              : "border-muted-foreground"
                          )}>
                            {allocationMode === 'all' && (
                              <div className="size-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1">分配全部账户</div>
                            <p className="text-xs text-muted-foreground">
                              分配项目内所有现有和未来的账户
                            </p>
                          </div>
                        </label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="partial"
                          id="allocation-partial"
                          className="peer sr-only"
                        />
                        <label
                          htmlFor="allocation-partial"
                          className={cn(
                            "flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer",
                            allocationMode === 'partial'
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
                          )}
                        >
                          <div className={cn(
                            "mt-0.5 size-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
                            allocationMode === 'partial'
                              ? "border-primary"
                              : "border-muted-foreground"
                          )}>
                            {allocationMode === 'partial' && (
                              <div className="size-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1">分配部分账户</div>
                            <p className="text-xs text-muted-foreground">
                              选择特定账户进行分配
                            </p>
                          </div>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  {allocationMode === 'all' ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-900 text-sm">
                        ✓ 将分配项目内所有现有和未来的账户
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col min-h-0 space-y-3">
                      {/* 自动拥有自己申请开户账户权限开关 */}
                      <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg border border-border">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="edit-auto-grant" className="text-sm font-medium cursor-pointer">
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
                          id="edit-auto-grant"
                          checked={autoGrantSelfCreatedAccounts}
                          onCheckedChange={setAutoGrantSelfCreatedAccounts}
                        />
                      </div>

                      {/* 搜索框和模式切换 */}
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

                      {/* 操作栏：全选和清除 */}
                      {filteredAccounts.length > 0 && (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="select-all-filtered-edit"
                              checked={isAllFilteredSelected}
                              onCheckedChange={handleSelectAllFiltered}
                            />
                            <label
                              htmlFor="select-all-filtered-edit"
                              className="text-sm text-foreground cursor-pointer"
                            >
                              全选当前筛选结果 ({filteredAccounts.length})
                            </label>
                          </div>
                          {selectedAccounts.length > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleClearAll}
                              className="h-8 text-xs"
                            >
                              清除所有选择
                            </Button>
                          )}
                        </div>
                      )}

                      {/* 账户列表 */}
                      <div className="flex-1 border border-border rounded-lg bg-muted/30 overflow-hidden flex flex-col min-h-0">
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                          {filteredAccounts.length === 0 ? (
                            <div className="text-center text-muted-foreground text-sm py-8">
                              未找到匹配的账户
                            </div>
                          ) : (
                            filteredAccounts.map((account) => (
                              <div key={account.id} className="flex items-center space-x-3">
                                <Checkbox
                                  id={`account-edit-${account.id}`}
                                  checked={selectedAccounts.includes(account.id)}
                                  onCheckedChange={() => toggleAccount(account.id)}
                                />
                                <label
                                  htmlFor={`account-edit-${account.id}`}
                                  className="flex-1 text-foreground cursor-pointer text-sm"
                                >
                                  <span className="font-medium">{account.name}</span>
                                  <span className="text-muted-foreground ml-2">(ID: {account.id})</span>
                                </label>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="border-t border-border p-3 flex items-center justify-between text-sm bg-background">
                          <p className="text-muted-foreground">
                            已选择 {selectedAccounts.length} 个账户
                            {filteredAccounts.length !== mockAccounts.length && searchQuery && (
                              <span className="ml-2">（当前筛选：{filteredAccounts.length}/{mockAccounts.length}）</span>
                            )}
                          </p>
                          {searchQuery ? (
                            <p className="text-muted-foreground">
                              找到 {filteredAccounts.length} 个结果（共 {mockAccounts.length} 个账户）
                            </p>
                          ) : (
                            <p className="text-muted-foreground">
                              共 {mockAccounts.length} 个账户
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>
            取消
          </Button>
          <Button onClick={handleSendInvite} disabled={isSending}>
            {isSending ? '发送中...' : '发送邀请链接'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

