import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type MessageType = 'error' | 'warning' | 'info' | 'success';

interface MessageBoxProps {
  message: string;
  type?: MessageType;
  className?: string;
}

const messageBoxConfig = {
  error: {
    icon: AlertCircle,
    textColor: 'text-error',
    bgColor: 'bg-error/10',
    borderColor: 'border-error/30',
    iconColor: 'text-error'
  },
  warning: {
    icon: AlertTriangle,
    textColor: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    iconColor: 'text-warning'
  },
  info: {
    icon: Info,
    textColor: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/30',
    iconColor: 'text-info'
  },
  success: {
    icon: CheckCircle2,
    textColor: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    iconColor: 'text-success'
  }
};

export function MessageBox({ message, type = 'info', className }: MessageBoxProps) {
  const config = messageBoxConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-2 p-3 rounded-lg border text-sm',
        config.bgColor,
        config.borderColor,
        config.textColor,
        className
      )}
    >
      <Icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', config.iconColor)} />
      <span className="flex-1">{message}</span>
    </div>
  );
}
