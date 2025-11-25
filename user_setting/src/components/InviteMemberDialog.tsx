import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
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
import { Copy, X, Info, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Switch } from './ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';
import { getRoleDisplayName, type UserRole } from '../lib/permissionUtils';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (data: any) => void;
}

const mockAccounts = [
  { id: '1', name: '广告账户 A - Facebook' },
  { id: '2', name: '广告账户 B - Google Ads' },
  { id: '3', name: '广告账户 C - TikTok' },
  { id: '4', name: '广告账户 D - Twitter' },
];

interface InviteResult {
  identifier: string;
  role: string;
  token: string;
  link: string;
}

// 判断输入是邮箱还是手机号
const isEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const isPhone = (value: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/; // 中国大陆手机号格式
  return phoneRegex.test(value);
};

export function InviteMemberDialog({ open, onOpenChange, onInvite }: InviteMemberDialogProps) {
  const [identifiers, setIdentifiers] = useState<string>(''); // 批量输入，支持换行或逗号分隔
  const [role, setRole] = useState('Member');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [autoGrantSelfCreatedAccounts, setAutoGrantSelfCreatedAccounts] = useState(false);
  const [message, setMessage] = useState('');
  const [inviteResults, setInviteResults] = useState<InviteResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'id' | 'name'>('name');

  // 解析输入的账号列表
  const parseIdentifiers = (input: string): string[] => {
    return input
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  // 验证账号格式
  const validateIdentifiers = (identifiers: string[]): { valid: string[]; invalid: string[] } => {
    const valid: string[] = [];
    const invalid: string[] = [];

    identifiers.forEach(identifier => {
      if (isEmail(identifier) || isPhone(identifier)) {
        valid.push(identifier);
      } else {
        invalid.push(identifier);
      }
    });

    return { valid, invalid };
  };

  const handleGenerateInvite = () => {
    if (!identifiers.trim()) {
      toast.error('请输入手机号或邮箱');
      return;
    }

    // 验证资产配置（如果未开启自动拥有自己申请开户账户权限，则必须至少选择一个账户）
    if (role !== 'Finance' && role !== 'Owner' && selectedAccounts.length === 0 && !autoGrantSelfCreatedAccounts) {
      toast.error('请至少选择一个广告账户，或开启自动拥有自己申请开户的账户权限');
      return;
    }

    const parsedIds = parseIdentifiers(identifiers);
    
    if (parsedIds.length === 0) {
      toast.error('请输入至少一个有效的手机号或邮箱');
      return;
    }

    if (parsedIds.length > 20) {
      toast.error('单次最多邀请 20 个成员');
      return;
    }

    const { valid, invalid } = validateIdentifiers(parsedIds);

    if (invalid.length > 0) {
      toast.error(`以下账号格式无效：${invalid.join(', ')}`);
      return;
    }

    // 生成邀请链接
    const results: InviteResult[] = valid.map(identifier => {
      const token = `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const link = `${window.location.origin}/invite?token=${token}`;
      return {
        identifier,
        role,
        token,
        link
      };
    });

    setInviteResults(results);
    setShowResults(true);
  };

  const handleCopyLink = (link: string, identifier: string) => {
    navigator.clipboard.writeText(link);
    toast.success(`已复制 ${identifier} 的邀请链接`);
  };

  const handleCopyAll = () => {
    const links = inviteResults
      .map(result => `${result.identifier}: ${result.link}`)
      .join('\n');
    navigator.clipboard.writeText(links);
    toast.success('已复制所有邀请链接');
  };

  const handleFinish = () => {
    // 通知父组件邀请已生成
    onInvite({
      results: inviteResults,
      role,
      accounts: selectedAccounts,
      autoGrantSelfCreatedAccounts,
      message,
    });

    // 重置表单
    setIdentifiers('');
    setRole('Member');
    setSelectedAccounts([]);
    setAutoGrantSelfCreatedAccounts(false);
    setMessage('');
    setInviteResults([]);
    setShowResults(false);
    setSearchQuery('');
    setSearchMode('all');
    onOpenChange(false);
  };

  const handleBack = () => {
    setShowResults(false);
    setInviteResults([]);
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

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        // 重置所有状态
        setIdentifiers('');
        setRole('Member');
        setSelectedAccounts([]);
        setAutoGrantSelfCreatedAccounts(false);
        setMessage('');
        setInviteResults([]);
        setShowResults(false);
        setSearchQuery('');
        setSearchMode('name');
      }
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>邀请成员</DialogTitle>
          <DialogDescription>
            邀请新成员加入广告主团队，分配角色和访问权限
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="identifiers">邀请账号（手机号或邮箱）</Label>
                <Textarea
                  id="identifiers"
                  placeholder="支持批量输入，每行一个或使用逗号分隔&#10;例如：&#10;13900001111&#10;test@example.com&#10;或：13900001111, test@example.com"
                  value={identifiers}
                  onChange={(e) => setIdentifiers(e.target.value)}
                  rows={4}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  单次最多邀请 20 个成员，支持手机号或邮箱格式
                </p>
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

              {role !== 'Finance' && (
                <div className="space-y-4">
                  {/* 自动拥有自己申请开户账户权限开关 */}
                  <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="invite-auto-grant" className="text-sm font-medium cursor-pointer">
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
                      id="invite-auto-grant"
                      checked={autoGrantSelfCreatedAccounts}
                      onCheckedChange={setAutoGrantSelfCreatedAccounts}
                    />
                  </div>

                  {/* 配置资产（选填） */}
                  <div className="space-y-2">
                    <Label>配置资产（选填）</Label>
                    
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
                              id={`account-${account.id}`}
                              checked={selectedAccounts.includes(account.id)}
                              onCheckedChange={() => toggleAccount(account.id)}
                            />
                            <label
                              htmlFor={`account-${account.id}`}
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
              )}

              {role === 'Finance' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-900 text-sm">
                    财务角色不需要分配广告账户访问权限，仅可访问财务相关功能
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">邀请有效期：7 天</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button onClick={handleGenerateInvite}>生成邀请链接</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-4">
              {inviteResults.length === 1 ? (
                // 单人邀请场景
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-900 text-sm font-medium mb-2">邀请链接已生成</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground">受邀账号：</span>
                        <Badge variant="outline">{inviteResults[0].identifier}</Badge>
                        <Badge variant="outline">{getRoleDisplayName(inviteResults[0].role as UserRole)}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={inviteResults[0].link}
                          readOnly
                          className="flex-1 font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyLink(inviteResults[0].link, inviteResults[0].identifier)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          复制链接
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // 多人批量邀请场景
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground font-medium">
                      已生成 {inviteResults.length} 条邀请链接
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyAll}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      一键复制全部
                    </Button>
                  </div>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead>受邀账号</TableHead>
                            <TableHead>预设角色</TableHead>
                            <TableHead>邀请链接</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inviteResults.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell className="text-sm text-foreground">{result.identifier}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                                  {getRoleDisplayName(result.role as UserRole)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={result.link}
                                  readOnly
                                  className="font-mono text-xs"
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyLink(result.link, result.identifier)}
                                  className="h-8"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleBack}>
                返回修改
              </Button>
              <Button onClick={handleFinish}>完成</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}