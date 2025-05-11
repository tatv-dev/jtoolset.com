// src/components/tools/lorem-ipsum/LoremIpsum.jsx
'use client';

import { useState } from 'react';
import { FileText, Copy, Check, RefreshCw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function LoremIpsum() {
  const { t } = useTranslation();
  const [length, setLength] = useState(50);
  const [unit, setUnit] = useState('words'); // words, sentences, paragraphs, characters
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [includeHTML, setIncludeHTML] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState('');
  
  // Lorem ipsum text base
  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et',
    'dolore', 'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam',
    'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip',
    'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor',
    'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore',
    'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
    'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt',
    'mollit', 'anim', 'id', 'est', 'laborum', 'curabitur', 'pretium', 'tincidunt',
    'lacus', 'at', 'velit', 'vivamus', 'vel', 'nulla', 'eget', 'eros',
    'elementum', 'pellentesque', 'quisque', 'porta', 'volutpat', 'erat', 'quisque', 'erat',
    'eros', 'viverra', 'eget', 'congue', 'eget', 'semper', 'rutrum', 'nulla',
    'nunc', 'purus', 'phasellus', 'in', 'felis', 'donec', 'semper', 'sapien',
    'a', 'libero', 'nam', 'dui', 'proin', 'leo', 'odio', 'porttitor',
    'id', 'consequat', 'in', 'consequat', 'ut', 'nulla', 'sed', 'accumsan',
    'felis', 'ut', 'at', 'dolor', 'quis', 'odio', 'consequat', 'varius',
    'integer', 'ac', 'leo', 'pellentesque', 'ultrices', 'mattis', 'odio', 'donec',
    'vitae', 'nisi', 'nam', 'ultrices', 'libero', 'non', 'mattis', 'pulvinar',
    'nulla', 'pede', 'ullamcorper', 'augue', 'a', 'suscipit', 'nulla', 'elit',
    'ac', 'nulla', 'sed', 'vel', 'enim', 'sit', 'amet', 'nunc',
    'viverra', 'dapibus', 'nulla', 'suscipit', 'ligula', 'in', 'lacus', 'curabitur',
    'at', 'ipsum', 'ac', 'tellus', 'semper', 'interdum', 'mauris', 'ullamcorper',
    'purus', 'sit', 'amet', 'nulla', 'quisque', 'arcu', 'libero', 'rutrum',
    'ac', 'lobortis', 'vel', 'dapibus', 'at', 'diam', 'nam', 'tristique'
  ];
  
  // Generate random words
  const getRandomWords = (count) => {
    const words = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * loremWords.length);
      words.push(loremWords[randomIndex]);
    }
    return words;
  };
  
  // Capitalize first letter
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  // Generate sentence
  const generateSentence = (wordCount = null) => {
    const words = wordCount ? wordCount : Math.floor(Math.random() * 10) + 5;
    const sentence = getRandomWords(words);
    sentence[0] = capitalize(sentence[0]);
    return sentence.join(' ') + '.';
  };
  
  // Generate paragraph
  const generateParagraph = (sentenceCount = null) => {
    const sentences = sentenceCount ? sentenceCount : Math.floor(Math.random() * 4) + 3;
    const paragraph = [];
    for (let i = 0; i < sentences; i++) {
      paragraph.push(generateSentence());
    }
    return paragraph.join(' ');
  };
  
  // Generate text based on unit and length
  const generateText = () => {
    let text = '';
    
    switch (unit) {
      case 'words':
        const words = getRandomWords(length);
        if (startWithLorem && words.length >= 2) {
          words[0] = 'Lorem';
          words[1] = 'ipsum';
        }
        text = words.join(' ');
        break;
        
      case 'sentences':
        const sentences = [];
        for (let i = 0; i < length; i++) {
          if (i === 0 && startWithLorem) {
            sentences.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
          } else {
            sentences.push(generateSentence());
          }
        }
        text = sentences.join(' ');
        break;
        
      case 'paragraphs':
        const paragraphs = [];
        for (let i = 0; i < length; i++) {
          if (i === 0 && startWithLorem) {
            paragraphs.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');
          } else {
            paragraphs.push(generateParagraph());
          }
        }
        text = paragraphs.join('\n\n');
        break;
        
      case 'characters':
        // Generate enough words to meet character count
        const wordCount = Math.ceil(length / 5); // Average word length is ~5 chars
        const tempWords = getRandomWords(wordCount);
        let tempText = tempWords.join(' ');
        
        // Add "Lorem ipsum" at the start if needed
        if (startWithLorem) {
          tempText = 'Lorem ipsum ' + tempText;
        }
        
        // Trim to exact character count
        text = tempText.substring(0, length);
        break;
    }
    
    // Add HTML tags if requested
    if (includeHTML && unit === 'paragraphs') {
      const paragraphs = text.split('\n\n');
      text = paragraphs.map(p => `<p>${p}</p>`).join('\n\n');
    }
    
    setGenerated(text);
  };
  
  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Generate on mount
  useState(() => {
    generateText();
  }, []);
  
  return (
    <div className="space-y-6">
      <Card
        title={t('tools.lorem-ipsum.name')}
        description={t('tools.lorem-ipsum.description')}
        icon={FileText}
      >
        <div className="space-y-4">
          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Length and Unit */}
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('tools.lorem-ipsum.length')}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  id="length"
                  min="1"
                  max={unit === 'characters' ? 5000 : 100}
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value) || 1)}
                  className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="min-w-[150px] px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <option value="words">{t('tools.lorem-ipsum.words')}</option>
                  <option value="sentences">{t('tools.lorem-ipsum.sentences')}</option>
                  <option value="paragraphs">{t('tools.lorem-ipsum.paragraphs')}</option>
                  <option value="characters">{t('tools.lorem-ipsum.characters')}</option>
                </select>
              </div>
            </div>
            
            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="start-with-lorem"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="start-with-lorem" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {t('tools.lorem-ipsum.startWithLorem')}
                </label>
              </div>
              
              {unit === 'paragraphs' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="include-html"
                    checked={includeHTML}
                    onChange={(e) => setIncludeHTML(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="include-html" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('tools.lorem-ipsum.includeHTML')}
                  </label>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={generateText}
              icon={RefreshCw}
            >
              {t('tools.lorem-ipsum.generate')}
            </Button>
            
            <Button
              variant="secondary"
              icon={copied ? Check : Copy}
              onClick={copyToClipboard}
              disabled={!generated}
            >
              {copied ? t('tools.lorem-ipsum.copied') : t('tools.lorem-ipsum.copy')}
            </Button>
          </div>
          
          {/* Generated Text */}
          {generated && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('tools.lorem-ipsum.generatedText')}
              </label>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                <pre className="whitespace-pre-wrap font-sans text-sm">{generated}</pre>
              </div>
              
              {/* Statistics */}
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex flex-wrap gap-4">
                <span>{t('tools.lorem-ipsum.wordCount')}: {generated.split(/\s+/).length}</span>
                <span>{t('tools.lorem-ipsum.characterCount')}: {generated.length}</span>
                <span>{t('tools.lorem-ipsum.paragraphCount')}: {generated.split(/\n\n+/).length}</span>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Info */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.lorem-ipsum.aboutTitle')}</h3>
          <p>{t('tools.lorem-ipsum.aboutDescription')}</p>
          <ul>
            <li>{t('tools.lorem-ipsum.feature1')}</li>
            <li>{t('tools.lorem-ipsum.feature2')}</li>
            <li>{t('tools.lorem-ipsum.feature3')}</li>
            <li>{t('tools.lorem-ipsum.feature4')}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}