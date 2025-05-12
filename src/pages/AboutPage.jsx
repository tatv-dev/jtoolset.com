// src/pages/AboutPage.jsx
import { useState } from 'react';
import { Code, Coffee, Terminal, Zap, Cpu, Laugh } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Danh sách các câu nói ngộ nghĩnh về lập trình
const DEV_JOKES = [
  "99 little bugs in the code, 99 bugs in the code. Take one down, patch it around, 127 little bugs in the code.",
  "I'm not a morning person, I'm a coffee person.",
  "I do not always debug my code, but when I do, I prefer to do it at 2 AM.",
  "Sometimes I believe the universe is purely mechanical. Then I remember my own code.",
  "There are 10 types of people in the world: Those who understand binary, and those who don't.",
  "I'm sorry, the programmer you are trying to reach is currently in another branch.",
  "Debugging is like being a detective in a crime movie where you're also the murderer.",
  "My code NEVER has bugs. It just develops random unexpected features.",
  "I use Stack Overflow, therefore I am a programmer.",
  "When your hammer is C++, everything begins to look like a thumb."
];

export default function AboutPage() {
  const { t } = useTranslation();
  const [currentJoke, setCurrentJoke] = useState(null);
  const [hoverStates, setHoverStates] = useState({
    coffee: false,
    terminal: false,
    code: false,
    cpu: false
  });

  const handleHover = (icon) => {
    setHoverStates(prev => ({
      ...prev,
      [icon]: true
    }));
  };

  const handleHoverExit = (icon) => {
    setHoverStates(prev => ({
      ...prev,
      [icon]: false
    }));
  };

  const showRandomJoke = () => {
    const joke = DEV_JOKES[Math.floor(Math.random() * DEV_JOKES.length)];
    setCurrentJoke(joke);
    setTimeout(() => setCurrentJoke(null), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {t('pages.about.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('pages.about.description')}
          </p>
        </div>

        {/* Animated Icons Section */}
        <div className="flex justify-center space-x-8 mb-8">
          {[
            { 
              icon: Coffee, 
              key: 'coffee', 
              animationClass: "hover:rotate-12 hover:scale-110 transition-transform duration-300 hover:text-orange-500" 
            },
            { 
              icon: Terminal, 
              key: 'terminal', 
              animationClass: "hover:rotate-[-12deg] hover:scale-110 transition-transform duration-300 hover:text-green-500" 
            },
            { 
              icon: Code, 
              key: 'code', 
              animationClass: "hover:rotate-12 hover:scale-110 transition-transform duration-300 hover:text-blue-500" 
            },
            { 
              icon: Cpu, 
              key: 'cpu', 
              animationClass: "hover:rotate-[-12deg] hover:scale-110 transition-transform duration-300 hover:text-purple-500" 
            }
          ].map(({ icon: Icon, key, animationClass }) => (
            <div 
              key={key}
              className={`cursor-pointer ${animationClass}`}
              onMouseEnter={() => handleHover(key)}
              onMouseLeave={() => handleHoverExit(key)}
              onClick={showRandomJoke}
            >
              <Icon 
                size={48} 
                className="text-gray-600 dark:text-gray-400" 
              />
              {hoverStates[key] && (
                <div className="absolute transform -translate-x-1/2 -translate-y-full bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 animate-bounce">
                  Click for a dev joke!
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Developer Joke Display */}
        {currentJoke && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in flex items-center">
            <Laugh className="mr-3" />
            <p className="text-sm">{currentJoke}</p>
          </div>
        )}

        {/* Team and Mission */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('pages.about.mission.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('pages.about.mission.description')}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('pages.about.team.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('pages.about.team.description')}
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8">
          <a 
            href="https://github.com/tatv-dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 
            border border-transparent text-base font-medium rounded-md 
            text-white bg-primary-600 hover:bg-primary-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-primary-500 transition-colors duration-300 
            hover:scale-105 transform"
          >
            {t('pages.about.cta')}
          </a>
        </div>
      </div>
    </div>
  );
}