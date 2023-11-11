import { AppProps } from "next/app";

// vercel deploy
export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
