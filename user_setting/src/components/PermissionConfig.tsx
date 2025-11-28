import { MemberManagement } from './MemberManagement';

interface PermissionConfigProps {
  onBack: () => void;
}

export function PermissionConfig({ onBack }: PermissionConfigProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
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