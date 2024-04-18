"use client";

import { useCallback, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isLogined, setLogined] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const member = localStorage.getItem("samil-pr-member");
        if (member) {
            router.push("/home");
        } else {
            setLogined(false);
        }
    }, []);

    const onSubmit = useCallback(async (event: any) => {
        event.preventDefault();
        setLoading(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                name: event.target.name.value,
                password: event.target.password.value,
                group: event.target.group.value,
            });
            if (result?.error) {
                setLoading(false);
                if (result.status === 401) {
                    setError(result.error);
                }
                if (result.status > 500) {
                    setError("서버 점검 중입니다. 간사님께 문의하세요.");
                }
            } else {
                router.push("/home");
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        } catch (error) {
            setLoading(false);
            console.error("error >> ", error);
            setError("서버 점검 중입니다. 간사님께 문의하세요.");
        }
    }, []);

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-rows-6 h-full p-3 text-base tracking-tight leading-tight"
        >
            <article className="row-start-2 row-end-6  dark:bg-black drop-shadow-xl border-2 border-white justify-start w-full h-full">
                <div className="w-full bg-gray-100 flex pl-2">
                    <h1 className="text-base">[2청 2진] 기도제목 한줄 나눔</h1>
                </div>
                {!isLogined && (
                    <section className="w-full h-[90%] p-5 flex flex-col justify-center items-center">
                        <label className="hidden">
                            소속 :
                            <input
                                type="text"
                                name="group"
                                defaultValue={1}
                                placeholder="소속을 작성하세요."
                            />
                        </label>
                        <article className="w-full grid pb-5 gap-1">
                            <label className="prefix">{">>"} 이름</label>
                            <input
                                name="name"
                                placeholder="이름을 입력하세요"
                                className="text-white w-full p-2 bg-gray-700 border-r-3 border-b-3 dark:border-[#21f838] textarea"
                                required
                                autoComplete="off"
                                autoFocus
                            />
                        </article>
                        <article className="w-full grid pb-2 gap-1">
                            <label className="prefix">{">>"} 비밀번호</label>
                            <input
                                name="password"
                                placeholder="생년월일 6자리입니다"
                                className="text-white w-full p-2 bg-gray-700 border-r-3 border-b-3 dark:border-[#21f838] textarea"
                                required
                                autoComplete="off"
                            />
                        </article>
                        {error && (
                            <div
                                className="w-full text-[#ffff00] text-sm mb-3"
                                id={`error`}
                            >
                                {"[경고]"} {error}
                            </div>
                        )}
                        <div className="text-[#21f838] w-full flex justify-center mb-3">
                            {isLoading && (
                                <span className="border-b-2 border-l-1 border-[#21f838]">
                                    로그인 중입니다..
                                </span>
                            )}
                            {!isLoading && (
                                <button
                                    type="submit"
                                    className="trans-button border-b-2 border-l-1 border-[#21f838]"
                                >{`[로그인]`}</button>
                            )}
                        </div>
                    </section>
                )}
            </article>
        </form>
    );
}
