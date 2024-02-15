"use client";
import { useRef, useState } from "react";
import { Check } from "../(common)/checkProps";
import MemberWrapper from "../(common)/memberWrapper";

export default function CheckList(props: {
    checkList: Check[];
    fetchInitData: () => Promise<void>;
}) {
    const { checkList, fetchInitData } = props;
    const [isLoading, setLoading] = useState<boolean>(false);
    const closedMember = useRef(new Set<number>([]));
    const userCheckedList = useRef(checkList); // 제출용 데이터

    function handleClick(event: React.MouseEvent<HTMLInputElement>) {
        const checkInput = event.currentTarget;
        const { index, memberId, type } = checkInput.dataset;
        if (index && type) {
            switch (type) {
                case "community": {
                    userCheckedList.current[parseInt(index)].community =
                        checkInput.checked;
                    if (checkInput.checked) {
                        userCheckedList.current[parseInt(index)].worship =
                            checkInput.checked;
                        toggleWorshipInput(memberId || "");
                    }
                }
                case "worship": {
                    userCheckedList.current[parseInt(index)].worship =
                        checkInput.checked;
                }
            }
        }
    }

    function toggleWorshipInput(memberId: string) {
        const worshipInput = document.getElementById(
            `worship_${memberId}`
        ) as HTMLInputElement;
        if (worshipInput) {
            worshipInput.checked = true;
        }
    }

    async function handleSubmit(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        setLoading(true);
        const result = await fetch("/api/checks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                checkList: userCheckedList.current,
            }),
        });
        setTimeout(() => {
            setLoading(false);
            fetchInitData();
        }, 1000);
    }

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
                    <ul className="items-center w-full inline-flex">
                        <li className="w-full p-1">
                            <div className="flex items-center ps-3">
                                <input
                                    id={`worship_${check.memberId}`}
                                    type="checkbox"
                                    className="text-blue-600 mr-1 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    onClick={handleClick}
                                    data-index={index}
                                    data-type="worship"
                                    defaultChecked={check?.worship}
                                />
                                <label
                                    htmlFor={`worship_${check.memberId}`}
                                    className="w-full text-sm text-gray-900 dark:text-gray-300"
                                >
                                    대예배
                                </label>
                            </div>
                        </li>
                        <li className="w-full">
                            <div className="flex items-center ps-3">
                                <input
                                    id={`community_${check.memberId}`}
                                    type="checkbox"
                                    className="text-blue-600 mr-1 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    onClick={handleClick}
                                    data-index={index}
                                    data-type="community"
                                    data-member-id={check?.memberId}
                                    defaultChecked={check?.community}
                                />
                                <label
                                    htmlFor={`community_${check.memberId}`}
                                    className="w-full text-sm text-gray-900 dark:text-gray-300"
                                >
                                    팀모임
                                </label>
                            </div>
                        </li>
                    </ul>
                </MemberWrapper>
            ))}
            <section className="mt-5 z-100">
                {!isLoading && (
                    <button
                        className="w-full items-center bg-gray-100 border-gray-300 text-base"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        제출
                    </button>
                )}
                {isLoading && (
                    <div className="w-full items-center text-center">
                        <span className="animate-pulse">등록 중입니다.</span>
                        <span className="animate-bounce inline mr-0.5 prefix">
                            {"💬"}
                        </span>
                    </div>
                )}
            </section>
        </>
    );
}
