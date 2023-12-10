"use client";
import { useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getMember } from "../utils";
import Header from "../pray/header";

export default function Check() {
    const { data: session } = useSession();

    const member = useMemo(() => {
        return getMember(session);
    }, []);

    useEffect(() => {
        if (member.role === 1) {
            //fetchInitData();
        } else {
            router.push("/home");
        }
    }, [member]);

    return (
        <section className="flex h-m-screen flex-col text-sm tracking-tight leading-tight">
            <Header toggleMode={() => {}} />
            <main className="mt-3 mb-2 max-h-m-screen overflow-y-scroll">
                안녕하세요
            </main>
        </section>
    );
}
