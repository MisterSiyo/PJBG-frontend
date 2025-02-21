import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        console.log(`Navigated to ${router.pathname}`);
    }, [router.pathname]);

    return <Component {...pageProps} />;
}

export default MyApp;
