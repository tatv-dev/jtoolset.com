// src/components/tools/remove-duplicate-lines/RemoveDuplicateLines.jsx
'use client';

import { useState } from 'react';
import { FileText, Copy, Check, RefreshCw, FilterX, ArrowUp, ArrowDown } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function RemoveDuplicateLines() {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [ignoreEmptyLines, setIgnoreEmptyLines] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [sortLines, setSortLines] = useState(false);
  const [sortDirection, setSortDirection] = useState('asc');
  const [stats, setStats] = useState({
    inputLines: 0,
    outputLines: 0,
    duplicatesRemoved: 0
  });
  const [copied, setCopied] = useState(false);
  
  // Process text and remove duplicates
  const processDuplicates = () => {
    if (!inputText) {
      setOutputText('');
      setStats({
        inputLines: 0,
        outputLines: 0,
        duplicatesRemoved: 0
      });
      return;
    }
    
    // Split input into lines
    const lines = inputText.split('\n');
    
    // Track input stats
    const inputLineCount = lines.length;
    
    // Track unique lines
    const uniqueLines = new Set();
    const resultLines = [];
    
    // Process each line
    lines.forEach(line => {
      // Process the line based on settings
      let processedLine = line;
      
      if (trimWhitespace) {
        processedLine = processedLine.trim();
      }
      
      if (!caseSensitive) {
        processedLine = processedLine.toLowerCase();
      }
      
      // Skip empty lines if setting is enabled
      if (ignoreEmptyLines && processedLine === '') {
        return;
      }
      
      // Check if line is unique
      if (!uniqueLines.has(processedLine)) {
        uniqueLines.add(processedLine);
        // Add the original line to result, not the processed one
        resultLines.push(line);
      }
    });
    
    // Sort lines if enabled
    if (sortLines) {
      resultLines.sort((a, b) => {
        if (sortDirection === 'desc') {
          return b.localeCompare(a);
        }
        return a.localeCompare(b);
      });
    }
    
    // Calculate statistics
    const outputLineCount = resultLines.length;
    const duplicatesRemoved = inputLineCount - outputLineCount;
    
    // Update state
    setOutputText(resultLines.join('\n'));
    setStats({
      inputLines: inputLineCount,
      outputLines: outputLineCount,
      duplicatesRemoved
    });
  };
  
  // Copy output to clipboard
  const copyOutput = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Clear all
  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setStats({
      inputLines: 0,
      outputLines: 0,
      duplicatesRemoved: 0
    });
  };
  
  // Load sample text
  const loadSample = () => {
    setInputText(`Line 1
Line 2
Line 3
Line 1
Line 4
Line 2
Line 5
Line 3
Line 6
Line 1
Line 7
Line 8
Line 9
Line 8
Line 9
Line 10
Line 7

Line 11

Line 11
Duplicated line with trailing spaces   
Duplicated line with trailing spaces`);
    processDuplicates();
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <div className="space-y-6">
      <Card
        title={t('tools.remove-duplicate-lines.name')}
        description={t('tools.remove-duplicate-lines.description')}
        icon={FilterX}
      >
        <div className="space-y-4">
          {/* Options */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input
                id="case-sensitive"
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="case-sensitive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('tools.remove-duplicate-lines.caseSensitive')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="trim-whitespace"
                type="checkbox"
                checked={trimWhitespace}
                onChange={(e) => setTrimWhitespace(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="trim-whitespace" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('tools.remove-duplicate-lines.trimWhitespace')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="ignore-empty"
                type="checkbox"
                checked={ignoreEmptyLines}
                onChange={(e) => setIgnoreEmptyLines(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="ignore-empty" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('tools.remove-duplicate-lines.ignoreEmptyLines')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="sort-lines"
                type="checkbox"
                checked={sortLines}
                onChange={(e) => setSortLines(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="sort-lines" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('tools.remove-duplicate-lines.sortLines')}
              </label>
              
              {sortLines && (
                <button
                  onClick={toggleSortDirection}
                  className="ml-2 p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  title={sortDirection === 'asc' 
                    ? t('tools.remove-duplicate-lines.sortAscending')
                    : t('tools.remove-duplicate-lines.sortDescending')}
                >
                  {sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </button>
              )}
            </div>
          </div>
          
          {/* Input */}
          <div>
            <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.remove-duplicate-lines.inputText')}
            </label>
            <textarea
              id="input-text"
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('tools.remove-duplicate-lines.placeholder')}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
            />
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              icon={FilterX}
              onClick={processDuplicates}
            >
              {t('tools.remove-duplicate-lines.removeDuplicates')}
            </Button>
            
            <Button
              variant="secondary"
              onClick={loadSample}
            >
              {t('tools.remove-duplicate-lines.loadSample')}
            </Button>
            
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={clearAll}
            >
              {t('tools.remove-duplicate-lines.clear')}
            </Button>
          </div>
          
          {/* Stats */}
          {showStats && outputText && (
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <div className="text-sm text-blue-700 dark:text-blue-300 flex flex-wrap gap-4">
                <span>{t('tools.remove-duplicate-lines.inputLines')}: {stats.inputLines}</span>
                <span>{t('tools.remove-duplicate-lines.outputLines')}: {stats.outputLines}</span>
                <span>{t('tools.remove-duplicate-lines.duplicatesRemoved')}: {stats.duplicatesRemoved}</span>
              </div>
              <button
                onClick={() => setShowStats(false)}
                className="p-1 rounded-md flex items-center justify-center bg-gray-300 text-blue-500 bg:blue-100 hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 transition-all duration-200"
                aria-label="Hide stats"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Output */}
          {outputText && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('tools.remove-duplicate-lines.outputText')}
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  icon={copied ? Check : Copy}
                  onClick={copyOutput}
                >
                  {copied ? t('tools.remove-duplicate-lines.copied') : t('tools.remove-duplicate-lines.copy')}
                </Button>
              </div>
              <textarea
                rows={8}
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
          <h3>{t('tools.remove-duplicate-lines.aboutTitle')}</h3>
          <p>{t('tools.remove-duplicate-lines.aboutDescription')}</p>
          
          <h4>{t('tools.remove-duplicate-lines.optionsTitle')}</h4>
          <ul>
            <li><strong>{t('tools.remove-duplicate-lines.caseSensitiveOption')}:</strong> {t('tools.remove-duplicate-lines.caseSensitiveDescription')}</li>
            <li><strong>{t('tools.remove-duplicate-lines.trimWhitespaceOption')}:</strong> {t('tools.remove-duplicate-lines.trimWhitespaceDescription')}</li>
            <li><strong>{t('tools.remove-duplicate-lines.ignoreEmptyLinesOption')}:</strong> {t('tools.remove-duplicate-lines.ignoreEmptyLinesDescription')}</li>
            <li><strong>{t('tools.remove-duplicate-lines.sortLinesOption')}:</strong> {t('tools.remove-duplicate-lines.sortLinesDescription')}</li>
          </ul>
          
          <h4>{t('tools.remove-duplicate-lines.useCasesTitle')}</h4>
          <ul>
            <li>{t('tools.remove-duplicate-lines.useCase1')}</li>
            <li>{t('tools.remove-duplicate-lines.useCase2')}</li>
            <li>{t('tools.remove-duplicate-lines.useCase3')}</li>
            <li>{t('tools.remove-duplicate-lines.useCase4')}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}