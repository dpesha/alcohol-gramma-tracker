
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { Plus, Edit, Trash } from "lucide-react";
import type { Drink } from "./DrinkForm";
import DrinkForm from "./DrinkForm";

interface DrinkHistoryProps {
  drinks: Drink[];
  onDeleteDrink: (drinkIndex: number) => void;
  onAddDrink: (drink: Drink) => void;
  onEditDrink: (drinkIndex: number, updatedDrink: Drink) => void;
}

const DrinkHistory = ({ drinks, onDeleteDrink, onAddDrink, onEditDrink }: DrinkHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDrink, setEditingDrink] = useState<{ drink: Drink; index: number } | null>(null);
  const [isAddingDrink, setIsAddingDrink] = useState(false);

  const dailyTotals = drinks.reduce((acc: Record<string, number>, drink) => {
    const dateStr = new Date(drink.date).toISOString().split('T')[0];
    acc[dateStr] = (acc[dateStr] || 0) + drink.alcoholGrams;
    return acc;
  }, {});

  const selectedDrinks = selectedDate
    ? drinks.filter(
        drink =>
          new Date(drink.date).toISOString().split('T')[0] ===
          selectedDate.toISOString().split('T')[0]
      )
    : [];

  const modifiers = {
    hasDrinks: (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return dateStr in dailyTotals;
    },
  };

  const modifiersStyles = {
    hasDrinks: {
      backgroundColor: "hsl(var(--primary) / 0.1)",
      color: "hsl(var(--primary))",
      fontWeight: "bold",
    },
  };

  const formatters = {
    formatDay: (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      const total = dailyTotals[dateStr];
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div>{date.getDate()}</div>
          {total && (
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {total.toFixed(1)}g
            </div>
          )}
        </div>
      );
    },
  };

  const handleEdit = (drink: Drink, index: number) => {
    setEditingDrink({ drink, index });
  };

  const handleEditSubmit = (updatedDrink: Drink) => {
    if (editingDrink) {
      onEditDrink(editingDrink.index, updatedDrink);
      setEditingDrink(null);
    }
  };

  const handleAddNewDrink = (drink: Drink) => {
    onAddDrink(drink);
    setIsAddingDrink(false);
    setIsDialogOpen(true); // Keep the dialog open to show the updated list
  };

  return (
    <Card className="glass-card p-6 w-full max-w-md mx-auto mt-6 fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Drink History</h2>
      </div>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          setSelectedDate(date);
          if (date) setIsDialogOpen(true);
        }}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        formatters={formatters}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Drinks for {selectedDate ? format(selectedDate, 'PPP') : ''}
            </DialogTitle>
          </DialogHeader>
          {selectedDrinks.length > 0 ? (
            <div className="max-h-[60vh] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Volume (ml)</TableHead>
                    <TableHead>Alcohol (%)</TableHead>
                    <TableHead>Total (g)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedDrinks.map((drink, index) => (
                    <TableRow key={index}>
                      <TableCell>{drink.type}</TableCell>
                      <TableCell>{drink.volume}</TableCell>
                      <TableCell>{drink.alcoholPercentage}%</TableCell>
                      <TableCell>{drink.alcoholGrams.toFixed(1)}g</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(drink, drinks.indexOf(drink))}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDeleteDrink(drinks.indexOf(drink))}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={() => setIsAddingDrink(true)}
                  size="sm"
                >
                  <Plus className="mr-1" />
                  Add Another Drink
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">No drinks recorded for this date</p>
              <Button 
                onClick={() => setIsAddingDrink(true)}
                size="sm"
              >
                <Plus className="mr-1" />
                Add First Drink
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingDrink} onOpenChange={setIsAddingDrink}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Drink</DialogTitle>
          </DialogHeader>
          {selectedDate && (
            <DrinkForm 
              onAddDrink={handleAddNewDrink}
              initialDrink={{ 
                type: "Beer",
                volume: 350,
                alcoholPercentage: 5,
                alcoholGrams: 0,
                date: selectedDate 
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingDrink} onOpenChange={(open) => !open && setEditingDrink(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Drink</DialogTitle>
          </DialogHeader>
          {editingDrink && (
            <DrinkForm 
              onAddDrink={handleEditSubmit}
              initialDrink={editingDrink.drink}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DrinkHistory;
