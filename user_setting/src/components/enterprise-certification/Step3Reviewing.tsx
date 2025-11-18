import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useState } from 'react';
import { EnterpriseData, ContactData } from '../EnterpriseCertificationPage';

interface Step3ReviewingProps {
  enterpriseData: EnterpriseData;
  contactData: ContactData;
  onSimulateApproval: () => void;
  onSimulateRejection: () => void;
}

export function Step3Reviewing({
  enterpriseData,
  contactData,
  onSimulateApproval,
  onSimulateRejection,
}: Step3ReviewingProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* 状态展示 */}
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          认证已提交, 正在审核
        </h2>
        <p className="text-muted-foreground mb-6">
          您已提交认证信息, 认证通过后您可在通知邮箱收到认证审核结果
        </p>
        <Button>去开户申请</Button>
      </div>

      {/* 已提交信息 */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <CardTitle>已提交信息</CardTitle>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* 企业信息 */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">企业信息</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">行业：</span>
                    <span className="text-foreground ml-2">{enterpriseData.industry}</span>
                  </div>
                  {enterpriseData.businessLicensePreview && (
                    <div>
                      <span className="text-muted-foreground">营业执照附件：</span>
                      <img
                        src={enterpriseData.businessLicensePreview}
                        alt="营业执照"
                        className="mt-2 w-32 h-32 object-contain border border-border rounded"
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">企业名称：</span>
                    <span className="text-foreground ml-2">{enterpriseData.enterpriseName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">营业执照统一社会信用代码：</span>
                    <span className="text-foreground ml-2">{enterpriseData.socialCreditCode}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">企业地址：</span>
                    <span className="text-foreground ml-2">
                      {[enterpriseData.country, enterpriseData.province, enterpriseData.city, enterpriseData.detailedAddress]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 联系人信息 */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-4">联系人信息</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">联系人姓名：</span>
                    <span className="text-foreground ml-2">{contactData.contactName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">职位：</span>
                    <span className="text-foreground ml-2">{contactData.position}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">电话：</span>
                    <span className="text-foreground ml-2">
                      {contactData.countryCode} {contactData.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">通知邮箱：</span>
                    <span className="text-foreground ml-2">{contactData.notificationEmails.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">对账邮箱：</span>
                    <span className="text-foreground ml-2">{contactData.reconciliationEmails.join(', ')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Demo控制面板 */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Demo控制面板</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onSimulateApproval}>
              模拟认证通过
            </Button>
            <Button variant="outline" size="sm" onClick={onSimulateRejection}>
              模拟认证失败
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

