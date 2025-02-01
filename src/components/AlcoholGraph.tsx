import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { Drink } from "./DrinkForm";

interface AlcoholGraphProps {
  drinks: Drink[];
}

const AlcoholGraph = ({ drinks }: AlcoholGraphProps) => {
  // Group drinks by date and calculate total alcohol for each day
  const dailyData = drinks.reduce((acc: { date: string; total: number }[], drink) => {
    const date = new Date().toLocaleDateString();
    const existingDay = acc.find(d => d.date === date);
    
    if (existingDay) {
      existingDay.total += drink.alcoholGrams;
    } else {
      acc.push({ date, total: drink.alcoholGrams });
    }
    
    return acc;
  }, []);

  console.log("Graph data:", dailyData);

  return (
    <Card className="glass-card p-6 w-full max-w-md mx-auto mt-6 fade-in">
      <h2 className="text-xl font-semibold mb-4">Alcohol Intake Over Time</h2>
      <div className="h-[300px] w-full">
        <ChartContainer
          className="h-full"
          config={{
            line: {
              theme: {
                light: "hsl(var(--primary))",
                dark: "hsl(var(--primary))",
              },
            },
          }}
        >
          <LineChart data={dailyData}>
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ 
                value: 'Alcohol (g)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: '12px' }
              }}
            />
            <ChartTooltip>
              <ChartTooltipContent />
            </ChartTooltip>
            <Line
              type="monotone"
              dataKey="total"
              strokeWidth={2}
              dot={true}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </Card>
  );
};

export default AlcoholGraph;