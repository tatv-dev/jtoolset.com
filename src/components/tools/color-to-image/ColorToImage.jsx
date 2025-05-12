// src/components/tools/color-to-image/ColorToImage.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Palette, Download, Copy, Check, RefreshCw, Droplet, Image as ImageIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function ColorToImage() {
  const { t } = useTranslation();
  const [color, setColor] = useState('#3498db');
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [format, setFormat] = useState('png');
  const [imageUrl, setImageUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [colorName, setColorName] = useState('');
  const [gradient, setGradient] = useState(false);
  const [gradientColor, setGradientColor] = useState('#e74c3c');
  const [gradientDirection, setGradientDirection] = useState('to right');
  const [isTransparent, setIsTransparent] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const canvasRef = useRef(null);
  
  // Define a list of common colors with their names
  const commonColors = {
    '#FF0000': 'Red',
    '#00FF00': 'Green',
    '#0000FF': 'Blue',
    '#FFFF00': 'Yellow',
    '#FF00FF': 'Magenta',
    '#00FFFF': 'Cyan',
    '#000000': 'Black',
    '#FFFFFF': 'White',
    '#808080': 'Gray',
    '#800000': 'Maroon',
    '#808000': 'Olive',
    '#008000': 'Dark Green',
    '#800080': 'Purple',
    '#008080': 'Teal',
    '#000080': 'Navy',
    '#FFA500': 'Orange',
    '#A52A2A': 'Brown',
    '#FFC0CB': 'Pink',
    '#ADD8E6': 'Light Blue',
    '#90EE90': 'Light Green',
    '#F0E68C': 'Khaki',
    '#E6E6FA': 'Lavender',
    '#3498db': 'Dodger Blue',
    '#e74c3c': 'Tomato',
    '#2ecc71': 'Emerald',
    '#9b59b6': 'Amethyst',
    '#f1c40f': 'Sunflower',
    '#1abc9c': 'Turquoise',
    '#34495e': 'Wet Asphalt',
  };
  
  // Update color name when color changes
  useEffect(() => {
    // Normalize color to uppercase for comparison
    const normalizedColor = color.toUpperCase();
    const name = commonColors[normalizedColor] || '';
    setColorName(name);
  }, [color]);
  
  // Generate image whenever properties change
  useEffect(() => {
    generateImage();
  }, [color, width, height, format, gradient, gradientColor, gradientDirection, isTransparent, opacity]);
  
  // Generate image based on current settings
  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (gradient) {
      // Create gradient
      let grd;
      switch (gradientDirection) {
        case 'to right':
          grd = ctx.createLinearGradient(0, 0, width, 0);
          break;
        case 'to left':
          grd = ctx.createLinearGradient(width, 0, 0, 0);
          break;
        case 'to bottom':
          grd = ctx.createLinearGradient(0, 0, 0, height);
          break;
        case 'to top':
          grd = ctx.createLinearGradient(0, height, 0, 0);
          break;
        case 'to bottom right':
          grd = ctx.createLinearGradient(0, 0, width, height);
          break;
        case 'to bottom left':
          grd = ctx.createLinearGradient(width, 0, 0, height);
          break;
        case 'to top right':
          grd = ctx.createLinearGradient(0, height, width, 0);
          break;
        case 'to top left':
          grd = ctx.createLinearGradient(width, height, 0, 0);
          break;
        case 'radial':
          grd = ctx.createRadialGradient(
            width / 2, height / 2, 0,
            width / 2, height / 2, Math.max(width, height) / 2
          );
          break;
        default:
          grd = ctx.createLinearGradient(0, 0, width, 0);
      }
      
      // Add color stops
      if (isTransparent) {
        // Convert hex to rgba
        const r1 = parseInt(color.slice(1, 3), 16);
        const g1 = parseInt(color.slice(3, 5), 16);
        const b1 = parseInt(color.slice(5, 7), 16);
        const a = opacity / 100;
        
        const r2 = parseInt(gradientColor.slice(1, 3), 16);
        const g2 = parseInt(gradientColor.slice(3, 5), 16);
        const b2 = parseInt(gradientColor.slice(5, 7), 16);
        
        grd.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, ${a})`);
        grd.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, ${a})`);
      } else {
        grd.addColorStop(0, color);
        grd.addColorStop(1, gradientColor);
      }
      
      // Fill with gradient
      ctx.fillStyle = grd;
    } else {
      // Fill with solid color
      if (isTransparent) {
        // Convert hex to rgba
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const a = opacity / 100;
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      } else {
        ctx.fillStyle = color;
      }
    }
    
    ctx.fillRect(0, 0, width, height);
    
    // Convert canvas to image URL
    const imgUrl = canvas.toDataURL(`image/${format}`);
    setImageUrl(imgUrl);
  };
  
  // Download the generated image
  const downloadImage = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `color-${color.replace('#', '')}-${width}x${height}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Copy image to clipboard
  const copyImage = async () => {
    try {
      if (!imageUrl) return;
      
      const blob = await fetch(imageUrl).then(r => r.blob());
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert(t('tools.color-to-image.errors.clipboardError'));
    }
  };
  
  // Random color generator
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let randomColor = '#';
    for (let i = 0; i < 6; i++) {
      randomColor += letters[Math.floor(Math.random() * 16)];
    }
    setColor(randomColor);
    
    if (gradient) {
      let randomGradientColor = '#';
      for (let i = 0; i < 6; i++) {
        randomGradientColor += letters[Math.floor(Math.random() * 16)];
      }
      setGradientColor(randomGradientColor);
    }
  };
  
  // Handle width/height constraints
  const handleDimensionChange = (setter, value) => {
    const numValue = parseInt(value, 10);
    // Ensure the value is between 1 and 1000
    if (!isNaN(numValue)) {
      setter(Math.min(Math.max(numValue, 1), 1000));
    }
  };
  
  // Handle opacity constraints
  const handleOpacityChange = (value) => {
    const numValue = parseInt(value, 10);
    // Ensure the value is between 0 and 100
    if (!isNaN(numValue)) {
      setOpacity(Math.min(Math.max(numValue, 0), 100));
    } else {
      setOpacity(100);
    }
  };
  
  // Reset to default values
  const resetToDefaults = () => {
    setColor('#3498db');
    setWidth(100);
    setHeight(100);
    setFormat('png');
    setGradient(false);
    setGradientColor('#e74c3c');
    setGradientDirection('to right');
    setIsTransparent(false);
    setOpacity(100);
  };

  return (
    <div className="space-y-6">
      <Card
        title={t('tools.color-to-image.name')}
        description={t('tools.color-to-image.description')}
        icon={Palette}
      >
        <div className="space-y-6">
          {/* Main Color Picker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="color-picker" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {gradient ? t('tools.color-to-image.startColor') : t('tools.color-to-image.color')}
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="color-picker"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-16 p-0 border border-gray-300 dark:border-gray-700 rounded-md"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
                />
                {colorName && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {colorName}
                  </div>
                )}
              </div>
            </div>
            
            {/* Gradient Options */}
            <div>
              <div className="flex items-start justify-between">
                <label htmlFor="gradient-toggle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('tools.color-to-image.gradient')}
                </label>
                
                <div className="flex items-center h-5">
                  <input
                    id="gradient-toggle"
                    type="checkbox"
                    checked={gradient}
                    onChange={(e) => setGradient(e.target.checked)}
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                </div>
              </div>
              
              {gradient && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="color"
                    id="gradient-color-picker"
                    value={gradientColor}
                    onChange={(e) => setGradientColor(e.target.value)}
                    className="h-10 w-16 p-0 border border-gray-300 dark:border-gray-700 rounded-md"
                  />
                  <input
                    type="text"
                    value={gradientColor}
                    onChange={(e) => setGradientColor(e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
                  />
                  
                  <select
                    value={gradientDirection}
                    onChange={(e) => setGradientDirection(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="to right">{t('tools.color-to-image.direction.right')}</option>
                    <option value="to left">{t('tools.color-to-image.direction.left')}</option>
                    <option value="to bottom">{t('tools.color-to-image.direction.bottom')}</option>
                    <option value="to top">{t('tools.color-to-image.direction.top')}</option>
                    <option value="to bottom right">{t('tools.color-to-image.direction.bottomRight')}</option>
                    <option value="to bottom left">{t('tools.color-to-image.direction.bottomLeft')}</option>
                    <option value="to top right">{t('tools.color-to-image.direction.topRight')}</option>
                    <option value="to top left">{t('tools.color-to-image.direction.topLeft')}</option>
                    <option value="radial">{t('tools.color-to-image.direction.radial')}</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          
          {/* Transparency Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-start justify-between">
                <label htmlFor="transparent-toggle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('tools.color-to-image.transparency')}
                </label>
                
                <div className="flex items-center h-5">
                  <input
                    id="transparent-toggle"
                    type="checkbox"
                    checked={isTransparent}
                    onChange={(e) => setIsTransparent(e.target.checked)}
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                </div>
              </div>
              
              {isTransparent && (
                <div className="mt-2">
                  <label htmlFor="opacity-slider" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    {t('tools.color-to-image.opacity')}: {opacity}%
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      id="opacity-slider"
                      min="0"
                      max="100"
                      value={opacity}
                      onChange={(e) => handleOpacityChange(e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={opacity}
                      onChange={(e) => handleOpacityChange(e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Image Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('tools.color-to-image.dimensions')}
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={width}
                  onChange={(e) => handleDimensionChange(setWidth, e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <span className="text-gray-500 dark:text-gray-400">×</span>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={height}
                  onChange={(e) => handleDimensionChange(setHeight, e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">px</span>
                
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="ml-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Canvas (hidden but used for image generation) */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          {/* Generated Image Preview */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <div className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('tools.color-to-image.preview')}
            </div>
            
            {imageUrl ? (
              <div 
                className="relative border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden"
                style={{ 
                  backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xOdTWsmQAAABpSURBVDhPYxgFRAEuLq5/EINYzMzM/1lZWf+zsbH9ZyAVgAwA+RnEZgIpICVckAbM6upqsAFkg0CJiYkI50ENQ3YBzAWkGoIcnVBDQQaRHRiwkMRnCMwQXOGA8AZyPIIN4OXl/T8KIAIwMAAA4LilB4OUiZ0AAAAASUVORK5CYII=")'
                }}
              >
                <img
                  src={imageUrl}
                  alt="Generated color"
                  style={{ maxWidth: '300px', maxHeight: '300px' }}
                  className="display-block"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 w-40 bg-gray-200 dark:bg-gray-700 rounded-md">
                <ImageIcon className="h-10 w-10 text-gray-400" />
              </div>
            )}
            
            {/* Image Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="primary"
                icon={Download}
                onClick={downloadImage}
                disabled={!imageUrl}
              >
                {t('tools.color-to-image.download')}
              </Button>
              
              <Button
                variant="secondary"
                icon={copied ? Check : Copy}
                onClick={copyImage}
                disabled={!imageUrl}
              >
                {copied ? t('tools.color-to-image.copied') : t('tools.color-to-image.copy')}
              </Button>
            </div>
          </div>
          
          {/* Extra Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              icon={Droplet}
              onClick={generateRandomColor}
            >
              {t('tools.color-to-image.randomColor')}
            </Button>
            
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={resetToDefaults}
            >
              {t('tools.color-to-image.reset')}
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Info Card */}
      <Card>
        <div className="prose dark:prose-invert max-w-none">
          <h3>{t('tools.color-to-image.aboutTitle')}</h3>
          <p>{t('tools.color-to-image.aboutDescription')}</p>
          
          <h4>{t('tools.color-to-image.useCasesTitle')}</h4>
          <ul>
            <li><strong>{t('tools.color-to-image.useCase1.title')}:</strong> {t('tools.color-to-image.useCase1.description')}</li>
            <li><strong>{t('tools.color-to-image.useCase2.title')}:</strong> {t('tools.color-to-image.useCase2.description')}</li>
            <li><strong>{t('tools.color-to-image.useCase3.title')}:</strong> {t('tools.color-to-image.useCase3.description')}</li>
            <li><strong>{t('tools.color-to-image.useCase4.title')}:</strong> {t('tools.color-to-image.useCase4.description')}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}