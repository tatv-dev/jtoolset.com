// src/components/tools/domain-ip/DomainIp.jsx
'use client';

import { useState } from 'react';
import { Globe, Search, Copy, Check, RefreshCw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function DomainIp() {
  const { t } = useTranslation();
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  
  // Validate domain
  const validateDomain = (domain) => {
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };
  
  // Clean domain
  const cleanDomain = (input) => {
    // Remove protocol if present
    let cleaned = input.replace(/^(https?:\/\/)?(www\.)?/, '');
    // Remove path and query string
    cleaned = cleaned.split('/')[0].split('?')[0];
    return cleaned.toLowerCase();
  };
  
  // Lookup IP address
  const lookupIp = async () => {
    const cleanedDomain = cleanDomain(domain);
    
    if (!cleanedDomain) {
      setError(t('tools.domain-ip.errors.enterDomain'));
      return;
    }
    
    if (!validateDomain(cleanedDomain)) {
      setError(t('tools.domain-ip.errors.invalidDomain'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // We'll use DNS lookup API
      const response = await fetch(`https://dns.google/resolve?name=${cleanedDomain}&type=A`);
      const data = await response.json();
      
      if (data.Answer && data.Answer.length > 0) {
        const ipAddresses = data.Answer.filter(answer => answer.type === 1).map(answer => answer.data);
        
        // Get additional information about the first IP
        const ipInfo = await fetch(`http://ip-api.com/json/${ipAddresses[0]}`);
        const ipDetails = await ipInfo.json();
        
        const result = {
          domain: cleanedDomain,
          ipAddresses,
          primary: ipAddresses[0],
          details: ipDetails,
          records: data.Answer,
          timestamp: new Date().toISOString()
        };
        
        setResult(result);
        
        // Add to history
        setHistory(prev => [result, ...prev.filter(h => h.domain !== cleanedDomain)].slice(0, 10));
      } else {
        setError(t('tools.domain-ip.errors.noRecords'));
      }
    } catch (err) {
      setError(t('tools.domain-ip.errors.lookupFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  // Copy IP to clipboard
  const copyIp = (ip) => {
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Load sample domain
  const loadSample = () => {
    setDomain('google.com');
  };
  
  // Clear results
  const clearResults = () => {
    setDomain('');
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <Card
        title={t('tools.domain-ip.name')}
        description={t('tools.domain-ip.description')}
        icon={Globe}
      >
        <div className="space-y-4">
          {/* Domain Input */}
          <div>
            <label htmlFor="domain-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.domain-ip.domainName')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="domain-input"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder={t('tools.domain-ip.placeholder')}
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                onKeyPress={(e) => e.key === 'Enter' && lookupIp()}
              />
              <Button
                variant="primary"
                icon={Search}
                onClick={lookupIp}
                disabled={loading}
              >
                {t('tools.domain-ip.lookup')}
              </Button>
            </div>
          </div>
          
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          
          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
              <p className="text-gray-600 dark:text-gray-400">{t('tools.domain-ip.loading')}</p>
            </div>
          )}
          
          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Primary IP */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('tools.domain-ip.primaryIp')}
                    </h3>
                    <p className="text-2xl font-mono mt-1">{result.primary}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t('tools.domain-ip.domain')}: {result.domain}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    icon={copied ? Check : Copy}
                    onClick={() => copyIp(result.primary)}
                  >
                    {copied ? t('tools.domain-ip.copied') : t('tools.domain-ip.copy')}
                  </Button>
                </div>
              </div>
              
              {/* All IP Addresses */}
              {result.ipAddresses.length > 1 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {t('tools.domain-ip.allIps')}
                  </h3>
                  <div className="space-y-2">
                    {result.ipAddresses.map((ip, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <span className="font-mono">{ip}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Copy}
                          onClick={() => copyIp(ip)}
                        >
                          {t('tools.domain-ip.copy')}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* IP Details */}
              {result.details && result.details.status === 'success' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {t('tools.domain-ip.ipDetails')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('tools.domain-ip.country')}:</span>
                      <span className="font-medium">{result.details.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('tools.domain-ip.city')}:</span>
                      <span className="font-medium">{result.details.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('tools.domain-ip.isp')}:</span>
                      <span className="font-medium">{result.details.isp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('tools.domain-ip.organization')}:</span>
                      <span className="font-medium">{result.details.org}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* DNS Records */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  {t('tools.domain-ip.dnsRecords')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th className="px-4 py-3">{t('tools.domain-ip.type')}</th>
                        <th className="px-4 py-3">{t('tools.domain-ip.ttl')}</th>
                        <th className="px-4 py-3">{t('tools.domain-ip.data')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.records.map((record, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-4 py-3">{record.type === 1 ? 'A' : record.type}</td>
                          <td className="px-4 py-3">{record.TTL}</td>
                          <td className="px-4 py-3 font-mono">{record.data}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={loadSample}
            >
              {t('tools.domain-ip.loadSample')}
            </Button>
            
            <Button
              variant="outline"
              onClick={clearResults}
              icon={RefreshCw}
            >
              {t('tools.domain-ip.clear')}
            </Button>
          </div>
          
          {/* History */}
          {history.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                {t('tools.domain-ip.history')}
              </h3>
              <div className="space-y-2">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setDomain(item.domain);
                      setResult(item);
                    }}
                  >
                    <div>
                      <span className="font-medium">{item.domain}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">→</span>
                      <span className="ml-2 font-mono">{item.primary}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
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
          <h3>{t('tools.domain-ip.aboutTitle')}</h3>
          <p>{t('tools.domain-ip.aboutDescription')}</p>
          <ul>
            <li>{t('tools.domain-ip.feature1')}</li>
            <li>{t('tools.domain-ip.feature2')}</li>
            <li>{t('tools.domain-ip.feature3')}</li>
            <li>{t('tools.domain-ip.feature4')}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}