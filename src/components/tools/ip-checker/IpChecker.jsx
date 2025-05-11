// src/components/tools/ip-checker/IpChecker.jsx
'use client';

import { useState, useEffect } from 'react';
import { Network, Copy, Check, RefreshCw, MapPin, Globe } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function IpChecker() {
  const { t } = useTranslation();
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [additionalData, setAdditionalData] = useState(null);
  
  // Fetch IP information
  const fetchIpInfo = async () => {
    setLoading(true);
    setError('');
    
    try {
      // First API call to get basic IP info
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      
      // Second API call to get detailed information
      const detailsResponse = await fetch(`http://ip-api.com/json/${data.ip}`);
      const details = await detailsResponse.json();
      
      setIpData({
        ip: data.ip,
        ...details
      });
      
      // Optional: Get additional info from another API
      try {
        const additionalResponse = await fetch(`https://ipapi.co/${data.ip}/json/`);
        const additionalInfo = await additionalResponse.json();
        setAdditionalData(additionalInfo);
      } catch (err) {
        console.error('Error fetching additional data:', err);
      }
      
    } catch (err) {
      setError(t('tools.ip-checker.errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  // Load IP info on component mount
  useEffect(() => {
    fetchIpInfo();
  }, []);
  
  // Copy IP to clipboard
  const copyIp = () => {
    if (!ipData?.ip) return;
    
    navigator.clipboard.writeText(ipData.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Format location string
  const formatLocation = () => {
    if (!ipData) return '';
    
    const parts = [];
    if (ipData.city) parts.push(ipData.city);
    if (ipData.regionName) parts.push(ipData.regionName);
    if (ipData.country) parts.push(ipData.country);
    
    return parts.join(', ');
  };
  
  // Get flag emoji
  const getFlagEmoji = (countryCode) => {
    if (!countryCode) return '';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="space-y-6">
      <Card
        title={t('tools.ip-checker.name')}
        description={t('tools.ip-checker.description')}
        icon={Network}
      >
        <div className="space-y-4">
          {/* Current IP Address */}
          {ipData && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('tools.ip-checker.yourIp')}
                  </h3>
                  <p className="text-2xl font-mono mt-1">{ipData.ip}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    icon={copied ? Check : Copy}
                    onClick={copyIp}
                  >
                    {copied ? t('tools.ip-checker.copied') : t('tools.ip-checker.copy')}
                  </Button>
                  <Button
                    variant="outline"
                    icon={RefreshCw}
                    onClick={fetchIpInfo}
                    disabled={loading}
                  >
                    {t('tools.ip-checker.refresh')}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Loading state */}
          {loading && (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
              <p className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.loading')}</p>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          
          {/* Detailed Information */}
          {ipData && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                  {t('tools.ip-checker.location')}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.country')}:</span>
                    <span className="font-medium">
                      {getFlagEmoji(ipData.countryCode)} {ipData.country}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.region')}:</span>
                    <span className="font-medium">{ipData.regionName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.city')}:</span>
                    <span className="font-medium">{ipData.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.zipCode')}:</span>
                    <span className="font-medium">{ipData.zip || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.coordinates')}:</span>
                    <span className="font-medium">{ipData.lat}, {ipData.lon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.timezone')}:</span>
                    <span className="font-medium">{ipData.timezone}</span>
                  </div>
                </div>
              </div>
              
              {/* Network Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-primary-600" />
                  {t('tools.ip-checker.network')}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.isp')}:</span>
                    <span className="font-medium">{ipData.isp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.organization')}:</span>
                    <span className="font-medium">{ipData.org}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.asn')}:</span>
                    <span className="font-medium">{ipData.as}</span>
                  </div>
                  {additionalData?.connection && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.connectionType')}:</span>
                      <span className="font-medium">{additionalData.connection.type}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.proxy')}:</span>
                    <span className={`font-medium ${ipData.proxy ? 'text-red-600' : 'text-green-600'}`}>
                      {ipData.proxy ? t('tools.ip-checker.yes') : t('tools.ip-checker.no')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Map */}
          {ipData && ipData.lat && ipData.lon && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('tools.ip-checker.mapLocation')}
              </h3>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="300"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${ipData.lon-0.01},${ipData.lat-0.01},${ipData.lon+0.01},${ipData.lat+0.01}&layer=mapnik&marker=${ipData.lat},${ipData.lon}`}
                  className="w-full h-[300px]"
                ></iframe>
              </div>
            </div>
          )}
          
          {/* Additional Information */}
          {additionalData && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('tools.ip-checker.additionalInfo')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {additionalData.currency && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.currency')}:</span>
                    <span className="font-medium">{additionalData.currency}</span>
                  </div>
                )}
                {additionalData.languages && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.languages')}:</span>
                    <span className="font-medium">{additionalData.languages}</span>
                  </div>
                )}
                {additionalData.country_calling_code && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('tools.ip-checker.callingCode')}:</span>
                    <span className="font-medium">{additionalData.country_calling_code}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Info */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.ip-checker.aboutTitle')}</h3>
          <p>{t('tools.ip-checker.aboutDescription')}</p>
          <ul>
            <li>{t('tools.ip-checker.feature1')}</li>
            <li>{t('tools.ip-checker.feature2')}</li>
            <li>{t('tools.ip-checker.feature3')}</li>
            <li>{t('tools.ip-checker.feature4')}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}