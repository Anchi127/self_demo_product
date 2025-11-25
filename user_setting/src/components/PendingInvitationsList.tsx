import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Copy, X, RotateCw } from 'lucide-react';
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

export interface PendingInvitation {
  id: string;
  invitedIdentifier: string; // 手机号或邮箱
  inviterName: string;
  invitedRole: 'Admin' | 'Finance' | 'Member';
  invitedAt: string; // 邀请时间
  expiresAt: string; // 过期时间
  status: 'pending' | 'expired' | 'revoked';
  token: string;
}

interface PendingInvitationsListProps {
  invitations: PendingInvitation[];
  onRevoke: (invitationId: string) => void;
  onResend: (invitationId: string) => void;
}

export function PendingInvitationsList({ invitations, onRevoke, onResend }: PendingInvitationsListProps) {
  const generateInviteLink = (token: string) => {
    return `${window.location.origin}/invite?token=${token}`;
  };

  const handleCopyLink = (token: string, identifier: string) => {
    const link = generateInviteLink(token);
    navigator.clipboard.writeText(link);
    toast.success(`已复制 ${identifier} 的邀请链接`);
  };

  const handleCopyAll = () => {
    const links = invitations
      .filter(inv => inv.status === 'pending' || inv.status === 'expired')
      .map(inv => {
        const link = generateInviteLink(inv.token);
        return `${inv.invitedIdentifier}: ${link}`;
      })
      .join('\n');
    
    navigator.clipboard.writeText(links);
    toast.success('已复制所有邀请链接');
  };

  const handleRevoke = (invitationId: string) => {
    onRevoke(invitationId);
    toast.success('邀请已撤回');
  };

  const handleResend = (invitationId: string) => {
    onResend(invitationId);
    toast.success('邀请已重新发送');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">待接受</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">已过期</Badge>;
      case 'revoked':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">已撤回</Badge>;
      default:
        return null;
    }
  };

  const pendingInvitations = invitations.filter(inv => inv.status !== 'revoked');
  const hasPending = pendingInvitations.length > 0;

  return (
    <div className="space-y-4">
      {hasPending && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            共 {pendingInvitations.length} 条待处理邀请
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAll}
            className="h-8"
          >
            <Copy className="w-4 h-4 mr-2" />
            一键复制全部链接
          </Button>
        </div>
      )}

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>受邀账号</TableHead>
              <TableHead>邀请人</TableHead>
              <TableHead>预设角色</TableHead>
              <TableHead>邀请时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  暂无待接受邀请
                </TableCell>
              </TableRow>
            ) : (
              invitations.map((invitation) => (
                <TableRow key={invitation.id}>
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
                  <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyLink(invitation.token, invitation.invitedIdentifier)}
                        className="h-8"
                        disabled={invitation.status === 'revoked'}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

