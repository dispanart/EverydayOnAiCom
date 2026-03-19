// components/layout/PageWrapper.jsx
// Wrapper untuk semua halaman — menggabungkan Header + Footer
// Ini Server Component yang aman me-render Client Components (Header/Footer)

import Header from './Header';
import Footer from './Footer';

export default function PageWrapper({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
