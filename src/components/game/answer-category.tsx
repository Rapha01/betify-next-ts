'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { CategoryAnswer } from '@/types/bet';

interface AnswerCategoryProps {
  answers: CategoryAnswer[];
  setAnswers: (answers: CategoryAnswer[]) => void;
}

export function AnswerCategory({ answers, setAnswers }: AnswerCategoryProps) {
  const addAnswer = () => {
    if (answers.length >= 32) return;
    
    setAnswers([...answers, { title: '', baseOdds: 2 }]);
  };

  const updateAnswer = (index: number, field: keyof CategoryAnswer, value: string | number) => {
    const newAnswers = [...answers];
    newAnswers[index] = {
      ...newAnswers[index],
      [field]: field === 'baseOdds' ? Number(value) : value,
    };
    setAnswers(newAnswers);
  };

  const removeAnswer = (index: number) => {
    if (answers.length <= 2) return; // Minimum 2 answers required
    setAnswers(answers.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Answers</h3>
        <span className="text-sm text-muted-foreground">
          {answers.length} / 32
        </span>
      </div>

      <div className="space-y-3">
        {answers.map((answer, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor={`answer-title-${index}`} className="text-xs">
                Answer {index + 1}
              </Label>
              <Input
                id={`answer-title-${index}`}
                placeholder="Enter answer text"
                maxLength={64}
                value={answer.title}
                onChange={(e) => updateAnswer(index, 'title', e.target.value)}
              />
            </div>
            <div className="w-16">
              <Label htmlFor={`answer-odds-${index}`} className="text-xs">
                Odds
              </Label>
              <Input
                id={`answer-odds-${index}`}
                type="number"
                min={0}
                max={32}
                step={0.1}
                value={answer.baseOdds}
                onChange={(e) => updateAnswer(index, 'baseOdds', e.target.value)}
              />
            </div>
            {answers.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeAnswer(index)}
                className="shrink-0 h-9 w-9"
                title="Remove answer"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {answers.length < 32 && (
        <Button
          type="button"
          variant="outline"
          onClick={addAnswer}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Answer
        </Button>
      )}
    </div>
  );
}
