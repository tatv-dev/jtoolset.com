// src/pages/ToolPage.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getToolBySlug, getRelatedTools } from '../lib/tools';
// import { AdUnit } from '../lib/ads';
import { useTranslation } from 'react-i18next';

// Import dynamic tool components
import UnixTimeConverter from '../components/tools/unix-time/UnixTimeConverter';
import RandomGenerator from '../components/tools/random/RandomGenerator';
import JwtDecoder from '../components/tools/jwt-decoder/JwtDecoder';
import CookieTools from '../components/tools/cookie-tools/CookieTools';
import JsonFormatter from '../components/tools/json-formatter/JsonFormatter';
import UrlEncoder from '../components/tools/url-encoder/UrlEncoder';
import Base64 from '../components/tools/base64/Base64';
import HashGenerator from '../components/tools/hash-generator/HashGenerator';

export default function ToolPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [relatedTools, setRelatedTools] = useState([]);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const foundTool = getToolBySlug(slug);
    if (foundTool) {
      setTool(foundTool);
      setRelatedTools(getRelatedTools(foundTool.id));
    } else {
      navigate('/not-found', { replace: true });
    }
  }, [slug, navigate]);
  
  if (!tool) return null;
  
  // Render component tương ứng với công cụ
  const renderToolComponent = () => {
    switch (tool.slug) {
      case 'unix-time':
        return <UnixTimeConverter />;
      case 'random':
        return <RandomGenerator />;
      case 'jwt-decoder':
        return <JwtDecoder />;
      case 'cookie-tools':
        return <CookieTools />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'url-encoder':
        return <UrlEncoder />;
      case 'base64':
        return <Base64 />;
      case 'hash-generator':
  return <HashGenerator />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600 dark:text-gray-300">
              {t('common.developing')}
            </h2>
          </div>
        );
    }
  };

  // Hàm xử lý chia sẻ
  const getShareUrl = (type) => {
    const url = encodeURIComponent(`https://JToolset.com/tools/${tool.slug}`);
    const title = encodeURIComponent(`${t('tools.' + tool.slug + '.name')} - JToolset`);
    
    switch (type) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      default:
        return '#';
    }
  };
  
  return (
    <div className="space-y-8 py-6">
      {/* Tiêu đề trang */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t(`tools.${tool.slug}.name`)}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          {t(`tools.${tool.slug}.description`)}
        </p>
        
        {/* Thẻ tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tool.tags && tool.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Component chính của công cụ */}
      <div>
        {renderToolComponent()}
      </div>
      
      {/* Quảng cáo */}
      {/* <AdUnit 
        slot="9876543210" 
        className="py-4 flex justify-center" 
      /> */}
      
      {/* Công cụ liên quan */}
      {relatedTools.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.relatedTools')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((relatedTool) => (
              <Link
                key={relatedTool.id}
                to={`/tools/${relatedTool.slug}`}
                className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t(`tools.${relatedTool.slug}.name`)}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {t(`tools.${relatedTool.slug}.description`)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Phần chia sẻ */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          {t('common.share')}
        </h2>
        
        <div className="flex space-x-3">
          <ShareButton type="twitter" getShareUrl={getShareUrl} />
          <ShareButton type="facebook" getShareUrl={getShareUrl} />
          <ShareButton type="linkedin" getShareUrl={getShareUrl} />
        </div>
        
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {t('common.shareMessage')}
        </p>
      </div>
    </div>
  );
}

// Component nút chia sẻ
function ShareButton({ type, getShareUrl }) {
  // Sử dụng các biến thông thường thay vì functions
  let buttonStyle = 'text-white w-10 h-10 rounded-full flex items-center justify-center font-bold ';
  let buttonIcon = '';
  let ariaLabel = 'Share on social media';
  
  if (type === 'twitter') {
    buttonStyle += 'bg-blue-400 hover:bg-blue-500';
    buttonIcon = '𝕏';
    ariaLabel = 'Share on Twitter';
  } else if (type === 'facebook') {
    buttonStyle += 'bg-blue-600 hover:bg-blue-700';
    buttonIcon = 'f';
    ariaLabel = 'Share on Facebook';
  } else if (type === 'linkedin') {
    buttonStyle += 'bg-blue-700 hover:bg-blue-800';
    buttonIcon = 'in';
    ariaLabel = 'Share on LinkedIn';
  }
  
  return (
    <a
      href={getShareUrl(type)}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonStyle}
      aria-label={ariaLabel}
    >
      {buttonIcon}
    </a>
  );
}