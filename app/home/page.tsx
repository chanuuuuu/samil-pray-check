"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import RequestGroupList from "../request/requestGroupList";
import Header from "../pray/header";
import ReqeustTypeMenu from "../pray/requestTypeMenu";
import {
    HomeDto,
    PrayerRequest,
    getPrayerRequestGroup,
} from "../request/requestProps";
import RequestLoading from "../request/requestLoading";
import PrayMode from "../request/prayMode";
import RegistMode from "../request/registMode";
import { useSession } from "next-auth/react";
import { getMember } from "../utils";

export default function Home() {
    const { data: session } = useSession();
    const closedMember = useRef(new Set<number>());
    const router = useRouter();

    const [menuType, setMenuType] = useState<string>("01");
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isPrayMode, setPrayMode] = useState<boolean>(false);
    const [isRegistMode, setRegistMode] = useState<boolean>(false);
    const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
    const [cellMember, setCellMember] = useState<number[]>([]);

    const member = useMemo(() => {
        return getMember(session);
    }, []);

    const fetchInitData = useCallback(async () => {
        setLoading(true);
        const paramUrl = new URLSearchParams({
            cellId: `${member?.cellId || 0}`,
            groupId: `${member?.groupId || 0}`,
        });
        const result = await fetch("/api/prayer-request?" + paramUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data: HomeDto = await result.json();
        setCellMember(data?.myCellMember || []);
        setPrayerRequests(data?.myPrayerRequests || []);
        setLoading(false);
    }, [isLoading, prayerRequests, cellMember]);

    useEffect(() => {
        if (member) {
            fetchInitData();
        } else {
            router.push("/");
        }
    }, [member]);

    const requestGroups = useMemo(() => {
        return getPrayerRequestGroup(prayerRequests);
    }, [prayerRequests]);

    const filteredGroups = useMemo(() => {
        if (menuType == "01") {
            return requestGroups.filter((group) =>
                cellMember.includes(group.memberId)
            );
        }
        return requestGroups;
    }, [menuType, requestGroups]);

    function toggleMode(type: string) {
        switch (type) {
            case "REGIST":
                setPrayMode(false);
                setRegistMode(!isRegistMode);
                return;
            case "PRAY":
                setRegistMode(false);
                setPrayMode(!isPrayMode);
                return;
        }
    }

    return (
        <section className="flex h-m-screen flex-col text-sm tracking-tight leading-tight">
            <Header toggleMode={toggleMode} />
            <main className="mt-3 mb-2 max-h-m-screen overflow-y-scroll">
                <ReqeustTypeMenu
                    menuType={menuType}
                    setMenuType={setMenuType}
                    setLoading={setLoading}
                    fetchInitData={fetchInitData}
                />
                <section className="border-l-2 border-r-2 border-b-4 border-black ml-2 mr-2 p-2 dark:bg-slate-400 shadow-slate-500/70">
                    {isLoading && <RequestLoading />}
                    {!isLoading && (
                        <RequestGroupList
                            closedMember={closedMember}
                            requestGroups={filteredGroups}
                        />
                    )}
                </section>
            </main>
            {isPrayMode && (
                <PrayMode
                    isPrayMode={isPrayMode}
                    closedMember={closedMember}
                    requestGroups={filteredGroups}
                />
            )}
            {isRegistMode && (
                <RegistMode
                    isRegistMode={isRegistMode}
                    requestGroups={filteredGroups}
                    myMemberId={member?.memberId}
                    toggleMode={toggleMode}
                    fetchInitData={fetchInitData}
                />
            )}
        </section>
    );
}
