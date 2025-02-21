
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Drink {
  type: string;
  volume: number;
  alcoholPercentage: number;
  alcoholGrams: number;
  date: Date;
}

interface DrinkFormProps {
  onAddDrink: (drink: Drink) => void;
  initialDrink?: Drink;
}

const DrinkForm = ({ onAddDrink, initialDrink }: DrinkFormProps) => {
  const [type, setType] = useState(initialDrink?.type || "Beer");
  const [volume, setVolume] = useState(initialDrink?.volume.toString() || "350");
  const [alcoholPercentage, setAlcoholPercentage] = useState(initialDrink?.alcoholPercentage.toString() || "5");
  const [date, setDate] = useState<Date>(initialDrink?.date || new Date());

  useEffect(() => {
    if (initialDrink) {
      setType(initialDrink.type);
      setVolume(initialDrink.volume.toString());
      setAlcoholPercentage(initialDrink.alcoholPercentage.toString());
      setDate(new Date(initialDrink.date));
    }
  }, [initialDrink]);

  const calculateAlcoholGrams = (volume: number, percentage: number) => {
    // Alcohol density is approximately 0.789 g/ml
    return (volume * (percentage / 100) * 0.789);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const alcoholGrams = calculateAlcoholGrams(Number(volume), Number(alcoholPercentage));
    
    onAddDrink({
      type,
      volume: Number(volume),
      alcoholPercentage: Number(alcoholPercentage),
      alcoholGrams,
      date
    });

    if (!initialDrink) {
      // Only reset if we're not editing
      setType("Beer");
      setVolume("350");
      setAlcoholPercentage("5");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beer">Beer</SelectItem>
            <SelectItem value="Highball">Highball</SelectItem>
            <SelectItem value="Wine">Wine</SelectItem>
            <SelectItem value="Spirits">Spirits</SelectItem>
            <SelectItem value="Cocktail">Cocktail</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Volume (ml)</label>
        <Input
          type="number"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          min="0"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Alcohol Percentage (%)</label>
        <Input
          type="number"
          value={alcoholPercentage}
          onChange={(e) => setAlcoholPercentage(e.target.value)}
          min="0"
          max="100"
          step="0.1"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => setDate(newDate || new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full">
        {initialDrink ? 'Save Changes' : 'Add Drink'}
      </Button>
    </form>
  );
};

export default DrinkForm;
