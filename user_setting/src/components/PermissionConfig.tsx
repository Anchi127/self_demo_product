import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RoleDefinitions } from './RoleDefinitions';
import { PermissionMatrix } from './PermissionMatrix';
import { MemberManagement } from './MemberManagement';

interface PermissionConfigProps {
  onBack: () => void;
}

export function PermissionConfig({ onBack }: PermissionConfigProps) {
  const [activeTab, setActiveTab] = useState('matrix');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-4"
        >
          ← 返回系统与管理
        </button>
        <h2 className="text-foreground">权限配置</h2>
      </div>

      <div className="space-y-6">
        <RoleDefinitions />

        <div className="bg-card rounded-xl border border-border p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="matrix">权限矩阵</TabsTrigger>
              <TabsTrigger value="members">成员管理</TabsTrigger>
            </TabsList>

            <TabsContent value="matrix">
              <PermissionMatrix />
            </TabsContent>

            <TabsContent value="members">
              <MemberManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}