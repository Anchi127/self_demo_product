import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle2, X } from 'lucide-react';

export function BusinessLicenseSidebar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">营业执照要求</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>请尽量提供清晰且无水印的营业执照证件,且必须是真实最新的版本</li>
          <li>确保营业执照下方的二维码可识别</li>
          <li>提交的营业执照或组织机构代码证照片不清晰或不完整会导致不匹配</li>
        </ol>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-2">上传示例</p>
            <div className="border border-border rounded-md p-4 bg-muted/50">
              <div className="aspect-video bg-background border border-border rounded flex items-center justify-center text-xs text-muted-foreground">
                营业执照示例图片
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground">四角完整 光线合适 图片清晰</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <X className="w-4 h-4 text-destructive" />
              <span className="text-muted-foreground">缺失</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <X className="w-4 h-4 text-destructive" />
              <span className="text-muted-foreground">模糊</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <X className="w-4 h-4 text-destructive" />
              <span className="text-muted-foreground">强光</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

