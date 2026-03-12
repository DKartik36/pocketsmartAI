import { motion } from "framer-motion";

interface RecommendationCardProps {
  icon: string;
  title: string;
  price: number;
  subtitle: string;
  badge?: string;
  index: number;
  variant?: "home" | "party" | "jewelry";
}

const variantClasses = {
  home: "border-home/20 hover:border-home/40",
  party: "border-party/20 hover:border-party/40",
  jewelry: "border-jewelry/20 hover:border-jewelry/40",
};

const badgeClasses = {
  home: "bg-home-surface text-home",
  party: "bg-party-surface text-party",
  jewelry: "bg-jewelry-surface text-jewelry",
};

export function RecommendationCard({ icon, title, price, subtitle, badge, index, variant = "home" }: RecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className={`bg-card rounded-xl border-2 ${variantClasses[variant]} p-5 shadow-card hover:shadow-card-hover transition-all duration-300 group`}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-foreground truncate">{title}</h4>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display font-bold text-lg text-foreground">₹{price.toLocaleString()}</p>
          {badge && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClasses[variant]}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
