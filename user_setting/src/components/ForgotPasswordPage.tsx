import React, { useState } from 'react';
import { EyeOpenIcon } from './icons/EyeOpenIcon';
import { EyeClosedIcon } from './icons/EyeClosedIcon';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Mail, Phone } from 'lucide-react';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

// 判断输入是邮箱还是手机号
const isEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const isPhone = (value: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/; // 中国大陆手机号格式
  return phoneRegex.test(value);
};

export function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
  const [resetMethod, setResetMethod] = useState<'phone' | 'email'>('phone');
  
  // 手机号重置相关状态
  const [phone, setPhone] = useState('');
  const [phoneVerificationCode, setPhoneVerificationCode] = useState('');
  const [phoneNewPassword, setPhoneNewPassword] = useState('');
  const [phoneConfirmPassword, setPhoneConfirmPassword] = useState('');
  const [showPhonePassword, setShowPhonePassword] = useState(false);
  const [showPhoneConfirmPassword, setShowPhoneConfirmPassword] = useState(false);
  const [phoneCodeCountdown, setPhoneCodeCountdown] = useState(0);
  
  // 邮箱重置相关状态
  const [email, setEmail] = useState('');
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [emailNewPassword, setEmailNewPassword] = useState('');
  const [emailConfirmPassword, setEmailConfirmPassword] = useState('');
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [showEmailConfirmPassword, setShowEmailConfirmPassword] = useState(false);
  const [emailCodeCountdown, setEmailCodeCountdown] = useState(0);
  
  const phoneInputRef = React.useRef<HTMLInputElement>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  // 发送手机号验证码
  const handleSendPhoneCode = () => {
    if (!phone.trim()) {
      if (phoneInputRef.current) {
        phoneInputRef.current.setCustomValidity('请先输入手机号');
        phoneInputRef.current.reportValidity();
      }
      return;
    }
    
    if (!isPhone(phone)) {
      if (phoneInputRef.current) {
        phoneInputRef.current.setCustomValidity('请输入有效的手机号');
        phoneInputRef.current.reportValidity();
      }
      return;
    }
    
    // 模拟发送验证码
    console.log('发送验证码到手机号:', phone);
    // 实际项目中这里应该调用发送验证码API
    
    // 开始倒计时
    setPhoneCodeCountdown(60);
    const timer = setInterval(() => {
      setPhoneCodeCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 发送邮箱验证码
  const handleSendEmailCode = () => {
    if (!email.trim()) {
      if (emailInputRef.current) {
        emailInputRef.current.setCustomValidity('请先输入邮箱地址');
        emailInputRef.current.reportValidity();
      }
      return;
    }
    
    if (!isEmail(email)) {
      if (emailInputRef.current) {
        emailInputRef.current.setCustomValidity('请输入有效的邮箱地址');
        emailInputRef.current.reportValidity();
      }
      return;
    }
    
    // 模拟发送验证码
    console.log('发送验证码到邮箱:', email);
    // 实际项目中这里应该调用发送验证码API
    
    // 开始倒计时
    setEmailCodeCountdown(60);
    const timer = setInterval(() => {
      setEmailCodeCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 手机号重置密码提交
  const handlePhoneReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证手机号
    if (!phone.trim()) {
      if (phoneInputRef.current) {
        phoneInputRef.current.setCustomValidity('请输入手机号');
        phoneInputRef.current.reportValidity();
      }
      return;
    }
    
    if (!isPhone(phone)) {
      if (phoneInputRef.current) {
        phoneInputRef.current.setCustomValidity('请输入有效的手机号');
        phoneInputRef.current.reportValidity();
      }
      return;
    }
    
    // 验证验证码
    if (!phoneVerificationCode.trim()) {
      alert('请输入短信验证码');
      return;
    }
    
    // 验证密码
    if (!phoneNewPassword.trim()) {
      alert('请输入新密码');
      return;
    }
    
    if (phoneNewPassword.length < 6) {
      alert('密码长度至少为6位');
      return;
    }
    
    // 验证确认密码
    if (phoneNewPassword !== phoneConfirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    
    // 模拟重置成功
    console.log('手机号重置密码:', {
      phone,
      verificationCode: phoneVerificationCode,
      newPassword: phoneNewPassword
    });
    
    alert('密码重置成功，请使用新密码登录');
    onBackToLogin();
  };

  // 邮箱重置密码提交
  const handleEmailReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证邮箱
    if (!email.trim()) {
      if (emailInputRef.current) {
        emailInputRef.current.setCustomValidity('请输入邮箱地址');
        emailInputRef.current.reportValidity();
      }
      return;
    }
    
    if (!isEmail(email)) {
      if (emailInputRef.current) {
        emailInputRef.current.setCustomValidity('请输入有效的邮箱地址');
        emailInputRef.current.reportValidity();
      }
      return;
    }
    
    // 验证验证码
    if (!emailVerificationCode.trim()) {
      alert('请输入邮箱验证码');
      return;
    }
    
    // 验证密码
    if (!emailNewPassword.trim()) {
      alert('请输入新密码');
      return;
    }
    
    if (emailNewPassword.length < 6) {
      alert('密码长度至少为6位');
      return;
    }
    
    // 验证确认密码
    if (emailNewPassword !== emailConfirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    
    // 模拟重置成功
    console.log('邮箱重置密码:', {
      email,
      verificationCode: emailVerificationCode,
      newPassword: emailNewPassword
    });
    
    alert('密码重置成功，请使用新密码登录');
    onBackToLogin();
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-auto bg-card border border-border rounded-lg shadow-lg p-8">
        <button
          onClick={onBackToLogin}
          className="mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← 返回登录
        </button>
        
        <h2 className="text-3xl font-bold text-center text-foreground mb-2">
          忘记密码
        </h2>
        <p className="text-sm text-center text-muted-foreground mb-8">
          请选择重置密码的方式
        </p>

        <Tabs value={resetMethod} onValueChange={(value) => setResetMethod(value as 'phone' | 'email')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>手机号</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>邮箱</span>
            </TabsTrigger>
          </TabsList>

          {/* 手机号重置表单 */}
          <TabsContent value="phone">
            <form onSubmit={handlePhoneReset} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  ref={phoneInputRef}
                  type="tel"
                  placeholder="请输入您的手机号"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneInputRef.current) {
                      phoneInputRef.current.setCustomValidity('');
                    }
                  }}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneVerificationCode">短信验证码</Label>
                <div className="flex gap-2">
                  <Input
                    id="phoneVerificationCode"
                    type="text"
                    placeholder="请输入验证码"
                    value={phoneVerificationCode}
                    onChange={(e) => setPhoneVerificationCode(e.target.value)}
                    required
                    className="flex-1"
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    onClick={handleSendPhoneCode}
                    disabled={phoneCodeCountdown > 0}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    {phoneCodeCountdown > 0 ? `${phoneCodeCountdown}秒后重试` : '发送验证码'}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNewPassword">新密码</Label>
                <div className="relative" style={{ position: 'relative' }}>
                  <Input
                    id="phoneNewPassword"
                    type={showPhonePassword ? 'text' : 'password'}
                    placeholder="请输入新密码（至少6位）"
                    value={phoneNewPassword}
                    onChange={(e) => setPhoneNewPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPhonePassword(!showPhonePassword)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={showPhonePassword ? '隐藏密码' : '显示密码'}
                    style={{
                      position: 'absolute',
                      right: '0',
                      top: '0',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 12px',
                      zIndex: 10,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {showPhonePassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneConfirmPassword">确认新密码</Label>
                <div className="relative" style={{ position: 'relative' }}>
                  <Input
                    id="phoneConfirmPassword"
                    type={showPhoneConfirmPassword ? 'text' : 'password'}
                    placeholder="请再次输入新密码"
                    value={phoneConfirmPassword}
                    onChange={(e) => setPhoneConfirmPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPhoneConfirmPassword(!showPhoneConfirmPassword)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={showPhoneConfirmPassword ? '隐藏密码' : '显示密码'}
                    style={{
                      position: 'absolute',
                      right: '0',
                      top: '0',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 12px',
                      zIndex: 10,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {showPhoneConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full">
                重置密码
              </Button>
            </form>
          </TabsContent>

          {/* 邮箱重置表单 */}
          <TabsContent value="email">
            <form onSubmit={handleEmailReset} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  ref={emailInputRef}
                  type="email"
                  placeholder="请输入您的邮箱地址"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailInputRef.current) {
                      emailInputRef.current.setCustomValidity('');
                    }
                  }}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailVerificationCode">邮箱验证码</Label>
                <div className="flex gap-2">
                  <Input
                    id="emailVerificationCode"
                    type="text"
                    placeholder="请输入验证码"
                    value={emailVerificationCode}
                    onChange={(e) => setEmailVerificationCode(e.target.value)}
                    required
                    className="flex-1"
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    onClick={handleSendEmailCode}
                    disabled={emailCodeCountdown > 0}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    {emailCodeCountdown > 0 ? `${emailCodeCountdown}秒后重试` : '发送验证码'}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailNewPassword">新密码</Label>
                <div className="relative" style={{ position: 'relative' }}>
                  <Input
                    id="emailNewPassword"
                    type={showEmailPassword ? 'text' : 'password'}
                    placeholder="请输入新密码（至少6位）"
                    value={emailNewPassword}
                    onChange={(e) => setEmailNewPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailPassword(!showEmailPassword)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={showEmailPassword ? '隐藏密码' : '显示密码'}
                    style={{
                      position: 'absolute',
                      right: '0',
                      top: '0',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 12px',
                      zIndex: 10,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {showEmailPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailConfirmPassword">确认新密码</Label>
                <div className="relative" style={{ position: 'relative' }}>
                  <Input
                    id="emailConfirmPassword"
                    type={showEmailConfirmPassword ? 'text' : 'password'}
                    placeholder="请再次输入新密码"
                    value={emailConfirmPassword}
                    onChange={(e) => setEmailConfirmPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailConfirmPassword(!showEmailConfirmPassword)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={showEmailConfirmPassword ? '隐藏密码' : '显示密码'}
                    style={{
                      position: 'absolute',
                      right: '0',
                      top: '0',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 12px',
                      zIndex: 10,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {showEmailConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full">
                重置密码
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

