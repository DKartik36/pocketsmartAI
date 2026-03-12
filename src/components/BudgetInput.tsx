import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface BudgetInputProps {
  budget: string;
  onBudgetChange: (v: string) => void;
  selectLabel: string;
  selectValue: string;
  onSelectChange: (v: string) => void;
  options: string[];
  onSubmit: () => void;
  variant: "home" | "party" | "jewelry";
  placeholder?: string;
}

const btnClasses = {
  home: "bg-home hover:bg-home/90",
  party: "bg-party hover:bg-party/90",
  jewelry: "bg-jewelry hover:bg-jewelry/90",
};

export function BudgetInput({ budget, onBudgetChange, selectLabel, selectValue, onSelectChange, options, onSubmit, variant, placeholder }: BudgetInputProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Total Budget (₹)</Label>
          <Input
            type="number"
            placeholder={placeholder || "Enter your budget"}
            value={budget}
            onChange={(e) => onBudgetChange(e.target.value)}
            className="h-12 text-lg font-display border-2 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">{selectLabel}</Label>
          <Select value={selectValue} onValueChange={onSelectChange}>
            <SelectTrigger className="h-12 text-base border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        onClick={onSubmit}
        disabled={!budget || Number(budget) <= 0}
        className={`mt-5 w-full h-12 text-base font-semibold text-primary-foreground ${btnClasses[variant]} rounded-xl transition-all`}
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Get Smart Recommendations
      </Button>
    </div>
  );
}
