// src/components/tools/unix-time/UnixTimeConverter.jsx
'use client';

import { useState, useEffect } from 'react';
import { Clock, RefreshCw, Copy, Check } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TimeDisplay from './TimeDisplay';
import { useTranslation } from 'react-i18next'; // Đảm bảo import hook này

export default function UnixTimeConverter() {
  const { t } = useTranslation(); // Sử dụng hook để lấy hàm t
  const [unixTimestamp, setUnixTimestamp] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [currentUnixTime, setCurrentUnixTime] = useState(0);
  const [copied, setCopied] = useState(false);
  const [timezoneOffset, setTimezoneOffset] = useState(0);


  // Cập nhật thời gian Unix hiện tại mỗi giây
  useEffect(() => {
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Khởi tạo múi giờ địa phương
  useEffect(() => {
    const date = new Date();
    setTimezoneOffset(date.getTimezoneOffset() * -1);
  }, []);

  // Cập nhật thời gian Unix hiện tại
  function updateCurrentTime() {
    const now = Math.floor(Date.now() / 1000);
    setCurrentUnixTime(now);
  }

  // Chuyển đổi từ Unix timestamp sang DateTime
  function convertUnixToDateTime() {
    if (!unixTimestamp) return;
    
    try {
      const timestamp = parseInt(unixTimestamp);
      if (isNaN(timestamp)) throw new Error('Invalid timestamp');
      
      const date = new Date(timestamp * 1000);
      const isoString = date.toISOString();
      setDateTime(isoString.slice(0, 16)); // Format: YYYY-MM-DDTHH:MM
    } catch (error) {
      alert('Timestamp Unix không hợp lệ. Vui lòng nhập số nguyên.');
    }
  }

  // Chuyển đổi từ DateTime sang Unix timestamp
  function convertDateTimeToUnix() {
    if (!dateTime) return;
    
    try {
      const date = new Date(dateTime);
      const timestamp = Math.floor(date.getTime() / 1000);
      setUnixTimestamp(timestamp.toString());
    } catch (error) {
      alert('Ngày giờ không hợp lệ');
    }
  }

  // Sao chép Unix timestamp hiện tại vào clipboard
  function copyCurrentTimestamp() {
    navigator.clipboard.writeText(currentUnixTime.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Sử dụng thời gian hiện tại
  function useCurrentTime() {
    const now = new Date();
    const localISOString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 16);
    setDateTime(localISOString);
    setUnixTimestamp(Math.floor(now.getTime() / 1000).toString());
  }

  return (
    <div className="grid gap-6">
      <Card
        title={t('tools.unix-time.name')}
        description={t('tools.unix-time.description')}
        icon={Clock}
      >
        <div className="space-y-6">
          {/* Current Unix Time Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('tools.unix-time.currentTime')}</h3>
                <p className="text-2xl font-mono mt-1">{currentUnixTime}</p>
              </div>
              <Button
                onClick={copyCurrentTimestamp}
                variant="outline"
                icon={copied ? Check : Copy}
              >
                {copied ? t('tools.unix-time.copied') : t('tools.unix-time.copy')}
              </Button>
            </div>
          </div>

          {/* Unix to DateTime */}
          <div className="space-y-4">
            <div>
              <label htmlFor="unix-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('tools.unix-time.unixTimestamp')}
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="unix-input"
                  value={unixTimestamp}
                  onChange={(e) => setUnixTimestamp(e.target.value)}
                  placeholder="Nhập Unix timestamp (giây)"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button onClick={convertUnixToDateTime} className="text-primary-600 dark:text-primary-400">
                <RefreshCw className="mx-auto h-5 w-5" />
                <span className="text-xs block mt-1">{t('tools.unix-time.convertToDateTime')}</span>
              </button>
            </div>

            <div>
              <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('tools.unix-time.dateTime')}
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="datetime-local"
                  id="date-input"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button onClick={convertDateTimeToUnix} className="text-primary-600 dark:text-primary-400">
                <RefreshCw className="mx-auto h-5 w-5 rotate-180" />
                <span className="text-xs block mt-1">{t('tools.unix-time.convertToUnix')}</span>
              </button>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={useCurrentTime}
                variant="secondary"
                size="sm"
                icon={Clock}
              >
                {t('tools.unix-time.useCurrentTime')}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Time Display */}
      {unixTimestamp && !isNaN(parseInt(unixTimestamp)) && (
        <TimeDisplay timestamp={parseInt(unixTimestamp)} timezoneOffset={timezoneOffset} />
      )}
    </div>
  );
}