import { useState } from "react";
import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { BudgetInput } from "./BudgetInput";
import { getPartyBudget, type PartyBudgetSplit } from "@/lib/budget-logic";
import { Progress } from "@/components/ui/progress";

export function PartyBudgetPlanner() {
  const [budget, setBudget] = useState("");
  const [eventType, setEventType] = useState("Birthday");
  const [results, setResults] = useState<PartyBudgetSplit[]>([]);

  const handleSubmit = () => {
    const b = Number(budget);
    if (b > 0) setResults(getPartyBudget(b, eventType));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl gradient-party flex items-center justify-center">
          <PartyPopper className="w-6 h-6 text-party" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Party Budget Planner</h2>
          <p className="text-sm text-muted-foreground">Plan the perfect event within your budget</p>
        </div>
      </div>

      <BudgetInput
        budget={budget}
        onBudgetChange={setBudget}
        selectLabel="Event Type"
        selectValue={eventType}
        onSelectChange={setEventType}
        options={["Birthday", "Wedding", "Corporate Event"]}
        onSubmit={handleSubmit}
        variant="party"
        placeholder="e.g. 100000"
      />

      {results.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg text-foreground">
              Budget Split for {eventType}
            </h3>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-party-surface text-party">
              Budget: ₹{Number(budget).toLocaleString()}
            </span>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {results.map((r, i) => (
              <motion.div
                key={r.category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-xl border border-border p-4 text-center shadow-card"
              >
                <span className="text-2xl block mb-1">{r.icon}</span>
                <p className="text-xs text-muted-foreground font-medium">{r.category}</p>
                <p className="font-display font-bold text-lg text-foreground mt-1">₹{r.amount.toLocaleString()}</p>
                <p className="text-xs font-medium text-party">{r.percentage}%</p>
              </motion.div>
            ))}
          </div>

          {/* Progress bars */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-card space-y-4">
            <h4 className="font-display font-semibold text-foreground">Budget Allocation</h4>
            {results.map((r) => (
              <div key={r.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{r.icon} {r.category}</span>
                  <span className="font-medium text-foreground">{r.percentage}% — via {r.platform}</span>
                </div>
                <Progress value={r.percentage} className="h-2.5 rounded-full" />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
