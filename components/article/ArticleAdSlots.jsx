import ArticleContent from '@/components/article/ArticleContent';
import AdSense, { AD_SLOTS } from '@/components/ui/AdSense';

export default function ArticleAdSlots({ html }) {
  return (
    <>
      <AdSense slot={AD_SLOTS.articleTop} className="eonai-ad-article-top" />
      <ArticleContent html={html} />
      <AdSense slot={AD_SLOTS.articleBottom} className="eonai-ad-article-bottom" />
    </>
  );
}
