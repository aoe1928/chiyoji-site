export type SiteLanguage = 'ja' | 'en';

const categoryLabels: Record<string, Record<SiteLanguage, string>> = {
  music: { ja: '音楽', en: 'Music' },
  'second-waltz': { ja: 'セカンドワルツ', en: 'Second Waltz' },
  purgatorio: { ja: 'Purgatorio', en: 'Purgatorio' },
  live: { ja: 'ライブ', en: 'Live' },
  merchandise: { ja: 'グッズ', en: 'Merchandise' },
  release: { ja: 'リリース', en: 'Releases' },
  'site-news': { ja: 'サイトのお知らせ', en: 'Site News' },
  lifestyle: { ja: 'ライフハック', en: 'Life Hacks' },
  technology: { ja: '技術', en: 'Technology' },
};

export const getCategoryLabel = (category: string, language: string) => {
  const selectedLanguage: SiteLanguage = language === 'en' ? 'en' : 'ja';
  return categoryLabels[category]?.[selectedLanguage]
    || category.replace(/-/g, ' ').replace(/\b\w/g, character => character.toUpperCase());
};

export const getCategoryPath = (categories: string[], depth = categories.length) =>
  `/tags/${categories.slice(0, depth).join('/')}/`;
