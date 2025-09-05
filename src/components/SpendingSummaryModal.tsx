import React, { useState, useEffect } from 'react';
import { X, DollarSign, PieChart, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { DayItinerary } from '../types';
import { generateSpendingSummary, SpendingSummary } from '../lib/openai';

interface SpendingSummaryModalProps {
  dayItineraries: DayItinerary[];
  destination: string;
  onClose: () => void;
}

export const SpendingSummaryModal: React.FC<SpendingSummaryModalProps> = ({
  dayItineraries,
  destination,
  onClose
}) => {
  const [summary, setSummary] = useState<SpendingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateSummary = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const spendingSummary = await generateSpendingSummary(dayItineraries, destination);
        setSummary(spendingSummary);
      } catch (err) {
        console.error('Error generating spending summary:', err);
        setError('Unable to generate spending summary. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generateSummary();
  }, [dayItineraries, destination]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'accommodation': 'bg-blue-500',
      'transport': 'bg-green-500',
      'restaurant': 'bg-orange-500',
      'attraction': 'bg-purple-500',
      'activity': 'bg-pink-500',
      'shopping': 'bg-indigo-500',
      'other': 'bg-gray-500'
    };
    return colors[category.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <PieChart className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Spending Analysis</h2>
              <p className="text-gray-600 mt-1">Smart insights for your {destination} trip</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin mb-4">
                <Sparkles className="h-12 w-12 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analyzing Your Spending
              </h3>
              <p className="text-gray-600 text-center">
                AI is crunching the numbers and generating insights...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Analysis Unavailable
                </h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : summary ? (
            <div className="space-y-8">
              {/* Total Budget Overview */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        ${summary.totalBudget.toLocaleString()}
                      </h3>
                      <p className="text-gray-600">Total Trip Budget</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600">
                      ${summary.dailyAverage.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">Daily Average</p>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                  Spending by Category
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {summary.categoryBreakdown.map((category, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${getCategoryColor(category.category)}`}></div>
                          <span className="font-medium text-gray-900 capitalize">
                            {category.category}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ${category.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {category.percentage}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getCategoryColor(category.category)}`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                  AI Insights & Recommendations
                </h3>
                <div className="space-y-4">
                  {summary.insights.map((insight, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Optimization Tips */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
                  Budget Optimization Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {summary.budgetTips.map((tip, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Breakdown */}
              {summary.dailyBreakdown.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Daily Spending Breakdown
                  </h3>
                  <div className="space-y-3">
                    {summary.dailyBreakdown.map((day, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">
                              Day {index + 1}
                            </span>
                            <span className="text-gray-600 ml-2">
                              ({new Date(day.date).toLocaleDateString()})
                            </span>
                          </div>
                          <div className="font-semibold text-gray-900">
                            ${day.amount.toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${(day.amount / Math.max(...summary.dailyBreakdown.map(d => d.amount))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};