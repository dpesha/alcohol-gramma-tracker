
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import type { Drink } from "./DrinkForm";
import DrinkForm from "./DrinkForm";

interface DrinkHistoryProps {
  drinks: Drink[];
  onDeleteDrink: (drinkIndex: number) => void;
  onAddDrink: (drink: Drink) => void;
  onEditDrink: (drinkIndex: number, updatedDrink: Drink) => void;
}

const DrinkHistory = ({ drinks, onDeleteDrink, onAddDrink, onEditDrink }: DrinkHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dailyTotals = drinks.reduce((acc: Record<string, number>, drink) => {
    const dateStr = new Date(drink.date).toISOString().split('T')[0];
    acc[dateStr] = (acc[dateStr] || 0) + drink.alcoholGrams;
    return acc;
  }, {});

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

  const formatters = {
    formatDay: (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      const total = dailyTotals[dateStr];
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div>{date.getDate()}</div>
          {total && (
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {total.toFixed(1)}g
            </div>
          )}
        </div>
      );
    },
  };

  const handleAddNewDrink = (drink: Drink) => {
    onAddDrink(drink);
  };

  return (
    <Card className="glass-card p-6 w-full max-w-md mx-auto mt-6 fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Drink History</h2>
      </div>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (date) {
            setSelectedDate(date);
            setIsDialogOpen(true);
          }
        }}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        formatters={formatters}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Drinks for {selectedDate ? format(selectedDate, 'PPP') : ''}
            </DialogTitle>
            <DialogDescription>
              Add drinks or manage existing entries
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto min-h-0">
            <DrinkForm 
              onAddDrink={handleAddNewDrink}
              date={selectedDate}
            />
            
            {selectedDrinks.length > 0 && (
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Volume (ml)</TableHead>
                      <TableHead>Alcohol (%)</TableHead>
                      <TableHead>Total (g)</TableHead>
                      <TableHead>Actions</TableHead>
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
                            onClick={() => onDeleteDrink(drinks.indexOf(drink))}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DrinkHistory;
