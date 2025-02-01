import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateAlcoholGrams } from "@/lib/calculations";
import { toast } from "sonner";

export interface Drink {
  id: string;
  type: string;
  percentage: number;
  volume: number;
  alcoholGrams: number;
}

interface DrinkFormProps {
  onAddDrink: (drink: Drink) => void;
}

const DrinkForm = ({ onAddDrink }: DrinkFormProps) => {
  const [percentage, setPercentage] = useState("5");
  const [volume, setVolume] = useState("350");
  const [type, setType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!percentage || !volume || !type) {
      toast.error("Please fill in all fields");
      return;
    }

    const percentageNum = parseFloat(percentage);
    const volumeNum = parseFloat(volume);

    if (percentageNum <= 0 || percentageNum > 100) {
      toast.error("Percentage must be between 0 and 100");
      return;
    }

    if (volumeNum <= 0) {
      toast.error("Volume must be greater than 0");
      return;
    }

    const alcoholGrams = calculateAlcoholGrams(percentageNum, volumeNum);
    
    const newDrink: Drink = {
      id: Date.now().toString(),
      type,
      percentage: percentageNum,
      volume: volumeNum,
      alcoholGrams,
    };

    onAddDrink(newDrink);
    toast.success("Drink added successfully");
    
    // Reset form
    setPercentage("5");
    setVolume("350");
    setType("");
  };

  return (
    <Card className="glass-card p-6 w-full max-w-md mx-auto fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="type">Drink Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select drink type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beer">Beer</SelectItem>
              <SelectItem value="highball">Highball</SelectItem>
              <SelectItem value="wine">Wine</SelectItem>
              <SelectItem value="spirits">Spirits</SelectItem>
              <SelectItem value="cocktail">Cocktail</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="percentage">Alcohol Percentage (%)</Label>
          <Input
            id="percentage"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            placeholder="e.g. 5.0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="volume">Volume (ml)</Label>
          <Input
            id="volume"
            type="number"
            min="0"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            placeholder="e.g. 350"
          />
        </div>

        <Button type="submit" className="w-full">
          Add Drink
        </Button>
      </form>
    </Card>
  );
};

export default DrinkForm;