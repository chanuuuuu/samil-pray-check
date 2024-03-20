"use client";
import { MutableRefObject } from "react";
import RequestGroup from "./requestGroup";
import { PrayerRequestGroup } from "../(common)/requestProps";
import MemberWrapper from "../(common)/memberWrapper";

export default function RequestGroupList(props: {
    closedMember: MutableRefObject<Set<number>>;
    requestGroups: PrayerRequestGroup[];
}) {
    const { closedMember, requestGroups } = props;

    return (
        <>
            {requestGroups.map((group, index) => (
                <MemberWrapper
                    member={group}
                    index={index}
                    closedMember={closedMember}
                    key={group.memberId}
                    sectionId={`request_group_section_${group.memberId}`}
                >
                    <RequestGroup requests={group.requests}></RequestGroup>
                </MemberWrapper>
            ))}
        </>
    );
}
