import "./globals.css";
import type { Metadata } from "next";
import SessionProvider from "./AuthProvider";

export const metadata: Metadata = {
    title: "한줄 기도제목 나눔",
    description: "기도제목을 나눕니다",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            ></meta>
            <body className="dark font-['sam']">
                <div className="mx-auto h-screen bg-neutral-50 dark:bg-blue-700">
                    <SessionProvider>{children}</SessionProvider>
                    <footer className="font-serif text-xs font-thin absolute bottom-0 left-0 mb-1 p-1 footer text-slate-500 dark:text-slate-300 z-10">
                        In their hearts humans plan their course, but the{" "}
                        <span className="uppercase">Lord</span> establishes
                        their steps.
                    </footer>
                </div>
            </body>
        </html>
    );
}
