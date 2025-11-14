import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { UserPlus, Edit, Trash2, Crown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { InviteMemberDialog } from './InviteMemberDialog';
import { EditMemberDialog } from './EditMemberDialog';
import { TransferOwnerDialog } from './TransferOwnerDialog';
import { RemoveMemberDialog } from './RemoveMemberDialog';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Finance' | 'Member';
  accountCount: number | string;
}

const initialMembers: Member[] = [
  { id: '1', name: '王一', email: 'w1@xx.com', role: 'Owner', accountCount: '全部账户' },
  { id: '2', name: '李二', email: 'l2@xx.com', role: 'Admin', accountCount: 2 },
  { id: '3', name: '张三', email: 'z3@xx.com', role: 'Member', accountCount: 1 },
  { id: '4', name: '赵四', email: 'z4@xx.com', role: 'Finance', accountCount: 0 },
];

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

  const handleInvite = (data: any) => {
    const newMember: Member = {
      id: String(Date.now()),
      name: data.email.split('@')[0],
      email: data.email,
      role: data.role,
      accountCount: data.role === 'Finance' ? 0 : data.accounts.length,
    };
    setMembers([...members, newMember]);
  };

  const handleEdit = (data: any) => {
    if (editMember) {
      setMembers(members.map(m => 
        m.id === editMember.id 
          ? { ...m, role: data.role, accountCount: data.role === 'Finance' ? 0 : data.accounts.length }
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-foreground mb-1">广告主成员管理</h3>
          <p className="text-muted-foreground text-sm">Adv: A001</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="h-9">
          <UserPlus className="w-4 h-4 mr-2" />
          邀请成员
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>用户名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>账户数</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="text-foreground">{member.name}</TableCell>
                <TableCell className="text-muted-foreground">{member.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleColors[member.role]}>
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{member.accountCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {member.role === 'Owner' ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditMember(member)}
                          className="h-8"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTransferOwnerOpen(true)}
                          className="h-8"
                        >
                          <Crown className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditMember(member)}
                          className="h-8"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRemoveMember(member)}
                          className="h-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
      />
    </div>
  );
}