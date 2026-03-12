import { useState } from "react";
import { motion } from "framer-motion";
import { Gem, Upload } from "lucide-react";
import { BudgetInput } from "./BudgetInput";
import { RecommendationCard } from "./RecommendationCard";
import { getJewelryBudget, type JewelryRecommendation } from "@/lib/budget-logic";
import { Button } from "@/components/ui/button";

export function JewelryBudgetPlanner() {
  const [budget, setBudget] = useState("");
  const [occasion, setOccasion] = useState("Wedding");
  const [results, setResults] = useState<JewelryRecommendation[]>([]);
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleSubmit = () => {
    const b = Number(budget);
    if (b > 0) setResults(getJewelryBudget(b, occasion));
  };

  const handleImageUpload = () => {
    setImageUploaded(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl gradient-jewelry flex items-center justify-center">
          <Gem className="w-6 h-6 text-jewelry" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Jewelry Budget Planner</h2>
          <p className="text-sm text-muted-foreground">Find the perfect jewelry within your budget</p>
        </div>
      </div>

      <BudgetInput
        budget={budget}
        onBudgetChange={setBudget}
        selectLabel="Occasion"
        selectValue={occasion}
        onSelectChange={setOccasion}
        options={["Wedding", "Party", "Casual"]}
        onSubmit={handleSubmit}
        variant="jewelry"
        placeholder="e.g. 25000"
      />

      {/* Mock image upload */}
      <div className="bg-card rounded-2xl border-2 border-dashed border-jewelry/30 p-6 text-center shadow-card">
        <Upload className="w-8 h-8 mx-auto text-jewelry/50 mb-2" />
        <p className="text-sm text-muted-foreground mb-3">Upload an outfit image for personalized suggestions</p>
        <Button variant="outline" onClick={handleImageUpload} className="border-jewelry/30 text-jewelry hover:bg-jewelry-surface">
          {imageUploaded ? "✅ Image Analyzed" : "Upload Image (Mock)"}
        </Button>
        {imageUploaded && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-accent mt-2 font-medium">
            AI detected: Warm tones, traditional style — recommendations adjusted!
          </motion.p>
        )}
      </div>

      {results.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg text-foreground">
              {occasion} Jewelry Picks
            </h3>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-jewelry-surface text-jewelry">
              Budget: ₹{Number(budget).toLocaleString()}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((r, i) => (
              <RecommendationCard
                key={r.type}
                icon={r.icon}
                title={r.type}
                price={r.price}
                subtitle={r.description}
                badge={r.material}
                index={i}
                variant="jewelry"
              />
            ))}
          </div>
          <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
            <p className="text-sm text-accent font-medium">
              💡 Total: ₹{results.reduce((s, r) => s + r.price, 0).toLocaleString()} — stays within your ₹{Number(budget).toLocaleString()} budget!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
