"use client";

import { useMemo, useState, useEffect, MutableRefObject } from "react";
import { PrayerRequestGroup } from "./requestProps";

export default function RequestGroup(props: {
    prayerRequestGroup: PrayerRequestGroup;
    closedMember: MutableRefObject<Set<number>>;
}) {
    const { prayerRequestGroup, closedMember } = props;
    const { memberId } = prayerRequestGroup;
    const [isClose, setOpen] = useState(closedMember.current.has(memberId));

    function toggleMemberClose(memberId: number) {
        if (closedMember.current.has(memberId)) {
            closedMember.current.delete(memberId);
        } else {
            closedMember.current.add(memberId);
        }
        setOpen(closedMember.current.has(memberId));
    }

    return (
        <article
            className="w-full dark:bg-black drop-shadow-xl border-2 mb-2 border-white request-group"
            id={`request_group_section_${memberId}`}
        >
            <details open={!isClose} onClick={(e) => e.preventDefault()}>
                <summary className="w-full bg-gray-100 flex flex-row justify-between pl-2">
                    <span className="dark:text-black text-sm">
                        {prayerRequestGroup.name}
                    </span>
                    <button
                        onClick={() =>
                            toggleMemberClose(prayerRequestGroup.memberId)
                        }
                    >
                        <img
                            src="/hyphen.svg"
                            className="w-5 h-fill  border-solid shadow-xs border border-r-2 border-gray-700 shadow-black"
                        ></img>
                    </button>
                </summary>
            </details>
            <section className="content-wrapper dark:text-white">
                <div className="pt-2 pl-2 pr-2 text-sm pb-1 font-semibold close-request content">
                    {prayerRequestGroup.requests.map((request, index) => (
                        <div
                            className="whitespace-normal pb-0.5"
                            key={`request_${index}`}
                        >
                            {"> "}
                            {request}
                        </div>
                    ))}
                </div>
            </section>
        </article>
    );
}
