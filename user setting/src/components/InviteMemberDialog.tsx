import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
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

export function InviteMemberDialog({ open, onOpenChange, onInvite }: InviteMemberDialogProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!email) {
      toast.error('请输入邮箱地址');
      return;
    }

    if (role !== 'Finance' && selectedAccounts.length === 0) {
      toast.error('请至少选择一个广告账户');
      return;
    }

    onInvite({
      email,
      role,
      accounts: selectedAccounts,
      message,
    });

    toast.success('邀请已发送');
    onOpenChange(false);
    
    // Reset form
    setEmail('');
    setRole('Member');
    setSelectedAccounts([]);
    setMessage('');
  };

  const toggleAccount = (accountId: string) => {
    setSelectedAccounts(prev =>
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>邀请成员</DialogTitle>
          <DialogDescription>
            邀请新成员加入广告主团队，分配角色和访问权限
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱地址</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">角色</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Owner">Owner</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role !== 'Finance' && (
            <div className="space-y-2">
              <Label>可访问广告账户</Label>
              <div className="border border-border rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto bg-muted/30">
                {mockAccounts.map((account) => (
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
                Finance 角色不需要分配广告账户访问权限，仅可访问财务相关功能
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">自定义邀请消息（可选）</Label>
            <Textarea
              id="message"
              placeholder="添加个性化邀请消息..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800">邀请有效期：7 天</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>发送邀请</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}