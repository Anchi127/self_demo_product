import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Lock, 
  Shield, 
  Bell, 
  Mail, 
  MessageCircle, 
  Globe,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export function SystemSettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // 账号安全状态
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordLastModified, setPasswordLastModified] = useState('2024-01-15 10:30:00');
  
  // 通知偏好设置
  const [emailNotification, setEmailNotification] = useState(true);
  const [wechatNotification, setWechatNotification] = useState(true);
  const [inAppNotification, setInAppNotification] = useState(true);
  
  // 系统语言
  const [language, setLanguage] = useState('zh-CN');

  // 密码修改表单状态
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePassword = () => {
    // 这里应该添加密码验证和保存逻辑
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('新密码和确认密码不匹配');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert('密码长度至少为8位');
      return;
    }
    // 保存成功后更新修改时间
    setPasswordLastModified(new Date().toLocaleString('zh-CN'));
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('密码修改成功');
  };

  return (
    <div className="h-full overflow-auto bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">系统设置</h1>
          <p className="text-muted-foreground mt-1">管理您的账户安全、通知偏好和系统语言设置</p>
        </div>

        {/* 账号安全 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">账号安全</h2>
          
          {/* 密码修改卡片 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                密码修改
              </CardTitle>
              <CardDescription>定期更新密码以保护您的账户安全</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">当前密码</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="请输入当前密码"
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground hover:text-foreground flex items-center justify-center w-5 h-5"
                    style={{ pointerEvents: 'auto' }}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">新密码</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="请输入新密码（至少8位）"
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground hover:text-foreground flex items-center justify-center w-5 h-5"
                    style={{ pointerEvents: 'auto' }}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">确认新密码</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="请再次输入新密码"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground hover:text-foreground flex items-center justify-center w-5 h-5"
                    style={{ pointerEvents: 'auto' }}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-muted-foreground">
                  密码最近修改时间：{passwordLastModified}
                </p>
                <Button onClick={handleSavePassword}>保存密码</Button>
              </div>
            </CardContent>
          </Card>

          {/* 二步验证卡片 */}
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
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground font-medium">二步验证状态</p>
                    {twoFactorEnabled ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500">已启用</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">未启用</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    二步验证可以保护您的账户，即使有人知道您的密码也无法登录。
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
              
              {twoFactorEnabled && (
                <div className="mt-4 p-4 bg-secondary rounded-lg space-y-2">
                  <p className="text-sm font-medium text-foreground">验证器应用</p>
                  <p className="text-sm text-muted-foreground">
                    推荐使用手机应用验证器（如 Google Authenticator、Microsoft Authenticator）
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    配置验证器
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* 通知偏好设置 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">通知偏好设置</h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                通知方式
              </CardTitle>
              <CardDescription>选择您希望接收通知的方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 邮件通知 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground font-medium">邮件通知</p>
                    <p className="text-sm text-muted-foreground">
                      通过邮箱接收系统通知、安全提醒等重要信息
                    </p>
                  </div>
                </div>
                <Switch
                  checked={emailNotification}
                  onCheckedChange={setEmailNotification}
                />
              </div>
              
              <Separator />
              
              {/* 微信通知 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground font-medium">微信通知</p>
                    <p className="text-sm text-muted-foreground">
                      通过微信接收实时通知和提醒消息
                    </p>
                  </div>
                </div>
                <Switch
                  checked={wechatNotification}
                  onCheckedChange={setWechatNotification}
                />
              </div>
              
              <Separator />
              
              {/* 站内信通知 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground font-medium">站内信通知</p>
                    <p className="text-sm text-muted-foreground">
                      在系统内接收通知消息，登录后即可查看
                    </p>
                  </div>
                </div>
                <Switch
                  checked={inAppNotification}
                  onCheckedChange={setInAppNotification}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* 系统语言 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">系统语言</h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                语言设置
              </CardTitle>
              <CardDescription>选择您偏好的系统显示语言</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">选择语言</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="w-full max-w-xs">
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh-CN">简体中文</SelectItem>
                    <SelectItem value="zh-TW">繁體中文</SelectItem>
                    <SelectItem value="en-US">English</SelectItem>
                    <SelectItem value="ja-JP">日本語</SelectItem>
                    <SelectItem value="ko-KR">한국어</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  更改语言后，页面将自动刷新以应用新设置
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

