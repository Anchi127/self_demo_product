import { useState } from 'react';
import { Button } from '../ui/button';
import { EnterpriseData } from '../EnterpriseCertificationPage';
import { EnterpriseInfoForm } from './EnterpriseInfoForm';
import { BusinessLicenseSidebar } from './BusinessLicenseSidebar';

interface Step1EnterpriseInfoProps {
  data: EnterpriseData;
  onNext: (data: EnterpriseData) => void;
}

export function Step1EnterpriseInfo({ data, onNext }: Step1EnterpriseInfoProps) {
  const [formData, setFormData] = useState<EnterpriseData>(data);

  const handleReset = () => {
    setFormData({
      industry: '',
      businessLicense: null,
      businessLicensePreview: '',
      enterpriseName: '',
      socialCreditCode: '',
      country: '',
      province: '',
      city: '',
      detailedAddress: '',
    });
  };

  const handleNext = () => {
    // 验证必填字段
    if (!formData.industry || !formData.enterpriseName || !formData.socialCreditCode) {
      return;
    }
    onNext(formData);
  };

  return (
    <div className="flex gap-8">
      {/* 左侧表单区域 */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-foreground mb-6">企业认证</h2>
        <EnterpriseInfoForm data={formData} onChange={setFormData} />
        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={handleReset}>
            重置
          </Button>
          <Button onClick={handleNext}>
            下一步
          </Button>
        </div>
      </div>

      {/* 右侧边栏 */}
      <div className="w-80">
        <BusinessLicenseSidebar />
      </div>
    </div>
  );
}

