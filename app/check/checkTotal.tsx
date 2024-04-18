"use client";
import { Check, CheckTotalType } from "../(common)/checkProps";
import { useMemo } from "react";

export default function CheckTotal(props: { checkList: Check[] }) {
    const { checkList } = props;

    const total = useMemo(() => {
        const result: CheckTotalType = {
            community: {},
            worship: {},
        };
        checkList.forEach((check) => {
            const { cellId, community, worship } = check;
            const name = `${check.name}(${check.gisu || ""})`;
            if (cellId || cellId === 0) {
                if (community) {
                    if (result.community[cellId])
                        result.community[cellId].push(name);
                    else result.community[cellId] = [name];
                }
                if (worship) {
                    if (result.worship[cellId])
                        result.worship[cellId].push(name);
                    else result.worship[cellId] = [name];
                }
            }
        });
        return {
            community: Object.values(result.community),
            worship: Object.values(result.worship),
        };
    }, [checkList]);

    return (
        <article className="w-full dark:bg-slate-400  drop-shadow-xl mb-2 border-white grid gap-5">
            <section className="dark:bg-black border-2">
                <div className="w-full bg-gray-100 flex flex-row justify-between pl-2">
                    <span className="dark:text-black text-sm">대예배</span>
                </div>
                {total.worship && total.worship.length > 0 ? (
                    <div className="dark:text-white pb-1">
                        {total.worship.map((group) => (
                            <div className="pt-1 pl-2 pr-2 text-sm pb-1 font-semibold">
                                {group.join(", ")}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className=" dark:text-white pb-1">
                        <div className="pt-4 pb-4 pl-2 pr-2 text-sm font-semibold">
                            금주 등록된 출석이 존재하지 않습니다.
                        </div>
                    </div>
                )}
            </section>
            <section className="dark:bg-black border-2">
                <div className="w-full bg-gray-100 flex flex-row justify-between pl-2">
                    <span className="dark:text-black text-sm">팀모임</span>
                </div>
                {total.community && total.community.length > 0 ? (
                    <div className=" dark:text-white pb-1">
                        {total.community.map((group, index) => (
                            <div
                                className="pt-1 pl-2 pr-2 text-sm pb-1 font-semibold"
                                key={`group_${index}_section`}
                            >
                                {group.join(", ")}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className=" dark:text-white pb-1">
                        <div className="pt-4 pb-4 pl-2 pr-2 text-sm font-semibold">
                            금주 등록된 출석이 존재하지 않습니다.
                        </div>
                    </div>
                )}
            </section>
        </article>
    );
}
