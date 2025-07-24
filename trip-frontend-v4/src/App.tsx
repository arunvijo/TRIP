import React, { useState, useEffect, useRef } from 'react';

// Define TypeScript interfaces for better type safety
interface Activity {
  time: string;
  description: string;
}

interface ItineraryDay {
  day: number;
  date: string;
  location: string;
  activities: Activity[];
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

// Mock data for demonstration purposes, now typed
const mockItinerary: ItineraryDay[] = [
  {
    day: 1,
    date: 'August 1, 2025',
    location: 'Paris, France',
    activities: [
      { time: '09:00 AM', description: 'Arrive at Charles de Gaulle Airport (CDG), transfer to hotel.' },
      { time: '11:00 AM', description: 'Check into Hotel Le Littré, Montparnasse.' },
      { time: '01:00 PM', description: 'Lunch at a local bistro near the hotel.' },
      { time: '03:00 PM', description: 'Explore the Luxembourg Gardens.' },
      { time: '06:00 PM', description: 'Visit the Eiffel Tower (pre-booked tickets recommended).' },
      { time: '08:00 PM', description: 'Dinner cruise on the Seine River.' },
    ],
  },
  {
    day: 2,
    date: 'August 2, 2025',
    location: 'Paris, France',
    activities: [
      { time: '09:30 AM', description: 'Louvre Museum visit (focus on key masterpieces).' },
      { time: '01:00 PM', description: 'Lunch near the Louvre.' },
      { time: '02:30 PM', description: 'Walk along the Champs-Élysées to Arc de Triomphe.' },
      { time: '05:00 PM', description: 'Shopping or leisure time.' },
      { time: '07:30 PM', description: 'Dinner in Le Marais district.' },
    ],
  },
  {
    day: 3,
    date: 'August 3, 2025',
    location: 'Paris, France',
    activities: [
      { time: '10:00 AM', description: 'Day trip to Palace of Versailles.' },
      { time: '01:00 PM', description: 'Lunch at Versailles.' },
      { time: '04:00 PM', description: 'Return to Paris.' },
      { time: '06:00 PM', description: 'Optional: Montmartre and Sacré-Coeur Basilica.' },
      { time: '08:00 PM', description: 'Farewell dinner at a traditional French restaurant.' },
    ],
  },
];

// Main App Component
function App() {
  // State to store chat messages, explicitly typed as an array of Message
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! I am TRIP, your AI travel assistant. How can I help you plan your next adventure?', sender: 'bot' },
  ]);
  // State to store the generated itinerary, explicitly typed as ItineraryDay[] or null
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  // State to store the current message being typed
  const [inputMessage, setInputMessage] = useState<string>('');
  // Ref for auto-scrolling chat window, explicitly typed for HTMLDivElement
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // State for loading indicator
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to scroll to the bottom of the chat window
  const scrollToBottom = () => {
    // Safely access current property using optional chaining
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect to scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to simulate an API call to the backend for itinerary generation, with typed userQuery
  const simulateItineraryGeneration = async (userQuery: string) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // Corrected setTimeout usage

    // For demonstration, if the user asks about Paris, show the mock itinerary
    if (userQuery.toLowerCase().includes('paris trip') || userQuery.toLowerCase().includes('plan a trip to paris')) {
      setMessages(prevMessages => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: 'Great! Here is a suggested itinerary for your trip to Paris:', sender: 'bot' },
      ]);
      setItinerary(mockItinerary);
    } else {
      // Generic response for other queries
      setMessages(prevMessages => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: `I'm still learning to plan trips for all destinations, but I can help you with a trip to Paris! Try asking me "Plan a trip to Paris".`, sender: 'bot' },
      ]);
      setItinerary(null); // Clear itinerary if not Paris
    }
    setIsLoading(false);
  };

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage: Message = { id: messages.length + 1, text: inputMessage, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage(''); // Clear input field

    // Simulate bot response and itinerary generation
    await simulateItineraryGeneration(inputMessage);
  };

  // Function to handle Enter key press in the input field, with typed event
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 font-inter text-gray-800 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[80vh]">

        {/* Chat Window Section */}
        <div className="flex-1 flex flex-col p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-4 pb-2 border-b border-blue-200">TRIP Chat</h2>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {messages.map((msg: Message) => ( // Explicitly type msg
              <div
                key={msg.id}
                className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="max-w-[75%] p-3 rounded-lg shadow-md bg-gray-100 text-gray-800 rounded-bl-none">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    <span>TRIP is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Scroll target */}
          </div>

          {/* Message Input */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center">
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mr-3 text-sm sm:text-base"
              placeholder="Type your travel query..."
              value={inputMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)} // Explicitly type e
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>

        {/* Itinerary Display Section */}
        <div className="flex-1 flex flex-col p-4 md:p-6 bg-gray-50 overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-bold text-center text-purple-700 mb-4 pb-2 border-b border-purple-200">Your Itinerary</h2>
          {itinerary ? (
            <div className="space-y-6">
              {itinerary.map((dayPlan: ItineraryDay) => ( // Explicitly type dayPlan
                <div key={dayPlan.day} className="bg-white rounded-lg shadow-lg p-5 border border-gray-100">
                  <h3 className="text-xl font-semibold text-purple-600 mb-3">
                    Day {dayPlan.day}: {dayPlan.location} - {dayPlan.date}
                  </h3>
                  <ul className="space-y-2">
                    {dayPlan.activities.map((activity: Activity, index: number) => ( // Explicitly type activity and index
                      <li key={index} className="flex items-start text-gray-700">
                        <span className="font-medium text-purple-500 mr-2 min-w-[70px]">{activity.time}:</span>
                        <span>{activity.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
              <svg className="w-16 h-16 mb-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 0 002-2m0 0V5a2 2 0 012-2h2a2 0 012 2v14a2 0 01-2 2h-2a2 0 01-2-2z"></path>
              </svg>
              <p className="text-lg">Your itinerary will appear here after our AI plans your trip!</p>
              <p className="text-sm mt-2">Try asking me "Plan a trip to Paris".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
