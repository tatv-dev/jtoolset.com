// src/components/tools/regex-tester/RegexTester.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, Save, Check, Copy, RefreshCw, AlertTriangle, Code, HelpCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function RegexTester() {
  const { t } = useTranslation();
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('');
  const [output, setOutput] = useState([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [replacementText, setReplacementText] = useState('');
  const [replacementResult, setReplacementResult] = useState('');
  const [mode, setMode] = useState('matches'); // 'matches' or 'replace'
  const [savedRegexes, setSavedRegexes] = useState([]);
  const testTextRef = useRef(null);
  
  // Popular regex patterns
  const commonPatterns = [
    { name: 'Email', pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b', flags: 'g' },
    { name: 'URL', pattern: '(https?://[^\\s]+)', flags: 'g' },
    { name: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
    { name: 'Date (MM/DD/YYYY)', pattern: '\\b(0?[1-9]|1[0-2])/(0?[1-9]|[12]\\d|3[01])/\\d{4}\\b', flags: 'g' },
    { name: 'Phone Number', pattern: '\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b', flags: 'g' },
    { name: 'HTML Tag', pattern: '<([a-zA-Z][a-zA-Z0-9]*)(\\s[^>]*)?>(.*?)</\\1>', flags: 'g' },
    { name: 'Hex Color', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})', flags: 'g' },
    { name: 'Password Strength', pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$', flags: '' },
  ];
  
  // Load saved regexes from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedRegexes');
    if (saved) {
      try {
        setSavedRegexes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved regexes:', e);
      }
    }
  }, []);
  
  // Save regexes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('savedRegexes', JSON.stringify(savedRegexes));
  }, [savedRegexes]);
  
  // Highlight matches in the test text
  useEffect(() => {
    if (testTextRef.current) {
      setTimeout(() => highlightMatches(), 0);
    }
  }, [output, testTextRef.current]);
  
  // Test regex when inputs change
  useEffect(() => {
    if (regex) {
      testRegex();
    } else {
      setOutput([]);
      setError('');
      setReplacementResult('');
    }
  }, [regex, flags, testText, mode, replacementText]);
  
  // Test the regex
  const testRegex = () => {
    setError('');
    
    if (!regex || !testText) {
      setOutput([]);
      setReplacementResult('');
      return;
    }
    
    try {
      // Create RegExp object
      const re = new RegExp(regex, flags);
      
      if (mode === 'matches') {
        // Find all matches
        const matches = [];
        let match;
        
        if (flags.includes('g')) {
          // Use exec with global flag in a loop to get all matches with their indices
          while ((match = re.exec(testText)) !== null) {
            const result = {
              text: match[0],
              index: match.index,
              groups: []
            };
            
            // Extract capture groups
            for (let i = 1; i < match.length; i++) {
              result.groups.push({
                index: i,
                text: match[i] || ''
              });
            }
            
            matches.push(result);
            
            // Prevent infinite loops with zero-length matches
            if (match.index === re.lastIndex) {
              re.lastIndex++;
            }
          }
        } else {
          // Without global flag, only get the first match
          match = re.exec(testText);
          if (match) {
            const result = {
              text: match[0],
              index: match.index,
              groups: []
            };
            
            // Extract capture groups
            for (let i = 1; i < match.length; i++) {
              result.groups.push({
                index: i,
                text: match[i] || ''
              });
            }
            
            matches.push(result);
          }
        }
        
        setOutput(matches);
      } else {
        // Replace mode
        try {
          const result = testText.replace(re, replacementText);
          setReplacementResult(result);
        } catch (e) {
          setError(`Replacement error: ${e.message}`);
        }
      }
    } catch (e) {
      setError(`Invalid regular expression: ${e.message}`);
      setOutput([]);
      setReplacementResult('');
    }
  };
  
  // Highlight matches in the test text
  const highlightMatches = () => {
    const textarea = testTextRef.current;
    if (!textarea || output.length === 0) return;
    
    // Get textarea content
    const text = textarea.value;
    
    // Create a temp container to render the highlights
    const container = document.createElement('div');
    let lastIndex = 0;
    
    output.forEach((match, index) => {
      // Add text before the match
      container.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
      
      // Add the highlighted match
      const span = document.createElement('span');
      span.className = 'bg-yellow-200 dark:bg-yellow-800';
      span.textContent = match.text;
      container.appendChild(span);
      
      lastIndex = match.index + match.text.length;
    });
    
    // Add the remaining text
    container.appendChild(document.createTextNode(text.substring(lastIndex)));
    
    // Apply highlight styles to the output element
    const outputElement = document.getElementById('regex-highlights');
    if (outputElement) {
      outputElement.innerHTML = '';
      outputElement.appendChild(container);
    }
  };
  
  // Save the current regex
  const saveRegex = () => {
    if (!regex) return;
    
    const newSavedRegex = {
      id: Date.now(),
      name: `Pattern ${savedRegexes.length + 1}`,
      pattern: regex,
      flags: flags,
      description: ''
    };
    
    setSavedRegexes(prev => [...prev, newSavedRegex]);
  };
  
  // Load a saved regex
  const loadRegex = (savedRegex) => {
    setRegex(savedRegex.pattern);
    setFlags(savedRegex.flags);
  };
  
  // Delete a saved regex
  const deleteRegex = (id, e) => {
    e.stopPropagation();
    setSavedRegexes(prev => prev.filter(r => r.id !== id));
  };
  
  // Update a saved regex name
  const updateRegexName = (id, name, e) => {
    e.stopPropagation();
    setSavedRegexes(prev => 
      prev.map(r => r.id === id ? { ...r, name } : r)
    );
  };
  
  // Load a common pattern
  const loadCommonPattern = (pattern) => {
    setRegex(pattern.pattern);
    setFlags(pattern.flags);
  };
  
  // Clear all inputs
  const clearAll = () => {
    setRegex('');
    setFlags('g');
    setTestText('');
    setOutput([]);
    setError('');
    setReplacementText('');
    setReplacementResult('');
  };
  
  // Copy regex to clipboard
  const copyRegex = () => {
    const regexString = `/${regex}/${flags}`;
    navigator.clipboard.writeText(regexString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Copy result to clipboard
  const copyResult = () => {
    if (mode === 'matches') {
      const matchesStr = output.map(m => m.text).join('\n');
      navigator.clipboard.writeText(matchesStr);
    } else {
      navigator.clipboard.writeText(replacementResult);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Toggle a flag
  const toggleFlag = (flag) => {
    setFlags(prev => 
      prev.includes(flag) 
        ? prev.replace(flag, '') 
        : prev + flag
    );
  };

  return (
    <div className="space-y-6">
      <Card
        title={t('tools.regex-tester.name')}
        description={t('tools.regex-tester.description')}
        icon={Code}
      >
        <div className="space-y-4">
          {/* Regex Pattern Input */}
          <div>
            <label htmlFor="regex-pattern" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.regex-tester.pattern')}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 dark:text-gray-400">
                  /
                </span>
                <input
                  type="text"
                  id="regex-pattern"
                  value={regex}
                  onChange={(e) => setRegex(e.target.value)}
                  placeholder={t('tools.regex-tester.patternPlaceholder')}
                  className="w-full pl-5 pr-2 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 dark:text-gray-400">
                  /
                </span>
              </div>
              
              <div className="flex items-center">
                <input
                  type="text"
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  placeholder="flags"
                  className="w-16 px-2 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
                />
              </div>
            </div>
          </div>
          
          {/* Flags toggles */}
          <div className="flex flex-wrap gap-2">
            <FlagToggle 
              flag="g" 
              isActive={flags.includes('g')} 
              toggle={() => toggleFlag('g')} 
              tooltip={t('tools.regex-tester.flags.global')}
            />
            <FlagToggle 
              flag="i" 
              isActive={flags.includes('i')} 
              toggle={() => toggleFlag('i')} 
              tooltip={t('tools.regex-tester.flags.ignoreCase')}
            />
            <FlagToggle 
              flag="m" 
              isActive={flags.includes('m')} 
              toggle={() => toggleFlag('m')} 
              tooltip={t('tools.regex-tester.flags.multiline')}
            />
            <FlagToggle 
              flag="s" 
              isActive={flags.includes('s')} 
              toggle={() => toggleFlag('s')} 
              tooltip={t('tools.regex-tester.flags.dotAll')}
            />
            <FlagToggle 
              flag="u" 
              isActive={flags.includes('u')} 
              toggle={() => toggleFlag('u')} 
              tooltip={t('tools.regex-tester.flags.unicode')}
            />
            <FlagToggle 
              flag="y" 
              isActive={flags.includes('y')} 
              toggle={() => toggleFlag('y')} 
              tooltip={t('tools.regex-tester.flags.sticky')}
            />
          </div>
          
          {/* Error display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-red-400 text-sm flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}
          
          {/* Mode selection */}
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                mode === 'matches'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setMode('matches')}
            >
              {t('tools.regex-tester.matchMode')}
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                mode === 'replace'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setMode('replace')}
            >
              {t('tools.regex-tester.replaceMode')}
            </button>
          </div>
          
          {/* Test Text Input */}
          <div>
            <label htmlFor="test-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.regex-tester.testText')}
            </label>
            <textarea
              id="test-text"
              ref={testTextRef}
              rows={6}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder={t('tools.regex-tester.testTextPlaceholder')}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
            />
          </div>
          
          {/* Replacement Input (Only in replace mode) */}
          {mode === 'replace' && (
            <div>
              <label htmlFor="replacement-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('tools.regex-tester.replacementText')}
              </label>
              <input
                type="text"
                id="replacement-text"
                value={replacementText}
                onChange={(e) => setReplacementText(e.target.value)}
                placeholder={t('tools.regex-tester.replacementPlaceholder')}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
              />
            </div>
          )}
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              icon={mode === 'matches' ? Code : RefreshCw}
              onClick={testRegex}
            >
              {mode === 'matches' ? t('tools.regex-tester.testRegex') : t('tools.regex-tester.replaceText')}
            </Button>
            
            <Button
              variant="secondary"
              icon={Save}
              onClick={saveRegex}
              disabled={!regex}
            >
              {t('tools.regex-tester.savePattern')}
            </Button>
            
            <Button
              variant={copied ? "success" : "outline"}
              icon={copied ? Check : Copy}
              onClick={copyRegex}
              disabled={!regex}
            >
              {copied ? t('tools.regex-tester.copied') : t('tools.regex-tester.copyPattern')}
            </Button>
            
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={clearAll}
            >
              {t('tools.regex-tester.clear')}
            </Button>
          </div>
          
          {/* Results */}
          {mode === 'matches' && output.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('tools.regex-tester.matches')} ({output.length})
                </h3>
                {output.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={copied ? Check : Copy}
                    onClick={copyResult}
                  >
                    {copied ? t('tools.regex-tester.copied') : t('tools.regex-tester.copyMatches')}
                  </Button>
                )}
              </div>
              
              {/* Highlighted Text */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <pre id="regex-highlights" className="text-sm font-mono whitespace-pre-wrap">{testText}</pre>
              </div>
              
              {/* Match Details */}
              <div className="space-y-2">
                {output.map((match, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t('tools.regex-tester.match')} #{index + 1}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t('tools.regex-tester.index')}: {match.index}
                      </span>
                    </div>
                    <div className="font-mono text-sm mb-2 break-all">{match.text}</div>
                    
                    {match.groups.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {t('tools.regex-tester.groups')}
                        </div>
                        {match.groups.map((group, groupIndex) => (
                          <div key={groupIndex} className="flex text-xs">
                            <span className="min-w-8 font-medium text-gray-500 dark:text-gray-400">#{group.index}:</span>
                            <code className="font-mono text-gray-800 dark:text-gray-200">{group.text || '(empty)'}</code>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Replacement Result */}
          {mode === 'replace' && replacementResult && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('tools.regex-tester.result')}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  icon={copied ? Check : Copy}
                  onClick={copyResult}
                >
                  {copied ? t('tools.regex-tester.copied') : t('tools.regex-tester.copyResult')}
                </Button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">{replacementResult}</pre>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Saved Patterns & Common Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saved Patterns */}
        <Card 
          title={t('tools.regex-tester.savedPatterns')}
          className="h-full"
        >
          <div className="space-y-2">
            {savedRegexes.length === 0 ? (
              <div className="text-center py-6">
                <div className="mx-auto h-12 w-12 text-gray-400">📋</div>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t('tools.regex-tester.noSavedPatterns')}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t('tools.regex-tester.savePatternPrompt')}
                </p>
              </div>
            ) : (
              savedRegexes.map((saved) => (
                <div 
                  key={saved.id} 
                  className="group p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer"
                  onClick={() => loadRegex(saved)}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-gray-700 dark:text-gray-300">
                      <input
                        type="text" 
                        value={saved.name}
                        onChange={(e) => updateRegexName(saved.id, e.target.value, e)}
                        className="bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:border-primary-500 focus:ring-0 p-0 text-sm"
                      />
                    </div>
                    <button
                      onClick={(e) => deleteRegex(saved.id, e)}
                      className="p-1 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      aria-label="Delete pattern"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-1 text-xs font-mono text-gray-500 dark:text-gray-400 truncate">
                    /{saved.pattern}/{saved.flags}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
        
        {/* Common Patterns */}
        <Card 
          title={t('tools.regex-tester.commonPatterns')}
          className="h-full"
        >
          <div className="space-y-2">
            {commonPatterns.map((pattern, index) => (
              <div 
                key={index} 
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer"
                onClick={() => loadCommonPattern(pattern)}
              >
                <div className="font-medium text-gray-700 dark:text-gray-300">{pattern.name}</div>
                <div className="mt-1 text-xs font-mono text-gray-500 dark:text-gray-400 truncate">
                  /{pattern.pattern}/{pattern.flags}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Regex Reference & Help */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.regex-tester.referenceTitle')}</h3>
          
          <h4>{t('tools.regex-tester.commonSymbols')}</h4>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">{t('tools.regex-tester.symbol')}</th>
                <th className="text-left">{t('tools.regex-tester.meaning')}</th>
                <th className="text-left">{t('tools.regex-tester.example')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>.</code></td>
                <td>{t('tools.regex-tester.dot')}</td>
                <td><code>a.b</code> {t('tools.regex-tester.dotExample')}</td>
              </tr>
              <tr>
                <td><code>^</code></td>
                <td>{t('tools.regex-tester.caret')}</td>
                <td><code>^abc</code> {t('tools.regex-tester.caretExample')}</td>
              </tr>
              <tr>
                <td><code>$</code></td>
                <td>{t('tools.regex-tester.dollar')}</td>
                <td><code>abc$</code> {t('tools.regex-tester.dollarExample')}</td>
              </tr>
              <tr>
                <td><code>*</code></td>
                <td>{t('tools.regex-tester.asterisk')}</td>
                <td><code>a*</code> {t('tools.regex-tester.asteriskExample')}</td>
              </tr>
              <tr>
                <td><code>+</code></td>
                <td>{t('tools.regex-tester.plus')}</td>
                <td><code>a+</code> {t('tools.regex-tester.plusExample')}</td>
              </tr>
              <tr>
                <td><code>?</code></td>
                <td>{t('tools.regex-tester.question')}</td>
                <td><code>a?</code> {t('tools.regex-tester.questionExample')}</td>
              </tr>
              <tr>
                <td><code>\d</code></td>
                <td>{t('tools.regex-tester.digit')}</td>
                <td><code>\d+</code> {t('tools.regex-tester.digitExample')}</td>
              </tr>
              <tr>
                <td><code>\w</code></td>
                <td>{t('tools.regex-tester.word')}</td>
                <td><code>\w+</code> {t('tools.regex-tester.wordExample')}</td>
              </tr>
              <tr>
                <td><code>\s</code></td>
                <td>{t('tools.regex-tester.whitespace')}</td>
                <td><code>a\sb</code> {t('tools.regex-tester.whitespaceExample')}</td>
              </tr>
              <tr>
                <td><code>[abc]</code></td>
                <td>{t('tools.regex-tester.characterClass')}</td>
                <td><code>[aeiou]</code> {t('tools.regex-tester.characterClassExample')}</td>
              </tr>
              <tr>
                <td><code>(abc)</code></td>
                <td>{t('tools.regex-tester.captureGroup')}</td>
                <td><code>(abc)+</code> {t('tools.regex-tester.captureGroupExample')}</td>
              </tr>
            </tbody>
          </table>
          
          <h4>{t('tools.regex-tester.replaceSpecial')}</h4>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">{t('tools.regex-tester.symbol')}</th>
                <th className="text-left">{t('tools.regex-tester.meaning')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t('tools.regex-tester.beforeMatch')}</td>
              </tr>
              <tr>
                <td><code></code></td>
                <td>{t('tools.regex-tester.afterMatch')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// Flag toggle button component
function FlagToggle({ flag, isActive, toggle, tooltip }) {
  return (
    <button
      type="button"
      onClick={toggle}
      className={`relative rounded-md px-3 py-1.5 text-sm font-medium ${
        isActive
          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
      } hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500`}
      title={tooltip}
    >
      {flag}
    </button>
  );
}