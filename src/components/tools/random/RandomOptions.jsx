// src/components/tools/random/RandomOptions.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function RandomOptions({
  type,
  stringOptions,
  numberOptions,
  uuidOptions,
  passwordOptions,
  listOptions,
}) {
  const { t } = useTranslation();

  switch (type) {
    case 'string':
      return <StringOptions options={stringOptions} t={t} />;
    case 'number':
      return <NumberOptions options={numberOptions} t={t} />;
    case 'uuid':
      return <UuidOptions options={uuidOptions} t={t} />;
    case 'password':
      return <PasswordOptions options={passwordOptions} t={t} />;
    case 'list':
      return <ListOptions options={listOptions} t={t} />;
    default:
      return <StringOptions options={stringOptions} t={t} />;
  }
}

function StringOptions({ options, t }) {
  const {
    length,
    setLength,
    includeUppercase,
    setIncludeUppercase,
    includeLowercase,
    setIncludeLowercase,
    includeNumbers,
    setIncludeNumbers,
    includeSymbols,
    setIncludeSymbols,
  } = options;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tools.random.length')}: {length}
        </label>
        <input
          type="range"
          min="1"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>1</span>
          <span>32</span>
          <span>64</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('tools.random.include')}
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="include-uppercase"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="include-uppercase" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {t('tools.random.uppercase')}
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="include-lowercase"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="include-lowercase" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {t('tools.random.lowercase')}
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="include-numbers"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="include-numbers" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {t('tools.random.numbers')}
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="include-symbols"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="include-symbols" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {t('tools.random.symbols')}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberOptions({ options, t }) {
  const {
    min,
    setMin,
    max,
    setMax,
    quantity,
    setQuantity,
    allowDuplicates,
    setAllowDuplicates,
  } = options;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="min-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('tools.random.minValue')}
          </label>
          <input
            type="number"
            id="min-number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="max-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('tools.random.maxValue')}
          </label>
          <input
            type="number"
            id="max-number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('tools.random.quantity')}: {quantity}
        </label>
        <input
          type="range"
          id="quantity"
          min="1"
          max="100"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>1</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="allow-duplicates"
          checked={allowDuplicates}
          onChange={(e) => setAllowDuplicates(e.target.checked)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="allow-duplicates" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          {t('tools.random.allowDuplicates')}
        </label>
      </div>
    </div>
  );
}

function UuidOptions({ options, t }) {
  const { version, setVersion } = options;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t('tools.random.uuidVersion')}
      </label>
      <div className="flex space-x-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="uuid-v1"
            name="uuid-version"
            value="1"
            checked={version === 1}
            onChange={() => setVersion(1)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
          />
          <label htmlFor="uuid-v1" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            v1 (time-based)
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="uuid-v4"
            name="uuid-version"
            value="4"
            checked={version === 4}
            onChange={() => setVersion(4)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
          />
          <label htmlFor="uuid-v4" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            v4 (random)
          </label>
        </div>
      </div>
    </div>
  );
}

function PasswordOptions({ options, t }) {
  const { length, setLength, strength, setStrength } = options;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tools.random.length')}: {length}
        </label>
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>8</span>
          <span>20</span>
          <span>32</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tools.random.passwordStrength')}
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="strength-weak"
              name="password-strength"
              value="weak"
              checked={strength === 'weak'}
              onChange={() => setStrength('weak')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <label htmlFor="strength-weak" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {t('tools.random.weak')}
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="strength-medium"
              name="password-strength"
              value="medium"
              checked={strength === 'medium'}
              onChange={() => setStrength('medium')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <label htmlFor="strength-medium" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {t('tools.random.medium')}
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="strength-strong"
              name="password-strength"
              value="strong"
              checked={strength === 'strong'}
              onChange={() => setStrength('strong')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <label htmlFor="strength-strong" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {t('tools.random.strong')}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListOptions({ options, t }) {
  const { items, setItems } = options;

  return (
    <div>
      <label htmlFor="list-items" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t('tools.random.listItems')}
      </label>
      <textarea
        id="list-items"
        rows={6}
        value={items}
        onChange={(e) => setItems(e.target.value)}
        placeholder={t('tools.random.listItemsPlaceholder')}
        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-primary-500 focus:border-primary-500"
      />
    </div>
  );
}