import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { UserPlus, Edit, Trash2, Crown, Info } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { InviteMemberDialog } from './InviteMemberDialog';
import { EditMemberDialog } from './EditMemberDialog';
import { TransferOwnerDialog } from './TransferOwnerDialog';
import { RemoveMemberDialog } from './RemoveMemberDialog';
import { PendingInvitationsList, PendingInvitation } from './PendingInvitationsList';
import { EditInvitationDialog } from './EditInvitationDialog';
import { canInviteMember, canEditMember, canRemoveMember, canTransferOwner, getRoleDisplayName, type UserRole } from '../lib/permissionUtils';

const mockAccounts = [
  { id: '1', name: '广告账户 A - Facebook' },
  { id: '2', name: '广告账户 B - Google Ads' },
  { id: '3', name: '广告账户 C - TikTok' },
  { id: '4', name: '广告账户 D - Twitter' },
];

interface Member {
  id: string;
  name: string;
  email: string;
  identifier: string; // 手机号或邮箱
  role: 'Owner' | 'Admin' | 'Finance' | 'Member';
  accountCount: number | string;
  joinedAt: string; // 加入时间
  assets?: string[]; // 已分配的资产ID列表
  autoGrantSelfCreatedAccounts?: boolean; // 是否自动拥有自己申请开户的账户权限
}

const initialMembers: Member[] = [
  { 
    id: '1', 
    name: '王一', 
    email: 'w1@xx.com', 
    identifier: 'w1@xx.com',
    role: 'Owner', 
    accountCount: '全部账户',
    joinedAt: '2024-01-15T10:00:00Z',
    assets: [],
    autoGrantSelfCreatedAccounts: false
  },
  { 
    id: '2', 
    name: '李二', 
    email: 'l2@xx.com', 
    identifier: 'l2@xx.com',
    role: 'Admin', 
    accountCount: 2,
    joinedAt: '2024-02-20T14:30:00Z',
    assets: ['1', '2'],
    autoGrantSelfCreatedAccounts: true
  },
  { 
    id: '3', 
    name: '张三', 
    email: 'z3@xx.com', 
    identifier: 'z3@xx.com',
    role: 'Member', 
    accountCount: 1,
    joinedAt: '2024-03-10T09:15:00Z',
    assets: ['1'],
    autoGrantSelfCreatedAccounts: false
  },
  { 
    id: '4', 
    name: '赵四', 
    email: 'z4@xx.com', 
    identifier: 'z4@xx.com',
    role: 'Finance', 
    accountCount: 0,
    joinedAt: '2024-03-25T16:45:00Z',
    assets: [],
    autoGrantSelfCreatedAccounts: false
  },
];

// 模拟当前用户角色（实际应该从上下文或状态管理中获取）
const CURRENT_USER_ROLE: UserRole = 'Owner'; // 可以改为 'Admin' 测试不同权限

const roleColors: Record<string, string> = {
  Owner: 'bg-purple-50 text-purple-700 border-purple-200',
  Admin: 'bg-blue-50 text-blue-700 border-blue-200',
  Finance: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Member: 'bg-slate-50 text-slate-700 border-slate-200',
};

export function MemberManagement() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [transferOwnerOpen, setTransferOwnerOpen] = useState(false);
  const [removeMember, setRemoveMember] = useState<Member | null>(null);
  const [activeTab, setActiveTab] = useState('members');
  const [editInvitation, setEditInvitation] = useState<PendingInvitation | null>(null);
  
  // 模拟待接受邀请列表
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([
    {
      id: 'inv1',
      invitedIdentifier: '13900001111',
      inviterName: '王一',
      invitedRole: 'Admin',
      invitedAt: '2024-11-20T10:00:00Z',
      expiresAt: '2024-11-27T10:00:00Z',
      status: 'pending',
      token: 'abc123token'
    },
    {
      id: 'inv2',
      invitedIdentifier: 'test@example.com',
      inviterName: '李二',
      invitedRole: 'Member',
      invitedAt: '2024-11-15T14:00:00Z',
      expiresAt: '2024-11-22T14:00:00Z',
      status: 'expired',
      token: 'xyz789token'
    },
    {
      id: 'inv3',
      invitedIdentifier: 'invalid-email@wrong',
      inviterName: '当前用户',
      invitedRole: 'Member',
      invitedAt: '2024-11-28T10:00:00Z',
      expiresAt: '2024-12-05T10:00:00Z',
      status: 'failed',
      token: 'failed123token',
      errorReason: '邮箱错误',
      accounts: ['1', '2'],
      allocationMode: 'partial',
      autoGrantSelfCreatedAccounts: false
    }
  ]);

  const handleInvite = (data: any) => {
    // 创建邀请记录并添加到待接受邀请列表
    const currentUserName = '当前用户'; // 实际应该从用户上下文获取
    const now = new Date().toISOString();
    
    const newInvitations: PendingInvitation[] = data.invitations.map((invite: any) => ({
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      invitedIdentifier: invite.identifier,
      inviterName: currentUserName,
      invitedRole: invite.role as 'Admin' | 'Finance' | 'Member',
      invitedAt: now,
      expiresAt: invite.expiresAt,
      status: 'pending' as const,
      token: invite.token
    }));

    setPendingInvitations(prev => [...prev, ...newInvitations]);
  };

  const handleEdit = (data: any) => {
    if (editMember) {
      setMembers(members.map(m => 
        m.id === editMember.id 
          ? { 
              ...m, 
              role: data.role, 
              accountCount: data.role === 'Finance' ? 0 : (data.accounts?.length || 0),
              assets: data.accounts || [],
              autoGrantSelfCreatedAccounts: data.autoGrantSelfCreatedAccounts ?? false
            }
          : m
      ));
    }
  };

  const handleTransferOwner = (newOwnerId: string) => {
    setMembers(members.map(m => {
      if (m.role === 'Owner') return { ...m, role: 'Admin' as const };
      if (m.id === newOwnerId) return { ...m, role: 'Owner' as const, accountCount: '全部账户' };
      return m;
    }));
  };

  const handleRemove = () => {
    if (removeMember) {
      setMembers(members.filter(m => m.id !== removeMember.id));
    }
  };

  const handleRevokeInvitation = (invitationId: string | string[]) => {
    const ids = Array.isArray(invitationId) ? invitationId : [invitationId];
    setPendingInvitations(prev => 
      prev.map(inv => 
        ids.includes(inv.id)
          ? { ...inv, status: 'revoked' as const }
          : inv
      )
    );
  };

  const handleResendInvitation = (invitationId: string | string[]) => {
    const ids = Array.isArray(invitationId) ? invitationId : [invitationId];
    setPendingInvitations(prev => 
      prev.map(inv => {
        if (ids.includes(inv.id)) {
          // 生成新的 token 和过期时间
          const newToken = `new_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
          return {
            ...inv,
            token: newToken,
            expiresAt: newExpiresAt,
            status: 'pending' as const,
            errorReason: undefined
          };
        }
        return inv;
      })
    );
  };

  const handleEditInvitation = (invitation: PendingInvitation) => {
    setEditInvitation(invitation);
  };

  const handleUpdateInvitation = (data: any) => {
    if (!editInvitation) return;

    setPendingInvitations(prev => 
      prev.map(inv => {
        if (inv.id === editInvitation.id) {
          return {
            ...inv,
            invitedIdentifier: data.identifier,
            invitedRole: data.role as 'Admin' | 'Finance' | 'Member',
            token: data.token,
            expiresAt: data.expiresAt,
            status: 'pending' as const,
            errorReason: undefined,
            accounts: data.accounts,
            allocationMode: data.allocationMode,
            autoGrantSelfCreatedAccounts: data.autoGrantSelfCreatedAccounts
          };
        }
        return inv;
      })
    );

    setEditInvitation(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-foreground mb-1">广告主成员管理</h3>
          <p className="text-muted-foreground text-sm">项目名称：BPMSTEST</p>
        </div>
        {canInviteMember(CURRENT_USER_ROLE) && (
          <Button onClick={() => setInviteOpen(true)} className="h-9">
            <UserPlus className="w-4 h-4 mr-2" />
            邀请成员
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="members">成员列表</TabsTrigger>
          <TabsTrigger value="pending">待接受邀请</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>用户名</TableHead>
                  <TableHead>账号</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <span>角色</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <div className="space-y-2">
                              <p className="font-medium mb-2">角色定义说明</p>
                              <div className="space-y-1.5 text-sm">
                                <div>
                                  <span className="font-medium">项目负责人：</span>
                                  <span className="text-muted-foreground">项目最高权限。可邀请成员、分配角色、分配广告账户、发起充值与管理钱包、支持转移负责人。</span>
                                </div>
                                <div>
                                  <span className="font-medium">管理员：</span>
                                  <span className="text-muted-foreground">管理者。可邀请成员、分配账户权限、发起充值与管理钱包。</span>
                                </div>
                                <div>
                                  <span className="font-medium">财务：</span>
                                  <span className="text-muted-foreground">财务角色。拥有除邀请成员、分配账户权限外的全部功能，全部账户数据。</span>
                                </div>
                                <div>
                                  <span className="font-medium">成员：</span>
                                  <span className="text-muted-foreground">普通成员。仅能操作被分配的广告账户，不可访问钱包、不可邀请他人。</span>
                                </div>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead>已授权资产</TableHead>
                  <TableHead>加入时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => {
                  const canEdit = canEditMember(CURRENT_USER_ROLE, member.role);
                  const canRemove = canRemoveMember(CURRENT_USER_ROLE, member.role);
                  const canTransfer = canTransferOwner(CURRENT_USER_ROLE) && member.role === 'Owner';

                  // 根据角色显示已授权资产
                  const getAuthorizedAssets = () => {
                    if (member.role === 'Owner' || member.role === 'Admin' || member.role === 'Finance') {
                      return '全部账户';
                    }
                    // Member 角色显示具体账户名称
                    if (member.assets && member.assets.length > 0) {
                      const accountNames = member.assets
                        .map(assetId => {
                          const account = mockAccounts.find(acc => acc.id === assetId);
                          return account ? account.name : `账户 ${assetId}`;
                        })
                        .join('、');
                      return accountNames;
                    }
                    return '无';
                  };

                  return (
                    <TableRow key={member.id}>
                      <TableCell className="text-foreground">{member.name}</TableCell>
                      <TableCell className="text-muted-foreground">{member.identifier}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={roleColors[member.role]}>
                          {getRoleDisplayName(member.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{getAuthorizedAssets()}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(member.joinedAt).toLocaleDateString('zh-CN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditMember(member)}
                              className="h-8"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          {canTransfer && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setTransferOwnerOpen(true)}
                              className="h-8"
                            >
                              <Crown className="w-4 h-4" />
                            </Button>
                          )}
                          {canRemove && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRemoveMember(member)}
                              className="h-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <PendingInvitationsList
            invitations={pendingInvitations}
            onRevoke={handleRevokeInvitation}
            onResend={handleResendInvitation}
            onEdit={handleEditInvitation}
          />
        </TabsContent>
      </Tabs>

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={handleInvite}
      />

      <EditMemberDialog
        open={!!editMember}
        onOpenChange={(open) => !open && setEditMember(null)}
        member={editMember}
        onEdit={handleEdit}
        currentUserRole={CURRENT_USER_ROLE}
      />

      <TransferOwnerDialog
        open={transferOwnerOpen}
        onOpenChange={setTransferOwnerOpen}
        members={members.filter(m => m.role !== 'Owner')}
        onTransfer={handleTransferOwner}
      />

      <RemoveMemberDialog
        open={!!removeMember}
        onOpenChange={(open) => !open && setRemoveMember(null)}
        member={removeMember}
        onRemove={handleRemove}
        currentUserRole={CURRENT_USER_ROLE}
      />

      <EditInvitationDialog
        open={!!editInvitation}
        onOpenChange={(open) => !open && setEditInvitation(null)}
        invitation={editInvitation}
        onUpdate={handleUpdateInvitation}
      />
    </div>
  );
}