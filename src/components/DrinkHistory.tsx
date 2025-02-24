
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format, isToday } from "date-fns";
import { Button } from "@/components/ui/button";
import DrinkForm, { Drink } from "./DrinkForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash } from "lucide-react";
import { DayContent } from "react-day-picker";

interface DrinkHistoryProps {
  drinks: Drink[];
  onDeleteDrink: (drink: Drink) => void;
  onAddDrink: (drink: Drink) => void;
  onEditDrink: (drink: Drink) => void;
}

const DrinkHistory = ({ drinks, onDeleteDrink, onAddDrink, onEditDrink }: DrinkHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter drinks for selected date using start of day comparison
  const selectedDrinks = drinks.filter(drink => 
    format(new Date(drink.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );
  
  // Create dots for dates with drinks
  const datesWithDrinks = drinks.reduce((acc: { [key: string]: number }, drink) => {
    const dateStr = format(new Date(drink.date), 'yyyy-MM-dd');
    acc[dateStr] = (acc[dateStr] || 0) + drink.alcoholGrams;
    return acc;
  }, {});

  const modifiers = {
    hasDrink: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return dateStr in datesWithDrinks;
    }
  };

  const modifiersStyles = {
    hasDrink: {
      color: 'white',
      backgroundColor: 'hsl(var(--primary))',
    }
  };

  const handleDateClick = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // Only open dialog if the selected date is today
      if (isToday(date)) {
        setIsDialogOpen(true);
      }
    }
  };

  const handleAddNewDrink = (drink: Drink) => {
    onAddDrink({
      ...drink,
      date: selectedDate
    });
  };

  return (
    <Card className="glass-card p-4 md:p-6 w-full mx-auto fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold">Drink History</h2>
      </div>

      <div className="w-full flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateClick}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
            DayContent: ({ date }) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              if (dateStr in datesWithDrinks) {
                return (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <span>{date.getDate()}</span>
                    <span className="absolute -bottom-3 text-[0.6rem] font-medium">
                      {datesWithDrinks[dateStr].toFixed(1)}g
                    </span>
                  </div>
                );
              }
              return (
                <div className="flex items-center justify-center">
                  {date.getDate()}
                </div>
              );
            }
          }}
          className="w-full"
          classNames={{
            months: "w-full",
            month: "w-full",
            table: "w-full",
            head_row: "w-full flex justify-between",
            row: "w-full flex justify-between",
            day: "w-8 h-8 md:w-10 md:h-10 p-0",
            head_cell: "w-8 md:w-10 text-center",
            cell: "w-8 md:w-10 text-center p-0",
          }}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-md overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Drinks for {format(selectedDate, 'PPP')}
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
              <div className="mt-4 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Type</TableHead>
                      <TableHead className="whitespace-nowrap">Volume (ml)</TableHead>
                      <TableHead className="whitespace-nowrap">Alcohol (%)</TableHead>
                      <TableHead className="whitespace-nowrap">Total (g)</TableHead>
                      <TableHead className="whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDrinks.map((drink, index) => (
                      <TableRow key={index}>
                        <TableCell className="whitespace-nowrap">{drink.type}</TableCell>
                        <TableCell className="whitespace-nowrap">{drink.volume}</TableCell>
                        <TableCell className="whitespace-nowrap">{drink.alcoholPercentage}%</TableCell>
                        <TableCell className="whitespace-nowrap">{drink.alcoholGrams.toFixed(1)}g</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDeleteDrink(drink)}
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
