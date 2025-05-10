// src/components/tools/hash-generator/HashGenerator.jsx
'use client';

import { useState, useEffect } from 'react';
import { Hash, Copy, Check, FileUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

// Calculate hash using browser's SubtleCrypto API
async function calculateHash(text, algorithm) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  try {
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

// Simple MD5 implementation for demonstration
// Note: For production, use a proper library
function md5(string) {
  // This is a placeholder - in production, use a proper MD5 library
  return 'MD5 hashing requires a library - using placeholder';
}

export default function HashGenerator() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({});
  const [copied, setCopied] = useState(null);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([
    'SHA-1',
    'SHA-256',
    'SHA-384',
    'SHA-512'
  ]);
  
  const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
  
  // Generate hashes whenever input or algorithms change
  useEffect(() => {
    if (!input.trim()) {
      setHashes({});
      return;
    }
    
    const generateHashes = async () => {
      const newHashes = {};
      
      for (const algo of selectedAlgorithms) {
        if (algo === 'MD5') {
          newHashes[algo] = md5(input);
        } else {
          newHashes[algo] = await calculateHash(input, algo);
        }
      }
      
      setHashes(newHashes);
    };
    
    generateHashes();
  }, [input, selectedAlgorithms]);
  
  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const newHashes = {};
      
      for (const algo of selectedAlgorithms) {
        if (algo === 'MD5') {
          newHashes[algo] = 'File MD5 requires a library';
        } else {
          try {
            const hashBuffer = await crypto.subtle.digest(algo, arrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            newHashes[algo] = hashHex;
          } catch (error) {
            newHashes[algo] = `Error: ${error.message}`;
          }
        }
      }
      
      setHashes(newHashes);
      setInput(`File: ${file.name}`);
    };
    
    reader.readAsArrayBuffer(file);
  };
  
  // Copy to clipboard
  const handleCopy = (algo, hash) => {
    navigator.clipboard.writeText(hash);
    setCopied(algo);
    setTimeout(() => setCopied(null), 2000);
  };
  
  // Toggle algorithm selection
  const toggleAlgorithm = (algo) => {
    setSelectedAlgorithms(prev => 
      prev.includes(algo) 
        ? prev.filter(a => a !== algo)
        : [...prev, algo]
    );
  };
  
  // Clear all
  const clearAll = () => {
    setInput('');
    setHashes({});
  };

  return (
    <div className="space-y-6">
      <Card
        title={t('tools.hash-generator.name')}
        description={t('tools.hash-generator.description')}
        icon={Hash}
      >
        <div className="space-y-4">
          {/* Algorithm Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.hash-generator.selectAlgorithms')}
            </label>
            <div className="flex flex-wrap gap-2">
              {algorithms.map((algo) => (
                <button
                  key={algo}
                  onClick={() => toggleAlgorithm(algo)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    selectedAlgorithms.includes(algo)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>
          
          {/* Input */}
          <div>
            <label htmlFor="hash-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.hash-generator.input')}
            </label>
            <textarea
              id="hash-input"
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('tools.hash-generator.inputPlaceholder')}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          {/* File Upload */}
          <div className="flex items-center justify-center w-full">
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex flex-col items-center justify-center pt-3 pb-3">
                <FileUp className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">{t('tools.hash-generator.uploadFile')}</span>
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
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={clearAll}
            >
              {t('tools.hash-generator.clear')}
            </Button>
          </div>
          
          {/* Results */}
          {Object.keys(hashes).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('tools.hash-generator.results')}
              </h3>
              <div className="space-y-2">
                {Object.entries(hashes).map(([algo, hash]) => (
                  <div key={algo} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{algo}</span>
                      <Button
                        variant="outline"
                        size="xs"
                        icon={copied === algo ? Check : Copy}
                        onClick={() => handleCopy(algo, hash)}
                      >
                        {copied === algo ? t('tools.hash-generator.copied') : t('tools.hash-generator.copy')}
                      </Button>
                    </div>
                    <p className="text-sm font-mono break-all text-gray-600 dark:text-gray-400">{hash}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Info */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.hash-generator.aboutTitle')}</h3>
          <p>{t('tools.hash-generator.aboutDescription')}</p>
          <ul>
            <li><strong>SHA-1:</strong> {t('tools.hash-generator.sha1Info')}</li>
            <li><strong>SHA-256:</strong> {t('tools.hash-generator.sha256Info')}</li>
            <li><strong>SHA-384:</strong> {t('tools.hash-generator.sha384Info')}</li>
            <li><strong>SHA-512:</strong> {t('tools.hash-generator.sha512Info')}</li>
          </ul>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('tools.hash-generator.note')}
          </p>
        </div>
      </Card>
    </div>
  );
}