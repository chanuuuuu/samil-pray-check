"use client";
import "./globals.css";
import { redirectKakaoToBrowser, resizeMWsize } from "./utils";
import { useEffect } from "react";
import SessionProvider from "./AuthProvider";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        redirectKakaoToBrowser();
        resizeMWsize();
    });

    return (
        <html>
            <head>
                <title>한줄 기도제목 나눔</title>
                <meta name="description" content="기도제목을 나눕니다"></meta>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                ></meta>
            </head>
            <body className="dark font-['sam']">
                <div className="mx-auto h-m-screen bg-neutral-50 dark:bg-blue-700">
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
