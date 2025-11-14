
import React from 'react';

interface SocialButtonProps {
  provider: string;
  icon: React.ReactNode;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ provider, icon }) => {
  return (
    <button className="w-full flex items-center justify-center py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
      <span className="h-5 w-5 mr-3">{icon}</span>
      Continue with {provider}
    </button>
  );
};
