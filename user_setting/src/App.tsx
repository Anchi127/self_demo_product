import { useState } from 'react';
import { TopNav } from './components/TopNav';
import { SideNav } from './components/SideNav';
import { ConversationWorkspace } from './components/ConversationWorkspace';
import { SystemManagement } from './components/SystemManagement';
import { UserInfoPage } from './components/UserInfoPage';
import { AccountSecurityPage } from './components/AccountSecurityPage';
import { SystemSettingsPage } from './components/SystemSettingsPage';
import { AssetsPage } from './components/AssetsPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // 从localStorage读取登录状态
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isLoggedIn');
      return saved === 'true';
    }
    return false;
  });
  const [authPage, setAuthPage] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [currentPage, setCurrentPage] = useState('workbench');
  const [currentSubPage, setCurrentSubPage] = useState('');

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setCurrentPage('workbench'); // 跳转到工作台
  };

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setCurrentPage('workbench'); // 注册成功后跳转到工作台
  };

  const handleNavigateToRegister = () => {
    setAuthPage('register');
  };

  const handleNavigateToLogin = () => {
    setAuthPage('login');
  };

  const handleNavigateToForgotPassword = () => {
    setAuthPage('forgot-password');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setCurrentSubPage('');
  };

  const handleSubNavigate = (subPage: string) => {
    setCurrentSubPage(subPage);
  };

  const handleNavigateToSystemSettings = () => {
    setCurrentPage('system-settings');
    setCurrentSubPage('');
  };

  const handleNavigateToUserInfo = () => {
    setCurrentPage('user-info');
    setCurrentSubPage('');
  };

  const handleNavigateToAccountSecurity = () => {
    setCurrentPage('account-security');
    setCurrentSubPage('');
  };

  const handleBackFromAccountSecurity = () => {
    setCurrentPage('user-info');
    setCurrentSubPage('');
  };

  const pageNames: Record<string, string> = {
    workbench: '工作台',
    assets: '资产',
    marketing: '营销',
    creatives: '创意',
    partners: '合作',
    inbox: '收件箱',
    help: '帮助',
  };

  const renderContent = () => {
    // 对话工作台（会话/搜索/指令入口）
    if (currentPage === 'conversation') {
      return <ConversationWorkspace />;
    }

    // 工作台（显示占位页面）
    if (currentPage === 'workbench') {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <p className="mb-2">功能开发中</p>
            <p>当前页面：工作台</p>
          </div>
        </div>
      );
    }
    
    // 设置（原系统管理）
    if (currentPage === 'system') {
      return <SystemManagement currentSubPage={currentSubPage} onSubNavigate={handleSubNavigate} />;
    }

    // 用户信息
    if (currentPage === 'user-info') {
      return <UserInfoPage onNavigateToAccountSecurity={handleNavigateToAccountSecurity} />;
    }

    // 账号安全
    if (currentPage === 'account-security') {
      return <AccountSecurityPage onBack={handleBackFromAccountSecurity} />;
    }

    // 系统设置
    if (currentPage === 'system-settings') {
      return <SystemSettingsPage />;
    }

    // 项目设置
    if (currentPage === 'project-settings') {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <p className="mb-2">功能开发中</p>
            <p>项目设置页面</p>
          </div>
        </div>
      );
    }

    // 资产页面
    if (currentPage === 'assets') {
      return <AssetsPage />;
    }

    // 其他新菜单项（营销、创意、合作、收件箱、帮助）
    if (['marketing', 'creatives', 'partners', 'inbox', 'help'].includes(currentPage)) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <p className="mb-2">功能开发中</p>
            <p>当前页面：{pageNames[currentPage] || currentPage}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <p className="mb-2">功能开发中</p>
          <p>当前页面：{currentPage}</p>
        </div>
      </div>
    );
  };

  // 如果未登录，显示登录或注册页面
  if (!isLoggedIn) {
    return (
      <>
        {authPage === 'login' ? (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess} 
            onNavigateToRegister={handleNavigateToRegister}
            onNavigateToForgotPassword={handleNavigateToForgotPassword}
          />
        ) : authPage === 'register' ? (
          <RegisterPage 
            onRegisterSuccess={handleRegisterSuccess}
            onBackToLogin={handleNavigateToLogin}
          />
        ) : (
          <ForgotPasswordPage 
            onBackToLogin={handleNavigateToLogin}
          />
        )}
        <Toaster />
      </>
    );
  }

  // 如果已登录，显示主应用
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* 顶部导航栏已隐藏 */}
      {/* <TopNav 
        currentPage={currentPage}
        currentSubPage={currentSubPage}
        onNavigate={handleNavigate}
        onSubNavigate={handleSubNavigate}
      /> */}
      
      <div className="flex flex-1 overflow-hidden">
        <SideNav 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          onNavigateToUserInfo={handleNavigateToUserInfo}
          onNavigateToSystemSettings={handleNavigateToSystemSettings}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>

      <Toaster />
    </div>
  );
}