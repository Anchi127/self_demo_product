import { useState } from 'react';
import { TopNav } from './components/TopNav';
import { SideNav } from './components/SideNav';
import { ConversationWorkspace } from './components/ConversationWorkspace';
import { SystemManagement } from './components/SystemManagement';
import { UserInfoPage } from './components/UserInfoPage';
import { AccountSecurityPage } from './components/AccountSecurityPage';
import { SystemSettingsPage } from './components/SystemSettingsPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
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
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState('conversation');
  const [currentSubPage, setCurrentSubPage] = useState('');

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setCurrentPage('conversation'); // 跳转到对话工作台
  };

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setCurrentPage('conversation'); // 注册成功后跳转到对话工作台
  };

  const handleNavigateToRegister = () => {
    setAuthPage('register');
  };

  const handleNavigateToLogin = () => {
    setAuthPage('login');
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

  const renderContent = () => {
    if (currentPage === 'conversation') {
      return <ConversationWorkspace />;
    }
    
    if (currentPage === 'system') {
      return <SystemManagement currentSubPage={currentSubPage} onSubNavigate={handleSubNavigate} />;
    }

    if (currentPage === 'user-info') {
      return <UserInfoPage onNavigateToAccountSecurity={handleNavigateToAccountSecurity} />;
    }

    if (currentPage === 'account-security') {
      return <AccountSecurityPage onBack={handleBackFromAccountSecurity} />;
    }

    if (currentPage === 'system-settings') {
      return <SystemSettingsPage />;
    }

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
          />
        ) : (
          <RegisterPage 
            onRegisterSuccess={handleRegisterSuccess}
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
      <TopNav 
        currentPage={currentPage}
        currentSubPage={currentSubPage}
        onNavigate={handleNavigate}
        onNavigateToUserInfo={handleNavigateToUserInfo}
        onNavigateToSystemSettings={handleNavigateToSystemSettings}
        onLogout={handleLogout}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <SideNav currentPage={currentPage} onNavigate={handleNavigate} />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>

      <Toaster />
    </div>
  );
}