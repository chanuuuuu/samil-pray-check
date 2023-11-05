"use client";
import { useMemo, useLayoutEffect, MutableRefObject } from "react";
import { PrayerRequestGroup } from "./requestProps";

export default function PrayMode(props: {
    isPrayMode: boolean;
    requestGroups: PrayerRequestGroup[];
    closedMember: MutableRefObject<Set<number>>;
}) {
    const { isPrayMode, requestGroups, closedMember } = props;

    useLayoutEffect(() => {
        setTimeout(() => {
            const prayModeElement =
                document.getElementById(`pray-mode-section`);
            if (isPrayMode) {
                if (prayModeElement) prayModeElement.dataset.active = "true";
            } else {
                prayModeElement?.removeAttribute("data-active");
            }
        }, 50);
    }, [isPrayMode]);

    const filteredGroups = useMemo(() => {
        return requestGroups.filter(
            (group) => !closedMember.current.has(group.memberId)
        );
    }, [requestGroups]);

    return (
        <section
            className="absolute top-0 z-20 w-screen bg-black h-full max-h-screen font-sans overflow-y-scroll"
            id="pray-mode-section"
        >
            <div className="mt-6 p-3 pt-2 pb-2">
                {filteredGroups.map((group, groupIndex) => (
                    <div
                        className="text-white mb-3"
                        key={`requestGroup_${groupIndex}`}
                    >
                        <div className="pb-0.5 font-bold">{group.name}</div>
                        {group.requests.map((request, index) => (
                            <div
                                className="whitespace-normal pb-1.5 ml-3"
                                key={`request_${index}`}
                            >
                                <span className="font-bold">
                                    {`${index + 1}. `}
                                </span>
                                {request}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}
