'use client';
'use client';

import { useState, useRef, useEffect } from 'react';
import { QrCode, Download, Copy, Check, RefreshCw, Settings, Palette, Shield } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { useScript } from '@/hooks/useScript';

export default function QrGenerator() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [qrType, setQrType] = useState('text'); // text, url, email, phone, wifi
  const [qrOptions, setQrOptions] = useState({
    size: 256,
    errorCorrectionLevel: 'M',
    fgColor: '#000000',
    bgColor: '#ffffff',
    padding: 20, // Added padding option with default value
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
  const qrContainerRef = useRef(null);
  
  // Load QR code library
  const qrLibStatus = useScript('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js');
  
  // Generate QR code
  useEffect(() => {
    if (qrLibStatus !== 'ready') return;
    if (!input && qrType !== 'wifi' && qrType !== 'vcard') return;
    if (!qrContainerRef.current) return;
    
    // Clear previous QR code
    qrContainerRef.current.innerHTML = '';
    
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
    
    // Generate QR code using QRCodeJS
    try {
      // Create a wrapper div with padding
      const qrWrapper = document.createElement('div');
      qrWrapper.style.padding = `${qrOptions.padding}px`;
      qrWrapper.style.backgroundColor = qrOptions.bgColor;
      qrWrapper.style.display = 'inline-block';
      qrWrapper.style.borderRadius = '8px';
      
      // Append wrapper to container
      qrContainerRef.current.appendChild(qrWrapper);
      
      // eslint-disable-next-line no-undef
      new QRCode(qrWrapper, {
        text: data,
        width: qrOptions.size,
        height: qrOptions.size,
        colorDark: qrOptions.fgColor,
        colorLight: qrOptions.bgColor,
        correctLevel: QRCode.CorrectLevel[qrOptions.errorCorrectionLevel]
      });
      
      // Get image URL for download/copy
      setTimeout(() => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to include padding
        const totalSize = qrOptions.size + (qrOptions.padding * 2);
        canvas.width = totalSize;
        canvas.height = totalSize;
        
        // Fill background
        ctx.fillStyle = qrOptions.bgColor;
        ctx.fillRect(0, 0, totalSize, totalSize);
        
        // Get QR code image
        const qrImg = qrWrapper.querySelector('img');
        
        if (qrImg) {
          // Once image is loaded, draw it on canvas with padding
          qrImg.onload = () => {
            ctx.drawImage(qrImg, qrOptions.padding, qrOptions.padding);
            
            // Convert canvas to data URL for download/copy
            setQrCodeUrl(canvas.toDataURL('image/png'));
          };
          
          // If image is already loaded, force onload handler
          if (qrImg.complete) {
            qrImg.onload();
          }
        }
      }, 100);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }, [input, qrType, qrOptions, wifiOptions, vCardOptions, qrLibStatus]);
  
  // Download QR code
  const downloadQR = () => {
    if (!qrCodeUrl) return;
    
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
    }
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

  // Render the error correction level options
  const renderErrorCorrectionOptions = () => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-2">
        {[
          { value: 'L', label: 'Low (7%)' },
          { value: 'M', label: 'Medium (15%)' },
          { value: 'Q', label: 'Quartile (25%)' },
          { value: 'H', label: 'High (30%)' }
        ].map((option) => (
          <div 
            key={option.value}
            className={`p-2 rounded-md cursor-pointer text-center text-sm ${
              qrOptions.errorCorrectionLevel === option.value 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium border border-primary-200 dark:border-primary-700' 
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
            }`}
            onClick={() => setQrOptions({...qrOptions, errorCorrectionLevel: option.value})}
          >
            {option.label}
          </div>
        ))}
      </div>
    );
  };

  // Added: Render padding slider
  const renderPaddingSlider = () => {
    return (
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <label htmlFor="qr-padding" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('tools.qr-generator.padding') || 'Padding'}
          </label>
          <span className="text-sm text-gray-500 dark:text-gray-400">{qrOptions.padding} px</span>
        </div>
        <input
          type="range"
          id="qr-padding"
          min="0"
          max="50"
          step="5"
          value={qrOptions.padding}
          onChange={(e) => setQrOptions({...qrOptions, padding: parseInt(e.target.value)})}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>0px</span>
          <span>50px</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card
        title={t('tools.qr-generator.name')}
        description={t('tools.qr-generator.description')}
        icon={QrCode}
      >
        <div className="space-y-6">
          {/* Layout container for xl screens */}
          <div className="xl:flex xl:space-x-6 xl:space-y-0 space-y-6">
            {/* Left column - Type selection and options */}
            <div className="xl:w-1/2 space-y-6">
              {/* QR Type Selection */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <QrCode className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t('tools.qr-generator.selectType')}
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-2">
                  {['text', 'url', 'email', 'phone', 'wifi', 'vcard'].map((type) => (
                    <button
                      key={type}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                        qrType === type
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => setQrType(type)}
                    >
                      {t(`tools.qr-generator.types.${type}`)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* QR Options */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t('tools.qr-generator.options')}
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {/* Size Slider */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label htmlFor="qr-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('tools.qr-generator.size')}
                      </label>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{qrOptions.size} px</span>
                    </div>
                    <input
                      type="range"
                      id="qr-size"
                      min="128"
                      max="512"
                      step="8"
                      value={qrOptions.size}
                      onChange={(e) => setQrOptions({...qrOptions, size: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>128px</span>
                      <span>512px</span>
                    </div>
                  </div>
                  
                  {/* Added: Padding Slider */}
                  {renderPaddingSlider()}
                  
                  {/* Error Correction Level */}
                  <div>
                    <div className="flex items-center mb-2">
                      <Shield className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                      <label htmlFor="qr-error" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('tools.qr-generator.errorCorrection')}
                      </label>
                    </div>
                    {renderErrorCorrectionOptions()}
                  </div>
                  
                  {/* Color Selectors */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-3">
                      <Palette className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('tools.qr-generator.colors')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <div className="w-full">
                          <label htmlFor="qr-fgcolor" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                            {t('tools.qr-generator.foregroundColor')}
                          </label>
                          <div className="flex">
                            <input
                              type="color"
                              id="qr-fgcolor"
                              value={qrOptions.fgColor}
                              onChange={(e) => setQrOptions({...qrOptions, fgColor: e.target.value})}
                              className="w-full h-10 px-1 py-1 rounded-md border border-gray-300 dark:border-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-full">
                          <label htmlFor="qr-bgcolor" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                            {t('tools.qr-generator.backgroundColor')}
                          </label>
                          <div className="flex">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Input fields */}
            <div className="xl:w-1/2">
              {/* Input fields */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-base xl:text-lg font-medium text-gray-900 dark:text-gray-100">
                  {t('tools.qr-generator.input')}
                </div>
                {renderInputFields()}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="primary"
                    onClick={loadSample}
                    size="sm"
                  >
                    {t('tools.qr-generator.loadSample')}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={clearAll}
                    icon={RefreshCw}
                    size="sm"
                  >
                    {t('tools.qr-generator.clear')}
                  </Button>
                </div>
                
                {/* QR Code Preview */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2 justify-between items-center mb-4">
                    <div className="text-base xl:text-lg font-medium text-gray-900 dark:text-gray-100">
                      {t('tools.qr-generator.preview')}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="xl:sm"
                        icon={Download}
                        onClick={downloadQR}
                        disabled={!qrCodeUrl}
                      >
                        {t('tools.qr-generator.download')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={copied ? Check : Copy}
                        onClick={copyQR}
                        disabled={!qrCodeUrl}
                      >
                        {copied ? t('tools.qr-generator.copied') : t('tools.qr-generator.copy')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-center items-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div 
                      ref={qrContainerRef} 
                      className="flex justify-center items-center" 
                      style={{ minHeight: '128px', minWidth: '128px' }}
                    >
                      {qrLibStatus === 'loading' && (
                        <div className="text-center p-4">
                          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {t('tools.qr-generator.loading')}
                          </p>
                        </div>
                      )}
                      {qrLibStatus === 'error' && (
                        <div className="text-center p-4 text-red-500">
                          <p>{t('tools.qr-generator.libraryError')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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