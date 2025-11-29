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
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { Info, Search, X } from 'lucide-react';
import { cn } from '../lib/utils';
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
  const [selectedAuthorizedAccounts, setSelectedAuthorizedAccounts] = useState<string[]>([]);
  const [selectedCreatives, setSelectedCreatives] = useState<string[]>([]);
  const [autoGrantSelfCreatedAccounts, setAutoGrantSelfCreatedAccounts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'id' | 'name'>('name');
  const [allocationMode, setAllocationMode] = useState<'all' | 'partial'>('partial');
  const [activeAssetTab, setActiveAssetTab] = useState<'accounts' | 'authorizedAccounts' | 'creatives'>('accounts');

  useEffect(() => {
    if (member) {
      setRole(member.role);
      // 回显当前已拥有的资产
      if (member.role === 'Owner' || member.role === 'Admin' || member.role === 'Finance') {
        // 拥有全部权限的角色，不需要选择账户
        setSelectedAccounts([]);
        setAllocationMode('all');
      } else if (member.assets && Array.isArray(member.assets) && member.assets.length > 0) {
        // Member 角色，有具体资产
        setSelectedAccounts(member.assets);
        setAllocationMode('partial');
      } else if (typeof member.accountCount === 'number' && member.accountCount > 0) {
        // 如果没有 assets 字段，根据 accountCount 模拟
        setSelectedAccounts(mockAccounts.slice(0, member.accountCount).map(a => a.id));
        setAllocationMode('partial');
      } else {
        // Member 角色但没有资产，默认部分分配模式
        setSelectedAccounts([]);
        setAllocationMode('partial');
      }
      // 回显自动拥有自己申请开户账户权限的设置
      setAutoGrantSelfCreatedAccounts(member.autoGrantSelfCreatedAccounts ?? false);
    }
  }, [member]);

  // 判断角色是否需要选择账户分配
  const needsAccountSelection = role === 'Member';

  const handleSubmit = () => {
    // 验证角色设置权限
    if (!canSetRole(currentUserRole, member.role, role)) {
      toast.error('您没有权限进行此操作');
      return;
    }

    // 只有成员角色才需要验证账户配置
    if (needsAccountSelection && allocationMode === 'partial' && selectedAccounts.length === 0 && !autoGrantSelfCreatedAccounts) {
      toast.error('请至少选择一个广告账户，或选择"分配全部账户"，或开启自动拥有自己申请开户的账户权限');
      return;
    }

    onEdit({
      role,
      accounts: needsAccountSelection ? (allocationMode === 'all' ? 'all' : selectedAccounts) : 'all',
      authorizedAccounts: needsAccountSelection ? (selectedAuthorizedAccounts.length > 0 ? selectedAuthorizedAccounts : 'all') : 'all',
      creatives: needsAccountSelection ? (selectedCreatives.length > 0 ? selectedCreatives : 'all') : 'all',
      allocationMode: needsAccountSelection ? allocationMode : 'all',
      autoGrantSelfCreatedAccounts: needsAccountSelection ? autoGrantSelfCreatedAccounts : false,
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

  if (!member) return null;

  const availableRoles = getAvailableRoles(currentUserRole, member.role);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>编辑成员权限</DialogTitle>
          <DialogDescription>
            修改 {member.name} 的角色和访问权限
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex flex-col py-4" style={{ maxHeight: 'calc(90vh - 14rem)' }}>
          <div className="space-y-4">
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
            <Select value={role} onValueChange={(value) => {
              const newRole = value as UserRole;
              const oldRole = member.role;
              setRole(newRole);
              // 当角色变更为 Admin 或 Finance 时，清空账户选择
              if (newRole === 'Admin' || newRole === 'Finance') {
                setSelectedAccounts([]);
                setAllocationMode('all');
              } else if (newRole === 'Member' && (oldRole === 'Admin' || oldRole === 'Finance')) {
                // 从 Admin/Finance 变更为 Member 时，重置为部分分配模式，需要选择账户
                setSelectedAccounts([]);
                setAllocationMode('partial');
                setAutoGrantSelfCreatedAccounts(false);
              }
            }}>
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
            {(role === 'Admin' || role === 'Finance') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 text-sm">
                  {role === 'Finance' 
                    ? '财务角色拥有全部账户数据访问权限，无需分配账户'
                    : '管理员角色拥有全部账户访问权限，无需分配账户'}
                </p>
              </div>
            )}
            {needsAccountSelection && (member.role === 'Admin' || member.role === 'Finance') && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-900 text-sm">
                  从 {member.role === 'Admin' ? '管理员' : '财务'} 变更为成员时，需要定义授权资产范围
                </p>
              </div>
            )}
          </div>

          {/* 资产配置 - 只有成员角色需要选择账户分配 */}
          {needsAccountSelection && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>配置资产（选填）</Label>
                
                <Tabs value={activeAssetTab} onValueChange={(value) => setActiveAssetTab(value as 'accounts' | 'authorizedAccounts' | 'creatives')} className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="accounts" className="flex-1">账户</TabsTrigger>
                    <TabsTrigger value="authorizedAccounts" className="flex-1">授权账户</TabsTrigger>
                    <TabsTrigger value="creatives" className="flex-1">创意</TabsTrigger>
                  </TabsList>

                  {/* 账户标签页 */}
                  <TabsContent value="accounts" className="space-y-4 mt-4">
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
                          id="edit-allocation-all"
                          className="peer sr-only"
                        />
                        <label
                          htmlFor="edit-allocation-all"
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
                          id="edit-allocation-partial"
                          className="peer sr-only"
                        />
                        <label
                          htmlFor="edit-allocation-partial"
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

                    {allocationMode === 'all' ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-900 text-sm">
                          ℹ 将分配项目内所有现有和未来的账户
                        </p>
                      </div>
                    ) : (
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
                                  全选
                                </label>
                                <span className="text-sm text-muted-foreground">
                                  筛选结果：{filteredAccounts.length}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  已选择：{selectedAccounts.length}
                                </span>
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
                            </div>
                          )}

                          {/* 账户列表 */}
                          <div className="flex-1 border border-border rounded-lg bg-muted/30 overflow-hidden flex flex-col min-h-0">
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-48">
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
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* 授权账户标签页 */}
                  <TabsContent value="authorizedAccounts" className="mt-4">
                    <div className="flex items-center justify-center py-12 border border-border rounded-lg bg-muted/30">
                      <p className="text-muted-foreground text-sm">授权账户配置功能开发中，敬请期待</p>
                    </div>
                  </TabsContent>

                  {/* 创意标签页 */}
                  <TabsContent value="creatives" className="mt-4">
                    <div className="flex items-center justify-center py-12 border border-border rounded-lg bg-muted/30">
                      <p className="text-muted-foreground text-sm">创意配置功能开发中，敬请期待</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
          </div>
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