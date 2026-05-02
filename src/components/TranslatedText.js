'use client';

import { useTranslate } from '@/hooks/useTranslate';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/data/translations';

/**
 * Component to display translated text with a skeleton loader
 * @param {Object} props
 * @param {string} props.text - Original English text or a translation key
 * @param {string} [props.tag='span'] - HTML tag to wrap the text
 * @param {Object} [props.style] - Optional styles
 * @param {string} [props.className] - Optional class name
 */
export default function TranslatedText({ text, tag: Tag = 'span', style, className }) {
  const { language } = useLanguage();
  
  // Check if text exists in manual translations dictionary first
  const manualTranslation = t(text, language);
  const isManuallyTranslated = manualTranslation !== text;
  
  const { translated, loading } = useTranslate(isManuallyTranslated ? '' : text, language);

  const displayText = isManuallyTranslated ? manualTranslation : translated;

  if (loading) {
    return (
      <Tag 
        className={`skeleton ${className || ''}`} 
        style={{ 
          ...style, 
          display: 'inline-block', 
          minWidth: '60%', 
          borderRadius: '4px',
          height: '1em',
          verticalAlign: 'middle'
        }}
      >
        &nbsp;
      </Tag>
    );
  }

  return <Tag className={className} style={style}>{displayText}</Tag>;
}
