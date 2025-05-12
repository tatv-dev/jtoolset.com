// src/components/tools/domain-ip/DomainIp.jsx
'use client';

import { useState } from 'react';
import { Globe, Search, Copy, Check, RefreshCw, AlertTriangle } from 'lucide-react';
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
      // Array của các API alternatives để thử
      const dnsApis = [
        // API có CORS và HTTPS - dùng DNS over HTTPS
        {
          url: `https://cloudflare-dns.com/dns-query?name=${cleanedDomain}&type=A`,
          headers: { 'Accept': 'application/dns-json' },
          parser: async (response) => {
            const data = await response.json();
            if (data.Answer && data.Answer.length > 0) {
              const ipAddresses = data.Answer
                .filter(answer => answer.type === 1)
                .map(answer => answer.data);
              
              // Mặc định một số thông tin cơ bản
              return {
                success: true,
                domain: cleanedDomain,
                ipAddresses,
                primary: ipAddresses[0],
                records: data.Answer
              };
            }
            return { success: false };
          }
        },
        // Google Public DNS API
        {
          url: `https://dns.google/resolve?name=${cleanedDomain}&type=A`,
          parser: async (response) => {
            const data = await response.json();
            if (data.Answer && data.Answer.length > 0) {
              const ipAddresses = data.Answer
                .filter(answer => answer.type === 1)
                .map(answer => answer.data);
              
              return {
                success: true,
                domain: cleanedDomain,
                ipAddresses,
                primary: ipAddresses[0],
                records: data.Answer
              };
            }
            return { success: false };
          }
        },
        // Giả lập kết quả nếu các API khác thất bại 
        // (cần thêm một API backend của bạn hoặc sử dụng proxy)
        {
          url: `https://api.example.com/mock-dns?domain=${cleanedDomain}`,
          useSimulation: true,
          parser: async () => {
            // Tạo random IP để mô phỏng - nên thay thế bằng API thực
            const fakeIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            
            return {
              success: true,
              domain: cleanedDomain,
              ipAddresses: [fakeIp],
              primary: fakeIp,
              records: [
                {
                  name: cleanedDomain,
                  type: 1,
                  TTL: 300,
                  data: fakeIp
                }
              ],
              simulated: true
            };
          }
        }
      ];
      
      // Thử từng API cho đến khi một cái thành công
      let dnsResult = null;
      
      for (const api of dnsApis) {
        try {
          if (api.useSimulation) {
            // Dùng mô phỏng dữ liệu nếu các API thực thất bại
            dnsResult = await api.parser();
            break;
          }
          
          const options = {
            method: 'GET',
            headers: api.headers || {}
          };
          
          const response = await fetch(api.url, options);
          
          if (!response.ok) {
            continue; // Thử API tiếp theo
          }
          
          const result = await api.parser(response);
          if (result.success) {
            dnsResult = result;
            break;
          }
        } catch (err) {
          console.warn(`Failed with API: ${api.url}`, err);
          // Tiếp tục với API tiếp theo
        }
      }
      
      if (!dnsResult || !dnsResult.success) {
        throw new Error(t('tools.domain-ip.errors.noRecords'));
      }
      
      // Thử lấy thông tin IP chi tiết (cũng sử dụng API có hỗ trợ HTTPS)
      // Chú ý: ip-api.com chỉ hỗ trợ HTTP miễn phí, cần sử dụng các API thay thế
      try {
        // Thử dengan ipinfo.io có hỗ trợ HTTPS
        const ipInfoResponse = await fetch(`https://ipinfo.io/${dnsResult.primary}/json`);
        if (ipInfoResponse.ok) {
          const ipDetails = await ipInfoResponse.json();
          
          // Thêm thông tin chi tiết IP
          dnsResult.details = {
            country: ipDetails.country,
            city: ipDetails.city,
            org: ipDetails.org,
            isp: ipDetails.org // Ipinfo.io không phân biệt ISP và Org
          };
        }
      } catch (ipErr) {
        console.warn("Could not fetch IP details", ipErr);
        // Thêm dữ liệu chi tiết mặc định nếu không có dữ liệu thực
        if (dnsResult.simulated) {
          dnsResult.details = {
            country: "Unknown",
            city: "Unknown",
            org: "Unknown",
            isp: "Unknown"
          };
        }
      }
      
      // Thêm timestamp cho lịch sử
      dnsResult.timestamp = new Date().toISOString();
      
      setResult(dnsResult);
      
      // Add to history
      setHistory(prev => [dnsResult, ...prev.filter(h => h.domain !== cleanedDomain)].slice(0, 10));
    } catch (err) {
      setError(t('tools.domain-ip.errors.lookupFailed'));
      console.error("Lookup error:", err);
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
                    
                    {result.simulated && (
                      <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                        Note: This is simulated data. Install a CORS proxy or use a backend API for real DNS lookups.
                      </div>
                    )}
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
              {result.details && (
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