import { useState } from 'react';
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
import { AlertTriangle, Crown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TransferOwnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: any[];
  onTransfer: (memberId: string) => void;
}

export function TransferOwnerDialog({ open, onOpenChange, members, onTransfer }: TransferOwnerDialogProps) {
  const [selectedMember, setSelectedMember] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (!selectedMember) {
      toast.error('请选择新的 Owner');
      return;
    }
    setStep(2);
  };

  const handleTransfer = () => {
    if (!password) {
      toast.error('请输入密码');
      return;
    }
    if (!verificationCode) {
      toast.error('请输入验证码');
      return;
    }

    // Mock verification
    if (password !== 'demo123') {
      toast.error('密码错误');
      return;
    }
    if (verificationCode !== '123456') {
      toast.error('验证码错误');
      return;
    }

    onTransfer(selectedMember);
    toast.success('所有权转移成功');
    onOpenChange(false);
    
    // Reset
    setSelectedMember('');
    setPassword('');
    setVerificationCode('');
    setStep(1);
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
    setSelectedMember('');
    setPassword('');
    setVerificationCode('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-purple-600" />
            转移所有权
          </DialogTitle>
          <DialogDescription>
            将 Owner 权限转移给其他成员，此操作不可撤销
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-amber-900 text-sm font-medium">
                  转移所有权后：
                </p>
                <ul className="text-amber-800 space-y-1 ml-4 list-disc text-sm">
                  <li>您的角色将自动降为 Admin</li>
                  <li>新 Owner 将拥有最高权限</li>
                  <li>此操作无法撤销</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newOwner">选择新的 Owner</Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger id="newOwner">
                  <SelectValue placeholder="请选择成员" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.email}) - {member.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 text-sm">
                为确保安全，请完成以下验证
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">账户密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="输入您的密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-muted-foreground text-xs">Demo: 使用 "demo123"</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationCode">验证码</Label>
              <div className="flex gap-2">
                <Input
                  id="verificationCode"
                  placeholder="输入验证码"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <Button variant="outline" className="whitespace-nowrap">
                  发送验证码
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">Demo: 使用 "123456"</p>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                取消
              </Button>
              <Button onClick={handleNext}>
                下一步
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                上一步
              </Button>
              <Button onClick={handleTransfer} className="bg-purple-600 hover:bg-purple-700">
                确认转移
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}