
import { useState } from "react";
import DrinkForm, { Drink } from "@/components/DrinkForm";
import DailySummary from "@/components/DailySummary";
import AlcoholGraph from "@/components/AlcoholGraph";
import DrinkHistory from "@/components/DrinkHistory";

const Index = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);

  const handleAddDrink = (drink: Drink) => {
    setDrinks((prev) => [...prev, drink]);
  };

  const handleDeleteDrink = (index: number) => {
    setDrinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditDrink = (index: number, updatedDrink: Drink) => {
    setDrinks((prev) => prev.map((drink, i) => i === index ? updatedDrink : drink));
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-md mx-auto text-center space-y-2 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Alcohol Tracker</h1>
        <p className="text-muted-foreground">Track your daily alcohol consumption</p>
      </div>
      
      <DrinkHistory 
        drinks={drinks} 
        onDeleteDrink={handleDeleteDrink}
        onAddDrink={handleAddDrink}
        onEditDrink={handleEditDrink}
      />
      <DailySummary drinks={drinks} />
      <AlcoholGraph drinks={drinks} />
    </div>
  );
};

export default Index;
