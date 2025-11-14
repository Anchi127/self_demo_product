import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send } from 'lucide-react';

export function ConversationWorkspace() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-foreground text-3xl">你想要做什么？</h1>
          <p className="text-muted-foreground text-base">
            通过自然语言直接操作广告账户、查看报告或管理资产
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="请输入指令，例如：查看广告账户表现"
            className="flex-1 h-11"
          />
          <Button className="h-11 px-6">
            <Send className="w-4 h-4 mr-2" />
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}