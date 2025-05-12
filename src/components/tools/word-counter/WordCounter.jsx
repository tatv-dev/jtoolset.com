// src/components/tools/word-counter/WordCounter.jsx
'use client';

import { useState, useEffect } from 'react';
import { FileText, Copy, Check, RefreshCw, BarChart } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function WordCounter() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0
  });
  const [wordFrequency, setWordFrequency] = useState({});
  const [showWordFrequency, setShowWordFrequency] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Update stats when text changes
  useEffect(() => {
    calculateStats(text);
  }, [text]);
  
  // Calculate text statistics
  const calculateStats = (text) => {
    // No text case
    if (!text) {
      setStats({
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0
      });
      setWordFrequency({});
      return;
    }
    
    // Character count
    const characters = text.length;
    
    // Character count without spaces
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    // Word count
    const words = text.trim()
      ? text.trim().split(/\s+/).filter(word => word.match(/[a-zA-Z0-9]/)).length
      : 0;
    
    // Sentence count (basic approximation)
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
    
    // Paragraph count
    const paragraphs = text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0).length;
    
    // Line count
    const lines = text.split('\n').length;
    
    // Word frequency
    const wordList = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.match(/[a-zA-Z0-9]/));
      
    const frequency = {};
    
    wordList.forEach(word => {
      if (word in frequency) {
        frequency[word]++;
      } else {
        frequency[word] = 1;
      }
    });
    
    // Sort by frequency
    const sortedFrequency = Object.fromEntries(
      Object.entries(frequency).sort((a, b) => b[1] - a[1])
    );
    
    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines
    });
    
    setWordFrequency(sortedFrequency);
  };
  
  // Copy stats to clipboard
  const copyStats = () => {
    const statsText = `
${t('tools.word-counter.characters')}: ${stats.characters}
${t('tools.word-counter.charactersNoSpaces')}: ${stats.charactersNoSpaces}
${t('tools.word-counter.words')}: ${stats.words}
${t('tools.word-counter.sentences')}: ${stats.sentences}
${t('tools.word-counter.paragraphs')}: ${stats.paragraphs}
${t('tools.word-counter.lines')}: ${stats.lines}
    `.trim();
    
    navigator.clipboard.writeText(statsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Clear text
  const clearText = () => {
    setText('');
  };
  
  // Load sample
  const loadSample = () => {
    setText(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.

Sed dui lorem, adipiscing in adipiscing et, interdum nec metus. Mauris ultricies, justo eu convallis placerat, felis enim ornare nisi, vitae mattis nulla ante id dui.

Ut porttitor volutpat urna non sodales. Vestibulum imperdiet nunc eget neque posuere, at hendrerit mauris rutrum. Quisque rhoncus, erat nec faucibus gravida, risus enim hendrerit orci, sed aliquet lacus orci ut diam.`);
  };
  
  return (
    <div className="space-y-6">
      <Card
        title={t('tools.word-counter.name')}
        description={t('tools.word-counter.description')}
        icon={FileText}
      >
        <div className="space-y-4">
          {/* Text Input */}
          <div>
            <label htmlFor="word-counter-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.word-counter.enterText')}
            </label>
            <textarea
              id="word-counter-input"
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('tools.word-counter.placeholder')}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={loadSample}
            >
              {t('tools.word-counter.loadSample')}
            </Button>
            
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={clearText}
            >
              {t('tools.word-counter.clear')}
            </Button>
            
            <Button
              variant="outline"
              icon={BarChart}
              onClick={() => setShowWordFrequency(!showWordFrequency)}
            >
              {showWordFrequency 
                ? t('tools.word-counter.hideWordFrequency') 
                : t('tools.word-counter.showWordFrequency')}
            </Button>
          </div>
          
          {/* Stats */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {t('tools.word-counter.textStatistics')}
              </h3>
              <Button
                variant="outline"
                size="sm"
                icon={copied ? Check : Copy}
                onClick={copyStats}
              >
                {copied ? t('tools.word-counter.copied') : t('tools.word-counter.copyStats')}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatItem 
                label={t('tools.word-counter.characters')} 
                value={stats.characters} 
              />
              <StatItem 
                label={t('tools.word-counter.charactersNoSpaces')} 
                value={stats.charactersNoSpaces} 
              />
              <StatItem 
                label={t('tools.word-counter.words')} 
                value={stats.words} 
              />
              <StatItem 
                label={t('tools.word-counter.sentences')} 
                value={stats.sentences} 
              />
              <StatItem 
                label={t('tools.word-counter.paragraphs')} 
                value={stats.paragraphs} 
              />
              <StatItem 
                label={t('tools.word-counter.lines')} 
                value={stats.lines} 
              />
              <StatItem 
                label={t('tools.word-counter.readingTime')} 
                value={`${Math.ceil(stats.words / 225)} ${t('tools.word-counter.minutes')}`} 
              />
              <StatItem 
                label={t('tools.word-counter.speakingTime')} 
                value={`${Math.ceil(stats.words / 150)} ${t('tools.word-counter.minutes')}`} 
              />
            </div>
          </div>
          
          {/* Word Frequency */}
          {showWordFrequency && Object.keys(wordFrequency).length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                {t('tools.word-counter.wordFrequency')}
              </h3>
              
              <div className="max-h-60 overflow-y-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('tools.word-counter.word')}
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('tools.word-counter.frequency')}
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('tools.word-counter.percentage')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {Object.entries(wordFrequency).slice(0, 20).map(([word, frequency]) => (
                      <tr key={word} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="py-2 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                          {word}
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-500 dark:text-gray-400">
                          {frequency}
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-500 dark:text-gray-400">
                          {stats.words ? ((frequency / stats.words) * 100).toFixed(1) + '%' : '0%'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Info Card */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.word-counter.aboutTitle')}</h3>
          <p>{t('tools.word-counter.aboutDescription')}</p>
          
          <h4>{t('tools.word-counter.featuresTitle')}</h4>
          <ul>
            <li><strong>{t('tools.word-counter.feature1.title')}:</strong> {t('tools.word-counter.feature1.description')}</li>
            <li><strong>{t('tools.word-counter.feature2.title')}:</strong> {t('tools.word-counter.feature2.description')}</li>
            <li><strong>{t('tools.word-counter.feature3.title')}:</strong> {t('tools.word-counter.feature3.description')}</li>
            <li><strong>{t('tools.word-counter.feature4.title')}:</strong> {t('tools.word-counter.feature4.description')}</li>
          </ul>
          
          <h4>{t('tools.word-counter.useCasesTitle')}</h4>
          <ul>
            <li>{t('tools.word-counter.useCase1')}</li>
            <li>{t('tools.word-counter.useCase2')}</li>
            <li>{t('tools.word-counter.useCase3')}</li>
            <li>{t('tools.word-counter.useCase4')}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

// Stats Item Component
function StatItem({ label, value }) {
  return (
    <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </div>
      <div className="text-xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}