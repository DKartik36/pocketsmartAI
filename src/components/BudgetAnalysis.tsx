import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, TrendingUp, AlertTriangle, CheckCircle, Info, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Expense {
  id: string;
  name: string;
  amount: number;
}

type HealthStatus = "healthy" | "normal" | "critical";

interface AnalysisResult {
  status: HealthStatus;
  savings: number;
  savingsPercent: number;
  expenses: Expense[];
  totalExpense: number;
  income: number;
}

const COLORS = ["#6366f1", "#f472b6", "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#fb923c"];

const DEFAULT_CATEGORIES = [
  { name: "Home / Rent", amount: "" },
  { name: "Food", amount: "" },
  { name: "Transportation", amount: "" },
];

function getHealthStatus(savingsPercent: number): HealthStatus {
  if (savingsPercent >= 20) return "healthy";
  if (savingsPercent >= 5) return "normal";
  return "critical";
}

function getSmartSuggestions(result: AnalysisResult): string[] {
  const { status, expenses, income, savingsPercent } = result;

  if (status === "healthy") {
    return [
      `Great job! You're saving ${savingsPercent}% of your income. Consider investing in mutual funds or SIPs for long-term wealth building.`,
      "You could allocate a portion of savings to an emergency fund covering 6 months of expenses.",
      "Look into high-yield recurring deposits or government bonds for risk-free returns.",
    ];
  }

  const suggestions: string[] = [];
  const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);
  const topExpense = sortedExpenses[0];

  if (status === "critical") {
    suggestions.push(
      `⚠️ Your expenses consume ${(100 - savingsPercent).toFixed(0)}% of income. This leaves almost no buffer for emergencies.`
    );
  }

  // Smart, category-aware suggestions
  expenses.forEach((exp) => {
    const pct = (exp.amount / income) * 100;
    const name = exp.name.toLowerCase();

    if (name.includes("food") && pct > 20) {
      suggestions.push(
        `Your food spending is ${pct.toFixed(0)}% of income. Try meal prepping on weekends — it can cut food costs by 30-40% without sacrificing nutrition. Use apps like Mealime for planned grocery lists.`
      );
    } else if (name.includes("transport") && pct > 10) {
      suggestions.push(
        `Transportation at ₹${exp.amount.toLocaleString()} is high. Consider carpooling (BlaBlaCar), monthly transit passes, or cycling for short distances to save 40-60%.`
      );
    } else if ((name.includes("home") || name.includes("rent")) && pct > 35) {
      suggestions.push(
        `Housing at ${pct.toFixed(0)}% exceeds the recommended 30% rule. Consider a flatmate to split rent, or explore areas 15-20 mins further — rents can drop 20-30%.`
      );
    } else if (name.includes("entertain") || name.includes("shopping")) {
      suggestions.push(
        `Discretionary spending on "${exp.name}" can be optimized. Try the 48-hour rule — wait 2 days before non-essential purchases. Most impulse buys feel unnecessary after.`
      );
    }
  });

  // Income boosting suggestions for critical status
  if (status === "critical") {
    suggestions.push(
      "💡 Boost income: Freelance on platforms like Fiverr or Upwork using skills you already have (writing, design, coding, data entry). Even 5-10 hrs/week can add ₹10,000-30,000/month."
    );
    suggestions.push(
      "💡 Sell unused items on OLX or Facebook Marketplace. Most homes have ₹5,000-15,000 worth of unused electronics, clothes, or furniture."
    );
    suggestions.push(
      "💡 Consider micro-investing apps like Groww or Kuvera — start with as little as ₹100/day in index funds to build a habit of saving."
    );
  }

  if (status === "normal") {
    suggestions.push(
      "You're managing okay, but aim for 20%+ savings. Automate a fixed transfer to savings on payday — you'll adjust spending naturally."
    );
    suggestions.push(
      `Your biggest expense is "${topExpense.name}" at ₹${topExpense.amount.toLocaleString()}. Even a 10% reduction here saves ₹${Math.round(topExpense.amount * 0.1).toLocaleString()}/month.`
    );
  }

  return suggestions.slice(0, 5);
}

const statusConfig: Record<HealthStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  healthy: { label: "Healthy 💪", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle },
  normal: { label: "Normal ⚡", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Info },
  critical: { label: "Critical 🚨", color: "text-red-600", bg: "bg-red-50 border-red-200", icon: AlertTriangle },
};

export function BudgetAnalysis() {
  const [income, setIncome] = useState("");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES.map((c, i) => ({ ...c, id: String(i) })));
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const addCategory = () => {
    setCategories((prev) => [...prev, { id: String(Date.now()), name: "", amount: "" }]);
  };

  const removeCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCategory = (id: string, field: "name" | "amount", value: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const analyze = () => {
    const inc = Number(income);
    if (inc <= 0) return;

    const expenses: Expense[] = categories
      .filter((c) => c.name && Number(c.amount) > 0)
      .map((c) => ({ id: c.id, name: c.name, amount: Number(c.amount) }));

    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
    const savings = inc - totalExpense;
    const savingsPercent = (savings / inc) * 100;
    const status = getHealthStatus(savingsPercent);

    setResult({ status, savings, savingsPercent, expenses, totalExpense, income: inc });
  };

  const chartData = result
    ? [
        ...result.expenses.map((e) => ({ name: e.name, value: e.amount })),
        ...(result.savings > 0 ? [{ name: "Savings", value: result.savings }] : []),
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl gradient-analysis flex items-center justify-center">
          <PieChart className="w-6 h-6 text-analysis" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Budget Analysis</h2>
          <p className="text-sm text-muted-foreground">Analyze your spending health with smart insights</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Monthly Income (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 50000"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="h-12 text-lg font-display border-2 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-muted-foreground block">Expense Categories</Label>
          {categories.map((cat) => (
            <div key={cat.id} className="flex gap-2 items-center">
              <Input
                placeholder="Category name"
                value={cat.name}
                onChange={(e) => updateCategory(cat.id, "name", e.target.value)}
                className="flex-1 h-10 border-2"
              />
              <Input
                type="number"
                placeholder="Amount"
                value={cat.amount}
                onChange={(e) => updateCategory(cat.id, "amount", e.target.value)}
                className="w-32 h-10 border-2"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCategory(cat.id)}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addCategory} className="gap-1">
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        </div>

        <Button
          onClick={analyze}
          disabled={!income || Number(income) <= 0}
          className="w-full h-12 text-base font-semibold text-primary-foreground bg-analysis hover:bg-analysis/90 rounded-xl transition-all"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Analyze My Budget
        </Button>
      </div>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Status Badge */}
          {(() => {
            const cfg = statusConfig[result.status];
            const StatusIcon = cfg.icon;
            return (
              <div className={`flex items-center gap-3 p-4 rounded-2xl border ${cfg.bg}`}>
                <StatusIcon className={`w-6 h-6 ${cfg.color}`} />
                <div>
                  <p className={`font-display font-bold text-lg ${cfg.color}`}>
                    Budget Status: {cfg.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You spend ₹{result.totalExpense.toLocaleString()} of ₹{result.income.toLocaleString()} —{" "}
                    {result.savingsPercent >= 0
                      ? `saving ${result.savingsPercent.toFixed(1)}%`
                      : `overspending by ₹${Math.abs(result.savings).toLocaleString()}`}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Ring Chart */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <h3 className="font-display font-semibold text-foreground mb-4">Spending Breakdown</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {chartData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                      contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {chartData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-foreground font-medium">{entry.name}</span>
                    </div>
                    <span className="text-muted-foreground font-mono">
                      ₹{entry.value.toLocaleString()} ({((entry.value / result.income) * 100).toFixed(0)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Smart Suggestions */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <h3 className="font-display font-semibold text-foreground mb-4">💡 Smart Suggestions</h3>
            <div className="space-y-3">
              {getSmartSuggestions(result).map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 p-3 rounded-xl bg-muted/50 border border-border"
                >
                  <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                  <p className="text-sm text-foreground leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
