import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";
import { format } from "date-fns";

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
  date: Date;
  drinks?: Drink[];
}

interface PresetDrink {
  name: string;
  type: string;
  volume: number;
  alcoholPercentage: number;
}

const DRINK_PRESETS: PresetDrink[] = [
  { name: "PSB (350ml)", type: "Beer", volume: 350, alcoholPercentage: 5.5 },
  { name: "PSB (500ml)", type: "Beer", volume: 500, alcoholPercentage: 5.5 },
  { name: "Normal Beer (350ml)", type: "Beer", volume: 350, alcoholPercentage: 5 },
  { name: "Normal Beer (500ml)", type: "Beer", volume: 500, alcoholPercentage: 5 },
  { name: "Highball (350ml)", type: "Highball", volume: 350, alcoholPercentage: 7 },
  { name: "Highball (500ml)", type: "Highball", volume: 500, alcoholPercentage: 7 },
];

const DrinkForm = ({ onAddDrink, initialDrink, date, drinks = [] }: DrinkFormProps) => {
  const [isCustom, setIsCustom] = useState(false); // Changed to false to make presets default
  const [type, setType] = useState(initialDrink?.type || "Beer");
  const [volume, setVolume] = useState(initialDrink?.volume.toString() || "350");
  const [alcoholPercentage, setAlcoholPercentage] = useState(initialDrink?.alcoholPercentage.toString() || "5");
  const [presetCounts, setPresetCounts] = useState<{ [key: string]: number }>(
    Object.fromEntries(DRINK_PRESETS.map(preset => [preset.name, 0])) // Initialize all counters to 0
  );

  // Check if this date is already marked as no-drink day
  const isNoDrinkDay = drinks.some(
    drink => 
      format(new Date(drink.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
      drink.type === "no drink day"
  );

  const hasExistingDrinks = drinks.some(
    drink => 
      format(new Date(drink.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  useEffect(() => {
    if (initialDrink) {
      setType(initialDrink.type);
      setVolume(initialDrink.volume.toString());
      setAlcoholPercentage(initialDrink.alcoholPercentage.toString());
      setIsCustom(true);
    }
  }, [initialDrink]);

  const calculateAlcoholGrams = (volume: number, percentage: number) => {
    return (volume * (percentage / 100) * 0.789);
  };

  const handlePresetSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Add drinks for each preset with count > 0
    Object.entries(presetCounts).forEach(([presetName, count]) => {
      if (count > 0) {
        const preset = DRINK_PRESETS.find(p => p.name === presetName);
        if (preset) {
          const alcoholGrams = calculateAlcoholGrams(preset.volume, preset.alcoholPercentage);
          
          for (let i = 0; i < count; i++) {
            onAddDrink({
              type: preset.type,
              volume: preset.volume,
              alcoholPercentage: preset.alcoholPercentage,
              alcoholGrams,
              date
            });
          }
        }
      }
    });

    // Reset all counters to 0
    setPresetCounts(
      Object.fromEntries(DRINK_PRESETS.map(preset => [preset.name, 0]))
    );
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
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
      setType("Beer");
      setVolume("350");
      setAlcoholPercentage("5");
    }
  };

  const updatePresetCount = (presetName: string, increment: boolean) => {
    setPresetCounts(prev => ({
      ...prev,
      [presetName]: increment ? prev[presetName] + 1 : Math.max(0, prev[presetName] - 1)
    }));
  };

  const handleNoDrinkDay = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddDrink({
      type: "no drink day",
      volume: 0,
      alcoholPercentage: 0,
      alcoholGrams: 0,
      date
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 mb-2">
        <Button
          type="button"
          variant={isCustom ? "default" : "outline"}
          className="flex-1"
          onClick={() => setIsCustom(true)}
          disabled={isNoDrinkDay}
        >
          Custom
        </Button>
        <Button
          type="button"
          variant={!isCustom ? "default" : "outline"}
          className="flex-1"
          onClick={() => setIsCustom(false)}
          disabled={isNoDrinkDay}
        >
          Presets
        </Button>
        <Button
          type="button"
          variant="outline"
          className={`flex-1 ${
            isNoDrinkDay || hasExistingDrinks
              ? "bg-gray-300 hover:bg-gray-300 border-gray-300 cursor-not-allowed"
              : "bg-pink-300 hover:bg-pink-400 border-pink-300 hover:border-pink-400"
          } text-white hover:text-white`}
          onClick={handleNoDrinkDay}
          disabled={isNoDrinkDay || hasExistingDrinks}
        >
          No Drink Day
        </Button>
      </div>

      {isNoDrinkDay ? (
        <div className="text-center p-4 text-gray-500">
          This day is marked as a no-drink day
        </div>
      ) : (
        <>
          {isCustom ? (
            <div className="space-y-4">
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

                <Button type="submit" className="w-full">
                  {initialDrink ? 'Save Changes' : 'Add Drink'}
                </Button>
              </form>
            </div>
          ) : (
            <form onSubmit={handlePresetSubmit} className="space-y-2">
              <div className="grid gap-2">
                {DRINK_PRESETS.map((preset) => (
                  <div key={preset.name} className="p-2 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {preset.alcoholPercentage}% · {preset.volume}ml
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 w-7"
                          onClick={() => updatePresetCount(preset.name, false)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-4 text-center">
                          {presetCounts[preset.name]}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 w-7"
                          onClick={() => updatePresetCount(preset.name, true)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                type="submit" 
                className="w-full mt-2"
                disabled={Object.values(presetCounts).every(count => count === 0)}
              >
                Add Drinks
              </Button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default DrinkForm;
