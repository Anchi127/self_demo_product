import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { canRemoveMember, getRoleDisplayName, type UserRole } from '../lib/permissionUtils';

interface RemoveMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: any;
  onRemove: () => void;
  currentUserRole: UserRole;
}

export function RemoveMemberDialog({ open, onOpenChange, member, onRemove, currentUserRole }: RemoveMemberDialogProps) {
  if (!member) return null;

  const canRemove = canRemoveMember(currentUserRole, member.role);

  const handleConfirm = () => {
    if (!canRemove) {
      toast.error('您没有权限移除此成员');
      return;
    }

    onRemove();
    toast.success('成员已移除');
    onOpenChange(false);
  };

  if (!canRemove) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              无权限操作
            </DialogTitle>
            <DialogDescription>
              您没有权限移除此成员
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-900 text-sm">
                {currentUserRole === 'Admin' && member.role === 'Owner' 
                  ? '管理员无法移除项目负责人'
                  : currentUserRole === 'Admin' && member.role === 'Admin'
                  ? '管理员无法移除其他管理员'
                  : '您没有权限执行此操作'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            确认移除成员
          </DialogTitle>
          <DialogDescription>
            此操作不可撤销，请谨慎操作
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-900 mb-3 text-sm font-medium">
              您确定要移除以下成员吗？
            </p>
            <div className="space-y-1.5 text-red-800 text-sm">
              <p>姓名：{member.name}</p>
              <p>邮箱：{member.email}</p>
              <p>角色：{getRoleDisplayName(member.role)}</p>
            </div>
          </div>

          <div className="space-y-2 text-foreground text-sm">
            <p className="font-medium">移除后：</p>
            <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
              <li>该成员将立即失去访问权限</li>
              <li>其关联的广告账户权限将被清除</li>
              <li>该成员在该项目下的所有资产权限立即失效</li>
              <li>Token 强制失效</li>
              <li>无法自动恢复，需重新邀请</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            确认移除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}