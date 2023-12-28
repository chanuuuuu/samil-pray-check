import { signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { deleteMemberInLocalStorage } from "@/app/utils";

export default function Header(props: { toggleMode: (type: string) => void }) {
    const { toggleMode } = props;
    const router = useRouter();
    const pathname = usePathname();
    const isPrayerPage = pathname?.includes("home");

    function logout() {
        deleteMemberInLocalStorage();
        signOut({ callbackUrl: "/" });
    }

    return (
        <div className="z-30 dark:bg-slate-400 w-full min-h-max max-h-6 flex flex-row justify-between  border-b-2 border-black">
            <div className="flex gap-2">
                {isPrayerPage && (
                    <>
                        <button
                            className="border-solid shadow-xs border-2 border-l-1 border-r-1 border-gray-700 shadow-black pl-1 pr-1"
                            onClick={() => toggleMode("REGIST")}
                        >
                            기도제목 등록
                        </button>
                        <button
                            className="border-solid shadow-xs border-2 border-l-1 border-r-1 bg-[#FFDF00] border-gray-700 shadow-black pl-1 pr-1"
                            onClick={() => toggleMode("PRAY")}
                        >
                            기도모드
                        </button>
                        <button
                            className="border-solid shadow-xs border-2 border-l-1 border-r-1 border-gray-700 shadow-black pl-1 pr-1"
                            onClick={() => router.push("/check")}
                            hidden
                        >
                            출석부
                        </button>
                    </>
                )}
                {!isPrayerPage && (
                    <button
                        className="border-solid shadow-xs border-2 border-l-1 border-r-1 border-gray-700 shadow-black pl-1 pr-1"
                        onClick={() => router.push("/home")}
                    >
                        기도제목
                    </button>
                )}
            </div>
            <button
                className="border-solid shadow-xs border-2 border-l-1 border-gray-700 shadow-black pl-1 pr-1"
                onClick={logout}
            >
                로그아웃
            </button>
        </div>
    );
}
