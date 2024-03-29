"use client";
import { Dispatch, SetStateAction } from "react";
import { MenuType } from "./menuTypeProps";
import { getWeekCount } from "@/app/utils";

export default function ToggleMenu(props: {
    selectedMenuType: string;
    menuTypes: MenuType[];
    setMenuType: Dispatch<SetStateAction<string>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    fetchInitData: () => Promise<void>;
}) {
    const {
        selectedMenuType,
        menuTypes,
        setMenuType,
        setLoading,
        fetchInitData,
    } = props;

    function toggleMenuType(e: React.MouseEvent<HTMLElement>) {
        const value = (e.target as HTMLInputElement).value;
        if (value === selectedMenuType) return;
        setMenuType(value);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }

    async function clickRefresh() {
        const refreshElement = document.getElementById(
            "pr-refresh"
        ) as HTMLInputElement;
        refreshElement.disabled = true;
        await fetchInitData();
        setTimeout(() => {
            refreshElement.disabled = false;
        }, 6000);
    }

    const week = getWeekCount(new Date());

    return (
        <div className="sticky ml-2 mr-2 flex flex-row justify-between dark:bg-white border-t-2 border-l border-r-2 border-black">
            <menu className="flex flex-row flex-initial">
                <li className="p-1 bg-slate-400 border border-t-0 drop-shadow-md border-black">
                    {`${week}주차`}
                </li>
                {menuTypes.map((menuType, index) => {
                    return (
                        <li
                            className="dark:bg-white pl-5 pr-5 p-1 font-semibold text-gray-800"
                            key={`${index}_${menuType.code}`}
                        >
                            <button
                                className={
                                    "trans-button " +
                                    (selectedMenuType === menuType.code
                                        ? "underline underline-offset-2"
                                        : "")
                                }
                                onClick={toggleMenuType}
                                value={menuType.code}
                            >
                                {menuType.name}
                            </button>
                        </li>
                    );
                })}
            </menu>
            <button
                onClick={clickRefresh}
                id="pr-refresh"
                className="w-6 mr-0.5 h-fill  border-solid shadow-xs border border-r-2 border-b-2 border-gray-700 shadow-black"
            >
                <img src="/refresh-symbol.svg"></img>
            </button>
        </div>
    );
}
