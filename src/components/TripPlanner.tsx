import React, { useState } from 'react';
import { Calendar, MapPin, Users, Plus, Sparkles, UserPlus, Lightbulb, X, ChevronDown } from 'lucide-react';

interface TripPlannerProps {
  onTripCreate: (tripData: any) => void;
  onInspireMe: () => void;
  inspirationDestination?: string;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({ onTripCreate, onInspireMe, inspirationDestination }) => {
  const [fromLocation, setFromLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tripType, setTripType] = useState('relaxation');
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeField, setActiveField] = useState<'start' | 'return' | null>(null);
  const [isFirstSelection, setIsFirstSelection] = useState(true);

  // Beautiful travel videos from Pexels - various landscapes and experiences
  const travelVideos = [
    'https://videos.pexels.com/video-files/1851190/1851190-hd_1920_1080_30fps.mp4',
    'https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4',
    'https://videos.pexels.com/video-files/2022395/2022395-hd_1920_1080_30fps.mp4',
    'https://videos.pexels.com/video-files/1448735/1448735-hd_1920_1080_25fps.mp4',
    'https://videos.pexels.com/video-files/1526909/1526909-hd_1920_1080_30fps.mp4',
    'https://videos.pexels.com/video-files/1409899/1409899-hd_1920_1080_24fps.mp4',
    'https://videos.pexels.com/video-files/1721294/1721294-hd_1920_1080_30fps.mp4',
    'https://videos.pexels.com/video-files/1534735/1534735-hd_1920_1080_30fps.mp4',
    'https://videos.pexels.com/video-files/1448735/1448735-hd_1920_1080_25fps.mp4',
    'https://videos.pexels.com/video-files/1851190/1851190-hd_1920_1080_30fps.mp4',
    'https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4',
    'https://videos.pexels.com/video-files/2022395/2022395-hd_1920_1080_30fps.mp4'
  ];

  // High-quality 4K travel destination images from Pexels
  const travelImages = [
    'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160',
    'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160',
    'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160',
    'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160',
    'https://images.pexels.com/photos/1434819/pexels-photo-1434819.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160',
    'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160',
    'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160',
    'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160',
    'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160',
    'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160',
    'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160',
    'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160'
  ];

  // Update destination when inspiration is selected
  React.useEffect(() => {
    if (inspirationDestination) {
      setDestination(inspirationDestination);
    }
  }, [inspirationDestination]);

  // Auto-rotate videos every 6 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => 
        (prevIndex + 1) % travelVideos.length
      );
    }, 7000); // 7 seconds per video

    return () => clearInterval(interval);
  }, [travelVideos.length]);

  // Preload next video for smoother transitions
  React.useEffect(() => {
    const nextIndex = (currentVideoIndex + 1) % travelVideos.length;
    const video = document.createElement('video');
    video.src = travelVideos[nextIndex];
    video.load();
  }, [currentVideoIndex, travelVideos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromLocation || !destination || !startDate || !endDate) return;

    onTripCreate({
      fromLocation,
      destination,
      startDate,
      endDate,
      tripType,
      collaborators
    });
  };

  const handleDateSelect = (date: string) => {
    if (isFirstSelection) {
      // First selection is always start date
      setStartDate(date);
      setActiveField('return');
      setIsFirstSelection(false);
    } else {
      if (activeField === 'start') {
        // If new start date is after current end date, reset end date
        if (endDate && new Date(date) >= new Date(endDate)) {
          setStartDate(date);
          setEndDate('');
          setActiveField('return');
          setIsFirstSelection(false);
        } else {
          setStartDate(date);
        }
      } else {
        // Selecting return date
        if (new Date(date) <= new Date(startDate)) {
          // If return date is before or same as start date, make it the new start date
          setStartDate(date);
          setEndDate('');
          setActiveField('return');
          setIsFirstSelection(false);
        } else {
          setEndDate(date);
        }
      }
    }
  };

  const openCalendar = (field?: 'start' | 'return') => {
    setShowCalendar(true);
    if (startDate && endDate) {
      // Both dates are set, determine which field to make active
      setActiveField(field || 'start');
      setIsFirstSelection(false);
    } else if (startDate && !endDate) {
      // Only start date is set
      setActiveField('return');
      setIsFirstSelection(false);
    } else {
      // No dates set
      setActiveField('start');
      setIsFirstSelection(true);
    }
  };

  const closeCalendar = () => {
    setShowCalendar(false);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeCalendar();
    }
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const getNextMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const generateCalendarDays = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  };

  const isDateSelected = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return dateStr === startDate || dateStr === endDate;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="min-h-screen flex items-center p-4 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {travelVideos.map((videoUrl, index) => (
          <div key={`video-${index}`} className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
          }`}>
            <video
              key={`video-element-${index}-${currentVideoIndex}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover z-10"
              poster={travelImages[index]}
              onLoadStart={() => console.log(`Loading video ${index}`)}
              onCanPlay={() => console.log(`Video ${index} can play`)}
              onError={(e) => console.log(`Video ${index} error:`, e)}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Background image fallback - lower z-index so video appears on top */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
              style={{ backgroundImage: `url(${travelImages[index]})` }}
            />
          </div>
        ))}
        
        {/* Overlay to ensure form readability - higher z-index */}
        <div className="absolute inset-0 bg-black bg-opacity-30 z-20" />
      </div>

      <div className="max-w-xl w-full ml-8 lg:ml-16">
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl p-5 md:p-6 border border-white border-opacity-80 relative z-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-heading">
              Every Trip Has a Plan. What's Yours?
            </h1>
            <p className="text-sm text-gray-800 font-medium font-body">
              Craft the perfect trip that's uniquely yours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* From Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Where are you traveling from?
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="e.g. New York, London, Mumbai"
                  className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 bg-white rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Where's your dream destination?
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Paris, Hawaii, Japan, India"
                  className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 bg-white rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Trip Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What type of trip are you planning?
              </label>
              <div className="relative">
                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 bg-white rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all appearance-none pr-10"
                >
                  <option value="relaxation">Relaxation</option>
                  <option value="adventure">Adventure</option>
                  <option value="family">Family</option>
                  <option value="romantic">Romantic</option>
                  <option value="business">Business</option>
                  <option value="cultural">Cultural</option>
                  <option value="food">Food & Culinary</option>
                  <option value="nature">Nature & Wildlife</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              </div>
            </div>

            {/* Dates */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                When are you thinking?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                  <div className="relative">
                    <Calendar 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" 
                      onClick={() => openCalendar('start')}
                    />
                    <input
                      type="text"
                      value={formatDateForDisplay(startDate)}
                      onClick={() => openCalendar('start')}
                      placeholder="Select start date"
                      readOnly
                      className={`w-full pl-12 pr-4 py-2.5 border-2 bg-white rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all cursor-pointer ${
                        activeField === 'start' && showCalendar ? 'border-orange-500 ring-2 ring-orange-100' : 'border-gray-200'
                      }`}
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Return Date</label>
                  <div className="relative">
                    <Calendar 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" 
                      onClick={() => openCalendar('return')}
                    />
                    <input
                      type="text"
                      value={formatDateForDisplay(endDate)}
                      onClick={() => openCalendar('return')}
                      placeholder="Select return date"
                      readOnly
                      className={`w-full pl-12 pr-4 py-2.5 border-2 bg-white rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all cursor-pointer ${
                        activeField === 'return' && showCalendar ? 'border-orange-500 ring-2 ring-orange-100' : 'border-gray-200'
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              {/* Custom Calendar Popup */}
              {showCalendar && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  onClick={handleClickOutside}
                >
                  <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-2xl w-full mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {activeField === 'start' ? 'Select Start Date' : 'Select Return Date'}
                    </h3>
                    <button
                      onClick={closeCalendar}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Month */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                        {getCurrentMonth().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h4>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays(getCurrentMonth()).map((date, index) => {
                          const isCurrentMonth = date.getMonth() === getCurrentMonth().getMonth();
                          const isSelected = isDateSelected(date);
                          const isInRange = isDateInRange(date);
                          const isDisabled = isDateDisabled(date);
                          const dateStr = date.toISOString().split('T')[0];
                          
                          return (
                            <button
                              key={index}
                              onClick={() => !isDisabled && handleDateSelect(dateStr)}
                              disabled={isDisabled}
                              className={`
                                w-8 h-8 text-sm rounded-lg transition-all
                                ${!isCurrentMonth ? 'text-gray-300' : ''}
                                ${isSelected ? 'bg-orange-500 text-white font-semibold' : ''}
                                ${isInRange && !isSelected ? 'bg-orange-100 text-orange-700' : ''}
                                ${!isSelected && !isInRange && isCurrentMonth && !isDisabled ? 'hover:bg-gray-100 text-gray-700' : ''}
                                ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                              `}
                            >
                              {date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Next Month */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                        {getNextMonth().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h4>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays(getNextMonth()).map((date, index) => {
                          const isCurrentMonth = date.getMonth() === getNextMonth().getMonth();
                          const isSelected = isDateSelected(date);
                          const isInRange = isDateInRange(date);
                          const isDisabled = isDateDisabled(date);
                          const dateStr = date.toISOString().split('T')[0];
                          
                          return (
                            <button
                              key={index}
                              onClick={() => !isDisabled && handleDateSelect(dateStr)}
                              disabled={isDisabled}
                              className={`
                                w-8 h-8 text-sm rounded-lg transition-all
                                ${!isCurrentMonth ? 'text-gray-300' : ''}
                                ${isSelected ? 'bg-orange-500 text-white font-semibold' : ''}
                                ${isInRange && !isSelected ? 'bg-orange-100 text-orange-700' : ''}
                                ${!isSelected && !isInRange && isCurrentMonth && !isDisabled ? 'hover:bg-gray-100 text-gray-700' : ''}
                                ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                              `}
                            >
                              {date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {startDate && endDate && (
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-700 text-center">
                        <span className="font-semibold">Selected:</span> {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
                      </p>
                    </div>
                  )}
                </div>
                </div>
              )}
            </div>

            {/* Collaborators */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => setShowCollaborators(!showCollaborators)}
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium transition-all hover:scale-105"
                >
                  <div className="flex items-center space-x-1">
                    <UserPlus className="h-4 w-4" />
                    <Users className="h-3 w-3 opacity-70" />
                  </div>
                  <span>Invite tripmates</span>
                </button>
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>Friends</span>
                </button>
              </div>
              
              {showCollaborators && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                  />
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    Send Invite
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!fromLocation || !destination}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              Start planning
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={onInspireMe}
                className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-all font-medium hover:scale-105 group"
              >
                <div className="flex items-center space-x-1">
                  <Lightbulb className="h-5 w-5 group-hover:text-yellow-500 transition-colors" />
                  <Sparkles className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-all" />
                </div>
                <span>Need inspiration? Let us suggest a destination!</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};