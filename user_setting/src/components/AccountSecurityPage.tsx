import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Separator } from './ui/separator';
import { Shield, Lock, Smartphone } from 'lucide-react';

interface AccountSecurityPageProps {
  onBack?: () => void;
}

export function AccountSecurityPage({ onBack }: AccountSecurityPageProps) {
  // 模拟安全设置数据
  const securitySettings = {
    twoFactorEnabled: false,
    passwordLastModified: '2024-01-15 10:30:00',
  };

  return (
    <div className="h-full overflow-auto bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                返回
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-foreground">账号安全</h1>
              <p className="text-muted-foreground mt-1">管理您的账户安全设置</p>
            </div>
          </div>
        </div>

        {/* 密码设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              密码设置
            </CardTitle>
            <CardDescription>定期更新密码以保护您的账户安全</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">密码最近修改时间</label>
              <p className="text-foreground mt-1">{securitySettings.passwordLastModified}</p>
            </div>
            <Separator />
            <Button variant="outline">修改密码</Button>
          </CardContent>
        </Card>

        {/* 二步验证 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              二步验证
            </CardTitle>
            <CardDescription>为您的账户添加额外的安全保护层</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">二步验证状态</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {securitySettings.twoFactorEnabled ? '已启用' : '未启用'}
                </p>
              </div>
              <Button variant={securitySettings.twoFactorEnabled ? 'outline' : 'default'}>
                {securitySettings.twoFactorEnabled ? '禁用' : '启用'}
              </Button>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                二步验证可以保护您的账户，即使有人知道您的密码也无法登录。
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Smartphone className="w-4 h-4" />
                <span>推荐使用手机应用验证器（如 Google Authenticator）</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

