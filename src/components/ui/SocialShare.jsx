// src/components/ui/SocialShare.jsx
import { useState } from 'react';
import { Twitter, Facebook, Linkedin, Copy, Check, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SocialShare({ url, title, className = '' }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Format URLs for sharing
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  };

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
    }
  };

  // Toggle tooltip
  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <div className={`${className}`}>
      <div className="flex flex-col items-center sm:flex-row sm:justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-0 flex items-center">
          <Share2 className="mr-2 h-5 w-5 text-gray-500" />
          {t('common.share')}
        </h3>

        <div className="flex flex-wrap gap-2">
          {/* Mobile Share API Button - Only shows on supported browsers */}
          {navigator.share && (
            <button
              onClick={() => {
                navigator.share({
                  title: title,
                  url: url,
                }).catch(err => console.error('Error sharing', err));
              }}
              className="relative inline-flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
              aria-label="Share"
            >
              <Share2 size={20} />
              <span className="sr-only">Share</span>
            </button>
          )}

          {/* Twitter/X Share */}
          <a
            href={shareUrls.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center p-2 bg-black hover:bg-gray-800 text-white rounded-md transition-colors"
            aria-label="Share on X"
            onMouseEnter={() => setShowTooltip('twitter')}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Twitter size={20} />
            <span className="sr-only">Share on X</span>
            {showTooltip === 'twitter' && (
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                Share on X
              </span>
            )}
          </a>

          {/* Facebook Share */}
          <a
            href={shareUrls.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            aria-label="Share on Facebook"
            onMouseEnter={() => setShowTooltip('facebook')}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Facebook size={20} />
            <span className="sr-only">Share on Facebook</span>
            {showTooltip === 'facebook' && (
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                Share on Facebook
              </span>
            )}
          </a>

          {/* LinkedIn Share */}
          <a
            href={shareUrls.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center p-2 bg-blue-800 hover:bg-blue-900 text-white rounded-md transition-colors"
            aria-label="Share on LinkedIn"
            onMouseEnter={() => setShowTooltip('linkedin')}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Linkedin size={20} />
            <span className="sr-only">Share on LinkedIn</span>
            {showTooltip === 'linkedin' && (
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                Share on LinkedIn
              </span>
            )}
          </a>

          {/* Copy Link */}
          <button
            onClick={copyToClipboard}
            className="relative inline-flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
            aria-label="Copy link"
            onMouseEnter={() => setShowTooltip('copy')}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
            <span className="sr-only">{copied ? t('common.copied') : t('common.copy')}</span>
            {showTooltip === 'copy' && !copied && (
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                Copy link
              </span>
            )}
            {copied && (
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-green-600 text-white text-xs rounded animate-fade-in-out whitespace-nowrap">
                {t('common.copied')}!
              </span>
            )}
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        {t('common.shareMessage')}
      </p>
    </div>
  );
}