'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { EstimateOptions } from '@/types/bet';
import { useState } from 'react';

interface AnswerEstimateProps {
  options: EstimateOptions;
  setOptions: (options: EstimateOptions) => void;
}

export function AnswerEstimate({ options, setOptions }: AnswerEstimateProps) {
  const [previewValue, setPreviewValue] = useState(options.min);

  const updateOption = (field: keyof EstimateOptions, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setOptions({ ...options, [field]: numValue });
      
      // Update preview if min/max changes and current value is out of range
      if (field === 'min' && previewValue < numValue) {
        setPreviewValue(numValue);
      } else if (field === 'max' && previewValue > numValue) {
        setPreviewValue(numValue);
      }
    }
  };

  // Calculate decimal places for display
  const getDecimalPlaces = () => {
    const stepStr = options.step.toString();
    const decimalPart = stepStr.split('.')[1];
    return decimalPart ? decimalPart.length : 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Estimate Settings</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="estimate-odds">Base Odds</Label>
            <Input
              id="estimate-odds"
              type="number"
              min={1}
              max={32}
              step={0.1}
              value={options.baseOdds}
              onChange={(e) => updateOption('baseOdds', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Odds: 1-32</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estimate-winrate">Win Rate (%)</Label>
            <Input
              id="estimate-winrate"
              type="number"
              min={1}
              max={95}
              value={options.winRate}
              onChange={(e) => updateOption('winRate', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Percentage: 1-95</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimate-step">Step</Label>
            <Input
              id="estimate-step"
              type="number"
              min={0.000001}
              step="any"
              value={options.step}
              onChange={(e) => updateOption('step', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Increment</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estimate-min">Min Value</Label>
            <Input
              id="estimate-min"
              type="number"
              min={0}
              step="any"
              value={options.min}
              onChange={(e) => updateOption('min', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Minimum</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estimate-max">Max Value</Label>
            <Input
              id="estimate-max"
              type="number"
              step="any"
              value={options.max}
              onChange={(e) => updateOption('max', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Maximum</p>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm mb-2 block">Preview</Label>
          <div className="flex items-center gap-4">
            <Slider
              min={options.min}
              max={options.max}
              step={options.step}
              value={[previewValue]}
              onValueChange={(values) => setPreviewValue(values[0])}
              className="flex-1"
            />
            <span className="text-lg font-semibold min-w-[80px] text-right">
              {previewValue.toFixed(getDecimalPlaces())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
