import { Card } from "@/components/ui/card";
import type { Drink } from "./DrinkForm";

interface DailySummaryProps {
  drinks: Drink[];
}

const DailySummary = ({ drinks }: DailySummaryProps) => {
  const totalAlcoholGrams = drinks.reduce((sum, drink) => sum + drink.alcoholGrams, 0);

  return (
    <Card className="glass-card p-6 w-full max-w-md mx-auto mt-6 fade-in">
      <h2 className="text-xl font-semibold mb-4">Daily Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Drinks</span>
          <span className="font-medium">{drinks.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Alcohol</span>
          <span className="font-medium">{totalAlcoholGrams.toFixed(1)}g</span>
        </div>
      </div>
    </Card>
  );
};

export default DailySummary;