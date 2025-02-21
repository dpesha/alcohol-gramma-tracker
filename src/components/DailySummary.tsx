
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Drink } from "./DrinkForm";
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, isWithinInterval } from "date-fns";

interface DailySummaryProps {
  drinks: Drink[];
}

interface PeriodSummary {
  totalDrinks: number;
  totalAlcohol: number;
}

const DailySummary = ({ drinks }: DailySummaryProps) => {
  const calculateSummary = (start: Date, end: Date): PeriodSummary => {
    const periodDrinks = drinks.filter(drink => 
      isWithinInterval(new Date(drink.date), { start, end })
    );
    
    return {
      totalDrinks: periodDrinks.length,
      totalAlcohol: periodDrinks.reduce((sum, drink) => sum + drink.alcoholGrams, 0)
    };
  };

  const now = new Date();
  
  const dailySummary = calculateSummary(
    startOfDay(now),
    endOfDay(now)
  );
  
  const weeklySummary = calculateSummary(
    startOfWeek(now, { weekStartsOn: 1 }), // Week starts on Monday
    endOfWeek(now, { weekStartsOn: 1 })
  );
  
  const monthlySummary = calculateSummary(
    startOfMonth(now),
    endOfMonth(now)
  );

  return (
    <Card className="glass-card p-6 w-full max-w-md mx-auto mt-6 fade-in">
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Drinks</span>
            <span className="font-medium">{dailySummary.totalDrinks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Alcohol</span>
            <span className="font-medium">{dailySummary.totalAlcohol.toFixed(1)}g</span>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Drinks</span>
            <span className="font-medium">{weeklySummary.totalDrinks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Alcohol</span>
            <span className="font-medium">{weeklySummary.totalAlcohol.toFixed(1)}g</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Daily Average</span>
            <span className="font-medium">
              {(weeklySummary.totalAlcohol / 7).toFixed(1)}g
            </span>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Drinks</span>
            <span className="font-medium">{monthlySummary.totalDrinks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Alcohol</span>
            <span className="font-medium">{monthlySummary.totalAlcohol.toFixed(1)}g</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Daily Average</span>
            <span className="font-medium">
              {(monthlySummary.totalAlcohol / 30).toFixed(1)}g
            </span>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DailySummary;
