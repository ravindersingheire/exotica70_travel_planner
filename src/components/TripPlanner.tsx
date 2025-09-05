import React, { useState } from 'react';
import { Calendar, MapPin, Users, Plus, Sparkles, UserPlus, Lightbulb } from 'lucide-react';

interface TripPlannerProps {
  onTripCreate: (tripData: any) => void;
  onInspireMe: () => void;
  inspirationDestination?: string;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({ onTripCreate, onInspireMe, inspirationDestination }) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tripType, setTripType] = useState('');
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

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
    if (!destination || !startDate || !endDate) return;

    onTripCreate({
      destination,
      startDate,
      endDate,
      tripType,
      collaborators
    });
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

      <div className="max-w-2xl w-full ml-8 lg:ml-16">
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-white border-opacity-80 relative z-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Every Trip Has a Plan. What's Yours?
            </h1>
            <p className="text-base text-gray-800 font-medium font-body">
              Craft the perfect trip that's uniquely yours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Destination */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Where's your dream destination?
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Paris, Hawaii, Japan, India"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Trip Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                What type of trip are you planning?
              </label>
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all appearance-none"
              >
                <option value="">Select trip type (optional)</option>
                <option value="relaxation">Relaxation</option>
                <option value="adventure">Adventure</option>
                <option value="family">Family</option>
                <option value="romantic">Romantic</option>
                <option value="business">Business</option>
                <option value="cultural">Cultural</option>
                <option value="food">Food & Culinary</option>
                <option value="nature">Nature & Wildlife</option>
              </select>
            </div>

            {/* Dates */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                When are you thinking?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Collaborators */}
            <div>
              <div className="flex items-center justify-between mb-3">
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
                <div className="p-4 bg-gray-50 rounded-xl">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                  />
                  <button
                    type="button"
                    className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    Send Invite
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!destination}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              Start planning
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={onInspireMe}
                className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-all font-medium mb-4 hover:scale-105 group"
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