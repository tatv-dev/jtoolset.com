// src/components/tools/json-formatter/JsonFormatter.jsx
'use client';

import { useState } from 'react';
import { FileJson, Copy, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function JsonFormatter() {
  const { t } = useTranslation();
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  
  // Format JSON
  const formatJson = () => {
    if (!inputJson.trim()) {
      setError('Please enter JSON data');
      setOutputJson('');
      return;
    }

    try {
      let parsed = JSON.parse(inputJson);
      
      // Sort keys if enabled
      if (sortKeys) {
        parsed = sortObjectKeys(parsed);
      }
      
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutputJson(formatted);
      setError('');
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      setOutputJson('');
    }
  };
  
  // Minify JSON
  const minifyJson = () => {
    if (!inputJson.trim()) {
      setError('Please enter JSON data');
      setOutputJson('');
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
      setError('');
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      setOutputJson('');
    }
  };
  
  // Sort object keys recursively
  const sortObjectKeys = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
          result[key] = sortObjectKeys(obj[key]);
          return result;
        }, {});
    }
    return obj;
  };
  
  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(outputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Clear all
  const clearAll = () => {
    setInputJson('');
    setOutputJson('');
    setError('');
  };
  
  // Load sample JSON
  const loadSample = () => {
    const sample = {
      "name": "John Doe",
      "age": 30,
      "email": "john@example.com",
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "country": "USA"
      },
      "hobbies": ["reading", "swimming", "coding"],
      "isActive": true
    };
    setInputJson(JSON.stringify(sample, null, 2));
  };

  return (
    <div className="space-y-6">
      <Card
        title={t('tools.json-formatter.name')}
        description={t('tools.json-formatter.description')}
        icon={FileJson}
      >
        <div className="space-y-4">
          {/* Options */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="indent-size" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('tools.json-formatter.indentSize')}:
              </label>
              <select
                id="indent-size"
                value={indentSize}
                onChange={(e) => setIndentSize(parseInt(e.target.value))}
                className="rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value={2}>2 {t('tools.json-formatter.spaces')}</option>
                <option value={4}>4 {t('tools.json-formatter.spaces')}</option>
                <option value={8}>Tab</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sort-keys"
                checked={sortKeys}
                onChange={(e) => setSortKeys(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="sort-keys" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {t('tools.json-formatter.sortKeys')}
              </label>
            </div>
          </div>
          
          {/* Input */}
          <div>
            <label htmlFor="json-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.json-formatter.input')}
            </label>
            <textarea
              id="json-input"
              rows={8}
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder={t('tools.json-formatter.inputPlaceholder')}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
            />
          </div>
          
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-red-400 text-sm flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={formatJson}
              icon={FileJson}
            >
              {t('tools.json-formatter.format')}
            </Button>
            
            <Button
              variant="secondary"
              onClick={minifyJson}
            >
              {t('tools.json-formatter.minify')}
            </Button>
            
            <Button
              variant="outline"
              onClick={loadSample}
            >
              {t('tools.json-formatter.loadSample')}
            </Button>
            
            <Button
              variant="outline"
              onClick={clearAll}
              icon={RefreshCw}
            >
              {t('tools.json-formatter.clear')}
            </Button>
          </div>
          
          {/* Output */}
          {outputJson && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('tools.json-formatter.output')}
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  icon={copied ? Check : Copy}
                  onClick={handleCopy}
                >
                  {copied ? t('tools.json-formatter.copied') : t('tools.json-formatter.copy')}
                </Button>
              </div>
              <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <code className="text-sm font-mono">{outputJson}</code>
              </pre>
            </div>
          )}
        </div>
      </Card>
      
      {/* Features */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.json-formatter.featuresTitle')}</h3>
          <ul>
            <li>{t('tools.json-formatter.feature1')}</li>
            <li>{t('tools.json-formatter.feature2')}</li>
            <li>{t('tools.json-formatter.feature3')}</li>
            <li>{t('tools.json-formatter.feature4')}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}