// src/components/tools/base64/Base64.jsx
'use client';

import { useState } from 'react';
import { Code, Copy, Check, RefreshCw, Upload } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function Base64() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [inputType, setInputType] = useState('text'); // 'text' or 'file'
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  // Encode to Base64
  const encodeBase64 = (data) => {
    try {
      if (inputType === 'text') {
        // Encode text to Base64
        const encoded = btoa(unescape(encodeURIComponent(data)));
        setOutput(encoded);
      } else {
        // File is already processed as base64
        setOutput(data);
      }
      setError('');
    } catch (err) {
      setError('Error encoding to Base64: ' + err.message);
      setOutput('');
    }
  };
  
  // Decode from Base64
  const decodeBase64 = (data) => {
    try {
      const decoded = decodeURIComponent(escape(atob(data)));
      setOutput(decoded);
      setError('');
    } catch (err) {
      setError('Error decoding from Base64: Invalid Base64 string');
      setOutput('');
    }
  };
  
  // Process input based on mode
  const processInput = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    
    if (mode === 'encode') {
      encodeBase64(input);
    } else {
      decodeBase64(input);
    }
  };
  
  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1]; // Remove data:type;base64, prefix
      setInput(base64);
      if (mode === 'encode') {
        setOutput(base64);
      }
    };
    reader.readAsDataURL(file);
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
    setError('');
  };
  
  // Swap input and output
  const swapValues = () => {
    setInput(output);
    setOutput(input);
  };
  
  // Load sample
  const loadSample = () => {
    if (mode === 'encode') {
      setInput('Hello, World! This is a test string for Base64 encoding.');
    } else {
      setInput('SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgdGVzdCBzdHJpbmcgZm9yIEJhc2U2NCBlbmNvZGluZy4=');
    }
  };

  return (
    <div className="space-y-6">
      <Card
        title={t('tools.base64.name')}
        description={t('tools.base64.description')}
        icon={Code}
      >
        <div className="space-y-4">
          {/* Mode Selection */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex rounded-md shadow-sm">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  mode === 'encode'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                }`}
                onClick={() => setMode('encode')}
              >
                {t('tools.base64.encode')}
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  mode === 'decode'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                }`}
                onClick={() => setMode('decode')}
              >
                {t('tools.base64.decode')}
              </button>
            </div>
            
            {mode === 'encode' && (
              <div className="flex rounded-md shadow-sm">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    inputType === 'text'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => setInputType('text')}
                >
                  {t('tools.base64.text')}
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    inputType === 'file'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => setInputType('file')}
                >
                  {t('tools.base64.file')}
                </button>
              </div>
            )}
          </div>
          
          {/* Input */}
          <div>
            <label htmlFor="base64-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.base64.input')}
            </label>
            
            {inputType === 'file' && mode === 'encode' ? (
              <div className="flex items-center justify-center w-full">
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">{t('tools.base64.clickToUpload')}</span>
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            ) : (
              <textarea
                id="base64-input"
                rows={6}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' 
                  ? t('tools.base64.encodePlaceholder')
                  : t('tools.base64.decodePlaceholder')
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
              />
            )}
          </div>
          
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={processInput}
              icon={Code}
            >
              {mode === 'encode' ? t('tools.base64.encode') : t('tools.base64.decode')}
            </Button>
            
            <Button
              variant="secondary"
              onClick={swapValues}
              icon={RefreshCw}
              disabled={inputType === 'file'}
            >
              {t('tools.base64.swap')}
            </Button>
            
            <Button
              variant="outline"
              onClick={loadSample}
              disabled={inputType === 'file'}
            >
              {t('tools.base64.loadSample')}
            </Button>
            
            <Button
              variant="outline"
              onClick={clearAll}
            >
              {t('tools.base64.clear')}
            </Button>
          </div>
          
          {/* Output */}
          {output && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('tools.base64.output')}
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  icon={copied ? Check : Copy}
                  onClick={handleCopy}
                >
                  {copied ? t('tools.base64.copied') : t('tools.base64.copy')}
                </Button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-mono break-all whitespace-pre-wrap">{output}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Info */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.base64.aboutTitle')}</h3>
          <p>{t('tools.base64.aboutDescription')}</p>
          <ul>
            <li>{t('tools.base64.useCase1')}</li>
            <li>{t('tools.base64.useCase2')}</li>
            <li>{t('tools.base64.useCase3')}</li>
            <li>{t('tools.base64.useCase4')}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}