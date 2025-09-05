import OpenAI from 'openai';

// Initialize OpenAI client with error handling
const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
  });
};

export interface TripPlanningRequest {
  fromLocation: string;
  destination: string;
  startDate: string;
  endDate: string;
  tripType: string;
  collaborators: string[];
}

export interface AIActivitySuggestion {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  category: 'accommodation' | 'transport' | 'restaurant' | 'attraction' | 'activity' | 'shopping' | 'other';
  estimatedCost?: number;
  bookingRequired: boolean;
  tips: string[];
}

export interface AIDayPlan {
  date: string;
  theme: string;
  activities: AIActivitySuggestion[];
  localTips: string[];
  budgetEstimate: number;
}

export interface AITripPlan {
  destination: string;
  duration: number;
  totalBudgetEstimate: number;
  bestTimeToVisit: string;
  weatherInfo: string;
  localCurrency: string;
  languageInfo: string;
  culturalTips: string[];
  packingRecommendations: string[];
  dayPlans: AIDayPlan[];
  emergencyInfo: {
    emergencyNumber: string;
    nearestEmbassy?: string;
    importantAddresses: string[];
  };
}

export const generateTripPlan = async (request: TripPlanningRequest): Promise<AITripPlan> => {
  try {
    const openai = getOpenAIClient();
  } catch (error) {
    console.error('OpenAI configuration error:', error);
    // Return fallback trip plan when API key is missing
    return generateFallbackTripPlan(request);
  }
  
  const startDate = new Date(request.startDate);
  const endDate = new Date(request.endDate);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const prompt = `
Create a detailed ${duration}-day trip itinerary for ${request.destination} from ${request.startDate} to ${request.endDate}, traveling from ${request.fromLocation}.

Trip Details:
- From: ${request.fromLocation}
- Destination: ${request.destination}
- Duration: ${duration} days
- Trip Type: ${request.tripType}
- Travel Style: ${getTripStyleDescription(request.tripType)}
${request.collaborators.length > 0 ? `- Traveling with: ${request.collaborators.length} other people` : '- Solo travel'}

Please provide a comprehensive trip plan in JSON format with the following structure:
{
  "destination": "${request.destination}",
  "duration": ${duration},
  "totalBudgetEstimate": number (in USD),
  "bestTimeToVisit": "string",
  "weatherInfo": "string describing expected weather",
  "localCurrency": "string",
  "languageInfo": "string about local language and useful phrases",
  "culturalTips": ["array of cultural etiquette tips"],
  "packingRecommendations": ["array of packing suggestions"],
  "dayPlans": [
    {
      "date": "YYYY-MM-DD",
      "theme": "string describing the day's focus",
      "activities": [
        {
          "title": "Activity name",
          "description": "Detailed description",
          "location": "Specific address or area",
          "startTime": "HH:MM",
          "endTime": "HH:MM",
          "category": "accommodation|transport|restaurant|attraction|activity|shopping|other",
          "estimatedCost": number (in USD, optional),
          "bookingRequired": boolean,
          "tips": ["array of specific tips for this activity"]
        }
      ],
      "localTips": ["array of tips specific to this day"],
      "budgetEstimate": number (daily budget in USD)
    }
  ],
  "emergencyInfo": {
    "emergencyNumber": "local emergency number",
    "nearestEmbassy": "if applicable",
    "importantAddresses": ["array of important locations"]
  }
}

Requirements:
1. IMPORTANT: Include flight information from ${request.fromLocation} to ${request.destination} as the first activity on Day 1, and return flight as the last activity on the final day
2. Suggest realistic flight times and airlines that operate this route
1. Create realistic daily schedules (8 AM to 10 PM)
2. Include a mix of must-see attractions, local experiences, and ${request.tripType} activities
3. Suggest specific restaurants, hotels, and attractions with real names when possible
4. Provide realistic cost estimates
5. Include practical travel tips and cultural insights
6. Balance popular tourist spots with authentic local experiences
7. Consider travel time between activities
8. Include rest periods and meal times
9. Adapt suggestions based on the "${request.tripType}" trip type
9. Include diverse food and drink experiences: local cuisine, street food, cafés, bars, cooking classes, food markets, and beverage tastings
10. Suggest breakfast, lunch, dinner, and snack options with variety in dining styles and price points

Focus on creating an authentic, well-researched itinerary that captures the essence of ${request.destination} while catering to a ${request.tripType} travel style. Pay special attention to the local food and drink culture, including traditional dishes, popular beverages, dining customs, and unique culinary experiences.
`;
CRITICAL: Always include outbound flight from ${request.fromLocation} to ${request.destination} on Day 1, and return flight from ${request.destination} to ${request.fromLocation} on the final day. Include realistic flight times, airlines, and costs.

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert travel planner with extensive knowledge of destinations worldwide. Provide detailed, practical, and culturally-aware travel itineraries in valid JSON format only. Do not include any text outside the JSON response."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const tripPlan: AITripPlan = JSON.parse(response);
    
    // Validate the response structure
    if (!tripPlan.dayPlans || !Array.isArray(tripPlan.dayPlans)) {
      throw new Error('Invalid trip plan structure');
    }

    return tripPlan;
  } catch (error) {
    console.error('Error generating trip plan:', error);
    
    // Fallback to a basic structure if OpenAI fails
    return generateFallbackTripPlan(request);
  }
};

const getTripStyleDescription = (tripType: string): string => {
  switch (tripType) {
    case 'adventure':
      return 'Adventure-focused with outdoor activities, hiking, and thrilling experiences';
    case 'relaxation':
      return 'Relaxing and leisurely with spa visits, beaches, and peaceful activities';
    case 'cultural':
      return 'Cultural immersion with museums, historical sites, and local traditions';
    case 'food':
      return 'Culinary journey with food tours, cooking classes, and local cuisine';
    case 'romantic':
      return 'Romantic getaway with intimate dining, scenic views, and couple activities';
    case 'family':
      return 'Family-friendly with activities suitable for all ages';
    case 'business':
      return 'Business travel with networking opportunities and professional venues';
    case 'nature':
      return 'Nature-focused with wildlife, parks, and outdoor exploration';
    default:
      return 'Balanced mix of sightseeing, culture, and leisure activities';
  }
};

const generateFallbackTripPlan = (request: TripPlanningRequest): AITripPlan => {
  const startDate = new Date(request.startDate);
  const duration = Math.ceil((new Date(request.endDate).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const dayPlans: AIDayPlan[] = [];
  
  for (let i = 0; i < duration; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    dayPlans.push({
      date: currentDate.toISOString().split('T')[0],
      theme: `Day ${i + 1} - Exploring ${request.destination}`,
      activities: [
        {
          title: `Morning Activity in ${request.destination}`,
          description: `Start your day exploring the highlights of ${request.destination}`,
          location: request.destination,
          startTime: '09:00',
          endTime: '12:00',
          category: 'attraction',
          estimatedCost: 25,
          bookingRequired: false,
          tips: ['Arrive early to avoid crowds', 'Bring comfortable walking shoes']
        },
        {
          title: 'Local Lunch Experience',
          description: 'Enjoy authentic local cuisine',
          location: request.destination,
          startTime: '12:30',
          endTime: '14:00',
          category: 'restaurant',
          bookingRequired: false,
          tips: ['Try local specialties', 'Ask for recommendations']
        },
        {
          title: `Afternoon ${request.tripType} Activity`,
          description: `${request.tripType} focused activity in ${request.destination}`,
          location: request.destination,
          startTime: '15:00',
          endTime: '18:00',
          category: 'activity',
          estimatedCost: 40,
          bookingRequired: true,
          tips: ['Book in advance', 'Check weather conditions']
        }
      ],
      localTips: [`Best time to visit is early morning`, `Local currency exchange available at banks`],
      budgetEstimate: 100
    });
  }

  return {
    destination: request.destination,
    duration,
    totalBudgetEstimate: duration * 100,
    bestTimeToVisit: 'Year-round destination with seasonal variations',
    weatherInfo: 'Check local weather forecast before traveling',
    localCurrency: 'Local currency',
    languageInfo: 'English is widely spoken in tourist areas',
    culturalTips: ['Respect local customs', 'Dress appropriately for religious sites'],
    packingRecommendations: ['Comfortable walking shoes', 'Weather-appropriate clothing', 'Travel adapter'],
    dayPlans,
    emergencyInfo: {
      emergencyNumber: '911',
      importantAddresses: ['Local hospital', 'Tourist information center']
    }
  };
};
export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface DailySpending {
  date: string;
  amount: number;
}

export interface SpendingSummary {
  totalBudget: number;
  dailyAverage: number;
  categoryBreakdown: CategorySpending[];
  dailyBreakdown: DailySpending[];
  insights: string[];
  budgetTips: string[];
  currencyInfo: string;
}

export const generateSpendingSummary = async (dayItineraries: any[], destination: string): Promise<SpendingSummary> => {
  try {
    const openai = getOpenAIClient();
  } catch (error) {
    console.error('OpenAI configuration error:', error);
    // Return fallback spending summary when API key is missing
    return generateFallbackSpendingSummary(dayItineraries, destination);
  }

  // Calculate spending data from itineraries
  const spendingData = calculateSpendingFromItineraries(dayItineraries);
  
  const prompt = `
Analyze the following travel spending data for a trip to ${destination} and provide insights:

Spending Data:
${JSON.stringify(spendingData, null, 2)}

Please provide a comprehensive spending analysis in JSON format with the following structure:
{
  "totalBudget": number,
  "dailyAverage": number,
  "categoryBreakdown": [
    {
      "category": "string",
      "amount": number,
      "percentage": number,
      "count": number
    }
  ],
  "dailyBreakdown": [
    {
      "date": "YYYY-MM-DD",
      "amount": number
    }
  ],
  "insights": [
    "string array of 4-6 key insights about spending patterns"
  ],
  "budgetTips": [
    "string array of 6-8 practical money-saving tips specific to ${destination}"
  ],
  "currencyInfo": "string about local currency and exchange tips"
}

Requirements:
1. Analyze spending patterns and identify the highest expense categories
2. Provide insights about budget allocation and spending efficiency
3. Suggest practical ways to save money while maintaining trip quality
4. Include destination-specific financial tips and currency advice
5. Highlight any unusual spending patterns or recommendations
6. Consider local cost of living and typical tourist expenses in ${destination}

Focus on actionable insights that help travelers make informed financial decisions.
`;

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a financial travel advisor with expertise in budget optimization and destination-specific spending patterns. Provide detailed, practical spending analysis in valid JSON format only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const spendingSummary: SpendingSummary = JSON.parse(response);
    
    // Validate the response structure
    if (!spendingSummary.categoryBreakdown || !Array.isArray(spendingSummary.categoryBreakdown)) {
      throw new Error('Invalid spending summary structure');
    }

    return spendingSummary;
  } catch (error) {
    console.error('Error generating spending summary:', error);
    
    // Fallback to basic analysis if OpenAI fails
    return generateFallbackSpendingSummary(dayItineraries, destination);
  }
};

const calculateSpendingFromItineraries = (dayItineraries: any[]) => {
  const categoryTotals: Record<string, { amount: number; count: number }> = {};
  const dailyTotals: Record<string, number> = {};
  let totalBudget = 0;

  dayItineraries.forEach(day => {
    let dayTotal = 0;
    
    day.activities.forEach((activity: any) => {
      if (activity.cost && activity.cost > 0) {
        const category = activity.category || 'other';
        const cost = activity.cost;
        
        // Add to category totals
        if (!categoryTotals[category]) {
          categoryTotals[category] = { amount: 0, count: 0 };
        }
        categoryTotals[category].amount += cost;
        categoryTotals[category].count += 1;
        
        dayTotal += cost;
        totalBudget += cost;
      }
    });
    
    dailyTotals[day.date] = dayTotal;
  });

  return {
    totalBudget,
    categoryTotals,
    dailyTotals,
    dayCount: dayItineraries.length
  };
};

const generateFallbackSpendingSummary = (dayItineraries: any[], destination: string): SpendingSummary => {
  const spendingData = calculateSpendingFromItineraries(dayItineraries);
  
  // Convert category totals to breakdown format
  const categoryBreakdown: CategorySpending[] = Object.entries(spendingData.categoryTotals).map(([category, data]) => ({
    category,
    amount: data.amount,
    percentage: Math.round((data.amount / spendingData.totalBudget) * 100),
    count: data.count
  })).sort((a, b) => b.amount - a.amount);

  // Convert daily totals to breakdown format
  const dailyBreakdown: DailySpending[] = Object.entries(spendingData.dailyTotals).map(([date, amount]) => ({
    date,
    amount
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const dailyAverage = spendingData.totalBudget / spendingData.dayCount;

  return {
    totalBudget: spendingData.totalBudget,
    dailyAverage: Math.round(dailyAverage),
    categoryBreakdown,
    dailyBreakdown,
    insights: [
      `Your total trip budget is $${spendingData.totalBudget.toLocaleString()} across ${spendingData.dayCount} days`,
      `Daily average spending: $${Math.round(dailyAverage).toLocaleString()}`,
      `Highest spending category: ${categoryBreakdown[0]?.category || 'N/A'} (${categoryBreakdown[0]?.percentage || 0}%)`,
      `You have ${categoryBreakdown.length} different expense categories planned`,
      `Consider booking activities in advance for potential discounts`,
      `Local currency exchange rates can impact your actual spending`
    ],
    budgetTips: [
      'Book attractions and activities online in advance for discounts',
      'Use local public transportation instead of taxis when possible',
      'Eat at local restaurants away from tourist areas for better prices',
      'Look for free walking tours and city attractions',
      'Consider staying in accommodations with kitchen facilities',
      'Use travel reward credit cards for additional savings',
      'Download local discount apps and check for city tourism cards',
      'Set daily spending limits to stay within budget'
    ],
    currencyInfo: `Research current exchange rates for ${destination} and consider using local currency for better rates`
  };
};
