import { CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StepNavigationProps {
  currentStep: 1 | 2 | 3 | 4;
  certificationStatus: 'pending' | 'approved' | 'rejected';
}

export function StepNavigation({ currentStep, certificationStatus }: StepNavigationProps) {
  const steps = [
    { number: 1, label: '企业认证' },
    { number: 2, label: '联系人信息' },
    { number: 3, label: '认证审核' },
    { number: 4, label: '认证结果' },
  ];

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      return 'completed';
    }
    if (stepNumber === currentStep) {
      return 'active';
    }
    return 'pending';
  };

  return (
    <div className="space-y-4">
      {steps.map((step) => {
        const status = getStepStatus(step.number);
        const isCompleted = status === 'completed';
        const isActive = status === 'active';

        return (
          <div key={step.number} className="flex items-center gap-3">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                isCompleted && 'bg-primary text-primary-foreground',
                isActive && 'bg-primary text-primary-foreground',
                !isCompleted && !isActive && 'bg-muted text-muted-foreground'
              )}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : isActive && step.number === 3 && certificationStatus === 'pending' ? (
                <Clock className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={cn(
                'text-sm',
                isActive && 'font-semibold text-foreground',
                !isActive && 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

