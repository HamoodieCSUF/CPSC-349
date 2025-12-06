import React, { useEffect, useRef } from 'react';

const MessageLog = ({ messages }) => {
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  const getMessageStyle = (message) => {
    if (message.includes('You')) {
      return 'bg-green-900 bg-opacity-50 border-l-4 border-green-500';
    } else if (message.includes('AI')) {
      return 'bg-blue-900 bg-opacity-50 border-l-4 border-blue-500';
    } else if (message.includes('Book')) {
      return 'bg-yellow-900 bg-opacity-50 border-l-4 border-yellow-500';
    } else if (message.includes('Game')) {
      return 'bg-purple-900 bg-opacity-50 border-l-4 border-purple-500';
    }
    return 'bg-gray-700 bg-opacity-50';
  };

  return (
    <div className="bg-gray-800 bg-opacity-90 rounded-xl p-4 shadow-lg h-full flex flex-col">
      <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2 flex-shrink-0">
        Game Log
      </h3>
      
      <div 
        ref={logRef}
        className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Game events will appear here...</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded text-sm text-white ${getMessageStyle(message)} animate-fadeIn`}
            >
              {message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageLog;
