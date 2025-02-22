
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Minus } from "lucide-react";
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

interface PresetDrink {
  name: string;
  type: string;
  volume: number;
  alcoholPercentage: number;
}

const DRINK_PRESETS: PresetDrink[] = [
  { name: "Normal Beer (350ml)", type: "Beer", volume: 350, alcoholPercentage: 5 },
  { name: "Normal Beer (500ml)", type: "Beer", volume: 500, alcoholPercentage: 5 },
  { name: "PSB (350ml)", type: "Beer", volume: 350, alcoholPercentage: 5.5 },
  { name: "PSB (500ml)", type: "Beer", volume: 500, alcoholPercentage: 5.5 },
  { name: "Highball (350ml)", type: "Highball", volume: 350, alcoholPercentage: 7 },
  { name: "Highball (500ml)", type: "Highball", volume: 500, alcoholPercentage: 7 },
];

const DrinkForm = ({ onAddDrink, initialDrink }: DrinkFormProps) => {
  const [isCustom, setIsCustom] = useState(true);
  const [type, setType] = useState(initialDrink?.type || "Beer");
  const [volume, setVolume] = useState(initialDrink?.volume.toString() || "350");
  const [alcoholPercentage, setAlcoholPercentage] = useState(initialDrink?.alcoholPercentage.toString() || "5");
  const [date, setDate] = useState<Date | undefined>(initialDrink?.date || new Date());
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [presetCount, setPresetCount] = useState(1);

  useEffect(() => {
    if (initialDrink) {
      setType(initialDrink.type);
      setVolume(initialDrink.volume.toString());
      setAlcoholPercentage(initialDrink.alcoholPercentage.toString());
      setDate(new Date(initialDrink.date));
      setIsCustom(true);
    }
  }, [initialDrink]);

  const calculateAlcoholGrams = (volume: number, percentage: number) => {
    // Alcohol density is approximately 0.789 g/ml
    return (volume * (percentage / 100) * 0.789);
  };

  const handlePresetSelect = (presetName: string) => {
    setSelectedPreset(presetName);
    setIsCustom(false);
    setPresetCount(1);

    const preset = DRINK_PRESETS.find(p => p.name === presetName);
    if (preset) {
      setType(preset.type);
      setVolume(preset.volume.toString());
      setAlcoholPercentage(preset.alcoholPercentage.toString());
    }
  };

  const handlePresetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    const alcoholGrams = calculateAlcoholGrams(Number(volume), Number(alcoholPercentage));
    
    // Add multiple drinks based on count
    for (let i = 0; i < presetCount; i++) {
      onAddDrink({
        type,
        volume: Number(volume),
        alcoholPercentage: Number(alcoholPercentage),
        alcoholGrams,
        date
      });
    }

    // Reset form
    if (!initialDrink) {
      setPresetCount(1);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    const alcoholGrams = calculateAlcoholGrams(Number(volume), Number(alcoholPercentage));
    
    onAddDrink({
      type,
      volume: Number(volume),
      alcoholPercentage: Number(alcoholPercentage),
      alcoholGrams,
      date
    });

    if (!initialDrink) {
      setType("Beer");
      setVolume("350");
      setAlcoholPercentage("5");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={isCustom ? "default" : "outline"}
          className="flex-1"
          onClick={() => setIsCustom(true)}
        >
          Custom
        </Button>
        <Button
          type="button"
          variant={!isCustom ? "default" : "outline"}
          className="flex-1"
          onClick={() => setIsCustom(false)}
        >
          Presets
        </Button>
      </div>

      {isCustom ? (
        <form onSubmit={handleCustomSubmit} className="space-y-4">
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
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full">
            {initialDrink ? 'Save Changes' : 'Add Drink'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handlePresetSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Preset Drinks</label>
            <Select value={selectedPreset} onValueChange={handlePresetSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a preset drink" />
              </SelectTrigger>
              <SelectContent>
                {DRINK_PRESETS.map((preset) => (
                  <SelectItem key={preset.name} value={preset.name}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPreset && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Count</label>
                <div className="flex items-center justify-between gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setPresetCount(Math.max(1, presetCount - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium">{presetCount}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setPresetCount(presetCount + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
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
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button type="submit" className="w-full">
                Add {presetCount} {selectedPreset}
              </Button>
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default DrinkForm;
