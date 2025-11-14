import { useState, useEffect } from 'react';
import { Button } from './ui/button';
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
import { toast } from 'sonner@2.0.3';

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: any;
  onEdit: (data: any) => void;
}

const mockAccounts = [
  { id: '1', name: '广告账户 A - Facebook' },
  { id: '2', name: '广告账户 B - Google Ads' },
  { id: '3', name: '广告账户 C - TikTok' },
  { id: '4', name: '广告账户 D - Twitter' },
];

export function EditMemberDialog({ open, onOpenChange, member, onEdit }: EditMemberDialogProps) {
  const [role, setRole] = useState('Member');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  useEffect(() => {
    if (member) {
      setRole(member.role);
      // Mock initial accounts based on count
      if (typeof member.accountCount === 'number') {
        setSelectedAccounts(mockAccounts.slice(0, member.accountCount).map(a => a.id));
      }
    }
  }, [member]);

  const handleSubmit = () => {
    if (role !== 'Finance' && role !== 'Owner' && selectedAccounts.length === 0) {
      toast.error('请至少选择一个广告账户');
      return;
    }

    onEdit({
      role,
      accounts: selectedAccounts,
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

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>编辑成员权限</DialogTitle>
          <DialogDescription>
            修改 {member.name} ({member.email}) 的角色和访问权限
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">角色</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {member.role === 'Owner' ? (
                  <>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            {member.role !== 'Owner' && (
              <p className="text-gray-500">
                注：仅 Owner 可分配 Owner 角色
              </p>
            )}
          </div>

          {role !== 'Finance' && role !== 'Owner' && (
            <div className="space-y-2">
              <Label>可访问广告账户</Label>
              <div className="border border-border rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto bg-muted/30">
                {mockAccounts.map((account) => (
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
                      {account.name}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-sm">已选择 {selectedAccounts.length} 个账户</p>
            </div>
          )}

          {role === 'Finance' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-900 text-sm">
                切换为 Finance 角色后，系统将自动移除其广告账户访问权限
              </p>
            </div>
          )}

          {role === 'Owner' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-900 text-sm">
                Owner 角色默认拥有全部账户的访问权限
              </p>
            </div>
          )}
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