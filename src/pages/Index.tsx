import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Home, PartyPopper, Gem, PieChart } from "lucide-react";
import { HomeBudgetPlanner } from "@/components/HomeBudgetPlanner";
import { PartyBudgetPlanner } from "@/components/PartyBudgetPlanner";
import { JewelryBudgetPlanner } from "@/components/JewelryBudgetPlanner";
import { BudgetAnalysis } from "@/components/BudgetAnalysis";

const tabs = [
  { id: "home", label: "Home Interiors", icon: Home, gradient: "gradient-home" },
  { id: "party", label: "Party Planning", icon: PartyPopper, gradient: "gradient-party" },
  { id: "jewelry", label: "Jewelry", icon: Gem, gradient: "gradient-jewelry" },
  { id: "analysis", label: "Budget Analysis", icon: PieChart, gradient: "gradient-analysis" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.06]" />
        <div className="relative container mx-auto px-4 pt-12 pb-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
              <Sparkles className="w-4 h-4" />
              AI-Powered Budget Assistant
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground leading-tight">
              Pocket<span className="text-primary">Smart</span> AI
            </h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-base">
              Your intelligent budgeting companion for home interiors, party planning, and jewelry selection.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 -mt-1">
        <div className="flex justify-center">
          <div className="inline-flex gap-1 bg-card rounded-2xl p-1.5 shadow-elevated border border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? `${tab.gradient} text-foreground shadow-card`
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
          {activeTab === "home" && <HomeBudgetPlanner />}
          {activeTab === "party" && <PartyBudgetPlanner />}
          {activeTab === "jewelry" && <JewelryBudgetPlanner />}
          {activeTab === "analysis" && <BudgetAnalysis />}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-muted-foreground">
        PocketSmart AI © 2026 — Built for hackathons, demos & smart budgeting
      </footer>
    </div>
  );
};

export default Index;
