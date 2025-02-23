import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isSameMonth } from "date-fns";
import type { Drink } from "./DrinkForm";

interface AlcoholGraphProps {
  drinks: Drink[];
}

const AlcoholGraph = ({ drinks }: AlcoholGraphProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Filter drinks for the current month
  const monthlyDrinks = drinks.filter(drink => 
    isSameMonth(new Date(drink.date), currentMonth)
  );

  // Group drinks by date and calculate total alcohol for each day
  const dailyData = monthlyDrinks.reduce((acc: { date: string; total: number }[], drink) => {
    const date = new Date(drink.date).toLocaleDateString();
    const existingDay = acc.find(d => d.date === date);
    
    if (existingDay) {
      existingDay.total += drink.alcoholGrams;
    } else {
      acc.push({ date, total: drink.alcoholGrams });
    }
    
    return acc;
  }, []);

  // Sort data by date
  dailyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  return (
    <Card className="glass-card p-4 md:p-6 w-full mx-auto fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
        <h2 className="text-lg md:text-xl font-semibold">Drink History</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[100px] text-center text-sm md:text-base">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="h-[200px] md:h-[250px] w-full">
        {dailyData.length > 0 ? (
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
            <LineChart 
              data={dailyData}
              margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
            >
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickFormatter={(date) => format(new Date(date), 'd')}
                dy={10}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                label={{ 
                  value: 'Alcohol (g)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: '10px' },
                  dx: -10
                }}
              />
              <Tooltip 
                labelFormatter={(label) => format(new Date(label), 'PPP')}
                formatter={(value: number) => [`${value.toFixed(1)}g`, 'Alcohol']}
              />
              <Line
                type="monotone"
                dataKey="total"
                strokeWidth={2}
                dot={true}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm md:text-base text-muted-foreground">
            No data available for {format(currentMonth, 'MMMM yyyy')}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AlcoholGraph;
