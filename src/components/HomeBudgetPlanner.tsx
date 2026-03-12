import { useState } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { BudgetInput } from "./BudgetInput";
import { RecommendationCard } from "./RecommendationCard";
import { getHomeBudget, type HomeRecommendation } from "@/lib/budget-logic";

export function HomeBudgetPlanner() {
  const [budget, setBudget] = useState("");
  const [room, setRoom] = useState("Living Room");
  const [results, setResults] = useState<HomeRecommendation[]>([]);

  const handleSubmit = () => {
    const b = Number(budget);
    if (b > 0) setResults(getHomeBudget(b, room));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl gradient-home flex items-center justify-center">
          <Home className="w-6 h-6 text-home" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Home Budget Planner</h2>
          <p className="text-sm text-muted-foreground">Allocate budget smartly across furniture & decor</p>
        </div>
      </div>

      <BudgetInput
        budget={budget}
        onBudgetChange={setBudget}
        selectLabel="Room Type"
        selectValue={room}
        onSelectChange={setRoom}
        options={["Living Room", "Bedroom", "Kitchen"]}
        onSubmit={handleSubmit}
        variant="home"
        placeholder="e.g. 50000"
      />

      {results.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg text-foreground">
              Recommendations for {room}
            </h3>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-home-surface text-home">
              Budget: ₹{Number(budget).toLocaleString()}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((r, i) => (
              <RecommendationCard
                key={r.item}
                icon={r.icon}
                title={r.item}
                price={r.price}
                subtitle={r.category}
                badge={r.source}
                index={i}
                variant="home"
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
