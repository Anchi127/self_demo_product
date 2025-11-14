
import React, { useState } from 'react';
import AuthFormV1 from './components/AuthFormV1';
import AuthFormV2 from './components/AuthFormV2';

type AuthVersion = 'v1' | 'v2';

const App: React.FC = () => {
  const [version, setVersion] = useState<AuthVersion>('v1');

  const VersionSwitcher: React.FC = () => (
    <div className="fixed top-4 right-4 z-50 bg-white/20 backdrop-blur-sm p-1 rounded-full flex items-center space-x-1 shadow-lg border border-white/20">
      <button
        onClick={() => setVersion('v1')}
        className={`px-4 py-2 text-sm rounded-full transition-colors duration-300 ${
          version === 'v1' ? 'bg-white text-gray-900 shadow-md' : 'text-white hover:bg-white/10'
        }`}
      >
        Version 1
      </button>
      <button
        onClick={() => setVersion('v2')}
        className={`px-4 py-2 text-sm rounded-full transition-colors duration-300 ${
          version === 'v2' ? 'bg-white text-gray-900 shadow-md' : 'text-white hover:bg-white/10'
        }`}
      >
        Version 2
      </button>
    </div>
  );

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-gray-900 text-white font-sans p-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
      <VersionSwitcher />
      {version === 'v1' ? <AuthFormV1 /> : <AuthFormV2 />}
    </main>
  );
};

export default App;
