import React, { useState } from 'react';
import { MetaIcon } from './icons/MetaIcon';
import { GoogleIcon } from './icons/GoogleIcon';
import { TiktokIcon } from './icons/TiktokIcon';
import { EyeOpenIcon } from './icons/EyeOpenIcon';
import { EyeClosedIcon } from './icons/EyeClosedIcon';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, Phone } from 'lucide-react';
import { cn } from '../lib/utils';

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
}

type RegisterStep = 'select' | 'email' | 'phone' | 'social' | 'social-complete';
type SocialProvider = 'Meta' | 'Google' | 'TikTok';

// 判断输入是邮箱还是手机号
const isEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const isPhone = (value: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/; // 中国大陆手机号格式
  return phoneRegex.test(value);
};

export function RegisterPage({ onRegisterSuccess, onBackToLogin }: RegisterPageProps) {
  const [step, setStep] = useState<RegisterStep>('select');
  
  // 邮箱注册相关状态
  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailConfirmPassword, setEmailConfirmPassword] = useState('');
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [showEmailConfirmPassword, setShowEmailConfirmPassword] = useState(false);
  
  // 手机号注册相关状态
  const [phone, setPhone] = useState('');
  const [phonePassword, setPhonePassword] = useState('');
  const [phoneConfirmPassword, setPhoneConfirmPassword] = useState('');
  const [showPhonePassword, setShowPhonePassword] = useState(false);
  const [showPhoneConfirmPassword, setShowPhoneConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeCountdown, setCodeCountdown] = useState(0);
  
  // 共同字段
  const [invitationCode, setInvitationCode] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [otherContact, setOtherContact] = useState('');
  
  // 第三方注册相关状态
  const [socialProvider, setSocialProvider] = useState<SocialProvider | null>(null);
  const [socialContact, setSocialContact] = useState(''); // 合并的手机号或邮箱
  const [socialVerificationCode, setSocialVerificationCode] = useState('');
  const [socialCodeCountdown, setSocialCodeCountdown] = useState(0);
  const [socialName, setSocialName] = useState('');
  const [socialCompany, setSocialCompany] = useState('');

  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const phoneInputRef = React.useRef<HTMLInputElement>(null);
  const invitationCodeInputRef = React.useRef<HTMLInputElement>(null);
  const socialContactInputRef = React.useRef<HTMLInputElement>(null);

  // 发送验证码（手机号注册）
  const handleSendCode = () => {
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
    console.log('发送验证码到:', phone);
    // 实际项目中这里应该调用发送验证码API
    
    // 开始倒计时
    setCodeCountdown(60);
    const timer = setInterval(() => {
      setCodeCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 发送验证码（第三方注册补充信息）
  const handleSendSocialCode = () => {
    if (!socialContact.trim()) {
      if (socialContactInputRef.current) {
        socialContactInputRef.current.setCustomValidity('请输入手机号或邮箱');
        socialContactInputRef.current.reportValidity();
      }
      return;
    }
    
    const contactValue = socialContact.trim();
    const isPhoneNumber = isPhone(contactValue);
    const isEmailAddress = isEmail(contactValue);
    
    if (!isPhoneNumber && !isEmailAddress) {
      if (socialContactInputRef.current) {
        socialContactInputRef.current.setCustomValidity('请输入有效的手机号或邮箱地址');
        socialContactInputRef.current.reportValidity();
      }
      return;
    }
    
    // 模拟发送验证码
    if (isPhoneNumber) {
      console.log('发送短信验证码到:', contactValue);
    } else {
      console.log('发送邮箱验证码到:', contactValue);
    }
    
    // 实际项目中这里应该调用发送验证码API
    
    // 开始倒计时
    setSocialCodeCountdown(60);
    const timer = setInterval(() => {
      setSocialCodeCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 邮箱注册提交
  const handleEmailRegister = (e: React.FormEvent) => {
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
    
    // 验证密码
    if (!emailPassword.trim()) {
      alert('请输入密码');
      return;
    }
    
    if (emailPassword.length < 6) {
      alert('密码长度至少为6位');
      return;
    }
    
    // 验证确认密码
    if (emailPassword !== emailConfirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    
    // 验证其他必填字段
    if (!invitationCode.trim()) {
      if (invitationCodeInputRef.current) {
        invitationCodeInputRef.current.setCustomValidity('请输入邀请码');
        invitationCodeInputRef.current.reportValidity();
      }
      return;
    }
    
    if (!name.trim()) {
      alert('请输入姓名');
      return;
    }
    
    if (!company.trim()) {
      alert('请输入公司名称');
      return;
    }
    
    if (!position.trim()) {
      alert('请输入职位');
      return;
    }
    
    // 模拟注册成功
    console.log('邮箱注册信息:', {
      email,
      password: emailPassword,
      invitationCode,
      name,
      company,
      position,
      otherContact: otherContact.trim() || undefined
    });
    
    onRegisterSuccess();
  };

  // 手机号注册提交
  const handlePhoneRegister = (e: React.FormEvent) => {
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
    if (!verificationCode.trim()) {
      alert('请输入短信验证码');
      return;
    }
    
    // 验证密码
    if (!phonePassword.trim()) {
      alert('请输入密码');
      return;
    }
    
    if (phonePassword.length < 6) {
      alert('密码长度至少为6位');
      return;
    }
    
    // 验证确认密码
    if (phonePassword !== phoneConfirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    
    // 验证其他必填字段
    if (!invitationCode.trim()) {
      if (invitationCodeInputRef.current) {
        invitationCodeInputRef.current.setCustomValidity('请输入邀请码');
        invitationCodeInputRef.current.reportValidity();
      }
      return;
    }
    
    if (!name.trim()) {
      alert('请输入姓名');
      return;
    }
    
    if (!company.trim()) {
      alert('请输入公司名称');
      return;
    }
    
    if (!position.trim()) {
      alert('请输入职位');
      return;
    }
    
    // 模拟注册成功
    console.log('手机号注册信息:', {
      phone,
      verificationCode,
      password: phonePassword,
      invitationCode,
      name,
      company,
      position,
      otherContact: otherContact.trim() || undefined
    });
    
    onRegisterSuccess();
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`${provider} 注册`);
    // 实际项目中这里应该调用第三方授权API
    // 模拟第三方授权流程
    // 授权成功后，保存提供商信息并跳转到信息补充页面
    setSocialProvider(provider as SocialProvider);
    setStep('social-complete');
  };

  // 渲染选择注册方式页面
  const renderSelectStep = () => (
    <>
      <h2 className="text-3xl font-bold text-center text-foreground mb-2">
        创建账号
      </h2>
      <p className="text-sm text-center text-muted-foreground mb-8">
        请选择注册方式
      </p>

      {/* 第三方注册按钮 */}
      <div className="space-y-3 mb-6">
        <button
          onClick={() => handleSocialRegister('Meta')}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-input-background border border-input rounded-lg text-foreground hover:bg-muted hover:border-foreground/20 hover:shadow-sm transition-all duration-200 cursor-pointer group"
        >
          <div className="w-5 h-5 flex-shrink-0">
            <MetaIcon className="w-full h-full" />
          </div>
          <span>使用 Meta 账号注册</span>
        </button>
        
        <button
          onClick={() => handleSocialRegister('Google')}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-input-background border border-input rounded-lg text-foreground hover:bg-muted hover:border-foreground/20 hover:shadow-sm transition-all duration-200 cursor-pointer group"
        >
          <div className="w-5 h-5 flex-shrink-0">
            <GoogleIcon className="w-full h-full" />
          </div>
          <span>使用 Google 账号注册</span>
        </button>
        
        <button
          onClick={() => handleSocialRegister('TikTok')}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-input-background border border-input rounded-lg text-foreground hover:bg-muted hover:border-foreground/20 hover:shadow-sm transition-all duration-200 cursor-pointer group"
        >
          <div className="w-5 h-5 flex-shrink-0">
            <TiktokIcon className="w-full h-full" />
          </div>
          <span>使用 TikTok 账号注册</span>
        </button>
      </div>

      <div className="flex items-center my-6">
        <hr className="flex-grow border-border" />
        <span className="px-4 text-muted-foreground text-sm">或</span>
        <hr className="flex-grow border-border" />
      </div>

      {/* 邮箱和手机号注册选项 */}
      <div className="space-y-3">
        <button
          onClick={() => setStep('email')}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-input-background border border-input rounded-lg text-foreground hover:bg-muted hover:border-foreground/20 hover:shadow-sm transition-all duration-200"
        >
          <Mail className="w-5 h-5" />
          <span>使用邮箱注册</span>
        </button>
        
        <button
          onClick={() => setStep('phone')}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-input-background border border-input rounded-lg text-foreground hover:bg-muted hover:border-foreground/20 hover:shadow-sm transition-all duration-200"
        >
          <Phone className="w-5 h-5" />
          <span>使用手机号注册</span>
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        已有账号？
        <button
          onClick={onBackToLogin}
          className="text-primary hover:text-primary/80 hover:underline ml-1 transition-colors"
        >
          立即登录
        </button>
      </p>
    </>
  );

  // 渲染邮箱注册表单
  const renderEmailForm = () => (
    <>
      <button
        onClick={() => setStep('select')}
        className="mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← 返回选择注册方式
      </button>
      
      <h2 className="text-3xl font-bold text-center text-foreground mb-2">
        邮箱注册
      </h2>
      <p className="text-sm text-center text-muted-foreground mb-8">
        使用邮箱创建您的账号
      </p>

      <form onSubmit={handleEmailRegister} className="space-y-4" noValidate>
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
          <Label htmlFor="emailPassword">密码</Label>
          <div className="relative" style={{ position: 'relative' }}>
            <Input
              id="emailPassword"
              type={showEmailPassword ? 'text' : 'password'}
              placeholder="请输入密码（至少6位）"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
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
          <Label htmlFor="emailConfirmPassword">确认密码</Label>
          <div className="relative" style={{ position: 'relative' }}>
            <Input
              id="emailConfirmPassword"
              type={showEmailConfirmPassword ? 'text' : 'password'}
              placeholder="请再次输入密码"
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

        <div className="space-y-2">
          <Label htmlFor="invitationCode">邀请码</Label>
          <Input
            id="invitationCode"
            ref={invitationCodeInputRef}
            type="text"
            placeholder="请输入您的邀请码"
            value={invitationCode}
            onChange={(e) => {
              setInvitationCode(e.target.value);
              if (invitationCodeInputRef.current) {
                invitationCodeInputRef.current.setCustomValidity('');
              }
            }}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">姓名</Label>
          <Input
            id="name"
            type="text"
            placeholder="请输入您的姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">公司</Label>
          <Input
            id="company"
            type="text"
            placeholder="请输入您的公司名称"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">职位</Label>
          <Input
            id="position"
            type="text"
            placeholder="请输入您的职位"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherContact">
            其他联系方式 <span className="text-muted-foreground font-normal">(选填)</span>
          </Label>
          <Input
            id="otherContact"
            type="text"
            placeholder="请输入其他联系方式"
            value={otherContact}
            onChange={(e) => setOtherContact(e.target.value)}
            className="w-full"
          />
        </div>

        <Button type="submit" className="w-full">
          注册
        </Button>
      </form>
    </>
  );

  // 渲染手机号注册表单
  const renderPhoneForm = () => (
    <>
      <button
        onClick={() => setStep('select')}
        className="mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← 返回选择注册方式
      </button>
      
      <h2 className="text-3xl font-bold text-center text-foreground mb-2">
        手机号注册
      </h2>
      <p className="text-sm text-center text-muted-foreground mb-8">
        使用手机号创建您的账号
      </p>

      <form onSubmit={handlePhoneRegister} className="space-y-4" noValidate>
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
          <Label htmlFor="verificationCode">短信验证码</Label>
          <div className="flex gap-2">
            <Input
              id="verificationCode"
              type="text"
              placeholder="请输入验证码"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              className="flex-1"
              maxLength={6}
            />
            <Button
              type="button"
              onClick={handleSendCode}
              disabled={codeCountdown > 0}
              variant="outline"
              className="whitespace-nowrap"
            >
              {codeCountdown > 0 ? `${codeCountdown}秒后重试` : '发送验证码'}
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phonePassword">密码</Label>
          <div className="relative" style={{ position: 'relative' }}>
            <Input
              id="phonePassword"
              type={showPhonePassword ? 'text' : 'password'}
              placeholder="请输入密码（至少6位）"
              value={phonePassword}
              onChange={(e) => setPhonePassword(e.target.value)}
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
          <Label htmlFor="phoneConfirmPassword">确认密码</Label>
          <div className="relative" style={{ position: 'relative' }}>
            <Input
              id="phoneConfirmPassword"
              type={showPhoneConfirmPassword ? 'text' : 'password'}
              placeholder="请再次输入密码"
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

        <div className="space-y-2">
          <Label htmlFor="invitationCode">邀请码</Label>
          <Input
            id="invitationCode"
            ref={invitationCodeInputRef}
            type="text"
            placeholder="请输入您的邀请码"
            value={invitationCode}
            onChange={(e) => {
              setInvitationCode(e.target.value);
              if (invitationCodeInputRef.current) {
                invitationCodeInputRef.current.setCustomValidity('');
              }
            }}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">姓名</Label>
          <Input
            id="name"
            type="text"
            placeholder="请输入您的姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">公司</Label>
          <Input
            id="company"
            type="text"
            placeholder="请输入您的公司名称"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">职位</Label>
          <Input
            id="position"
            type="text"
            placeholder="请输入您的职位"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherContact">
            其他联系方式 <span className="text-muted-foreground font-normal">(选填)</span>
          </Label>
          <Input
            id="otherContact"
            type="text"
            placeholder="请输入其他联系方式"
            value={otherContact}
            onChange={(e) => setOtherContact(e.target.value)}
            className="w-full"
          />
        </div>

        <Button type="submit" className="w-full">
          注册
        </Button>
      </form>
    </>
  );

  // 第三方注册信息补充表单提交
  const handleSocialComplete = (e: React.FormEvent) => {
    e.preventDefault();

    // 验证联系方式
    if (!socialContact.trim()) {
      if (socialContactInputRef.current) {
        socialContactInputRef.current.setCustomValidity('请输入手机号或邮箱');
        socialContactInputRef.current.reportValidity();
      }
      return;
    }
    
    const contactValue = socialContact.trim();
    const isPhoneNumber = isPhone(contactValue);
    const isEmailAddress = isEmail(contactValue);
    
    if (!isPhoneNumber && !isEmailAddress) {
      if (socialContactInputRef.current) {
        socialContactInputRef.current.setCustomValidity('请输入有效的手机号或邮箱地址');
        socialContactInputRef.current.reportValidity();
      }
      return;
    }

    // 验证验证码
    if (!socialVerificationCode.trim()) {
      alert(isPhoneNumber ? '请输入短信验证码' : '请输入邮箱验证码');
      return;
    }

    // 验证姓名
    if (!socialName.trim()) {
      alert('请输入姓名');
      return;
    }

    // 验证企业名称
    if (!socialCompany.trim()) {
      alert('请输入企业名称');
      return;
    }

    // 模拟注册成功
    console.log('第三方注册信息:', {
      provider: socialProvider,
      contactType: isPhoneNumber ? 'phone' : 'email',
      contact: contactValue,
      verificationCode: socialVerificationCode,
      name: socialName,
      company: socialCompany,
    });
    
    onRegisterSuccess();
  };

  // 渲染第三方注册信息补充表单
  const renderSocialCompleteForm = () => (
    <>
      <h2 className="text-3xl font-bold text-center text-foreground mb-2">
        补充信息
      </h2>
      <p className="text-sm text-center text-muted-foreground mb-8">
        {socialProvider} 授权成功，请补充以下信息完成注册
      </p>

      <form onSubmit={handleSocialComplete} className="space-y-4" noValidate>
        {/* 联系方式输入 */}
        <div className="space-y-2">
          <Label htmlFor="social-contact">手机号或邮箱</Label>
          <div className="relative">
            {(() => {
              const contactValue = socialContact.trim();
              const isPhoneNumber = contactValue && isPhone(contactValue);
              const isEmailAddress = contactValue && isEmail(contactValue);
              // 如果还没有输入或格式不正确，默认显示邮箱图标；如果识别为手机号，显示手机图标
              return isPhoneNumber ? (
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              ) : (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              );
            })()}
            <Input
              id="social-contact"
              ref={socialContactInputRef}
              type="text"
              placeholder="请输入手机号或邮箱"
              value={socialContact}
              onChange={(e) => {
                setSocialContact(e.target.value);
                if (socialContactInputRef.current) {
                  socialContactInputRef.current.setCustomValidity('');
                }
              }}
              className="w-full pl-10"
              required
            />
          </div>
        </div>

        {/* 验证码 */}
        <div className="space-y-2">
          <Label htmlFor="social-verification-code">
            {(() => {
              const contactValue = socialContact.trim();
              const isPhoneNumber = contactValue && isPhone(contactValue);
              return isPhoneNumber ? '短信验证码' : '验证码';
            })()}
          </Label>
          <div className="flex gap-2">
            <Input
              id="social-verification-code"
              type="text"
              placeholder="请输入验证码"
              value={socialVerificationCode}
              onChange={(e) => setSocialVerificationCode(e.target.value)}
              className="flex-1"
              required
              maxLength={6}
            />
            <Button
              type="button"
              onClick={handleSendSocialCode}
              disabled={socialCodeCountdown > 0}
              variant="outline"
              className="whitespace-nowrap"
            >
              {socialCodeCountdown > 0 ? `${socialCodeCountdown}秒后重试` : '发送验证码'}
            </Button>
          </div>
        </div>

        {/* 姓名 */}
        <div className="space-y-2">
          <Label htmlFor="social-name">姓名</Label>
          <Input
            id="social-name"
            type="text"
            placeholder="请输入您的姓名"
            value={socialName}
            onChange={(e) => setSocialName(e.target.value)}
            className="w-full"
            required
          />
        </div>

        {/* 企业名称 */}
        <div className="space-y-2">
          <Label htmlFor="social-company">企业名称</Label>
          <Input
            id="social-company"
            type="text"
            placeholder="请输入企业名称"
            value={socialCompany}
            onChange={(e) => setSocialCompany(e.target.value)}
            className="w-full"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          完成注册
        </Button>
      </form>
    </>
  );

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background py-8">
      <div className="w-full max-w-md mx-auto bg-card border border-border rounded-lg shadow-lg p-8 max-h-[90vh] overflow-y-auto">
        {step === 'select' && renderSelectStep()}
        {step === 'email' && renderEmailForm()}
        {step === 'phone' && renderPhoneForm()}
        {step === 'social-complete' && renderSocialCompleteForm()}
      </div>
    </div>
  );
}
