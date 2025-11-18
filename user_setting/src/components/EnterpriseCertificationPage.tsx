import { useState } from 'react';
import { StepNavigation } from './enterprise-certification/StepNavigation';
import { Step1EnterpriseInfo } from './enterprise-certification/Step1EnterpriseInfo';
import { Step2ContactInfo } from './enterprise-certification/Step2ContactInfo';
import { Step3Reviewing } from './enterprise-certification/Step3Reviewing';
import { Step4Result } from './enterprise-certification/Step4Result';

export interface EnterpriseData {
  industry: string;
  businessLicense: File | null;
  businessLicensePreview: string;
  enterpriseName: string;
  socialCreditCode: string;
  country: string;
  province: string;
  city: string;
  detailedAddress: string;
}

export interface ContactData {
  contactName: string;
  position: string;
  countryCode: string;
  phone: string;
  notificationEmails: string[];
  reconciliationEmails: string[];
}

export function EnterpriseCertificationPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [certificationStatus, setCertificationStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  
  const [enterpriseData, setEnterpriseData] = useState<EnterpriseData>({
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

  const [contactData, setContactData] = useState<ContactData>({
    contactName: '',
    position: '',
    countryCode: '+86',
    phone: '',
    notificationEmails: [],
    reconciliationEmails: [],
  });

  const handleStep1Next = (data: EnterpriseData) => {
    setEnterpriseData(data);
    setCurrentStep(2);
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleStep2Submit = (data: ContactData) => {
    setContactData(data);
    setCurrentStep(3);
    setCertificationStatus('pending');
  };

  const handleStep3SimulateApproval = () => {
    setCertificationStatus('approved');
    setCurrentStep(4);
  };

  const handleStep3SimulateRejection = () => {
    setCertificationStatus('rejected');
    setRejectionReason('营业执照信息不清晰，请重新上传');
    setCurrentStep(4);
  };

  const handleStep4Resubmit = () => {
    setCurrentStep(1);
    setCertificationStatus('pending');
    setRejectionReason('');
  };

  return (
    <div className="h-full flex bg-background">
      {/* 左侧导航栏 */}
      <div className="w-64 bg-card border-r border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">企业认证</h2>
        <StepNavigation currentStep={currentStep} certificationStatus={certificationStatus} />
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          {currentStep === 1 && (
            <Step1EnterpriseInfo
              data={enterpriseData}
              onNext={handleStep1Next}
            />
          )}
          {currentStep === 2 && (
            <Step2ContactInfo
              data={contactData}
              onBack={handleStep2Back}
              onSubmit={handleStep2Submit}
            />
          )}
          {currentStep === 3 && (
            <Step3Reviewing
              enterpriseData={enterpriseData}
              contactData={contactData}
              onSimulateApproval={handleStep3SimulateApproval}
              onSimulateRejection={handleStep3SimulateRejection}
            />
          )}
          {currentStep === 4 && (
            <Step4Result
              status={certificationStatus}
              rejectionReason={rejectionReason}
              onResubmit={handleStep4Resubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

