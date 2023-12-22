"use client";
import { useRef } from "react";
import { Check } from "../(common)/checkProps";
import MemberWrapper from "../(common)/memberWrapper";

export default function CheckList(props: { checkList: Check[] }) {
    const { checkList } = props;
    const closedMember = useRef(new Set<number>());

    return (
        <>
            {checkList.map((check, index) => (
                <MemberWrapper
                    member={check}
                    index={index}
                    closedMember={closedMember}
                    key={check.memberId}
                    sectionId={`check_section_${check.memberId}`}
                >
                    <div>
                        <div>{check.name}</div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={check?.worship}
                                />
                                대예배
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={check?.community}
                                />
                                팀모임
                            </label>
                        </div>
                    </div>
                </MemberWrapper>
            ))}
        </>
    );
}
