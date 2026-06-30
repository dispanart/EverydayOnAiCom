import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LocalSearchPage from '@/components/search/LocalSearchPage';

export const metadata = {
  title: 'Search | EverydayOnAI',
  description: 'Search EverydayOnAI article titles locally in your browser.',
  robots: { index: false, follow: true },
};

export default function SearchPage({ searchParams }) {
  const initialQuery = typeof searchParams?.q === 'string' ? searchParams.q : '';

  return (
    <>
      <Header />
      <main className="w page-main search-page-main">
        <LocalSearchPage initialQuery={initialQuery} />
      </main>
      <Footer />
    </>
  );
}
