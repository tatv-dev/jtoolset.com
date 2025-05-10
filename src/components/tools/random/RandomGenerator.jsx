// src/components/tools/random/RandomGenerator.jsx
'use client';

import { useState } from 'react';
import { Shuffle, Copy, Check, RefreshCw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import RandomOptions from './RandomOptions';
import { useTranslation } from 'react-i18next';

export default function RandomGenerator() {
  const { t } = useTranslation();
  // Trạng thái
  const [generatorType, setGeneratorType] = useState('string');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Các options cho String Generator
  const [stringLength, setStringLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  
  // Options cho Number Generator
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  
  // Options cho UUID Generator
  const [uuidVersion, setUuidVersion] = useState(4);
  
  // Options cho Password Generator
  const [passwordLength, setPasswordLength] = useState(12);
  const [passwordStrength, setPasswordStrength] = useState('medium');
  
  // Options cho List Randomizer
  const [listItems, setListItems] = useState('');
  
  // Xử lý sao chép
  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Tạo chuỗi ngẫu nhiên
  const generateRandomString = () => {
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (chars.length === 0) {
      setResult(t('tools.random.errors.selectCharacterType'));
      return;
    }
    
    let result = '';
    for (let i = 0; i < stringLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setResult(result);
  };
  
  // Tạo số ngẫu nhiên
  const generateRandomNumbers = () => {
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    const qty = parseInt(quantity);
    
    if (isNaN(minNum) || isNaN(maxNum) || isNaN(qty)) {
      setResult(t('tools.random.errors.enterValidNumbers'));
      return;
    }
    
    if (minNum > maxNum) {
      setResult(t('tools.random.errors.minGreaterThanMax'));
      return;
    }
    
    if (qty < 1) {
      setResult(t('tools.random.errors.quantityLessThanOne'));
      return;
    }
    
    if (!allowDuplicates && (maxNum - minNum + 1) < qty) {
      setResult(t('tools.random.errors.cannotGenerateUnique', { qty, minNum, maxNum }));
      return;
    }
    
    let numbers = [];
    
    if (allowDuplicates) {
      for (let i = 0; i < qty; i++) {
        numbers.push(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
      }
    } else {
      // Fisher-Yates shuffle
      let pool = Array.from({ length: maxNum - minNum + 1 }, (_, i) => i + minNum);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      numbers = pool.slice(0, qty);
    }
    
    setResult(numbers.join(', '));
  };
  
  // Tạo UUID
  const generateUUID = () => {
    if (uuidVersion === 4) {
      // Version 4 (random)
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      setResult(uuid);
    } else {
      // Simplified version 1 (time-based)
      const now = new Date().getTime();
      const uuid = 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (now + Math.random() * 16) % 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      setResult(uuid);
    }
  };
  
  // Tạo mật khẩu
  const generatePassword = () => {
    let chars = '';
    
    switch (passwordStrength) {
      case 'weak':
        chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        break;
      case 'medium':
        chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
        break;
      case 'strong':
        chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        break;
      default:
        chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    }
    
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setResult(password);
  };
  
  // Tạo danh sách ngẫu nhiên
  const randomizeList = () => {
    if (!listItems.trim()) {
      setResult(t('tools.random.errors.enterItems'));
      return;
    }
    
    const items = listItems.split('\n').filter(item => item.trim() !== '');
    
    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    
    setResult(items.join('\n'));
  };
  
  // Xử lý tạo giá trị ngẫu nhiên dựa trên loại đã chọn
  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      switch (generatorType) {
        case 'string':
          generateRandomString();
          break;
        case 'number':
          generateRandomNumbers();
          break;
        case 'uuid':
          generateUUID();
          break;
        case 'password':
          generatePassword();
          break;
        case 'list':
          randomizeList();
          break;
        default:
          generateRandomString();
      }
      
      setIsGenerating(false);
    }, 300); // Thêm độ trễ nhỏ cho hiệu ứng
  };
  
  return (
    <div className="space-y-6">
      <Card
        title={t('tools.random.name')}
        description={t('tools.random.description')}
        icon={Shuffle}
      >
        <div className="space-y-4">
          {/* Generator Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.random.selectType')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  generatorType === 'string'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } border border-gray-200 dark:border-gray-700`}
                onClick={() => setGeneratorType('string')}
              >
                {t('tools.random.string')}
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  generatorType === 'number'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } border border-gray-200 dark:border-gray-700`}
                onClick={() => setGeneratorType('number')}
              >
                {t('tools.random.number')}
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  generatorType === 'uuid'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } border border-gray-200 dark:border-gray-700`}
                onClick={() => setGeneratorType('uuid')}
              >
                {t('tools.random.uuid')}
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  generatorType === 'password'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } border border-gray-200 dark:border-gray-700`}
                onClick={() => setGeneratorType('password')}
              >
                {t('tools.random.password')}
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  generatorType === 'list'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } border border-gray-200 dark:border-gray-700`}
                onClick={() => setGeneratorType('list')}
              >
                {t('tools.random.list')}
              </button>
            </div>
          </div>
          
          {/* Generator Options */}
          <RandomOptions
            type={generatorType}
            stringOptions={{
              length: stringLength,
              setLength: setStringLength,
              includeUppercase,
              setIncludeUppercase,
              includeLowercase,
              setIncludeLowercase,
              includeNumbers,
              setIncludeNumbers,
              includeSymbols,
              setIncludeSymbols,
            }}
            numberOptions={{
              min,
              setMin,
              max,
              setMax,
              quantity,
              setQuantity,
              allowDuplicates,
              setAllowDuplicates,
            }}
            uuidOptions={{
              version: uuidVersion,
              setVersion: setUuidVersion,
            }}
            passwordOptions={{
              length: passwordLength,
              setLength: setPasswordLength,
              strength: passwordStrength,
              setStrength: setPasswordStrength,
            }}
            listOptions={{
              items: listItems,
              setItems: setListItems,
            }}
          />
          
          {/* Generate Button */}
          <div className="mt-4">
            <Button
              variant="primary"
              size="lg"
              icon={isGenerating ? RefreshCw : Shuffle}
              onClick={handleGenerate}
              className={`w-full`}
              disabled={isGenerating}
            >
              {t('tools.random.generate')}
            </Button>
          </div>
          
          {/* Results */}
          {result && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('tools.random.result')}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  icon={copied ? Check : Copy}
                  onClick={handleCopy}
                >
                  {copied ? t('common.copied') : t('common.copy')}
                </Button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <pre className="whitespace-pre-wrap break-all font-mono text-sm">{result}</pre>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}