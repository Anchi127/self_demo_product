import { useState } from 'react';
import { TopNav } from './components/TopNav';
import { SideNav } from './components/SideNav';
import { ConversationWorkspace } from './components/ConversationWorkspace';
import { SystemManagement } from './components/SystemManagement';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('conversation');
  const [currentSubPage, setCurrentSubPage] = useState('');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setCurrentSubPage('');
  };

  const handleSubNavigate = (subPage: string) => {
    setCurrentSubPage(subPage);
  };

  const renderContent = () => {
    if (currentPage === 'conversation') {
      return <ConversationWorkspace />;
    }
    
    if (currentPage === 'system') {
      return <SystemManagement currentSubPage={currentSubPage} onSubNavigate={handleSubNavigate} />;
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

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopNav currentPage={currentPage} />
      
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