// src/components/tools/hash/HashTool.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Hash, Copy, Check, RefreshCw, Shield, FileUp, Zap, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function HashTool() {
  const { t } = useTranslation();
  
  // States for generate mode
  const [generateAlgorithm, setGenerateAlgorithm] = useState('SHA-256');
  const [generateInputType, setGenerateInputType] = useState('text');
  const [generateInput, setGenerateInput] = useState('');
  const [generateFileData, setGenerateFileData] = useState(null);
  const [generateFileName, setGenerateFileName] = useState('');
  const [generateResult, setGenerateResult] = useState('');
  const [isGenerateProcessing, setIsGenerateProcessing] = useState(false);
  const [generateCopied, setGenerateCopied] = useState(false);
  
  // States for verify mode
  const [verifyAlgorithm, setVerifyAlgorithm] = useState('SHA-256');
  const [verifyInputType, setVerifyInputType] = useState('text');
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyFileData, setVerifyFileData] = useState(null);
  const [verifyFileName, setVerifyFileName] = useState('');
  const [verifyResult, setVerifyResult] = useState('');
  const [verifyOriginalHash, setVerifyOriginalHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null); // null, true, or false
  const [isVerifyProcessing, setIsVerifyProcessing] = useState(false);
  
  // File input refs
  const generateFileInputRef = useRef(null);
  const verifyFileInputRef = useRef(null);
  
  // Available hash algorithms
  const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
  
  // Calculate hash for generate mode
  const calculateGenerateHash = async () => {
    if ((!generateInput && generateInputType === 'text') || 
        (!generateFileData && generateInputType === 'file')) {
      return;
    }
    
    setIsGenerateProcessing(true);
    setGenerateResult('');
    
    try {
      let data;
      
      if (generateInputType === 'text') {
        // Convert text to ArrayBuffer
        const encoder = new TextEncoder();
        data = encoder.encode(generateInput);
      } else {
        // Use file data
        data = generateFileData;
      }
      
      // Map algorithm name to WebCrypto algorithm identifier
      const algorithmMap = {
        'SHA-1': 'SHA-1',
        'SHA-256': 'SHA-256',
        'SHA-384': 'SHA-384',
        'SHA-512': 'SHA-512'
      };
      
      // Use Web Crypto API to calculate hash
      const hashBuffer = await crypto.subtle.digest(algorithmMap[generateAlgorithm], data);
      
      // Convert buffer to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Set result
      setGenerateResult(hashHex);
      
    } catch (error) {
      console.error('Error calculating hash:', error);
      setGenerateResult(`Error: ${error.message}`);
    } finally {
      setIsGenerateProcessing(false);
    }
  };
  
  // Calculate hash for verify mode
  const calculateVerifyHash = async () => {
    if ((!verifyInput && verifyInputType === 'text') || 
        (!verifyFileData && verifyInputType === 'file') ||
        !verifyOriginalHash) {
      return;
    }
    
    setIsVerifyProcessing(true);
    setVerifyResult('');
    setVerificationResult(null);
    
    try {
      let data;
      
      if (verifyInputType === 'text') {
        // Convert text to ArrayBuffer
        const encoder = new TextEncoder();
        data = encoder.encode(verifyInput);
      } else {
        // Use file data
        data = verifyFileData;
      }
      
      // Map algorithm name to WebCrypto algorithm identifier
      const algorithmMap = {
        'SHA-1': 'SHA-1',
        'SHA-256': 'SHA-256',
        'SHA-384': 'SHA-384',
        'SHA-512': 'SHA-512'
      };
      
      // Use Web Crypto API to calculate hash
      const hashBuffer = await crypto.subtle.digest(algorithmMap[verifyAlgorithm], data);
      
      // Convert buffer to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Set result
      setVerifyResult(hashHex);
      
      // Check against original hash
      const normalizedOriginal = verifyOriginalHash.toLowerCase().replace(/[^0-9a-f]/g, '');
      const normalizedResult = hashHex.toLowerCase();
      
      setVerificationResult(normalizedOriginal === normalizedResult);
      
    } catch (error) {
      console.error('Error calculating hash:', error);
      setVerifyResult(`Error: ${error.message}`);
    } finally {
      setIsVerifyProcessing(false);
    }
  };
  
  // Handle file upload for generate mode
  const handleGenerateFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setGenerateFileName(file.name);
    
    // Read file as ArrayBuffer
    const reader = new FileReader();
    reader.onload = (e) => {
      setGenerateFileData(e.target.result);
    };
    reader.readAsArrayBuffer(file);
  };
  
  // Handle file upload for verify mode
  const handleVerifyFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setVerifyFileName(file.name);
    
    // Read file as ArrayBuffer
    const reader = new FileReader();
    reader.onload = (e) => {
      setVerifyFileData(e.target.result);
    };
    reader.readAsArrayBuffer(file);
  };
  
  // Copy generated hash to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateResult);
    setGenerateCopied(true);
    setTimeout(() => setGenerateCopied(false), 2000);
  };
  
  // Clear all inputs and results for generate mode
  const clearGenerate = () => {
    setGenerateInput('');
    setGenerateFileData(null);
    setGenerateFileName('');
    setGenerateResult('');
    
    // Reset file input
    if (generateFileInputRef.current) {
      generateFileInputRef.current.value = '';
    }
  };
  
  // Clear all inputs and results for verify mode
  const clearVerify = () => {
    setVerifyInput('');
    setVerifyFileData(null);
    setVerifyFileName('');
    setVerifyResult('');
    setVerifyOriginalHash('');
    setVerificationResult(null);
    
    // Reset file input
    if (verifyFileInputRef.current) {
      verifyFileInputRef.current.value = '';
    }
  };
  
  // Load sample data for generate mode
  const loadGenerateSample = () => {
    if (generateInputType === 'text') {
      setGenerateInput('Hello, World! This is a sample text for hash calculation.');
      setGenerateFileData(null);
      setGenerateFileName('');
    }
  };
  
  // Load sample data for verify mode
  const loadVerifySample = () => {
    if (verifyInputType === 'text') {
      setVerifyInput('Hello, World! This is a sample text for hash calculation.');
      setVerifyFileData(null);
      setVerifyFileName('');
      setVerifyOriginalHash('7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');
    }
  };
  
  // Effect to automatically calculate hash when file is uploaded for generate mode
  useEffect(() => {
    if (generateFileData) {
      calculateGenerateHash();
    }
  }, [generateFileData, generateAlgorithm]);
  
  // Effect to automatically calculate hash when file is uploaded for verify mode
  useEffect(() => {
    if (verifyFileData) {
      calculateVerifyHash();
    }
  }, [verifyFileData, verifyAlgorithm]);

  // Render input fields for text - Generate mode
  const renderGenerateTextInput = () => {
    return (
      <div>
        <label htmlFor="generate-input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tools.sha.inputText')}
        </label>
        <textarea
          id="generate-input-text"
          rows={4}
          value={generateInput}
          onChange={(e) => setGenerateInput(e.target.value)}
          placeholder={t('tools.sha.inputPlaceholder')}
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>
    );
  };
  
  // Render input fields for file - Generate mode
  const renderGenerateFileInput = () => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tools.sha.inputFile')}
        </label>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="generate-file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileUp className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
              {!generateFileName ? (
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">{t('tools.sha.clickToUpload')}</span>
                </p>
              ) : (
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  {generateFileName}
                </p>
              )}
            </div>
            <input
              id="generate-file-upload"
              type="file"
              className="hidden"
              ref={generateFileInputRef}
              onChange={handleGenerateFileUpload}
            />
          </label>
        </div>
      </div>
    );
  };
  
  // Render input fields for text - Verify mode
  const renderVerifyTextInput = () => {
    return (
      <div>
        <label htmlFor="verify-input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tools.sha.originalText')}
        </label>
        <textarea
          id="verify-input-text"
          rows={4}
          value={verifyInput}
          onChange={(e) => setVerifyInput(e.target.value)}
          placeholder={t('tools.sha.originalTextPlaceholder')}
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>
    );
  };
  
  // Render input fields for file - Verify mode
  const renderVerifyFileInput = () => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tools.sha.originalFile')}
        </label>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="verify-file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileUp className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
              {!verifyFileName ? (
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">{t('tools.sha.clickToUpload')}</span>
                </p>
              ) : (
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  {verifyFileName}
                </p>
              )}
            </div>
            <input
              id="verify-file-upload"
              type="file"
              className="hidden"
              ref={verifyFileInputRef}
              onChange={handleVerifyFileUpload}
            />
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card
        title={t('tools.sha.name')}
        description={t('tools.sha.description')}
        icon={Hash}
      >
        {/* Desktop: Side by side, Mobile: Stacked */}
        <div className="lg:flex lg:space-x-6 space-y-6 lg:space-y-0">
          {/* Generator Section */}
          <div className="lg:w-1/2 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Hash className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {t('tools.sha.generateMode')}
                </h3>
              </div>
              
              <div className="space-y-4">
                {/* Algorithm Selection */}
                <div>
                  <label htmlFor="generate-algorithm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('tools.sha.algorithm')}
                  </label>
                  <select
                    id="generate-algorithm"
                    value={generateAlgorithm}
                    onChange={(e) => setGenerateAlgorithm(e.target.value)}
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
                      generateInputType === 'text'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                    }`}
                    onClick={() => setGenerateInputType('text')}
                  >
                    {t('tools.sha.text')}
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                      generateInputType === 'file'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                    }`}
                    onClick={() => setGenerateInputType('file')}
                  >
                    {t('tools.sha.file')}
                  </button>
                </div>
                
                {/* Input Fields */}
                {generateInputType === 'text' ? renderGenerateTextInput() : renderGenerateFileInput()}
                
                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    icon={Hash}
                    onClick={calculateGenerateHash}
                    isLoading={isGenerateProcessing}
                  >
                    {t('tools.sha.generateHash')}
                  </Button>
                  
                  {generateInputType === 'text' && (
                    <Button
                      variant="secondary"
                      onClick={loadGenerateSample}
                    >
                      {t('tools.sha.loadSample')}
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    icon={RefreshCw}
                    onClick={clearGenerate}
                  >
                    {t('tools.sha.clear')}
                  </Button>
                </div>
                
                {/* Results */}
                {generateResult && (
                  <div className="space-y-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('tools.sha.generatedHash')}
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={generateCopied ? Check : Copy}
                        onClick={copyToClipboard}
                      >
                        {generateCopied ? t('tools.sha.copied') : t('tools.sha.copy')}
                      </Button>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                      <p className="text-sm font-mono break-all">{generateResult}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Verifier Section */}
          <div className="lg:w-1/2 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Shield className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {t('tools.sha.verifyMode')}
                </h3>
              </div>
              
              <div className="space-y-4">
                {/* Algorithm Selection */}
                <div>
                  <label htmlFor="verify-algorithm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('tools.sha.algorithm')}
                  </label>
                  <select
                    id="verify-algorithm"
                    value={verifyAlgorithm}
                    onChange={(e) => setVerifyAlgorithm(e.target.value)}
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
                      verifyInputType === 'text'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                    }`}
                    onClick={() => setVerifyInputType('text')}
                  >
                    {t('tools.sha.text')}
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                      verifyInputType === 'file'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                    }`}
                    onClick={() => setVerifyInputType('file')}
                  >
                    {t('tools.sha.file')}
                  </button>
                </div>
                
                {/* Input Fields */}
                {verifyInputType === 'text' ? renderVerifyTextInput() : renderVerifyFileInput()}
                
                {/* Hash to Verify Input */}
                <div>
                  <label htmlFor="verify-original-hash" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('tools.sha.hashToVerify')}
                  </label>
                  <input
                    type="text"
                    id="verify-original-hash"
                    value={verifyOriginalHash}
                    onChange={(e) => setVerifyOriginalHash(e.target.value)}
                    placeholder={t('tools.sha.hashPlaceholder')}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    icon={Shield}
                    onClick={calculateVerifyHash}
                    isLoading={isVerifyProcessing}
                  >
                    {t('tools.sha.verifyHash')}
                  </Button>
                  
                  {verifyInputType === 'text' && (
                    <Button
                      variant="secondary"
                      onClick={loadVerifySample}
                    >
                      {t('tools.sha.loadSample')}
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    icon={RefreshCw}
                    onClick={clearVerify}
                  >
                    {t('tools.sha.clear')}
                  </Button>
                </div>
                
                {/* Results */}
                {verificationResult !== null && (
                  <div className={`p-4 rounded-md mt-4 ${
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
                              {t('tools.sha.hashMatch')}
                            </h3>
                            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                              {t('tools.sha.hashMatchDescription')}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Shield className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
                          <div>
                            <h3 className="text-base font-medium text-red-800 dark:text-red-300">
                              {t('tools.sha.hashMismatch')}
                            </h3>
                            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                              {t('tools.sha.hashMismatchDescription')}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Show the calculated hash for comparison */}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                            {t('tools.sha.expectedHash')}:
                          </span>
                          <span className="text-sm font-mono break-all">{verifyOriginalHash}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                            {t('tools.sha.calculatedHash')}:
                          </span>
                          <span className="text-sm font-mono break-all">{verifyResult}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Information Card */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.sha.aboutTitle')}</h3>
          <p>{t('tools.sha.aboutDescription')}</p>
          
          <h4>{t('tools.sha.algorithmsTitle')}</h4>
          <ul>
            <li><strong>SHA-1:</strong> {t('tools.sha.sha1Description')}</li>
            <li><strong>SHA-256:</strong> {t('tools.sha.sha256Description')}</li>
            <li><strong>SHA-384:</strong> {t('tools.sha.sha384Description')}</li>
            <li><strong>SHA-512:</strong> {t('tools.sha.sha512Description')}</li>
          </ul>
          
          <h4>{t('tools.sha.useCasesTitle')}</h4>
          <ul>
            <li>{t('tools.sha.useCase1')}</li>
            <li>{t('tools.sha.useCase2')}</li>
            <li>{t('tools.sha.useCase3')}</li>
            <li>{t('tools.sha.useCase4')}</li>
          </ul>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-900/30 mt-4">
            <h4 className="text-yellow-800 dark:text-yellow-300 text-base font-medium">{t('tools.sha.securityNoteTitle')}</h4>
            <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">{t('tools.sha.securityNoteText')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}