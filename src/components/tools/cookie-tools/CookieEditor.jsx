// src/components/tools/cookie-tools/CookieEditor.jsx
import { Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function CookieEditor({
  editingCookie,
  setEditingCookie,
  saveEditedCookie,
  cancelEditCookie,
  setActiveTab
}) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      {editingCookie ? (
        <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {t('tools.cookie-tools.editor.title', { name: editingCookie.originalName })}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tools.cookie-tools.editor.name')}
              </label>
              <input
                type="text"
                id="edit-name"
                value={editingCookie.name}
                onChange={(e) => setEditingCookie({...editingCookie, name: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="edit-value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tools.cookie-tools.editor.value')}
              </label>
              <input
                type="text"
                id="edit-value"
                value={editingCookie.value}
                onChange={(e) => setEditingCookie({...editingCookie, value: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-domain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tools.cookie-tools.editor.domain')}
              </label>
              <input
                type="text"
                id="edit-domain"
                value={editingCookie.domain}
                onChange={(e) => setEditingCookie({...editingCookie, domain: e.target.value})}
                placeholder={document.domain}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="edit-path" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tools.cookie-tools.editor.path')}
              </label>
              <input
                type="text"
                id="edit-path"
                value={editingCookie.path}
                onChange={(e) => setEditingCookie({...editingCookie, path: e.target.value})}
                placeholder="/"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-expires" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tools.cookie-tools.editor.expires')}
              </label>
              <input
                type="text"
                id="edit-expires"
                value={editingCookie.expires}
                onChange={(e) => setEditingCookie({...editingCookie, expires: e.target.value})}
                placeholder={t('tools.cookie-tools.editor.expiresPlaceholder')}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('tools.cookie-tools.editor.expiresFormat')}
              </p>
            </div>
            <div>
              <label htmlFor="edit-samesite" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('tools.cookie-tools.editor.sameSite')}
              </label>
              <select
                id="edit-samesite"
                value={editingCookie.sameSite}
                onChange={(e) => setEditingCookie({...editingCookie, sameSite: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Lax">{t('tools.cookie-tools.editor.lax')}</option>
                <option value="Strict">{t('tools.cookie-tools.editor.strict')}</option>
                <option value="None">{t('tools.cookie-tools.editor.none')}</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="edit-secure"
                checked={editingCookie.secure}
                onChange={(e) => setEditingCookie({...editingCookie, secure: e.target.checked})}
                className="h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
              />
              <label htmlFor="edit-secure" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('tools.cookie-tools.editor.secureLabel')}
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="edit-httpOnly"
                checked={editingCookie.httpOnly}
                onChange={(e) => setEditingCookie({...editingCookie, httpOnly: e.target.checked})}
                className="h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
              />
              <label htmlFor="edit-httpOnly" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('tools.cookie-tools.editor.httpOnlyLabel')}
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-3">
            <Button
              variant="outline"
              onClick={cancelEditCookie}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              icon={Save}
              onClick={saveEditedCookie}
            >
              {t('tools.cookie-tools.editor.saveChanges')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="mx-auto h-12 w-12 text-gray-400">✏️</div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            {t('tools.cookie-tools.editor.noCookieSelected')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('tools.cookie-tools.editor.selectCookiePrompt')}
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => setActiveTab('view')}
            >
              {t('tools.cookie-tools.editor.goToViewer')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}