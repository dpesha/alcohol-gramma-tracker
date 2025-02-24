import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import DrinkForm, { Drink } from "./DrinkForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface DrinkHistoryProps {
  drinks: Drink[];
  onDeleteDrink: (drink: Drink) => void;
  onAddDrink: (drink: Drink) => void;
  onEditDrink: (drink: Drink) => void;
}

const DrinkHistory = ({ drinks, onDeleteDrink, onAddDrink, onEditDrink }: DrinkHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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

  const formatters = {
    DayContent: (date: Date) => {
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
      return date.getDate();
    }
  };

  const handleAddDrink = (drink: Drink) => {
    onAddDrink(drink);
    setIsDialogOpen(false);
  };

  const dailyDrinks = drinks.filter(drink => 
    format(new Date(drink.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const totalAlcoholGrams = dailyDrinks.reduce((sum, drink) => sum + drink.alcoholGrams, 0);

  return (
    <Card className="glass-card p-4 md:p-6 w-full mx-auto fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold">Drink History</h2>
        <div className="text-sm text-muted-foreground">
          Total Alcohol: {totalAlcoholGrams.toFixed(1)}g
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={
              "w-full justify-start text-left font-normal" +
              (selectedDate ? " text-sm" : " text-muted-foreground")
            }
          >
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            formatters={formatters}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button onClick={() => setIsDialogOpen(true)} className="w-full mt-2">
        Add Drink
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full mt-2" disabled={dailyDrinks.length === 0}>
            Delete All Drinks
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all drinks for {format(selectedDate, "PPP")}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              dailyDrinks.forEach(drink => onDeleteDrink(drink));
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Drinks for {format(selectedDate, "PPP")}</h3>
        <ScrollArea className="rounded-md border h-[200px] w-full">
          {dailyDrinks.length > 0 ? (
            dailyDrinks.map((drink, index) => (
              <div key={index} className="flex items-center justify-between p-2 border-b last:border-b-0">
                <div>
                  <div className="font-medium">{drink.type}</div>
                  <div className="text-sm text-muted-foreground">
                    {drink.volume}ml, {drink.alcoholPercentage}%
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onEditDrink(drink)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.687a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H15.75A2.25 2.25 0 0118 8.25V11a.75.75 0 011.5 0v-2.75A3.75 3.75 0 0015.75 4.5H5.25A3.75 3.75 0 001.5 8.25v10.5A3.75 3.75 0 005.25 22.5h10.5A3.75 3.75 0 0019.5 18.75V14a.75.75 0 01-1.5 0z"
                      />
                    </svg>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => onDeleteDrink(drink)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground p-2">No drinks for this date.</div>
          )}
        </ScrollArea>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Drink for {format(selectedDate, "PPP")}</DialogTitle>
            <DialogDescription>
              Add a new drink to your history for the selected date.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <DrinkForm onAddDrink={handleAddDrink} date={selectedDate} />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DrinkHistory;
