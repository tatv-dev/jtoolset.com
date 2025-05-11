// src/components/tools/cookie-tools/CookieTools.jsx
import { useState, useEffect } from 'react';
import { Cookie, Edit, Plus, FileJson, AlertTriangle, Check, Clipboard, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CookieViewer from './CookieViewer';
import CookieEditor from './CookieEditor';
import CookieCreator from './CookieCreator';
import CookiePolicyGenerator from './CookiePolicyGenerator';
import { useTranslation } from 'react-i18next';

export default function CookieTools() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('view');
  const [cookies, setCookies] = useState([]);
  const [filteredCookies, setFilteredCookies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCookies, setSelectedCookies] = useState([]);
  const [editingCookie, setEditingCookie] = useState(null);
  const [showCookieDetails, setShowCookieDetails] = useState({});

  // Result and Copy states
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Cookie Creator state
  const [newCookie, setNewCookie] = useState({
    name: '',
    value: '',
    domain: '',
    path: '/',
    expires: '',
    secure: false,
    httpOnly: false,
    sameSite: 'Lax'
  });
  
  // Cookie Policy Generator state
  const [policySettings, setPolicySettings] = useState({
    companyName: 'Your Company',
    website: 'yourwebsite.com',
    usesEssential: true,
    usesAnalytics: true,
    usesMarketing: false,
    usesFunctional: true,
    cookieLifespan: '30 days',
    lastUpdated: new Date().toISOString().split('T')[0]
  });
  
  // Error states
  const [error, setError] = useState('');
  
  // Load cookies on component mount
  useEffect(() => {
    loadCookies();
  }, []);
  
  // Filter cookies when search term changes
  useEffect(() => {
    filterCookies();
  }, [cookies, searchTerm]);
  
  // Load all cookies from document
  const loadCookies = () => {
    try {
      const cookieList = document.cookie.split(';').map(cookie => {
        const [name, ...valueParts] = cookie.trim().split('=');
        const value = valueParts.join('=');
        
        // Get additional info if available
        const domain = document.domain;
        const path = '/';
        const secure = window.location.protocol === 'https:';
        
        return {
          name: name.trim(),
          value: value || '',
          domain,
          path,
          secure,
          httpOnly: false, // Cannot detect from client-side
          sameSite: 'Lax', // Default value
          expires: 'Session', // Cannot detect from client-side
        };
      }).filter(cookie => cookie.name);
      
      // Create some test cookies if none exist
      if (cookieList.length === 0) {
        createTestCookies();
        return;
      }
      
      setCookies(cookieList);
      setFilteredCookies(cookieList);
    } catch (err) {
      setError('Failed to load cookies: ' + err.message);
    }
  };
  
  // Create some test cookies for demo purposes
  const createTestCookies = () => {
    const testCookies = [
      { name: 'session_id', value: 'abc123xyz789', path: '/', expires: '1d' },
      { name: 'user_preference', value: '{"theme":"dark","lang":"en"}', path: '/', expires: '30d' },
      { name: 'visit_count', value: '5', path: '/', expires: '30d' },
      { name: 'last_visit', value: new Date().toISOString(), path: '/', expires: '7d' },
      { name: 'tracking_id', value: 'UA-12345-67', path: '/', expires: '1y' }
    ];
    
    testCookies.forEach(cookie => {
      document.cookie = `${cookie.name}=${cookie.value}; path=${cookie.path}`;
    });
    
    loadCookies();
  };
  
  // Filter cookies based on search term
  const filterCookies = () => {
    if (!searchTerm) {
      setFilteredCookies(cookies);
      return;
    }
    
    const filtered = cookies.filter(cookie => 
      cookie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cookie.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cookie.domain?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredCookies(filtered);
  };
  
  // Delete all cookies
  const deleteAllCookies = () => {
    try {
      cookies.forEach(cookie => {
        document.cookie = `${cookie.name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      
      setSelectedCookies([]);
      loadCookies();
    } catch (err) {
      setError('Failed to delete all cookies: ' + err.message);
    }
  };
  
  // Start editing a cookie
  const startEditCookie = (cookie) => {
    setEditingCookie({
      ...cookie,
      originalName: cookie.name // Store original name for reference
    });
    setActiveTab('edit');
  };
  
  // Cancel editing
  const cancelEditCookie = () => {
    setEditingCookie(null);
  };
  
  // Save edited cookie
  const saveEditedCookie = () => {
    try {
      if (!editingCookie.name) {
        throw new Error('Cookie name is required');
      }
      
      // First delete the original cookie
      document.cookie = `${editingCookie.originalName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      
      // Then set the new/edited cookie
      let cookieString = `${editingCookie.name}=${editingCookie.value}; path=${editingCookie.path || '/'}`;
      
      if (editingCookie.domain) cookieString += `; domain=${editingCookie.domain}`;
      if (editingCookie.expires && editingCookie.expires !== 'Session') {
        // Convert human-readable expiry to date
        let expiryDate = new Date();
        if (editingCookie.expires.endsWith('d')) {
          const days = parseInt(editingCookie.expires);
          expiryDate.setDate(expiryDate.getDate() + days);
        } else if (editingCookie.expires.endsWith('h')) {
          const hours = parseInt(editingCookie.expires);
          expiryDate.setHours(expiryDate.getHours() + hours);
        } else if (editingCookie.expires.endsWith('m')) {
          const minutes = parseInt(editingCookie.expires);
          expiryDate.setMinutes(expiryDate.getMinutes() + minutes);
        } else if (editingCookie.expires.endsWith('y')) {
          const years = parseInt(editingCookie.expires);
          expiryDate.setFullYear(expiryDate.getFullYear() + years);
        } else {
          // Try to parse as date string
          expiryDate = new Date(editingCookie.expires);
        }
        
        cookieString += `; expires=${expiryDate.toUTCString()}`;
      }
      
      if (editingCookie.secure) cookieString += '; secure';
      if (editingCookie.httpOnly) cookieString += '; HttpOnly';
      if (editingCookie.sameSite) cookieString += `; SameSite=${editingCookie.sameSite}`;
      
      document.cookie = cookieString;
      setEditingCookie(null);
      loadCookies();
      setActiveTab('view');
    } catch (err) {
      setError('Failed to save cookie: ' + err.message);
    }
  };
  
  // Create new cookie
  const createCookie = () => {
    try {
      if (!newCookie.name) {
        throw new Error('Cookie name is required');
      }
      
      let cookieString = `${newCookie.name}=${newCookie.value}; path=${newCookie.path || '/'}`;
      
      if (newCookie.domain) cookieString += `; domain=${newCookie.domain}`;
      if (newCookie.expires && newCookie.expires !== 'Session') {
        // Convert human-readable expiry to date
        let expiryDate = new Date();
        if (newCookie.expires.endsWith('d')) {
          const days = parseInt(newCookie.expires);
          expiryDate.setDate(expiryDate.getDate() + days);
        } else if (newCookie.expires.endsWith('h')) {
          const hours = parseInt(newCookie.expires);
          expiryDate.setHours(expiryDate.getHours() + hours);
        } else if (newCookie.expires.endsWith('m')) {
          const minutes = parseInt(newCookie.expires);
          expiryDate.setMinutes(expiryDate.getMinutes() + minutes);
        } else if (newCookie.expires.endsWith('y')) {
          const years = parseInt(newCookie.expires);
          expiryDate.setFullYear(expiryDate.getFullYear() + years);
        } else {
          // Try to parse as date string
          expiryDate = new Date(newCookie.expires);
        }
        
        cookieString += `; expires=${expiryDate.toUTCString()}`;
      }
      
      if (newCookie.secure) cookieString += '; secure';
      if (newCookie.httpOnly) cookieString += '; HttpOnly';
      if (newCookie.sameSite) cookieString += `; SameSite=${newCookie.sameSite}`;
      
      document.cookie = cookieString;
      
      // Reset the form
      setNewCookie({
        name: '',
        value: '',
        domain: '',
        path: '/',
        expires: '',
        secure: false,
        httpOnly: false,
        sameSite: 'Lax'
      });
      
      loadCookies();
      setActiveTab('view');
    } catch (err) {
      setError('Failed to create cookie: ' + err.message);
    }
  };
  
  // Generate cookie policy
  const generateCookiePolicy = () => {
    const today = new Date().toLocaleDateString();
    
    let policy = `# Cookie Policy for ${policySettings.companyName}

**Last updated:** ${policySettings.lastUpdated || today}

## Introduction

This Cookie Policy explains how ${policySettings.companyName} ("we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our website at ${policySettings.website} ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.

## What are cookies?

Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.

Cookies set by the website owner (in this case, ${policySettings.companyName}) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.

## Why do we use cookies?

We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Website. ${policySettings.usesAnalytics ? 'We also use cookies to collect information about how you use our Website, including which pages you go to most often and if they receive error messages from certain pages.' : ''} ${policySettings.usesMarketing ? 'Additionally, we use cookies to deliver advertising that may be relevant to you and your interests.' : ''}

## Types of cookies we use

### Essential Cookies

${policySettings.usesEssential ? 'Essential cookies are necessary for the Website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work.' : 'We do not use essential cookies on this Website.'}

### Performance & Analytics Cookies

${policySettings.usesAnalytics ? 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous.' : 'We do not use performance or analytics cookies on this Website.'}

### Functionality Cookies

${policySettings.usesFunctional ? 'These cookies enable the Website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, then some or all of these services may not function properly.' : 'We do not use functionality cookies on this Website.'}

### Targeting & Advertising Cookies

${policySettings.usesMarketing ? 'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information but are based on uniquely identifying your browser and internet device.' : 'We do not use targeting or advertising cookies on this Website.'}

## Cookie Lifespan

The typical lifespan of cookies we use is ${policySettings.cookieLifespan || '30 days'}, but this can vary depending on their specific purpose.

## How can you control cookies?

You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner on our Website.

You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our Website though your access to some functionality and areas of our Website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.

## Contact us

If you have any questions about our use of cookies or other technologies, please email us at privacy@${policySettings.website} or contact us through our website.
`;
    
    setResult(policy);
  };
  
  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card
        title="Cookie Tools"
        description="View, edit, create and manage cookies in your browser"
        icon={Cookie}
      >
        <div className="space-y-4">
          {/* Tab Navigator */}
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'view'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('view')}
            >
              <div className="flex items-center">
                <Cookie size={16} className="mr-2" />
                Cookie Viewer
              </div>
            </button>
            <button
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'edit'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('edit')}
            >
              <div className="flex items-center">
                <Edit size={16} className="mr-2" />
                Cookie Editor
              </div>
            </button>
            <button
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('create')}
            >
              <div className="flex items-center">
                <Plus size={16} className="mr-2" />
                Cookie Creator
              </div>
            </button>
            <button
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'policy'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('policy')}
            >
              <div className="flex items-center">
                <FileJson size={16} className="mr-2" />
                Policy Generator
              </div>
            </button>
          </div>
          
          {/* Error display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md p-3 flex items-start text-red-600 dark:text-red-400">
              <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm">{error}</div>
              <button
                onClick={() => setError('')}
                className="ml-auto p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          {/* Tab Content */}
          <div>
            {/* Cookie Viewer */}
            {activeTab === 'view' && (
              <CookieViewer
                cookies={cookies}
                filteredCookies={filteredCookies}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCookies={selectedCookies}
                setSelectedCookies={setSelectedCookies}
                startEditCookie={startEditCookie}
                loadCookies={loadCookies}
                deleteAllCookies={deleteAllCookies}
                createTestCookies={createTestCookies}
                showCookieDetails={showCookieDetails}
                setShowCookieDetails={setShowCookieDetails}
              />
            )}
            
            {/* Cookie Editor */}
            {activeTab === 'edit' && (
              <CookieEditor
                editingCookie={editingCookie}
                setEditingCookie={setEditingCookie}
                saveEditedCookie={saveEditedCookie}
                cancelEditCookie={cancelEditCookie}
                setActiveTab={setActiveTab}
              />
            )}
            
            {/* Cookie Creator */}
            {activeTab === 'create' && (
              <CookieCreator 
                newCookie={newCookie}
                setNewCookie={setNewCookie}
                createCookie={createCookie}
              />
            )}
            
            {/* Cookie Policy Generator */}
            {activeTab === 'policy' && (
              <CookiePolicyGenerator
                policySettings={policySettings}
                setPolicySettings={setPolicySettings}
                generateCookiePolicy={generateCookiePolicy}
              />
            )}
          </div>
          
          {/* Results display */}
          {result && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('tools.cookie-tools.result')}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  icon={copied ? Check : Clipboard}
                  onClick={handleCopy}
                >
                  {copied ? t('common.copied') : t('common.copy')}
                </Button>
              </div>
              <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto max-h-96">
                <code className="text-xs whitespace-pre-wrap break-all">{result}</code>
              </pre>
            </div>
          )}
        </div>
      </Card>
      
      {/* Cookie Management Info Card */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.cookie-tools.aboutTitle')}</h3>
          <p>
            {t('tools.cookie-tools.aboutDescription')}
          </p>
          
          <h4>{t('tools.cookie-tools.featuresTitle')}:</h4>
          <ul>
            <li><strong>{t('tools.cookie-tools.feature1.title')}:</strong> {t('tools.cookie-tools.feature1.description')}</li>
            <li><strong>{t('tools.cookie-tools.feature2.title')}:</strong> {t('tools.cookie-tools.feature2.description')}</li>
            <li><strong>{t('tools.cookie-tools.feature3.title')}:</strong> {t('tools.cookie-tools.feature3.description')}</li>
            <li><strong>{t('tools.cookie-tools.feature4.title')}:</strong> {t('tools.cookie-tools.feature4.description')}</li>
          </ul>
          
          <h4>{t('tools.cookie-tools.attributesTitle')}:</h4>
          <ul>
            <li><strong>{t('tools.cookie-tools.attribute1.title')}:</strong> {t('tools.cookie-tools.attribute1.description')}</li>
            <li><strong>{t('tools.cookie-tools.attribute2.title')}:</strong> {t('tools.cookie-tools.attribute2.description')}</li>
            <li><strong>{t('tools.cookie-tools.attribute3.title')}:</strong> {t('tools.cookie-tools.attribute3.description')}</li>
            <li><strong>{t('tools.cookie-tools.attribute4.title')}:</strong> {t('tools.cookie-tools.attribute4.description')}</li>
            <li><strong>{t('tools.cookie-tools.attribute5.title')}:</strong> {t('tools.cookie-tools.attribute5.description')}</li>
            <li><strong>{t('tools.cookie-tools.attribute6.title')}:</strong> {t('tools.cookie-tools.attribute6.description')}</li>
          </ul>
          
          <div className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <strong>{t('common.note')}:</strong> {t('tools.cookie-tools.securityNote')}
          </div>
        </div>
      </Card>
    </div>
  );
}