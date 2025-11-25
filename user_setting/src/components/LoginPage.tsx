import React, { useState } from 'react';
import { MetaIcon } from './icons/MetaIcon';
import { GoogleIcon } from './icons/GoogleIcon';
import { TiktokIcon } from './icons/TiktokIcon';
import { EyeOpenIcon } from './icons/EyeOpenIcon';
import { EyeClosedIcon } from './icons/EyeClosedIcon';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

export function LoginPage({ onLoginSuccess, onNavigateToRegister, onNavigateToForgotPassword }: LoginPageProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const identifierInputRef = React.useRef<HTMLInputElement>(null);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 先清除之前的自定义验证消息
    if (identifierInputRef.current) {
      identifierInputRef.current.setCustomValidity('');
    }
    
    // 检查identifier是否为空
    if (!identifier.trim()) {
      if (identifierInputRef.current) {
        // 设置自定义验证消息
        identifierInputRef.current.setCustomValidity('使用denglu@qq.com登陆，账密一致');
        // 触发验证显示
        identifierInputRef.current.reportValidity();
      }
      return;
    }
    
    // 检查password是否为空
    if (!password.trim()) {
      return;
    }
    
    // 校验：当identifier=denglu@qq.com，password=denglu@qq.com时，跳转回对话工作台页面
    if (identifier === 'denglu@qq.com' && password === 'denglu@qq.com') {
      onLoginSuccess();
    } else {
      alert('登录失败，请检查账号和密码');
    }
  };

  const handleSocialLogin = (provider: string) => {
    // 第三方登录按钮，不需要跳转交互，只有光标动效
    console.log(`${provider} 登录`);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-auto bg-card border border-border rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-foreground mb-2">
          密码登录
        </h2>
        <p className="text-sm text-center text-muted-foreground mb-8">
          推荐使用
          <button
            onClick={() => handleSocialLogin('快捷登录')}
            className="text-primary hover:text-primary/80 underline mx-1 transition-colors"
          >
            快捷登录
          </button>
          ，防止盗号。
        </p>

        {/* 第三方登录按钮 */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSocialLogin('Meta')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-input-background border border-input rounded-lg text-foreground hover:bg-muted hover:border-foreground/20 hover:shadow-sm transition-all duration-200 cursor-pointer group"
          >
            <div className="w-5 h-5 flex-shrink-0">
              <MetaIcon className="w-full h-full" />
            </div>
            <span>使用 Meta 账号登录</span>
          </button>
          
          <button
            onClick={() => handleSocialLogin('Google')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-input-background border border-input rounded-lg text-foreground hover:bg-muted hover:border-foreground/20 hover:shadow-sm transition-all duration-200 cursor-pointer group"
          >
            <div className="w-5 h-5 flex-shrink-0">
              <GoogleIcon className="w-full h-full" />
            </div>
            <span>使用 Google 账号登录</span>
          </button>
          
          <button
            onClick={() => handleSocialLogin('TikTok')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-input-background border border-input rounded-lg text-foreground hover:bg-muted hover:border-foreground/20 hover:shadow-sm transition-all duration-200 cursor-pointer group"
          >
            <div className="w-5 h-5 flex-shrink-0">
              <TiktokIcon className="w-full h-full" />
            </div>
            <span>使用 TikTok 账号登录</span>
          </button>
        </div>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-border" />
          <span className="px-4 text-muted-foreground text-sm">或</span>
          <hr className="flex-grow border-border" />
        </div>

        {/* 密码登录表单 */}
        <form onSubmit={handlePasswordLogin} className="space-y-4" noValidate>
          <div>
            <Input
              ref={identifierInputRef}
              type="text"
              placeholder="支持手机号/邮箱登录"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                // 清除自定义验证消息
                if (identifierInputRef.current) {
                  identifierInputRef.current.setCustomValidity('');
                }
              }}
              required
              className="w-full"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              如已注册UniAgency/Tec-ad，可直接使用手机号+密码登陆
            </p>
          </div>
          
          <div className="relative" style={{ position: 'relative' }}>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? '隐藏密码' : '显示密码'}
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
              {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </div>

          <div className="flex items-center justify-end text-sm">
            <button
              type="button"
              onClick={onNavigateToForgotPassword}
              className="text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              忘记密码？
            </button>
          </div>

          <Button type="submit" className="w-full">
            登录
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          没有用户？
          <button
            onClick={onNavigateToRegister}
            className="text-primary hover:text-primary/80 hover:underline ml-1 transition-colors"
          >
            立刻注册
          </button>
        </p>
      </div>
    </div>
  );
}

