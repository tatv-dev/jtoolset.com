// src/components/tools/jwt-decoder/JwtDecoder.jsx
'use client';

import { useState, useEffect } from 'react';
import { Key, FileJson, Clock, AlertTriangle, Copy, Check } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import JwtDisplay from './JwtDisplay';

export default function JwtDecoder() {
  const [jwtToken, setJwtToken] = useState('');
  const [decodedToken, setDecodedToken] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Giải mã JWT token khi người dùng nhập
  useEffect(() => {
    if (!jwtToken.trim()) {
      setDecodedToken(null);
      setError('');
      return;
    }

    try {
      const decoded = decodeJwtToken(jwtToken);
      setDecodedToken(decoded);
      setError('');
    } catch (err) {
      setDecodedToken(null);
      setError(err.message);
    }
  }, [jwtToken]);

  // Hàm giải mã JWT token
  function decodeJwtToken(token) {
    // Kiểm tra định dạng JWT cơ bản
    if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)) {
      throw new Error('Invalid JWT format. Expected format: xxxxx.yyyyy.zzzzz');
    }

    const [headerB64, payloadB64, signatureB64] = token.split('.');

    // Giải mã header và payload
    try {
      const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));

      // Kiểm tra tính hợp lệ của thời gian
      const isExpired = payload.exp && payload.exp < Math.floor(Date.now() / 1000);
      
      // JWT signature (không giải mã, chỉ hiển thị)
      const signature = signatureB64 || '';

      return {
        header,
        payload,
        signature,
        isExpired,
      };
    } catch (e) {
      throw new Error('Failed to decode JWT. The token may be malformed.');
    }
  }

  // Xử lý dán từ clipboard
  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setJwtToken(text);
    } catch (err) {
      alert('Không thể truy cập clipboard. Vui lòng cấp quyền hoặc dán thủ công.');
    }
  }

  // Xử lý sao chép
  function copyToClipboard(text) {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Xóa input
  function clearInput() {
    setJwtToken('');
    setDecodedToken(null);
    setError('');
  }

  return (
    <div className="space-y-6">
      <Card
        title="JWT Decoder"
        description="Phân tích và giải mã JWT (JSON Web Token)"
        icon={Key}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="jwt-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              JWT Token
            </label>
            <div className="mt-1">
              <textarea
                id="jwt-input"
                rows={3}
                value={jwtToken}
                onChange={(e) => setJwtToken(e.target.value)}
                placeholder="Nhập JWT token của bạn (xxxxx.yyyyy.zzzzz)"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-red-400 text-sm flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-end">
            <Button
              variant="outline"
              icon={FileJson}
              onClick={handlePaste}
            >
              Dán
            </Button>
            
            <Button
              variant="secondary"
              onClick={clearInput}
            >
              Xóa
            </Button>
          </div>
        </div>
      </Card>

      {decodedToken && (
        <JwtDisplay 
          decoded={decodedToken} 
          onCopy={copyToClipboard} 
          isCopied={copied} 
        />
      )}
    </div>
  );
}