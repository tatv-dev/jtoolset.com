// src/components/tools/unix-time/TimeDisplay.jsx
'use client';

import { useMemo } from 'react';
import { Clock, Globe } from 'lucide-react';
import Card from '@/components/ui/Card';
import { useTranslation } from 'react-i18next';

export default function TimeDisplay({ timestamp, timezoneOffset }) {
  const { t, i18n } = useTranslation();
  
  const dateTime = useMemo(() => {
    const date = new Date(timestamp * 1000);
    return date;
  }, [timestamp]);

  const formats = useMemo(() => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    // Định dạng chuẩn
    const iso = dateTime.toISOString();
    const local = dateTime.toLocaleString(i18n.language);
    
    // Định dạng theo tiêu chuẩn khác nhau
    const readable = dateTime.toLocaleString(i18n.language, options);
    const utc = dateTime.toUTCString();
    const relative = getRelativeTime(timestamp);

    return {
      iso,
      local,
      readable,
      utc,
      relative,
    };
  }, [dateTime, timestamp, i18n.language]);

  // Xác định múi giờ cục bộ
  const timezoneInfo = useMemo(() => {
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const offsetMinutes = Math.abs(timezoneOffset) % 60;
    
    const sign = timezoneOffset >= 0 ? '+' : '-';
    
    return {
      name: Intl.DateTimeFormat().resolvedOptions().timeZone,
      offset: `UTC${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`,
    };
  }, [timezoneOffset]);

  // Tính thời gian tương đối
  function getRelativeTime(unixTime) {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - unixTime;
    
    if (diff < 0) {
      return t('tools.unix-time.formats.futureTime', { count: Math.abs(diff) });
    }
    
    if (diff < 60) return t('tools.unix-time.formats.secondsAgo', { count: diff });
    if (diff < 3600) return t('tools.unix-time.formats.minutesAgo', { count: Math.floor(diff / 60) });
    if (diff < 86400) return t('tools.unix-time.formats.hoursAgo', { count: Math.floor(diff / 3600) });
    if (diff < 2592000) return t('tools.unix-time.formats.daysAgo', { count: Math.floor(diff / 86400) });
    if (diff < 31536000) return t('tools.unix-time.formats.monthsAgo', { count: Math.floor(diff / 2592000) });
    
    return t('tools.unix-time.formats.yearsAgo', { count: Math.floor(diff / 31536000) });
  }

  return (
    <Card title={t('tools.unix-time.timeInfo')} icon={Clock}>
      <div className="space-y-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Globe className="mr-2 h-4 w-4" />
          <span>{t('tools.unix-time.timezone')}: {timezoneInfo.name} ({timezoneInfo.offset})</span>
        </div>
        
        <div className="space-y-3">
          <FormatItem label={t('tools.unix-time.formats.friendly')} value={formats.readable} />
          <FormatItem label={t('tools.unix-time.formats.iso8601')} value={formats.iso} />
          <FormatItem label={t('tools.unix-time.formats.utc')} value={formats.utc} />
          <FormatItem label={t('tools.unix-time.formats.local')} value={formats.local} />
          <FormatItem label={t('tools.unix-time.formats.relative')} value={formats.relative} />
        </div>
      </div>
    </Card>
  );
}

function FormatItem({ label, value }) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>
      <div className="mt-1 text-sm font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded-md overflow-x-auto">
        {value}
      </div>
    </div>
  );
}