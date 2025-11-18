import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

interface Step4ResultProps {
  status: 'approved' | 'rejected';
  rejectionReason: string;
  onResubmit: () => void;
}

export function Step4Result({ status, rejectionReason, onResubmit }: Step4ResultProps) {
  if (status === 'approved') {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">认证通过</h2>
        <p className="text-muted-foreground mb-8">
          恭喜您！您的企业认证已通过审核。现在可以开始使用相关服务。
        </p>
        <div className="flex gap-4 justify-center">
          <Button>去开户申请</Button>
          <Button variant="outline">
            查看详情
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <XCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">认证失败</h2>
        <p className="text-muted-foreground mb-4">
          很抱歉，您的企业认证未通过审核。
        </p>
      </div>

      {/* 失败原因 */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">失败原因：</h3>
            <p className="text-sm text-muted-foreground">{rejectionReason || '未提供具体原因'}</p>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex gap-4 justify-center">
        <Button onClick={onResubmit}>重新提交</Button>
        <Button variant="outline">联系客服</Button>
      </div>
    </div>
  );
}

