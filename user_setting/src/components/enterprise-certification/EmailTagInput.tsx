import { useState, KeyboardEvent } from 'react';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { X } from 'lucide-react';

interface EmailTagInputProps {
  emails: string[];
  onChange: (emails: string[]) => void;
  placeholder?: string;
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function EmailTagInput({ emails, onChange, placeholder }: EmailTagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const email = inputValue.trim();
      if (isValidEmail(email) && !emails.includes(email)) {
        onChange([...emails, email]);
        setInputValue('');
      }
    }
    if (e.key === 'Backspace' && !inputValue && emails.length > 0) {
      onChange(emails.slice(0, -1));
    }
  };

  const handleRemove = (emailToRemove: string) => {
    onChange(emails.filter((email) => email !== emailToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border border-input rounded-md min-h-[42px] bg-input-background">
      {emails.map((email) => (
        <Badge key={email} variant="secondary" className="gap-1 pr-1">
          {email}
          <button
            type="button"
            onClick={() => handleRemove(email)}
            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      <Input
        type="email"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={emails.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
      />
    </div>
  );
}

