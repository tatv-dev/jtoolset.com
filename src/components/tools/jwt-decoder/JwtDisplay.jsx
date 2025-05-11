// src/components/tools/jwt-decoder/JwtDisplay.jsx
'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FileJson, Clock, Shield, Copy, Check, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function JwtDisplay({ decoded, onCopy, isCopied }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('payload');
  
  if (!decoded) return null;
  
  const { header, payload, signature, isExpired } = decoded;
  
  // Hàm định dạng timestamp thành Date
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };
  
  // Kiểm tra nếu còn hạn sử dụng
  const isValid = !isExpired;
  
  // Tính thời gian còn lại nếu còn hạn
  const getTimeRemaining = () => {
    if (!payload.exp) return t('tools.jwt-decoder.noExpiration');
    
    const now = Math.floor(Date.now() / 1000);
    const remaining = payload.exp - now;
    
    if (remaining <= 0) return t('tools.jwt-decoder.expired');
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    
    const parts = [];
    if (days > 0) parts.push(t('tools.jwt-decoder.time.days', { count: days }));
    if (hours > 0) parts.push(t('tools.jwt-decoder.time.hours', { count: hours }));
    if (minutes > 0) parts.push(t('tools.jwt-decoder.time.minutes', { count: minutes }));
    if (seconds > 0) parts.push(t('tools.jwt-decoder.time.seconds', { count: seconds }));
    
    return parts.join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Token summary */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center">
              <Shield className={`h-5 w-5 mr-2 ${isValid ? 'text-green-500' : 'text-red-500'}`} />
              <h3 className="text-base font-medium">
                {isValid ? t('tools.jwt-decoder.tokenValid') : t('tools.jwt-decoder.tokenExpired')}
              </h3>
            </div>
            
            {payload.exp && (
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {isValid 
                  ? `${t('tools.jwt-decoder.timeRemaining')}: ${getTimeRemaining()}` 
                  : `${t('tools.jwt-decoder.expiredAt')}: ${formatTimestamp(payload.exp)}`
                }
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            icon={isCopied ? Check : Copy}
            onClick={() => onCopy(decoded)}
          >
            {isCopied ? t('tools.jwt-decoder.copied') : t('tools.jwt-decoder.copy')}
          </Button>
        </div>
      </Card>
      
      {/* JWT Details */}
      <Card>
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'payload'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('payload')}
          >
            {t('tools.jwt-decoder.payload')}
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'header'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('header')}
          >
            {t('tools.jwt-decoder.header')}
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'signature'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('signature')}
          >
            {t('tools.jwt-decoder.signature')}
          </button>
        </div>
        
        {/* Tab Content */}
        <div>
          {activeTab === 'payload' && (
            <div className="space-y-4">
              {/* Time claims */}
              {(payload.exp || payload.iat || payload.nbf) && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('tools.jwt-decoder.timeInfo')}
                  </h4>
                  <div className="grid gap-2">
                    {payload.iat && (
                      <div className="grid grid-cols-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{t('tools.jwt-decoder.issuedAt')}:</span>
                        <span>{formatTimestamp(payload.iat)}</span>
                      </div>
                    )}
                    {payload.exp && (
                      <div className="grid grid-cols-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{t('tools.jwt-decoder.expiration')}:</span>
                        <span className={isExpired ? 'text-red-500' : ''}>{formatTimestamp(payload.exp)}</span>
                      </div>
                    )}
                    {payload.nbf && (
                      <div className="grid grid-cols-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{t('tools.jwt-decoder.notBefore')}:</span>
                        <span>{formatTimestamp(payload.nbf)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Standard claims */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('tools.jwt-decoder.payloadClaims')}
                </h4>
                <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md overflow-auto text-sm">
                  {JSON.stringify(payload, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          {activeTab === 'header' && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('tools.jwt-decoder.header')}
              </h4>
              <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md overflow-auto text-sm">
                {JSON.stringify(header, null, 2)}
              </pre>
            </div>
          )}
          
          {activeTab === 'signature' && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('tools.jwt-decoder.signature')}
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {t('tools.jwt-decoder.signatureInfo')}
                </p>
                <div className="font-mono text-sm break-all">
                  {signature || t('tools.jwt-decoder.noSignature')}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}