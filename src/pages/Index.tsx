
import { useState } from "react";
import DrinkForm, { Drink } from "@/components/DrinkForm";
import DailySummary from "@/components/DailySummary";
import DrinkHistory from "@/components/DrinkHistory";
import DrinkCalendar from "@/components/DrinkCalendar";

const Index = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);

  const handleAddDrink = (drink: Drink) => {
    setDrinks((prev) => [...prev, drink]);
  };

  const handleDeleteDrink = (drinkToDelete: Drink) => {
    setDrinks((prev) => prev.filter(drink => drink !== drinkToDelete));
  };

  const handleEditDrink = (drinkToEdit: Drink) => {
    setDrinks((prev) => prev.map(drink => 
      drink === drinkToEdit ? drinkToEdit : drink
    ));
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-4 md:space-y-6 max-w-lg mx-auto">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Responsible Drinking</h1>
        <p className="text-sm md:text-base text-muted-foreground">Track your daily alcohol consumption</p>
      </div>
      
      <DrinkCalendar 
        drinks={drinks} 
        onDeleteDrink={handleDeleteDrink}
        onAddDrink={handleAddDrink}
        onEditDrink={handleEditDrink}
      />
      <DailySummary drinks={drinks} />
      <DrinkHistory drinks={drinks} />
    </div>
  );
};

export default Index;
