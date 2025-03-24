
# Responsible Drinking App

A web application to help users track their daily alcohol consumption and promote responsible drinking habits.

## Project Requirements

### Overview
The Responsible Drinking App is designed to help users track and monitor their alcohol consumption on a daily basis. By providing visual feedback and historical data, it encourages responsible drinking habits and awareness of alcohol intake.

### Features

#### 1. Drink Calendar
- **Interactive Calendar**: Visual representation of drinking patterns over time
- **Color-Coded Days**: 
  - Green: No-drink days
  - Orange: Days with moderate drinking
  - Red: Days exceeding the recommended limit (40g of alcohol)
- **Daily Consumption Display**: Shows total alcohol consumption in grams for each day
- **Date Selection**: Click on any date to add or manage drinks

#### 2. Drink Management
- **Add Drinks**: Record different types of alcoholic beverages
- **Specify Details**:
  - Drink type (beer, wine, spirits, or custom)
  - Volume in milliliters
  - Alcohol percentage (ABV)
- **Record No-Drink Days**: Option to mark days with no alcohol consumption
- **Delete Entries**: Remove incorrectly added drinks

#### 3. Daily Summary
- **Current Day Stats**: Shows today's alcohol consumption
- **Limit Indicator**: Visual representation of consumption relative to daily limit
- **Health Impact Information**: Basic information about alcohol effects

#### 4. Drink History
- **Historical Data**: View drinking patterns over time
- **Graphical Representation**: Chart showing consumption trends
- **Daily Average**: Calculation of average daily consumption for the current month

### Technical Specifications
- Built with React and TypeScript
- Responsive design using Tailwind CSS
- Component-based architecture with shadcn/ui
- Local storage for data persistence

## How to Use

1. **View Calendar**: See your drinking patterns at a glance
2. **Add Drinks**: Click on any date to record your drinks for that day
3. **Track Progress**: Monitor your consumption patterns over time
4. **Review History**: See your drinking trends in the history chart

## Technical Setup

To work locally with this project:

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the development server
npm run dev
```

## Future Enhancements
- User authentication and cloud storage
- Personalized recommendations based on drinking patterns
- Social features for accountability
- Export and reporting capabilities
