// src/components/tools/qr-generator/QrGenerator.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { QrCode, Download, Copy, Check, RefreshCw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function QrGenerator() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [qrType, setQrType] = useState('text'); // text, url, email, phone, wifi
  const [qrOptions, setQrOptions] = useState({
    size: 256,
    errorCorrectionLevel: 'M',
    fgColor: '#000000',
    bgColor: '#ffffff',
  });
  const [wifiOptions, setWifiOptions] = useState({
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });
  const [vCardOptions, setVCardOptions] = useState({
    name: '',
    phone: '',
    email: '',
    organization: '',
    website: '',
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);
  
  // Generate QR code
  useEffect(() => {
    if (!input && qrType !== 'wifi' && qrType !== 'vcard') return;
    
    let data = input;
    
    // Format data based on type
    switch (qrType) {
      case 'url':
        if (input && !input.match(/^https?:\/\//)) {
          data = `https://${input}`;
        }
        break;
      case 'email':
        data = input ? `mailto:${input}` : '';
        break;
      case 'phone':
        data = input ? `tel:${input}` : '';
        break;
      case 'wifi':
        const { ssid, password, encryption, hidden } = wifiOptions;
        if (ssid) {
          data = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
        }
        break;
      case 'vcard':
        const { name, phone, email, organization, website } = vCardOptions;
        if (name || phone || email) {
          data = `BEGIN:VCARD\nVERSION:3.0\n`;
          if (name) data += `FN:${name}\n`;
          if (phone) data += `TEL:${phone}\n`;
          if (email) data += `EMAIL:${email}\n`;
          if (organization) data += `ORG:${organization}\n`;
          if (website) data += `URL:${website}\n`;
          data += `END:VCARD`;
        }
        break;
    }
    
    if (!data) return;
    
    // Generate QR code using API
    const params = new URLSearchParams({
      size: `${qrOptions.size}x${qrOptions.size}`,
      data: data,
      ecc: qrOptions.errorCorrectionLevel,
      color: qrOptions.fgColor.replace('#', ''),
      bgcolor: qrOptions.bgColor.replace('#', ''),
    });
    
    const url = `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
    setQrCodeUrl(url);
  }, [input, qrType, qrOptions, wifiOptions, vCardOptions]);
  
  // Download QR code
  const downloadQR = async () => {
    if (!qrCodeUrl) return;
    
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };
  
  // Copy QR code to clipboard
  const copyQR = async () => {
    if (!qrCodeUrl) return;
    
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying QR code:', error);
    }
  };
  
  // Load sample data
  const loadSample = () => {
    switch (qrType) {
      case 'text':
        setInput('Hello, World! This is a QR code test.');
        break;
      case 'url':
        setInput('https://example.com');
        break;
      case 'email':
        setInput('example@email.com');
        break;
      case 'phone':
        setInput('+1234567890');
        break;
      case 'wifi':
        setWifiOptions({
          ssid: 'MyWiFiNetwork',
          password: 'password123',
          encryption: 'WPA',
          hidden: false,
        });
        break;
      case 'vcard':
        setVCardOptions({
          name: 'John Doe',
          phone: '+1234567890',
          email: 'john@example.com',
          organization: 'Example Corp',
          website: 'https://example.com',
        });
        break;
    }
  };
  
  // Clear all
  const clearAll = () => {
    setInput('');
    setWifiOptions({
      ssid: '',
      password: '',
      encryption: 'WPA',
      hidden: false,
    });
    setVCardOptions({
      name: '',
      phone: '',
      email: '',
      organization: '',
      website: '',
    });
    setQrCodeUrl('');
  };

  // Render input fields based on QR type
  const renderInputFields = () => {
    switch (qrType) {
      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="wifi-ssid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tools.qr-generator.ssid')}
              </label>
              <input
                type="text"
                id="wifi-ssid"
                value={wifiOptions.ssid}
                onChange={(e) => setWifiOptions({...wifiOptions, ssid: e.target.value})}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label htmlFor="wifi-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tools.qr-generator.password')}
              </label>
              <input
                type="text"
                id="wifi-password"
                value={wifiOptions.password}
                onChange={(e) => setWifiOptions({...wifiOptions, password: e.target.value})}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label htmlFor="wifi-encryption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tools.qr-generator.encryption')}
              </label>
              <select
                id="wifi-encryption"
                value={wifiOptions.encryption}
                onChange={(e) => setWifiOptions({...wifiOptions, encryption: e.target.value})}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="wifi-hidden"
                checked={wifiOptions.hidden}
                onChange={(e) => setWifiOptions({...wifiOptions, hidden: e.target.checked})}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="wifi-hidden" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {t('tools.qr-generator.hiddenNetwork')}
              </label>
            </div>
          </div>
        );
      
      case 'vcard':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="vcard-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tools.qr-generator.fullName')}
              </label>
              <input
                type="text"
                id="vcard-name"
                value={vCardOptions.name}
                onChange={(e) => setVCardOptions({...vCardOptions, name: e.target.value})}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label htmlFor="vcard-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tools.qr-generator.phone')}
              </label>
              <input
                type="tel"
                id="vcard-phone"
                value={vCardOptions.phone}
                onChange={(e) => setVCardOptions({...vCardOptions, phone: e.target.value})}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label htmlFor="vcard-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tools.qr-generator.email')}
              </label>
              <input
                type="email"
                id="vcard-email"
                value={vCardOptions.email}
                onChange={(e) => setVCardOptions({...vCardOptions, email: e.target.value})}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label htmlFor="vcard-org" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tools.qr-generator.organization')}
              </label>
              <input
                type="text"
                id="vcard-org"
                value={vCardOptions.organization}
                onChange={(e) => setVCardOptions({...vCardOptions, organization: e.target.value})}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label htmlFor="vcard-website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tools.qr-generator.website')}
              </label>
              <input
                type="url"
                id="vcard-website"
                value={vCardOptions.website}
                onChange={(e) => setVCardOptions({...vCardOptions, website: e.target.value})}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div>
            <label htmlFor="qr-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.qr-generator.inputLabel')[qrType]}
            </label>
            <textarea
              id="qr-input"
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('tools.qr-generator.placeholder')[qrType]}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card
        title={t('tools.qr-generator.name')}
        description={t('tools.qr-generator.description')}
        icon={QrCode}
      >
        <div className="space-y-4">
          {/* QR Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('tools.qr-generator.selectType')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {['text', 'url', 'email', 'phone', 'wifi', 'vcard'].map((type) => (
                <button
                  key={type}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    qrType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setQrType(type)}
                >
                  {t(`tools.qr-generator.types.${type}`)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Input fields */}
          {renderInputFields()}
          
          {/* QR Options */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('tools.qr-generator.options')}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="qr-size" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {t('tools.qr-generator.size')}: {qrOptions.size}px
                </label>
                <input
                  type="range"
                  id="qr-size"
                  min="128"
                  max="512"
                  step="8"
                  value={qrOptions.size}
                  onChange={(e) => setQrOptions({...qrOptions, size: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="qr-error" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {t('tools.qr-generator.errorCorrection')}
                </label>
                <select
                  id="qr-error"
                  value={qrOptions.errorCorrectionLevel}
                  onChange={(e) => setQrOptions({...qrOptions, errorCorrectionLevel: e.target.value})}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="qr-fgcolor" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {t('tools.qr-generator.foregroundColor')}
                </label>
                <input
                  type="color"
                  id="qr-fgcolor"
                  value={qrOptions.fgColor}
                  onChange={(e) => setQrOptions({...qrOptions, fgColor: e.target.value})}
                  className="w-full h-10 px-1 py-1 rounded-md border border-gray-300 dark:border-gray-700"
                />
              </div>
              
              <div>
                <label htmlFor="qr-bgcolor" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {t('tools.qr-generator.backgroundColor')}
                </label>
                <input
                  type="color"
                  id="qr-bgcolor"
                  value={qrOptions.bgColor}
                  onChange={(e) => setQrOptions({...qrOptions, bgColor: e.target.value})}
                  className="w-full h-10 px-1 py-1 rounded-md border border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={loadSample}
            >
              {t('tools.qr-generator.loadSample')}
            </Button>
            
            <Button
              variant="secondary"
              onClick={clearAll}
              icon={RefreshCw}
            >
              {t('tools.qr-generator.clear')}
            </Button>
          </div>
          
          {/* QR Code Preview */}
          {qrCodeUrl && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('tools.qr-generator.preview')}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Download}
                    onClick={downloadQR}
                  >
                    {t('tools.qr-generator.download')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={copied ? Check : Copy}
                    onClick={copyQR}
                  >
                    {copied ? t('tools.qr-generator.copied') : t('tools.qr-generator.copy')}
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  width={qrOptions.size}
                  height={qrOptions.size}
                  className="max-w-full"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Info */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.qr-generator.aboutTitle')}</h3>
          <p>{t('tools.qr-generator.aboutDescription')}</p>
          <ul>
            <li>{t('tools.qr-generator.feature1')}</li>
            <li>{t('tools.qr-generator.feature2')}</li>
            <li>{t('tools.qr-generator.feature3')}</li>
            <li>{t('tools.qr-generator.feature4')}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}