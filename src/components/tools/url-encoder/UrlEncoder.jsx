// src/components/tools/url-encoder/UrlEncoder.jsx
'use client';

import { useState } from 'react';
import { Link2, Copy, Check, RefreshCw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function UrlEncoder() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [copied, setCopied] = useState(false);
  const [encodeComponent, setEncodeComponent] = useState(false);
  
  // Encode URL
  const encodeUrl = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    
    try {
      const encoded = encodeComponent ? encodeURIComponent(input) : encodeURI(input);
      setOutput(encoded);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
  };
  
  // Decode URL
  const decodeUrl = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    
    try {
      const decoded = encodeComponent ? decodeURIComponent(input) : decodeURI(input);
      setOutput(decoded);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
  };
  
  // Process input based on mode
  const processInput = () => {
    if (mode === 'encode') {
      encodeUrl();
    } else {
      decodeUrl();
    }
  };
  
  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Clear all
  const clearAll = () => {
    setInput('');
    setOutput('');
  };
  
  // Swap input and output
  const swapValues = () => {
    setInput(output);
    setOutput(input);
  };
  
  // Load sample
  const loadSample = () => {
    if (mode === 'encode') {
      setInput('https://example.com/search?q=hello world&lang=en#results');
    } else {
      setInput('https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26lang%3Den%23results');
    }
  };

  return (
    <div className="space-y-6">
      <Card
        title={t('tools.url-encoder.name')}
        description={t('tools.url-encoder.description')}
        icon={Link2}
      >
        <div className="space-y-4">
          {/* Mode Selection */}
          <div className="flex items-center space-x-4">
            <div className="flex rounded-md shadow-sm">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  mode === 'encode'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                }`}
                onClick={() => setMode('encode')}
              >
                {t('tools.url-encoder.encode')}
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  mode === 'decode'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                }`}
                onClick={() => setMode('decode')}
              >
                {t('tools.url-encoder.decode')}
              </button>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="encode-component"
                checked={encodeComponent}
                onChange={(e) => setEncodeComponent(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="encode-component" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {t('tools.url-encoder.encodeComponent')}
              </label>
            </div>
          </div>
          
          {/* Input */}
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.url-encoder.input')}
            </label>
            <textarea
              id="url-input"
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' 
                ? t('tools.url-encoder.encodePlaceholder')
                : t('tools.url-encoder.decodePlaceholder')
              }
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
            />
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={processInput}
              icon={Link2}
            >
              {mode === 'encode' ? t('tools.url-encoder.encode') : t('tools.url-encoder.decode')}
            </Button>
            
            <Button
              variant="secondary"
              onClick={swapValues}
              icon={RefreshCw}
            >
              {t('tools.url-encoder.swap')}
            </Button>
            
            <Button
              variant="outline"
              onClick={loadSample}
            >
              {t('tools.url-encoder.loadSample')}
            </Button>
            
            <Button
              variant="outline"
              onClick={clearAll}
            >
              {t('tools.url-encoder.clear')}
            </Button>
          </div>
          
          {/* Output */}
          {output && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('tools.url-encoder.output')}
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  icon={copied ? Check : Copy}
                  onClick={handleCopy}
                >
                  {copied ? t('tools.url-encoder.copied') : t('tools.url-encoder.copy')}
                </Button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-mono break-all">{output}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Info */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.url-encoder.infoTitle')}</h3>
          <p>{t('tools.url-encoder.infoDescription')}</p>
          <ul>
            <li><strong>encodeURI():</strong> {t('tools.url-encoder.encodeUriInfo')}</li>
            <li><strong>encodeURIComponent():</strong> {t('tools.url-encoder.encodeUriComponentInfo')}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}