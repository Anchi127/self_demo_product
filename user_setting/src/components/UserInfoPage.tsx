import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Mail, Phone, Shield, CheckCircle2, XCircle, ExternalLink, Folder } from 'lucide-react';

interface UserInfoPageProps {
  onNavigateToAccountSecurity?: () => void;
}

export function UserInfoPage({ onNavigateToAccountSecurity }: UserInfoPageProps) {
  // 模拟用户数据，实际应该从API或状态管理获取
  const userInfo = {
    username: '王小明',
    position: '产品经理',
    email: 'denglu@qq.com',
    phone: '138****8888',
    thirdPartyAccounts: [
      { provider: 'Meta', email: 'denglu@qq.com', bound: true },
      { provider: 'Google', email: 'denglu@qq.com', bound: true },
      { provider: 'TikTok', bound: false },
    ],
    passwordLastModified: '2024-01-15 10:30:00',
    twoFactorEnabled: false,
    company: {
      name: '钛动科技股份有限公司',
      joinDate: '2023-06-01',
    },
    projects: [
      { id: '1', name: 'BPMSTEST', role: '管理员' },
      { id: '2', name: '项目A', role: '开发者' },
      { id: '3', name: '项目B', role: '观察者' },
    ],
  };

  return (
    <div className="h-full overflow-auto bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">用户信息</h1>
          <p className="text-muted-foreground mt-1">查看和管理您的账户信息</p>
        </div>

        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">用户名</label>
                <p className="text-foreground mt-1">{userInfo.username}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">用户岗位</label>
                <p className="text-foreground mt-1">{userInfo.position}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 登录方式 */}
        <Card>
          <CardHeader>
            <CardTitle>登录方式</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground">登录邮箱</label>
                  <p className="text-foreground mt-1">{userInfo.email}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground">手机号</label>
                  <p className="text-foreground mt-1">{userInfo.phone}</p>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">三方登录信息（已关联账号）</label>
                <div className="space-y-2">
                  {userInfo.thirdPartyAccounts.map((account, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="text-foreground font-medium">{account.provider}:</span>
                      {account.bound ? (
                        <span className="text-muted-foreground">{account.email}</span>
                      ) : (
                        <span className="text-muted-foreground">未绑定</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 安全摘要 */}
        <Card>
          <CardHeader>
            <CardTitle>安全摘要</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">密码最近修改时间</label>
                <p className="text-foreground mt-1">{userInfo.passwordLastModified}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm text-muted-foreground">是否启用二步验证</label>
                    <div className="flex items-center gap-2 mt-1">
                      {userInfo.twoFactorEnabled ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-foreground">已启用</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">未启用</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateToAccountSecurity}
                  className="flex items-center gap-2"
                >
                  去设置
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 所属企业与项目 */}
        <Card>
          <CardHeader>
            <CardTitle>所属企业与项目</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 企业信息 */}
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">所属企业</label>
                <p className="text-foreground mt-1 font-medium">{userInfo.company.name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">加入企业时间</label>
                <p className="text-foreground mt-1">{userInfo.company.joinDate}</p>
              </div>
            </div>
            
            <Separator />
            
            {/* 项目列表 */}
            <div>
              <label className="text-sm text-muted-foreground mb-3 block">参与项目</label>
              <div className="space-y-3">
                {userInfo.projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <Folder className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium">{project.name}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{project.role}</Badge>
                  </div>
                ))}
                {userInfo.projects.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    暂无参与的项目
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

