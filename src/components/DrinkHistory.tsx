
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, isSameMonth, getDaysInMonth, isAfter, startOfMonth, getDate } from "date-fns";
import type { Drink } from "./DrinkForm";

interface DrinkHistoryProps {
  drinks: Drink[];
}

const DrinkHistory = ({ drinks }: DrinkHistoryProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Filter drinks for the current month
  const monthlyDrinks = drinks.filter(drink => 
    isSameMonth(new Date(drink.date), currentMonth)
  );

  // Group drinks by date and calculate total alcohol for each day
  const dailyData = monthlyDrinks.reduce((acc: { date: string; total: number }[], drink) => {
    const date = format(new Date(drink.date), 'yyyy-MM-dd'); // Use standardized date format
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

  // Calculate the number of days elapsed in the current month
  const today = new Date();
  const isCurrentMonth = isSameMonth(today, currentMonth);
  
  // If viewing current month, use days elapsed so far, otherwise use the last date with data
  let daysToCount;
  if (isCurrentMonth) {
    daysToCount = getDate(today);
  } else if (dailyData.length > 0) {
    // If viewing a past month, use the number of days with data
    const datesWithData = new Set(dailyData.map(item => format(new Date(item.date), 'd')));
    daysToCount = datesWithData.size;
  } else {
    // If no data, use full month
    daysToCount = getDaysInMonth(currentMonth);
  }
  
  // Ensure we don't divide by zero
  daysToCount = Math.max(1, daysToCount);

  // Calculate monthly average (total alcohol / days so far in current month)
  const totalAlcohol = dailyData.reduce((sum, day) => sum + day.total, 0);
  const dailyAverage = totalAlcohol / daysToCount;

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
              average: {
                theme: {
                  light: "#F97316", // Bright orange
                  dark: "#F97316",
                },
              },
            }}
          >
            <LineChart 
              data={dailyData}
              margin={{ top: 10, right: 35, left: -10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={8}
                tickFormatter={(date) => format(new Date(date), 'd')}
                dy={10}
                tick={{ transform: 'translate(0, 6)' }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={8}
                label={{ 
                  value: 'Alcohol (g)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: '8px' },
                  dx: -15
                }}
                width={35}
                tickSize={3}
              />
              <Tooltip 
                labelFormatter={(label) => format(new Date(label), 'PPP')}
                formatter={(value: number) => [`${value.toFixed(1)}g`, 'Alcohol']}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border/50 rounded-lg p-2 shadow-xl text-xs">
                        <p className="font-medium">{format(new Date(label), 'PPP')}</p>
                        <p className="text-foreground">
                          <span>Alcohol: </span>
                          <span className="font-mono font-medium">{payload[0].value?.toFixed(1)}g</span>
                        </p>
                        <p className="text-orange-500">
                          <span>Daily average: </span>
                          <span className="font-mono font-medium">{dailyAverage.toFixed(1)}g</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                strokeWidth={2}
                dot={true}
                activeDot={{ r: 6 }}
              />
              <ReferenceLine 
                y={dailyAverage} 
                stroke="#F97316" 
                strokeDasharray="3 3"
                label={{ 
                  value: `Avg: ${dailyAverage.toFixed(1)}g (${daysToCount} days)`,
                  position: 'right',
                  fill: '#F97316',
                  fontSize: 9,
                }}
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

export default DrinkHistory;
