// src/components/tools/reverse-text/ReverseText.jsx
'use client';

import { useState } from 'react';
import { RotateCcw, Copy, Check, RefreshCw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function ReverseText() {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [reverseType, setReverseType] = useState('characters'); // characters, words, lines
  const [preserveCase, setPreserveCase] = useState(false);
  const [preserveWhitespace, setPreserveWhitespace] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Reverse text
  const reverseText = () => {
    if (!inputText) {
      setOutputText('');
      return;
    }
    
    let reversed = '';
    
    switch (reverseType) {
      case 'characters':
        // Split into characters, reverse, then join
        if (preserveCase) {
          // Complex case preservation
          const chars = [...inputText];
          const reversedChars = [...chars].reverse();
          
          // Create a new array with the reversed order but original case
          reversed = chars.map((char, index) => {
            const revChar = reversedChars[index];
            if (char.toLowerCase() === char) {
              return revChar.toLowerCase();
            } else {
              return revChar.toUpperCase();
            }
          }).join('');
        } else {
          // Simple character reversal
          reversed = [...inputText].reverse().join('');
        }
        break;
        
      case 'words':
        // Split into words, reverse each word, then join
        const wordSeparator = preserveWhitespace ? /(\s+)/g : /\s+/g;
        const parts = inputText.split(wordSeparator);
        
        if (preserveWhitespace) {
          // Preserve whitespace by reversing only non-whitespace parts
          const reversedParts = parts.map((part, index) => {
            // Even indices are words, odd indices are separators
            if (index % 2 === 0) {
              if (preserveCase) {
                // Complex case preservation for words
                const chars = [...part];
                const reversedChars = [...chars].reverse();
                return chars.map((char, i) => {
                  if (char.toLowerCase() === char) {
                    return reversedChars[i].toLowerCase();
                  } else {
                    return reversedChars[i].toUpperCase();
                  }
                }).join('');
              } else {
                return [...part].reverse().join('');
              }
            }
            return part; // Return separators unchanged
          });
          
          reversed = reversedParts.join('');
        } else {
          // Without preserving whitespace structure
          const words = inputText.split(/\s+/);
          reversed = words.map(word => {
            if (preserveCase) {
              // Complex case preservation for words
              const chars = [...word];
              const reversedChars = [...chars].reverse();
              return chars.map((char, i) => {
                if (char.toLowerCase() === char) {
                  return reversedChars[i].toLowerCase();
                } else {
                  return reversedChars[i].toUpperCase();
                }
              }).join('');
            } else {
              return [...word].reverse().join('');
            }
          }).join(' ');
        }
        break;
        
      case 'lines':
        // Split into lines, reverse each line, then join
        const lines = inputText.split('\n');
        reversed = lines.map(line => {
          if (preserveCase) {
            // Complex case preservation for lines
            const chars = [...line];
            const reversedChars = [...chars].reverse();
            return chars.map((char, i) => {
              if (char.toLowerCase() === char) {
                return reversedChars[i].toLowerCase();
              } else {
                return reversedChars[i].toUpperCase();
              }
            }).join('');
          } else {
            return [...line].reverse().join('');
          }
        }).join('\n');
        break;
        
      case 'reverse-order':
        // Reverse the order of words or lines
        if (reverseType === 'words') {
          const words = inputText.split(/\s+/);
          reversed = words.reverse().join(' ');
        } else {
          const lines = inputText.split('\n');
          reversed = lines.reverse().join('\n');
        }
        break;
        
      default:
        reversed = [...inputText].reverse().join('');
    }
    
    setOutputText(reversed);
  };
  
  // Copy output to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Clear all
  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };
  
  // Load sample
  const loadSample = () => {
    setInputText("The quick brown fox jumps over the lazy dog.\nABCDEfghIJKLmnOP 12345 QRSTuvWXYZ.\nThis is a multi-line text sample.");
  };
  
  return (
    <div className="space-y-6">
      <Card
        title={t('tools.reverse-text.name')}
        description={t('tools.reverse-text.description')}
        icon={RotateCcw}
      >
        <div className="space-y-4">
          {/* Options */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('tools.reverse-text.reverseType')}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    reverseType === 'characters'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setReverseType('characters')}
                >
                  {t('tools.reverse-text.reverseCharacters')}
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    reverseType === 'words'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setReverseType('words')}
                >
                  {t('tools.reverse-text.reverseWords')}
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    reverseType === 'lines'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setReverseType('lines')}
                >
                  {t('tools.reverse-text.reverseLines')}
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    reverseType === 'reverse-order'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setReverseType('reverse-order')}
                >
                  {t('tools.reverse-text.reverseOrder')}
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <input
                  id="preserve-case"
                  type="checkbox"
                  checked={preserveCase}
                  onChange={(e) => setPreserveCase(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="preserve-case" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {t('tools.reverse-text.preserveCase')}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="preserve-whitespace"
                  type="checkbox"
                  checked={preserveWhitespace}
                  onChange={(e) => setPreserveWhitespace(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  disabled={reverseType !== 'words'}
                />
                <label htmlFor="preserve-whitespace" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {t('tools.reverse-text.preserveWhitespace')}
                </label>
              </div>
            </div>
          </div>
          
          {/* Input */}
          <div>
            <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.reverse-text.inputText')}
            </label>
            <textarea
              id="input-text"
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('tools.reverse-text.placeholder')}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
            />
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              icon={RotateCcw}
              onClick={reverseText}
            >
              {t('tools.reverse-text.reverseText')}
            </Button>
            
            <Button
              variant="secondary"
              onClick={loadSample}
            >
              {t('tools.reverse-text.loadSample')}
            </Button>
            
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={clearAll}
            >
              {t('tools.reverse-text.clear')}
            </Button>
          </div>
          
          {/* Output */}
          {outputText && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('tools.reverse-text.result')}
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  icon={copied ? Check : Copy}
                  onClick={copyToClipboard}
                >
                  {copied ? t('tools.reverse-text.copied') : t('tools.reverse-text.copy')}
                </Button>
              </div>
              <textarea
                rows={5}
                value={outputText}
                readOnly
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm"
              />
            </div>
          )}
        </div>
      </Card>
      
      {/* Info Card */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.reverse-text.aboutTitle')}</h3>
          <p>{t('tools.reverse-text.aboutDescription')}</p>
          
          <h4>{t('tools.reverse-text.featuresTitle')}</h4>
          <ul>
            <li><strong>{t('tools.reverse-text.reverseTypeTitle')}:</strong> {t('tools.reverse-text.reverseTypeDescription')}</li>
            <li><strong>{t('tools.reverse-text.preserveCaseTitle')}:</strong> {t('tools.reverse-text.preserveCaseDescription')}</li>
            <li><strong>{t('tools.reverse-text.preserveWhitespaceTitle')}:</strong> {t('tools.reverse-text.preserveWhitespaceDescription')}</li>
          </ul>
          
          <h4>{t('tools.reverse-text.useCasesTitle')}</h4>
          <ul>
            <li>{t('tools.reverse-text.useCase1')}</li>
            <li>{t('tools.reverse-text.useCase2')}</li>
            <li>{t('tools.reverse-text.useCase3')}</li>
            <li>{t('tools.reverse-text.useCase4')}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}