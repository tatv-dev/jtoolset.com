// src/components/tools/bcrypt/BcryptTool.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Shield, Copy, Check, RefreshCw, AlertTriangle, Key, Lock, Eye, EyeOff } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import Script from '@/components/ui/Script';
import bcrypt from 'bcryptjs';


export default function BcryptTool() {
  const { t } = useTranslation();
  // Generate hash states
  const [generatePassword, setGeneratePassword] = useState('');
  const [hashResult, setHashResult] = useState('');
  const [saltRounds, setSaltRounds] = useState(10);
  const [isHashLoading, setIsHashLoading] = useState(false);
  const [isGeneratingLengthWarning, setIsGeneratingLengthWarning] = useState(false);
  const [generatingErrorMessage, setGeneratingErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Verify hash states
  const [verifyPassword, setVerifyPassword] = useState('');
  const [hashToVerify, setHashToVerify] = useState('');
  const [verificationResult, setVerificationResult] = useState(null); // null, true, or false
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerifyingLengthWarning, setIsVerifyingLengthWarning] = useState(false);
  const [verifyingErrorMessage, setVerifyingErrorMessage] = useState('');
  
  // Common states
  const [showGeneratePassword, setShowGeneratePassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  


  // Handle password change for generating
  const handleGeneratePasswordChange = (e) => {
    const value = e.target.value;
    setGeneratePassword(value);
    
    // Warning if password is too long (bcrypt has a 72 byte limit)
    if (new TextEncoder().encode(value).length > 72) {
      setIsGeneratingLengthWarning(true);
    } else {
      setIsGeneratingLengthWarning(false);
    }
  };
  
  // Handle password change for verifying
  const handleVerifyPasswordChange = (e) => {
    const value = e.target.value;
    setVerifyPassword(value);
    
    // Warning if password is too long (bcrypt has a 72 byte limit)
    if (new TextEncoder().encode(value).length > 72) {
      setIsVerifyingLengthWarning(true);
    } else {
      setIsVerifyingLengthWarning(false);
    }
  };
  
  // Generate bcrypt hash
  const generateHash = async () => {
    if (!generatePassword) {
        setGeneratingErrorMessage(t('tools.bcrypt.errors.emptyInput'));
        return;
    }

    setIsHashLoading(true);
    setGeneratingErrorMessage('');

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(generatePassword, salt);
        setHashResult(hash);
        setIsHashLoading(false);
    } catch (error) {
        console.error('Bcrypt error:', error);
        setGeneratingErrorMessage(t('tools.bcrypt.errors.hashFailed'));
        setIsHashLoading(false);
    }
    };

  const verifyHash = async () => {
    if (!verifyPassword || !hashToVerify) {
        setVerifyingErrorMessage(t('tools.bcrypt.errors.missingInputs'));
        return;
    }

    setIsVerifying(true);
    setVerifyingErrorMessage('');
    setVerificationResult(null);

    try {
        const result = await bcrypt.compare(verifyPassword, hashToVerify);
        setVerificationResult(result);
        setIsVerifying(false);
    } catch (error) {
        console.error('Bcrypt error:', error);
        setVerifyingErrorMessage(t('tools.bcrypt.errors.verifyFailed'));
        setIsVerifying(false);
    }
    };
  
  // Copy hash to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(hashResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Clear generate fields
  const clearGenerateFields = () => {
    setGeneratePassword('');
    setHashResult('');
    setGeneratingErrorMessage('');
  };
  
  // Clear verify fields
  const clearVerifyFields = () => {
    setVerifyPassword('');
    setHashToVerify('');
    setVerificationResult(null);
    setVerifyingErrorMessage('');
  };
  
  // Load generate sample
  const loadGenerateSample = () => {
    setGeneratePassword('mySecurePassword123');
  };
  
  // Load verify sample
  const loadVerifySample = () => {
    setVerifyPassword('mySecurePassword123');
    setHashToVerify('$2a$10$CwTycUXWue0Thq9StjUM0uQCo6oE.AN2k/xvT.CVTUTvhfk4wDP/.');
  };

  // Function to use verified hash in generate section
  const useHashInVerify = () => {
    if (hashResult) {
      setHashToVerify(hashResult);
      setVerifyPassword(generatePassword);
    }
  };

  // Render the Generate section
  const renderGenerateSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
        <Key className="mr-2 h-5 w-5 text-primary-500" />
        {t('tools.bcrypt.generateMode')}
      </h3>
      
      {/* Salt Rounds Setting */}
      <div>
        <label htmlFor="salt-rounds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tools.bcrypt.saltRounds')}
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            id="salt-rounds"
            min="4"
            max="16"
            value={saltRounds}
            onChange={(e) => setSaltRounds(parseInt(e.target.value))}
            className="w-full max-w-md h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {saltRounds}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t('tools.bcrypt.saltRoundsDescription')}
        </p>
      </div>
      
      {/* Password Input */}
      <div>
        <label htmlFor="generate-password-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tools.bcrypt.passwordInput')}
        </label>
        <div className="relative">
          <input
            type={showGeneratePassword ? "text" : "password"}
            id="generate-password-input"
            value={generatePassword}
            onChange={handleGeneratePasswordChange}
            placeholder={t('tools.bcrypt.passwordPlaceholder')}
            className="w-full px-3 py-2 pr-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <button 
            type="button"
            className="absolute inset-y-0 right-0 px-2 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent"
            onClick={() => setShowGeneratePassword(!showGeneratePassword)}
          >
            {showGeneratePassword ? 
              <EyeOff size={16} className="opacity-70" /> : 
              <Eye size={16} className="opacity-70" />
            }
          </button>
        </div>
        {isGeneratingLengthWarning && (
          <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
            {t('tools.bcrypt.passwordLengthWarning')}
          </p>
        )}
      </div>
      
      {/* Error Messages */}
      {generatingErrorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-red-400 text-sm flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>{generatingErrorMessage}</div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          icon={Key}
          onClick={generateHash}
          isLoading={isHashLoading}
        >
          {t('tools.bcrypt.generateHash')}
        </Button>
        
        <Button
          variant="secondary"
          onClick={loadGenerateSample}
        >
          {t('tools.bcrypt.loadSample')}
        </Button>
        
        <Button
          variant="outline"
          icon={RefreshCw}
          onClick={clearGenerateFields}
        >
          {t('tools.bcrypt.clear')}
        </Button>
      </div>
      
      {/* Generated Hash Result */}
      {hashResult && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('tools.bcrypt.generatedHash')}
            </label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={copied ? Check : Copy}
                onClick={copyToClipboard}
              >
                {copied ? t('tools.bcrypt.copied') : t('tools.bcrypt.copy')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Lock}
                onClick={useHashInVerify}
                title={t('tools.bcrypt.useInVerify')}
              >
                {t('tools.bcrypt.useInVerify')}
              </Button>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <p className="text-sm font-mono break-all">{hashResult}</p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-900/30">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
              {t('tools.bcrypt.hashDetails')}
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 pl-5 list-disc">
              <li>{t('tools.bcrypt.hashDetailVersion')}</li>
              <li>{t('tools.bcrypt.hashDetailCost')} {saltRounds}</li>
              <li>{t('tools.bcrypt.hashDetailSalt')}</li>
              <li>{t('tools.bcrypt.hashDetailHash')}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
  
  // Render the Verify section
  const renderVerifySection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
        <Lock className="mr-2 h-5 w-5 text-primary-500" />
        {t('tools.bcrypt.verifyMode')}
      </h3>
      
      {/* Password Input */}
      <div>
        <label htmlFor="verify-password-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tools.bcrypt.passwordToCheck')}
        </label>
        <div className="relative">
          <input
            type={showVerifyPassword ? "text" : "password"}
            id="verify-password-input"
            value={verifyPassword}
            onChange={handleVerifyPasswordChange}
            placeholder={t('tools.bcrypt.passwordCheckPlaceholder')}
            className="w-full px-3 py-2 pr-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <button 
            type="button"
            className="absolute inset-y-0 right-0 px-2 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent"
            onClick={() => setShowVerifyPassword(!showVerifyPassword)}
          >
            {showVerifyPassword ? 
              <EyeOff size={16} className="opacity-70" /> : 
              <Eye size={16} className="opacity-70" />
            }
          </button>
        </div>
        {isVerifyingLengthWarning && (
          <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
            {t('tools.bcrypt.passwordLengthWarning')}
          </p>
        )}
      </div>
      
      {/* Hash Input */}
      <div>
        <label htmlFor="hash-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tools.bcrypt.hashInput')}
        </label>
        <input
          type="text"
          id="hash-input"
          value={hashToVerify}
          onChange={(e) => setHashToVerify(e.target.value)}
          placeholder={t('tools.bcrypt.hashPlaceholder')}
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
        />
      </div>
      
      {/* Error Messages */}
      {verifyingErrorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-red-400 text-sm flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>{verifyingErrorMessage}</div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          icon={Lock}
          onClick={verifyHash}
          isLoading={isVerifying}
        >
          {t('tools.bcrypt.verifyHash')}
        </Button>
        
        <Button
          variant="secondary"
          onClick={loadVerifySample}
        >
          {t('tools.bcrypt.loadSample')}
        </Button>
        
        <Button
          variant="outline"
          icon={RefreshCw}
          onClick={clearVerifyFields}
        >
          {t('tools.bcrypt.clear')}
        </Button>
      </div>
      
      {/* Verification Result */}
      {verificationResult !== null && (
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
                    {t('tools.bcrypt.hashMatch')}
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    {t('tools.bcrypt.hashMatchDescription')}
                  </p>
                </div>
              </>
            ) : (
              <>
                <Shield className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
                <div>
                  <h3 className="text-base font-medium text-red-800 dark:text-red-300">
                    {t('tools.bcrypt.hashMismatch')}
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    {t('tools.bcrypt.hashMismatchDescription')}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="space-y-6">
      {/* Load bcrypt-js library */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/bcryptjs/2.4.3/bcrypt.min.js"
        onLoad={() => window.bcryptLoaded()}
      />
      
      <Card
        title={t('tools.bcrypt.name')}
        description={t('tools.bcrypt.description')}
        icon={Shield}
      >
        {/* Layout container for different screens */}
        <div className="space-y-8 xl:space-y-0 xl:flex xl:gap-8">
          {/* Generate Section */}
          <div className="xl:w-1/2 space-y-4">
            {renderGenerateSection()}
          </div>
          
          {/* Divider line for xl screens */}
          <div className="hidden xl:block w-px bg-gray-200 dark:bg-gray-700"></div>
          
          {/* Verify Section */}
          <div className="xl:w-1/2 space-y-4">
            {renderVerifySection()}
          </div>
        </div>
      </Card>
      
      {/* Information Card */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.bcrypt.aboutTitle')}</h3>
          <p>{t('tools.bcrypt.aboutDescription')}</p>
          
          <h4>{t('tools.bcrypt.howItWorksTitle')}</h4>
          <ol>
            <li>{t('tools.bcrypt.howItWorks1')}</li>
            <li>{t('tools.bcrypt.howItWorks2')}</li>
            <li>{t('tools.bcrypt.howItWorks3')}</li>
            <li>{t('tools.bcrypt.howItWorks4')}</li>
          </ol>
          
          <h4>{t('tools.bcrypt.bestPracticesTitle')}</h4>
          <ul>
            <li>{t('tools.bcrypt.bestPractice1')}</li>
            <li>{t('tools.bcrypt.bestPractice2')}</li>
            <li>{t('tools.bcrypt.bestPractice3')}</li>
            <li>{t('tools.bcrypt.bestPractice4')}</li>
          </ul>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-900/30 mt-4">
            <h4 className="text-yellow-800 dark:text-yellow-300 text-base font-medium">{t('tools.bcrypt.securityNoteTitle')}</h4>
            <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">{t('tools.bcrypt.securityNoteText')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}