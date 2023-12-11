"use client";
import { useMemo, useLayoutEffect, useState, useEffect } from "react";
import {
    PrayerRequestGroup,
    PrayerRequestInput,
} from "../(common)/requestProps";
import {
    ElementUtils,
    Validator,
    MAX_INPUT_LENGTH,
    REGIST_GUIDE,
} from "../utils";

export default function RegistMode(props: {
    isRegistMode: boolean;
    requestGroups: PrayerRequestGroup[];
    myMemberId: number | undefined;
    toggleMode: (type: string) => void;
    fetchInitData: () => Promise<void>;
}) {
    const {
        isRegistMode,
        requestGroups,
        myMemberId,
        toggleMode,
        fetchInitData,
    } = props;
    const [newPrayRequestList, setPrayRequest] = useState<PrayerRequestInput[]>(
        []
    );
    const [isLoading, setLoading] = useState<boolean>(false);
    const [guide, setGuide] = useState<string>(REGIST_GUIDE.LOADING);

    const myPrayRequestGroup = useMemo(() => {
        return requestGroups.find((group) => group.memberId === myMemberId);
    }, [requestGroups]);

    useEffect(() => {
        if (isRegistMode) {
            if (myPrayRequestGroup) {
                setPrayRequest(
                    myPrayRequestGroup.requests.map((request, index) => {
                        return {
                            text: request,
                            id: index,
                        };
                    })
                );
            } else {
                setPrayRequest([
                    {
                        text: "",
                        id: 0,
                    },
                ]);
            }
        }
    }, [isRegistMode, myPrayRequestGroup]);

    useLayoutEffect(() => {
        setTimeout(() => {
            const registModeElement =
                document.getElementById(`regist-mode-section`);
            if (isRegistMode) {
                ElementUtils.activate(registModeElement);
            } else {
                ElementUtils.deactivate(registModeElement);
            }
        }, 50);
    }, [isRegistMode]);

    useLayoutEffect(() => {
        const textAreaList = document.getElementsByClassName("text-area");
        ElementUtils.forEach(textAreaList, ElementUtils.fitHeight);
        const inputElements = document.querySelectorAll(
            'textarea[name="prayRequest"]'
        );
        const inputElement = inputElements[
            inputElements.length - 1
        ] as HTMLInputElement;
        if (inputElement) {
            const textValue = inputElement?.value
                ? inputElement.value.trim() + " "
                : "";
            inputElement.focus();
            inputElement.value = "";
            inputElement.value = textValue;
        }
    }, [newPrayRequestList]);

    function inputPrayRequest(event: any) {
        ElementUtils.fitHeight(event.target);
        Validator.test(event.target);
    }

    function clickAddPrayRequest() {
        if (newPrayRequestList.length >= 5) {
            alert(REGIST_GUIDE.OVER_LENGTH);
            return;
        }
        let lastId = 0;
        if (newPrayRequestList.length >= 1) {
            lastId = newPrayRequestList[newPrayRequestList.length - 1].id + 1;
        }
        setPrayRequest([
            ...newPrayRequestList,
            {
                text: "",
                id: lastId,
            },
        ]);
    }

    function clickDeletePrayRequest(index: number) {
        if (isLoading) return;
        const textAreaList = document.getElementsByClassName("text-area");

        if (newPrayRequestList.length > 1) {
            const result: PrayerRequestInput[] = [];
            ElementUtils.forEach(textAreaList, (element) => {
                const id = parseInt(element.dataset.id || "0");
                if (id != index) {
                    result.push({
                        text: (element as HTMLInputElement).value,
                        id,
                    });
                }
            });
            setPrayRequest(result);
        } else {
            setPrayRequest([
                {
                    text: "",
                    id: 0,
                },
            ]);
        }
    }

    async function submitPrayRequest(event: any) {
        event.preventDefault();
        let error = false;
        const newPrayerRequests: string[] = [];
        ElementUtils.forEach(event.target?.prayRequest, (element) => {
            if (!Validator.test(element as HTMLInputElement)) {
                error = true;
                return;
            }
            newPrayerRequests.push(Validator.getText(element));
        });
        if (!myMemberId) return;
        if (!error) {
            setLoading(true);
            const result = await fetch("/api/prayer-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    memberId: myMemberId,
                    prayerRequests: newPrayerRequests,
                }),
            });
            if (result.status == 201) {
                setGuide(REGIST_GUIDE.SUCCESS);
            } else {
                setGuide(REGIST_GUIDE.FAIL);
            }
            setTimeout(() => {
                setLoading(false);
                fetchInitData();
                toggleMode("REGIST");
            }, 1000);
        }
    }

    function clickClose() {
        toggleMode("REGIST");
    }

    return (
        <section
            className="absolute top-0 z-20 w-screen bg-slate-800 h-full max-h-m-screen text-base flex items-center opacity-100"
            id="regist-mode-section"
        >
            <div className="ml-2 mr-2 p-1 w-full flex flex-col justify-center items-center">
                <article className="w-full dark:bg-black drop-shadow-xl border-2 border-white h-1/2">
                    <form onSubmit={submitPrayRequest}>
                        <div className="w-full bg-gray-100 flex pl-2 flex-row justify-between">
                            <span>기도제목 등록</span>
                            <button onClick={clickClose} type="button">
                                <img
                                    src="/x-symbol.svg"
                                    className="w-5 h-fill  border-solid shadow-xs border border-r-2 border-gray-700 shadow-black"
                                ></img>
                            </button>
                        </div>
                        <section className="dark:text-white w-full flex flex-col p-1 pt-5 gap-5">
                            {newPrayRequestList.map((request, index) => (
                                <div
                                    className="mb-2"
                                    key={`${`request-section-${index}`}`}
                                >
                                    <div className="flex mb-1">
                                        <span className="inline mr-0.5 prefix">
                                            {">>"}
                                        </span>
                                        <textarea
                                            className="inline w-full bg-black border-b-2 border-r-2 border-[#21f838] h-max text-area"
                                            defaultValue={request.text}
                                            onChange={inputPrayRequest}
                                            rows={1}
                                            spellCheck="false"
                                            key={request.id}
                                            data-id={request.id}
                                            data-error={false}
                                            name="prayRequest"
                                        ></textarea>
                                    </div>
                                    <div
                                        className="w-full text-[#ffff00] warning-length"
                                        id={`max-length-${request.id}`}
                                    >
                                        {"[경고]"} 기도제목 한 줄은
                                        {` ${MAX_INPUT_LENGTH}`}자를 넘을 수
                                        없습니다.
                                    </div>
                                    <div
                                        className="w-full text-[#ffff00] warning-length"
                                        id={`min-length-${request.id}`}
                                    >
                                        {"[경고]"} 빈 기도제목은 추가할 수
                                        없습니다.
                                    </div>
                                    <div className="w-full flex justify-center mb-3 prefix">
                                        <button
                                            type="button"
                                            className="border-b-2 border-l-1 border-r-2 border-[#21f838]"
                                            onClick={() =>
                                                clickDeletePrayRequest(
                                                    request.id
                                                )
                                            }
                                        >{`[삭제]`}</button>
                                    </div>
                                </div>
                            ))}
                        </section>
                        <section className="dark:text-white w-full mb-3 items-center flex flex-col justify-center">
                            {!isLoading && (
                                <>
                                    <button
                                        type="button"
                                        className="trans-button mb-2"
                                        onClick={clickAddPrayRequest}
                                    >{`[하나 더 쓰기]`}</button>
                                    <button
                                        type="submit"
                                        className="trans-button"
                                    >{`[등록하기]`}</button>
                                </>
                            )}
                            {isLoading && (
                                <div className="flex">
                                    <span className="animate-pulse border-b-2 border-l-1 border-[#21f838]">
                                        {guide}
                                    </span>
                                    <span className="animate-bounce inline mr-0.5 prefix">
                                        {"💬"}
                                    </span>
                                </div>
                            )}
                        </section>
                    </form>
                </article>
            </div>
        </section>
    );
}
