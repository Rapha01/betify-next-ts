'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Plus, HelpCircle, Loader2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BetType, CategoryAnswer, EstimateOptions } from '@/types/bet';
import { AnswerCategory } from './answer-category';
import { AnswerEstimate } from './answer-estimate';
import { betAPI } from '@/lib/api';
import { MessageBox } from '@/components/ui/message-box';

interface CreateBetDialogProps {
  gameId: string;
  onBetCreated?: () => void;
}

export function CreateBetDialog({ gameId, onBetCreated }: CreateBetDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [betType, setBetType] = useState<BetType>('category');
  const [dynamicOdds, setDynamicOdds] = useState(false);
  const [dynamicOddsPower, setDynamicOddsPower] = useState(5);
  const [isTipsHidden, setIsTipsHidden] = useState(false);
  
  // Date and time state
  const [hasTimeLimit, setHasTimeLimit] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [selectedTime, setSelectedTime] = useState('12:00');

  // Category answers
  const [categoryAnswers, setCategoryAnswers] = useState<CategoryAnswer[]>([
    { title: '', baseOdds: 2 },
    { title: '', baseOdds: 2 },
  ]);

  // Estimate options
  const [estimateOptions, setEstimateOptions] = useState<EstimateOptions>({
    step: 1,
    min: 2,
    max: 10,
    baseOdds: 2,
    winRate: 50,
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setBetType('category');
    setDynamicOdds(false);
    setDynamicOddsPower(5);
    setIsTipsHidden(false);
    setHasTimeLimit(false);
    setCategoryAnswers([
      { title: '', baseOdds: 2 },
      { title: '', baseOdds: 2 },
    ]);
    setEstimateOptions({
      step: 1,
      min: 2,
      max: 10,
      baseOdds: 2,
      winRate: 50,
    });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow);
    setSelectedTime('12:00');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;

    // Clear previous errors
    setError(null);

    // Validation
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (title.length > 128) {
      setError('Title must be 128 characters or less');
      return;
    }

    if (description.length > 512) {
      setError('Description must be 512 characters or less');
      return;
    }

    if (betType === 'category') {
      const validAnswers = categoryAnswers.filter(a => a.title.trim());
      if (validAnswers.length < 2) {
        setError('Please provide at least 2 answers with text');
        return;
      }
      if (validAnswers.length > 32) {
        setError('Maximum 32 answers allowed');
        return;
      }
      // Validate each answer
      for (const answer of validAnswers) {
        if (answer.title.length > 64) {
          setError('Answer titles must be 64 characters or less');
          return;
        }
        if (answer.baseOdds < 0 || answer.baseOdds > 32) {
          setError('Base odds must be between 0 and 32');
          return;
        }
      }
    } else {
      // Validate estimate options
      if (estimateOptions.min >= estimateOptions.max) {
        setError('Min value must be less than Max value');
        return;
      }
      if (estimateOptions.step <= 0) {
        setError('Step must be greater than 0');
        return;
      }
      if (estimateOptions.baseOdds < 1 || estimateOptions.baseOdds > 32) {
        setError('Base odds must be between 1 and 32');
        return;
      }
      if (estimateOptions.winRate < 1 || estimateOptions.winRate > 95) {
        setError('Win rate must be between 1% and 95%');
        return;
      }
    }

    // Validate date is selected and in the future (only if time limit is enabled)
    let timeLimit = '0'; // Default to 0 (no time limit)
    if (hasTimeLimit) {
      if (!selectedDate) {
        setError('Please select a date');
        return;
      }

      const [hours, minutes] = selectedTime.split(':').map(Number);
      const combinedDateTime = new Date(selectedDate);
      combinedDateTime.setHours(hours, minutes, 0, 0);
      
      if (combinedDateTime <= new Date()) {
        setError('Time limit must be in the future');
        return;
      }
      
      timeLimit = combinedDateTime.toISOString();
    }

    setIsLoading(true);

    try {
      const betData: any = {
        title: title.trim(),
        desc: description.trim(),
        betType,
        dynamicOdds,
        isTipsHidden,
        timeLimit,
      };

      if (dynamicOdds) {
        betData.dynamicOddsPower = dynamicOddsPower;
      }

      if (betType === 'category') {
        betData.category_answers = categoryAnswers.filter(a => a.title.trim());
      } else {
        betData.estimate_options = estimateOptions;
      }

      // Call the API to create the bet
      await betAPI.createBet(gameId, betData);

      // Reset form and close dialog
      resetForm();
      setOpen(false);
      
      // Notify parent component to refresh the list
      if (onBetCreated) {
        onBetCreated();
      }
    } catch (error: any) {
      console.error('Error creating bet:', error);
      setError(error.message || 'Failed to create bet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Clear error when closing dialog
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Create A New Bet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[calc(90vh-5rem)] overflow-y-auto mb-20">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create a new bet</DialogTitle>
            <DialogDescription>
              Set up a new betting pool for this game. Choose between category (multiple choice) or estimate (numeric range) bet types.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter bet title"
                maxLength={128}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError(null);
                }}
                required
              />
            </div>

            {/* Time Limit Checkbox */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="hasTimeLimit"
                checked={hasTimeLimit}
                onCheckedChange={(checked) => setHasTimeLimit(checked as boolean)}
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor="hasTimeLimit"
                  className="cursor-pointer text-base font-medium"
                >
                  Set time limit
                </Label>
                <p className="text-sm text-muted-foreground">
                  Set a deadline for when this bet will expire
                </p>
              </div>
            </div>

            {/* Date and Time Picker (Conditional) */}
            {hasTimeLimit && (
              <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="date-picker" className="px-1">
                    Date
                  </Label>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen} modal={true}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        type="button"
                        className={cn(
                          "w-32 justify-between font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-auto overflow-hidden p-0" 
                      align="start"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setDatePickerOpen(false);
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="time-picker" className="px-1">
                    Time
                  </Label>
                  <Input
                    type="time"
                    id="time-picker"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a description for this bet (optional)"
                maxLength={512}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Dynamic Odds */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="dynamicOdds"
                  checked={dynamicOdds}
                  onCheckedChange={(checked) => setDynamicOdds(checked as boolean)}
                />
                <div className="space-y-1 leading-none flex-1">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="dynamicOdds"
                      className="cursor-pointer font-medium"
                    >
                      Dynamic Odds
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Automatically adjust odds depending on an answer's pot size. Use the "Dynamic Odds Power" value (1-10) to increase or decrease the magnitude of change.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Automatically adjust odds based on pot sizes
                  </p>
                </div>
              </div>

              {/* Dynamic Odds Power */}
              {dynamicOdds && (
                <div className="space-y-2 pl-7">
                  <Label htmlFor="dynamicOddsPower">
                    Dynamic Odds Power
                  </Label>
                  <Input
                    id="dynamicOddsPower"
                    type="number"
                    min={1}
                    max={10}
                    value={dynamicOddsPower}
                    onChange={(e) => setDynamicOddsPower(Number(e.target.value))}
                    className="max-w-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Range: 1-10. Higher values increase the magnitude of odds adjustments.
                  </p>
                </div>
              )}

              {/* Tips Hidden */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="isTipsHidden"
                  checked={isTipsHidden}
                  onCheckedChange={(checked) => setIsTipsHidden(checked as boolean)}
                />
                <div className="space-y-1 leading-none flex-1">
                  <Label
                    htmlFor="isTipsHidden"
                    className="cursor-pointer font-medium"
                  >
                    Hide Tips
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Hide other players' tips until the bet is closed
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Bet Type Selector */}
            <div className="space-y-3">
              <Label>Bet Type</Label>
              <RadioGroup value={betType} onValueChange={(value) => setBetType(value as BetType)}>
                <div className="grid grid-cols-2 gap-4">
                  <Label
                    htmlFor="category"
                    className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all ${
                      betType === 'category'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="category" id="category" className="sr-only" />
                    <div className="font-semibold mb-1">Category</div>
                    <div className="text-xs text-muted-foreground text-center">
                      Multiple choice answers with individual odds
                    </div>
                  </Label>

                  <Label
                    htmlFor="estimate"
                    className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all ${
                      betType === 'estimate'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="estimate" id="estimate" className="sr-only" />
                    <div className="font-semibold mb-1">Estimate</div>
                    <div className="text-xs text-muted-foreground text-center">
                      Numeric range with min, max, and step values
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

           

            {/* Conditional rendering based on bet type */}
            {betType === 'category' ? (
              <AnswerCategory
                answers={categoryAnswers}
                setAnswers={setCategoryAnswers}
              />
            ) : (
              <AnswerEstimate
                options={estimateOptions}
                setOptions={setEstimateOptions}
              />
            )}
          </div>

          {/* Error Display */}
          {error && (
            <MessageBox message={error} type="error" className="mb-4" />
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
