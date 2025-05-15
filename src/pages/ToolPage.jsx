// src/pages/ToolPage.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getToolBySlug, getRelatedTools } from '../lib/tools';
import { AdUnit } from '../lib/ads';
import { ADSENSE_CONFIG } from '@/lib/ads';
import { useTranslation } from 'react-i18next';

// Import dynamic tool components
import UnixTimeConverter from '../components/tools/unix-time/UnixTimeConverter';
import RandomGenerator from '../components/tools/random/RandomGenerator';
import JwtDecoder from '../components/tools/jwt-decoder/JwtDecoder';
import JsonFormatter from '../components/tools/json-formatter/JsonFormatter';
import UrlEncoder from '../components/tools/url-encoder/UrlEncoder';
import Base64 from '../components/tools/base64/Base64';
import QrGenerator from '../components/tools/qr-generator/QrGenerator';
import IpChecker from '../components/tools/ip-checker/IpChecker';
import DomainIp from '../components/tools/domain-ip/DomainIp';
import LoremIpsum from '../components/tools/lorem-ipsum/LoremIpsum';
import ColorToImage from '../components/tools/color-to-image/ColorToImage';
import RegexTester from '../components/tools/regex-tester/RegexTester';
import WordCounter from '../components/tools/word-counter/WordCounter';
import RemoveDuplicateLines from '../components/tools/remove-duplicate-lines/RemoveDuplicateLines';
import ReverseText from '../components/tools/reverse-text/ReverseText';
import SocialShare from '../components/ui/SocialShare';
import BcryptTool from '../components/tools/hash/BcryptTool';
import ShaTool from '../components/tools/hash/ShaTool';

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
      case 'json-formatter':
        return <JsonFormatter />;
      case 'url-encoder':
        return <UrlEncoder />;
      case 'base64':
        return <Base64 />;
      case 'qr-generator':
        return <QrGenerator />;
      case 'ip-checker':
        return <IpChecker />;
      case 'domain-ip':
        return <DomainIp />;
      case 'lorem-ipsum':
        return <LoremIpsum />;
      case 'color-to-image':
        return <ColorToImage />;
      case 'regex-tester':
        return <RegexTester />;
      case 'word-counter':
        return <WordCounter />;
      case 'remove-duplicate-lines':
        return <RemoveDuplicateLines />;
      case 'reverse-text':
        return <ReverseText />;
      case 'sha':
        return <ShaTool />;
      case 'bcrypt':
        return <BcryptTool />;
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
    const url = encodeURIComponent(`https://jtoolset.com/tools/${tool.slug}`);
    const title = encodeURIComponent(`${t('tools.' + tool.slug + '.name')} - JToolset`);
    
    switch (type) {
      case 'x':
        return `https://x.com/intent/tweet?url=${url}&text=${title}`;
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
        slot={ADSENSE_CONFIG.AD_SLOTS.TOOL_PAGE_TOP}
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

      {/* Quảng cáo dưới chân trang */}
      {/* <AdUnit 
        slot={ADSENSE_CONFIG.AD_SLOTS.TOOL_PAGE_BOTTOM}
        className="py-4 flex justify-center" 
      /> */}
      
      {/* Phần chia sẻ */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <SocialShare 
          url={`https://jtoolset.com/tools/${tool.slug}`} 
          title={`${t(`tools.${tool.slug}.name`)} - JToolset: ${t(`tools.${tool.slug}.description`)}`}
        />
      </div>
    </div>
  );
}