// src/components/tools/hash/HashTool.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Hash, Copy, Check, RefreshCw, Shield, FileUp, Zap, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function HashTool() {
  const { t } = useTranslation();
  const [mode, setMode] = useState('generate'); // 'generate' or 'verify'
  
  // Common state for both modes
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [inputType, setInputType] = useState('text'); // 'text' or 'file'
  const [input, setInput] = useState('');
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Verify mode specific state
  const [originalHash, setOriginalHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null); // null, true, or false
  
  // File input ref
  const fileInputRef = useRef(null);
  
  // Available hash algorithms
  const algorithms = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
  
  // Calculate hash using Web Crypto API
  const calculateHash = async () => {
    if ((!input && inputType === 'text') || (!fileData && inputType === 'file')) {
      return;
    }
    
    setIsProcessing(true);
    setResult('');
    setVerificationResult(null);
    
    try {
      let data;
      
      if (inputType === 'text') {
        // Convert text to ArrayBuffer
        const encoder = new TextEncoder();
        data = encoder.encode(input);
      } else {
        // Use file data
        data = fileData;
      }
      
      // Map algorithm name to WebCrypto algorithm identifier
      const algorithmMap = {
        'MD5': 'MD5',
        'SHA-1': 'SHA-1',
        'SHA-256': 'SHA-256',
        'SHA-384': 'SHA-384',
        'SHA-512': 'SHA-512'
      };
      
      // For MD5, we'd need a custom implementation as it's not in WebCrypto
      // This is a simplified fallback message
      if (algorithm === 'MD5') {
        setTimeout(() => {
          setResult('MD5 is not supported in the Web Crypto API. For security reasons, consider using SHA-256 or stronger algorithms.');
          setIsProcessing(false);
        }, 500);
        return;
      }
      
      // Use Web Crypto API to calculate hash
      const hashBuffer = await crypto.subtle.digest(algorithmMap[algorithm], data);
      
      // Convert buffer to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Set result
      setResult(hashHex);
      
      // If in verify mode, check against original hash
      if (mode === 'verify' && originalHash) {
        const normalizedOriginal = originalHash.toLowerCase().replace(/[^0-9a-f]/g, '');
        const normalizedResult = hashHex.toLowerCase();
        
        setVerificationResult(normalizedOriginal === normalizedResult);
      }
      
    } catch (error) {
      console.error('Error calculating hash:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    
    // Read file as ArrayBuffer
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileData(e.target.result);
    };
    reader.readAsArrayBuffer(file);
  };
  
  // Copy hash to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Clear all inputs and results
  const clearAll = () => {
    setInput('');
    setFileData(null);
    setFileName('');
    setResult('');
    setOriginalHash('');
    setVerificationResult(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Load sample data
  const loadSample = () => {
    if (inputType === 'text') {
      setInput('Hello, World! This is a sample text for hash calculation.');
      setFileData(null);
      setFileName('');
    }
  };
  
  // Effect to automatically calculate hash when file is uploaded
  useEffect(() => {
    if (fileData) {
      calculateHash();
    }
  }, [fileData, algorithm]);
  
  return (
    <div className="space-y-6">
      <Card
        title={t('tools.hash.name')}
        description={t('tools.hash.description')}
        icon={Hash}
      >
        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex rounded-md shadow-sm">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                mode === 'generate'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
              }`}
              onClick={() => setMode('generate')}
            >
              <Hash className="inline-block w-4 h-4 mr-1" />
              {t('tools.hash.generateMode')}
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                mode === 'verify'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
              }`}
              onClick={() => setMode('verify')}
            >
              <Shield className="inline-block w-4 h-4 mr-1" />
              {t('tools.hash.verifyMode')}
            </button>
          </div>
          
          {/* Algorithm Selection */}
          <div>
            <label htmlFor="algorithm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.hash.algorithm')}
            </label>
            <select
              id="algorithm"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {algorithms.map((algo) => (
                <option key={algo} value={algo}>{algo}</option>
              ))}
            </select>
          </div>
          
          {/* Input Type Selection */}
          <div className="flex rounded-md shadow-sm">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                inputType === 'text'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
              }`}
              onClick={() => setInputType('text')}
            >
              {t('tools.hash.text')}
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                inputType === 'file'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
              }`}
              onClick={() => setInputType('file')}
            >
              {t('tools.hash.file')}
            </button>
          </div>
          
          {/* Input Field - Text */}
          {inputType === 'text' && (
            <div>
              <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {mode === 'generate' 
                  ? t('tools.hash.inputText') 
                  : t('tools.hash.originalText')}
              </label>
              <textarea
                id="input-text"
                rows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'generate' 
                  ? t('tools.hash.inputPlaceholder') 
                  : t('tools.hash.originalTextPlaceholder')}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}
          
          {/* Input Field - File */}
          {inputType === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {mode === 'generate'
                  ? t('tools.hash.inputFile')
                  : t('tools.hash.originalFile')}
              </label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileUp className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                    {!fileName ? (
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">{t('tools.hash.clickToUpload')}</span>
                      </p>
                    ) : (
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        {fileName}
                      </p>
                    )}
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
          )}
          
          {/* Verify Hash Input */}
          {mode === 'verify' && (
            <div>
              <label htmlFor="original-hash" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('tools.hash.hashToVerify')}
              </label>
              <input
                type="text"
                id="original-hash"
                value={originalHash}
                onChange={(e) => setOriginalHash(e.target.value)}
                placeholder={t('tools.hash.hashPlaceholder')}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              icon={mode === 'generate' ? Hash : Shield}
              onClick={calculateHash}
              isLoading={isProcessing}
            >
              {mode === 'generate' 
                ? t('tools.hash.generateHash') 
                : t('tools.hash.verifyHash')}
            </Button>
            
            {inputType === 'text' && (
              <Button
                variant="secondary"
                onClick={loadSample}
              >
                {t('tools.hash.loadSample')}
              </Button>
            )}
            
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={clearAll}
            >
              {t('tools.hash.clear')}
            </Button>
          </div>
          
          {/* Results - Generate Mode */}
          {mode === 'generate' && result && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('tools.hash.generatedHash')}
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  icon={copied ? Check : Copy}
                  onClick={copyToClipboard}
                >
                  {copied ? t('tools.hash.copied') : t('tools.hash.copy')}
                </Button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <p className="text-sm font-mono break-all">{result}</p>
              </div>
            </div>
          )}
          
          {/* Results - Verify Mode */}
          {mode === 'verify' && verificationResult !== null && (
            <div className={`p-4 rounded-md ${
              verificationResult 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30'
            }`}>
              <div className="flex items-center">
                {verificationResult ? (
                  <>
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                    <div>
                      <h3 className="text-base font-medium text-green-800 dark:text-green-300">
                        {t('tools.hash.hashMatch')}
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        {t('tools.hash.hashMatchDescription')}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Shield className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
                    <div>
                      <h3 className="text-base font-medium text-red-800 dark:text-red-300">
                        {t('tools.hash.hashMismatch')}
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                        {t('tools.hash.hashMismatchDescription')}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {/* Show the calculated hash for comparison */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                      {t('tools.hash.expectedHash')}:
                    </span>
                    <span className="text-sm font-mono break-all">{originalHash}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                      {t('tools.hash.calculatedHash')}:
                    </span>
                    <span className="text-sm font-mono break-all">{result}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Information Card */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.hash.aboutTitle')}</h3>
          <p>{t('tools.hash.aboutDescription')}</p>
          
          <h4>{t('tools.hash.algorithmsTitle')}</h4>
          <ul>
            {/* <li><strong>MD5:</strong> {t('tools.hash.md5Description')}</li> */}
            <li><strong>SHA-1:</strong> {t('tools.hash.sha1Description')}</li>
            <li><strong>SHA-256:</strong> {t('tools.hash.sha256Description')}</li>
            <li><strong>SHA-384:</strong> {t('tools.hash.sha384Description')}</li>
            <li><strong>SHA-512:</strong> {t('tools.hash.sha512Description')}</li>
          </ul>
          
          <h4>{t('tools.hash.useCasesTitle')}</h4>
          <ul>
            <li>{t('tools.hash.useCase1')}</li>
            <li>{t('tools.hash.useCase2')}</li>
            <li>{t('tools.hash.useCase3')}</li>
            <li>{t('tools.hash.useCase4')}</li>
          </ul>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-900/30 mt-4">
            <h4 className="text-yellow-800 dark:text-yellow-300 text-base font-medium">{t('tools.hash.securityNoteTitle')}</h4>
            <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">{t('tools.hash.securityNoteText')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}