// src/components/tools/unix-time/TimeDisplay.jsx
'use client';

import { useMemo } from 'react';
import { Clock, Globe, Calendar, Hourglass, Tag } from 'lucide-react';
import Card from '@/components/ui/Card';
import { useTranslation } from 'react-i18next';

export default function TimeDisplay({ timestamp, timezoneOffset }) {
  const { t, i18n } = useTranslation();
  
  const dateTime = useMemo(() => {
    return new Date(timestamp * 1000);
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

    // Standard formats
    const iso = dateTime.toISOString();
    const local = dateTime.toLocaleString(i18n.language);
    
    // Different standard formats
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

  // Determine local timezone
  const timezoneInfo = useMemo(() => {
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const offsetMinutes = Math.abs(timezoneOffset) % 60;
    
    const sign = timezoneOffset >= 0 ? '+' : '-';
    
    return {
      name: Intl.DateTimeFormat().resolvedOptions().timeZone,
      offset: `UTC${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`,
    };
  }, [timezoneOffset]);

  // Calculate relative time
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
      <div className="space-y-5">
        {/* Timezone Info with improved visibility */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
          <Globe className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">
            {t('tools.unix-time.timezone')}: <span className="font-semibold">{timezoneInfo.name}</span> ({timezoneInfo.offset})
          </span>
        </div>
        
        {/* Main format - most visually prominent */}
        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4 border-l-4 border-primary-500">
          <div className="flex items-center mb-2 text-primary-700 dark:text-primary-400 font-medium">
            <Calendar className="mr-2 h-5 w-5" />
            {t('tools.unix-time.formats.friendly')}
          </div>
          <div className="text-lg font-medium">
            {formats.readable}
          </div>
        </div>
        
        {/* Grid of other formats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormatItem 
            icon={<Tag className="h-4 w-4" />}
            label={t('tools.unix-time.formats.iso8601')} 
            value={formats.iso} 
          />
          <FormatItem 
            icon={<Globe className="h-4 w-4" />}
            label={t('tools.unix-time.formats.utc')} 
            value={formats.utc} 
          />
          <FormatItem 
            icon={<Clock className="h-4 w-4" />}
            label={t('tools.unix-time.formats.local')} 
            value={formats.local} 
          />
          <FormatItem 
            icon={<Hourglass className="h-4 w-4" />}
            label={t('tools.unix-time.formats.relative')} 
            value={formats.relative} 
            highlight={true}
          />
        </div>
      </div>
    </Card>
  );
}

function FormatItem({ icon, label, value, highlight = false }) {
  return (
    <div className={`rounded-lg ${highlight ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'} p-3 h-full`}>
      <div className="flex items-center gap-2 text-sm font-medium mb-1.5">
        {icon}
        <span className={highlight ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}>
          {label}
        </span>
      </div>
      <div className="font-mono text-sm overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {value}
      </div>
    </div>
  );
}