import React from 'react';
import '../styles/global.css';
import StoreProvider from '../utils/Store';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import CookieAcceptancePopup from '../components/CookieAcceptancePopup';
import initFacebookPixel from '../utils/facebookPixel';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  React.useEffect(() => {
    initFacebookPixel('462439775168143');
  }, []);
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <CookieAcceptancePopup />
        <PayPalScriptProvider deferLoading={true}>
          {Component.auth ? (
            <Auth adminOnly={Component.auth.adminOnly}>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </PayPalScriptProvider>
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=Ingresa aquí');
    },
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  if (adminOnly && !session.user.isAdmin) {
    router.push('/unauthorized?message=No tienes permisos de administrador');
    return <div>Redirecting...</div>;
  }

  return children;
}

export default MyApp;
