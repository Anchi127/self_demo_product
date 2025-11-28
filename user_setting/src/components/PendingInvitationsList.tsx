import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { X, RotateCw, Edit, AlertCircle, Send, Copy } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { toast } from 'sonner@2.0.3';
import { getRoleDisplayName, type UserRole } from '../lib/permissionUtils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

export interface PendingInvitation {
  id: string;
  invitedIdentifier: string; // 手机号或邮箱
  inviterName: string;
  invitedRole: 'Admin' | 'Finance' | 'Member';
  invitedAt: string; // 邀请时间
  expiresAt: string; // 过期时间
  status: 'pending' | 'expired' | 'revoked' | 'failed';
  token: string;
  errorReason?: string; // 失败原因（仅当 status 为 'failed' 时）
  accounts?: string | string[]; // 账户分配：'all' 或账户ID数组
  allocationMode?: 'all' | 'partial'; // 分配模式
  autoGrantSelfCreatedAccounts?: boolean; // 是否自动拥有自己申请开户的账户权限
}

interface PendingInvitationsListProps {
  invitations: PendingInvitation[];
  onRevoke: (invitationId: string | string[]) => void;
  onResend: (invitationId: string | string[]) => void;
  onEdit?: (invitation: PendingInvitation) => void;
}

export function PendingInvitationsList({ invitations, onRevoke, onResend, onEdit }: PendingInvitationsListProps) {
  const [selectedInvitations, setSelectedInvitations] = useState<string[]>([]);

  const generateInviteLink = (token: string) => {
    return `${window.location.origin}/invite?token=${token}`;
  };

  const handleCopyLink = (token: string, identifier: string) => {
    const link = generateInviteLink(token);
    navigator.clipboard.writeText(link);
    toast.success(`已复制 ${identifier} 的邀请链接`);
  };

  const handleResendAll = () => {
    const resendableInvitations = invitations.filter(
      inv => inv.status === 'pending' || inv.status === 'expired' || inv.status === 'failed'
    );
    
    if (resendableInvitations.length === 0) {
      toast.error('没有可重新发送的邀请');
      return;
    }
    
    const invitationIds = resendableInvitations.map(inv => inv.id);
    onResend(invitationIds);
    toast.success(`已重新发送 ${resendableInvitations.length} 条邀请`);
  };

  const handleRevoke = (invitationId: string) => {
    onRevoke(invitationId);
    toast.success('邀请已撤回');
  };

  const handleResend = (invitationId: string) => {
    onResend(invitationId);
    toast.success('邀请已重新发送');
  };

  // 批量操作
  const handleBatchRevoke = () => {
    if (selectedInvitations.length === 0) {
      toast.error('请至少选择一个邀请');
      return;
    }
    onRevoke(selectedInvitations);
    toast.success(`已撤回 ${selectedInvitations.length} 条邀请`);
    setSelectedInvitations([]);
  };

  const handleBatchResend = () => {
    if (selectedInvitations.length === 0) {
      toast.error('请至少选择一个邀请');
      return;
    }
    onResend(selectedInvitations);
    toast.success(`已重新发送 ${selectedInvitations.length} 条邀请`);
    setSelectedInvitations([]);
  };

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableIds = invitations
        .filter(inv => inv.status !== 'revoked')
        .map(inv => inv.id);
      setSelectedInvitations(selectableIds);
    } else {
      setSelectedInvitations([]);
    }
  };

  // 切换单个选择
  const handleToggleSelect = (invitationId: string) => {
    setSelectedInvitations(prev =>
      prev.includes(invitationId)
        ? prev.filter(id => id !== invitationId)
        : [...prev, invitationId]
    );
  };

  // 检查是否全选
  const selectableInvitations = invitations.filter(inv => inv.status !== 'revoked');
  const isAllSelected = selectableInvitations.length > 0 && 
    selectableInvitations.every(inv => selectedInvitations.includes(inv));

  const getStatusBadge = (invitation: PendingInvitation) => {
    switch (invitation.status) {
      case 'pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">待接受</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">已过期</Badge>;
      case 'revoked':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">已撤回</Badge>;
      case 'failed':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-red-50 text-red-700 border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <AlertCircle className="w-3 h-3 mr-1" />
                发送失败
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" className="w-auto p-2">
              <p className="text-sm text-foreground">{invitation.errorReason || '发送失败'}</p>
            </PopoverContent>
          </Popover>
        );
      default:
        return null;
    }
  };

  const pendingInvitations = invitations.filter(inv => inv.status !== 'revoked');
  const resendableInvitations = invitations.filter(
    inv => inv.status === 'pending' || inv.status === 'expired' || inv.status === 'failed'
  );
  const hasPending = pendingInvitations.length > 0;
  const hasResendable = resendableInvitations.length > 0;
  const hasSelected = selectedInvitations.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {hasPending ? `共 ${pendingInvitations.length} 条待处理邀请` : '暂无待处理邀请'}
        </p>
        <div className="flex items-center gap-2">
          {hasSelected && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBatchResend}
                className="h-8"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                批量重新发送 ({selectedInvitations.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBatchRevoke}
                className="h-8 text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4 mr-2" />
                批量撤销 ({selectedInvitations.length})
              </Button>
            </>
          )}
          {hasResendable && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendAll}
              className="h-8"
            >
              <Send className="w-4 h-4 mr-2" />
              一键重新发送邀请 ({resendableInvitations.length})
            </Button>
          )}
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>受邀账号</TableHead>
              <TableHead>邀请人</TableHead>
              <TableHead>预设角色</TableHead>
              <TableHead>邀请时间</TableHead>
              <TableHead>过期时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  暂无待接受邀请
                </TableCell>
              </TableRow>
            ) : (
              invitations.map((invitation) => {
                const isSelectable = invitation.status !== 'revoked';
                const isSelected = selectedInvitations.includes(invitation.id);

                return (
                  <TableRow key={invitation.id}>
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleSelect(invitation.id)}
                        disabled={!isSelectable}
                      />
                    </TableCell>
                    <TableCell className="text-foreground">{invitation.invitedIdentifier}</TableCell>
                    <TableCell className="text-muted-foreground">{invitation.inviterName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                        {getRoleDisplayName(invitation.invitedRole as UserRole)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invitation.invitedAt).toLocaleString('zh-CN')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invitation.expiresAt).toLocaleString('zh-CN')}
                    </TableCell>
                    <TableCell>{getStatusBadge(invitation)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {invitation.status !== 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyLink(invitation.token, invitation.invitedIdentifier)}
                            className="h-8"
                            disabled={invitation.status === 'revoked'}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                        {invitation.status === 'expired' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResend(invitation.id)}
                            className="h-8"
                          >
                            <RotateCw className="w-4 h-4" />
                          </Button>
                        )}
                        {invitation.status === 'failed' && onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(invitation)}
                            className="h-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {invitation.status !== 'revoked' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevoke(invitation.id)}
                            className="h-8 text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

