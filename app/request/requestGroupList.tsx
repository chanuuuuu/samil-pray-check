"use client";
import { useEffect, MutableRefObject } from "react";
import RequestGroup from "./requestGroup";
import { PrayerRequestGroup } from "./requestProps";

export default function RequestGroupList(props: {
    closedMember: MutableRefObject<Set<number>>;
    isLoading: boolean;
    requestGroups: PrayerRequestGroup[];
}) {
    const { closedMember, isLoading, requestGroups } = props;

    useEffect(() => {
        requestGroups.forEach((group, index) => {
            const groupSectionElement = document.getElementById(
                `request_group_section_${group.memberId}`
            );
            if (groupSectionElement) {
                const delay = 0.45 * index;
                groupSectionElement.style.transitionDelay = delay + "s";
                setTimeout(() => {
                    groupSectionElement.dataset.active = "true";
                }, 100);
            }
        });
    }, [isLoading, requestGroups]);

    return (
        <>
            {requestGroups.map((group) => (
                <RequestGroup
                    prayerRequestGroup={group}
                    closedMember={closedMember}
                    key={group.memberId}
                />
            ))}
        </>
    );
}
