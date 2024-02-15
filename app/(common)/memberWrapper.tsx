"use client";

import {
    useState,
    useEffect,
    MutableRefObject,
    ReactNode,
    useMemo,
} from "react";
import { Member } from "./requestProps";

export default function MemberWrapper(props: {
    member: Member;
    closedMember: MutableRefObject<Set<number>>;
    children: ReactNode;
    index: number;
    sectionId: string;
}) {
    const { member, closedMember, children, index, sectionId } = props;
    const { memberId } = member;
    const [isClose, setOpen] = useState(closedMember.current.has(memberId));

    function toggleMemberClose(memberId: number) {
        if (closedMember.current.has(memberId)) {
            closedMember.current.delete(memberId);
        } else {
            closedMember.current.add(memberId);
        }
        setOpen(closedMember.current.has(memberId));
    }

    useEffect(() => {
        const groupSectionElement = document.getElementById(sectionId);
        if (groupSectionElement) {
            const delay = 0.35 * index;
            groupSectionElement.style.transitionDelay = delay + "s";
            setTimeout(() => {
                groupSectionElement.dataset.active = "true";
            }, 100);
        }
    }, []);

    const memberFullName = member?.gisu
        ? `${member.name}(${member.gisu}기)`
        : member.name;

    return (
        <article
            className="w-full dark:bg-black drop-shadow-xl border-2 mb-2 border-white request-group"
            id={sectionId}
        >
            <details open={!isClose} onClick={(e) => e.preventDefault()}>
                <summary className="w-full bg-gray-100 flex flex-row justify-between pl-2">
                    <span className="dark:text-black text-sm">
                        {memberFullName}
                    </span>
                    <button onClick={() => toggleMemberClose(member.memberId)}>
                        <img
                            src={isClose ? "/plus.svg" : "/hyphen.svg"}
                            className="w-5 h-fill border-solid shadow-xs border border-r-2 border-gray-700 shadow-black"
                        ></img>
                    </button>
                </summary>
            </details>
            <section className="content-wrapper dark:text-white">
                <div className="pt-2 pl-2 pr-2 text-sm pb-1 font-semibold close-request content">
                    {children}
                </div>
            </section>
        </article>
    );
}
