"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getMember } from "../utils";
import Header from "../pray/header";
import ToggleMenu from "../(common)/toggleMenu";
import RequestLoading from "../request/requestLoading";
import { CHECK_TYPE_CODE, checkTypes } from "../(common)/menuTypeProps";
import { CheckDto, Check } from "../(common)/checkProps";

export default function Check() {
    const { data: session } = useSession();
    const router = useRouter();
    const [cellMember, setCellMember] = useState<number[]>([]);
    const [checkList, setCheckList] = useState<Check[]>([]);
    const [selectedMenuType, setMenuType] = useState<string>(
        CHECK_TYPE_CODE.등록
    );
    const [isLoading, setLoading] = useState<boolean>(false);

    const member = useMemo(() => {
        return getMember(session);
    }, []);

    const fetchInitData = useCallback(async () => {
        setLoading(true);
        const paramUrl = new URLSearchParams({
            cellId: `${member?.cellId || 0}`,
            groupId: `${member?.groupId || 0}`,
        });
        const result = await fetch("/api/check?" + paramUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data: CheckDto = await result.json();
        console.log(data);
        setCellMember(data?.myCellMember || []);
        setCheckList(data?.myCheckList || []);
        setLoading(false);
    }, [isLoading]);

    useEffect(() => {
        if (member?.role === 1) {
            fetchInitData();
        } else {
            router.push("/home");
        }
    }, [member]);

    return (
        <section className="flex h-m-screen flex-col text-sm tracking-tight leading-tight">
            <Header toggleMode={() => {}} />
            <main className="mt-3 mb-2 max-h-m-screen overflow-y-scroll">
                <ToggleMenu
                    selectedMenuType={selectedMenuType}
                    setMenuType={setMenuType}
                    setLoading={setLoading}
                    fetchInitData={fetchInitData}
                    menuTypes={checkTypes}
                />
                <section className="border-l-2 border-r-2 border-b-4 border-black ml-2 mr-2 p-2 dark:bg-slate-400 shadow-slate-500/70">
                    {isLoading && <RequestLoading />}
                    {!isLoading && <div>본문입니다.</div>}
                </section>
            </main>
        </section>
    );
}
