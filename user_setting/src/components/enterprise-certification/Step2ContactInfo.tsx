import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ContactData } from '../EnterpriseCertificationPage';
import { EmailTagInput } from './EmailTagInput';

interface Step2ContactInfoProps {
  data: ContactData;
  onBack: () => void;
  onSubmit: (data: ContactData) => void;
}

const countryCodes = [
  { code: '+86', country: '中国' },
  { code: '+1', country: '美国' },
  { code: '+81', country: '日本' },
  { code: '+82', country: '韩国' },
];

export function Step2ContactInfo({ data, onBack, onSubmit }: Step2ContactInfoProps) {
  const [formData, setFormData] = useState<ContactData>(data);

  const handleSubmit = () => {
    // 验证必填字段
    if (!formData.contactName || !formData.position || !formData.phone) {
      return;
    }
    if (formData.notificationEmails.length === 0 || formData.reconciliationEmails.length === 0) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-6">联系人信息</h2>
      
      <div className="space-y-6 max-w-2xl">
        {/* 联系人姓名 */}
        <div className="space-y-2">
          <Label htmlFor="contactName">
            联系人姓名 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contactName"
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            placeholder="请输入"
          />
        </div>

        {/* 职位 */}
        <div className="space-y-2">
          <Label htmlFor="position">
            职位 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            placeholder="请输入"
          />
        </div>

        {/* 电话 */}
        <div className="space-y-2">
          <Label>
            电话 <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <Select
              value={formData.countryCode}
              onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((item) => (
                  <SelectItem key={item.code} value={item.code}>
                    {item.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="请输入电话号码"
              className="flex-1"
            />
          </div>
        </div>

        {/* 通知邮箱 */}
        <div className="space-y-2">
          <Label>
            通知邮箱 <span className="text-destructive">*</span>
          </Label>
          <EmailTagInput
            emails={formData.notificationEmails}
            onChange={(emails) => setFormData({ ...formData, notificationEmails: emails })}
            placeholder="请输入通知邮箱"
          />
          <p className="text-xs text-muted-foreground">
            用于接收下户,余额告警等重要通知,支持添加多个,按回车添加
          </p>
        </div>

        {/* 对账邮箱 */}
        <div className="space-y-2">
          <Label>
            对账邮箱 <span className="text-destructive">*</span>
          </Label>
          <EmailTagInput
            emails={formData.reconciliationEmails}
            onChange={(emails) => setFormData({ ...formData, reconciliationEmails: emails })}
            placeholder="请输入对账邮箱"
          />
          <p className="text-xs text-muted-foreground">
            用于接收账单,发票等财务信息,支持多个,按回车添加
          </p>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Button variant="outline" onClick={onBack}>
          上一步
        </Button>
        <Button onClick={handleSubmit}>
          提交
        </Button>
      </div>
    </div>
  );
}

