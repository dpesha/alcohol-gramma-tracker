
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import type { Drink } from "./DrinkForm";

interface DrinkHistoryProps {
  drinks: Drink[];
  onDeleteDrink: (drinkIndex: number) => void;
}

const DrinkHistory = ({ drinks, onDeleteDrink }: DrinkHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Create a map of dates to total alcohol grams
  const dailyTotals = drinks.reduce((acc: Record<string, number>, drink) => {
    const dateStr = new Date(drink.date).toISOString().split('T')[0];
    acc[dateStr] = (acc[dateStr] || 0) + drink.alcoholGrams;
    return acc;
  }, {});

  // Get drinks for selected date
  const selectedDrinks = selectedDate
    ? drinks.filter(
        drink =>
          new Date(drink.date).toISOString().split('T')[0] ===
          selectedDate.toISOString().split('T')[0]
      )
    : [];

  const modifiers = {
    hasDrinks: (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return dateStr in dailyTotals;
    },
  };

  const modifiersStyles = {
    hasDrinks: {
      backgroundColor: "hsl(var(--primary) / 0.1)",
      color: "hsl(var(--primary))",
      fontWeight: "bold",
    },
  };

  return (
    <Card className="glass-card p-6 w-full max-w-md mx-auto mt-6 fade-in">
      <h2 className="text-xl font-semibold mb-4">Drink History</h2>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          setSelectedDate(date);
          if (date) setIsDialogOpen(true);
        }}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        footer={
          selectedDate && (
            <div className="text-sm text-center">
              Total: {dailyTotals[selectedDate.toISOString().split('T')[0]]?.toFixed(1) || 0}g
            </div>
          )
        }
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Drinks for {selectedDate ? format(selectedDate, 'PPP') : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Volume (ml)</TableHead>
                  <TableHead>Alcohol (%)</TableHead>
                  <TableHead>Total (g)</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedDrinks.map((drink, index) => (
                  <TableRow key={index}>
                    <TableCell>{drink.type}</TableCell>
                    <TableCell>{drink.volume}</TableCell>
                    <TableCell>{drink.alcoholPercentage}%</TableCell>
                    <TableCell>{drink.alcoholGrams.toFixed(1)}g</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const drinkIndex = drinks.indexOf(drink);
                          onDeleteDrink(drinkIndex);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DrinkHistory;
