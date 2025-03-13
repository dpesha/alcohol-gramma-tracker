
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import DrinkForm, { Drink } from "./DrinkForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash } from "lucide-react";


interface DrinkCalendarProps {
  drinks: Drink[];
  onDeleteDrink: (drink: Drink) => void;
  onAddDrink: (drink: Drink) => void;
}

// Daily alcohol limit in grams
const DAILY_ALCOHOL_LIMIT = 40;

const DrinkCalendar = ({ drinks, onDeleteDrink, onAddDrink}: DrinkCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedDrinks = drinks.filter(drink => 
    format(new Date(drink.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );
  
  const datesWithDrinks = drinks.reduce((acc: { [key: string]: { grams: number, isNoDrinkDay: boolean, isOverLimit: boolean } }, drink) => {
    const dateStr = format(new Date(drink.date), 'yyyy-MM-dd');
    
    if (!acc[dateStr]) {
      acc[dateStr] = {
        grams: 0,
        isNoDrinkDay: false,
        isOverLimit: false
      };
    }
    
    if (drink.type === "no drink day") {
      acc[dateStr].isNoDrinkDay = true;
    } else {
      acc[dateStr].grams += drink.alcoholGrams;
    }
    
    // Check if total grams exceeds the daily limit
    acc[dateStr].isOverLimit = acc[dateStr].grams > DAILY_ALCOHOL_LIMIT;
    
    return acc;
  }, {});

  const modifiers = {
    hasDrink: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return dateStr in datesWithDrinks;
    },
    noDrinkDay: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return datesWithDrinks[dateStr]?.isNoDrinkDay;
    },
    overLimit: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return datesWithDrinks[dateStr]?.isOverLimit;
    }
  };

  const modifiersStyles = {
    hasDrink: {
      color: 'white',
      backgroundColor: 'hsl(var(--primary))',
      borderRadius: '50%',
    },
    noDrinkDay: {
      color: 'white',
      backgroundColor: 'rgb(255 182 193)',
      borderRadius: '50%',
    },
    overLimit: {
      color: 'white',
      backgroundColor: '#ea384c',
      borderRadius: '50%',
    }
  };

  const handleDateClick = (date: Date | undefined) => {
    setIsDialogOpen(true);
    if (date) {
      setSelectedDate(date);
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
        <h2 className="text-lg md:text-xl font-semibold">Drink Calendar</h2>
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
                    <span className={`absolute -bottom-1 text-[0.6rem] font-medium ${
                      datesWithDrinks[dateStr].isNoDrinkDay 
                        ? 'text-pink-600' 
                        : datesWithDrinks[dateStr].isOverLimit
                          ? 'text-red-600'
                          : 'text-green-700'
                    }`}>
                      {datesWithDrinks[dateStr].grams.toFixed(1)}g
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
            row: "w-full flex justify-between mb-4", // Added mb-4 for more vertical spacing between rows
            day: "w-8 h-10 md:w-10 md:h-12 p-0", // Increased height from h-8 to h-10/h-12
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
              drinks={drinks}
            />
            
            {selectedDrinks.length > 0 && (
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Type</TableHead>
                      <TableHead className="w-20">Vol.</TableHead>
                      <TableHead className="w-16">ABV</TableHead>
                      <TableHead className="w-16">Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDrinks.map((drink, index) => (
                      <TableRow key={index}>
                        <TableCell>{drink.type}</TableCell>
                        <TableCell>{drink.volume}ml</TableCell>
                        <TableCell>{drink.alcoholPercentage}%</TableCell>
                        <TableCell>{drink.alcoholGrams.toFixed(1)}g</TableCell>
                        <TableCell className="px-1">
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

export default DrinkCalendar;
