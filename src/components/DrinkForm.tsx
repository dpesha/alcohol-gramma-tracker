import { useState } from "react";
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
}

const DrinkForm = ({ onAddDrink }: DrinkFormProps) => {
  const [type, setType] = useState("Beer");
  const [volume, setVolume] = useState("350");
  const [alcoholPercentage, setAlcoholPercentage] = useState("5");
  const [date, setDate] = useState<Date>(new Date());

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
      date: date
    });

    // Reset form (except date)
    setType("Beer");
    setVolume("350");
    setAlcoholPercentage("5");
  };

  return (
    <Card className="glass-card p-6 w-full max-w-md mx-auto fade-in">
      <h2 className="text-xl font-semibold mb-4">Add Drink</h2>
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

        <Button type="submit" className="w-full">Add Drink</Button>
      </form>
    </Card>
  );
};

export default DrinkForm;