import { MemberManagement } from './MemberManagement';

interface PermissionConfigProps {
  onBack: () => void;
}

export function PermissionConfig({ onBack }: PermissionConfigProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-4"
        >
          ← 返回设置
        </button>
        <h2 className="text-foreground">成员与权限</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <MemberManagement />
        </div>
      </div>
    </div>
  );
}