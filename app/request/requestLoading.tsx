export default function RequestLoading() {
    return (
        <div className="h-[50vh] flex flex-col justify-center">
            <article className="w-full dark:bg-black drop-shadow-xl border-2 border-white h-1/2">
                <div className="w-full bg-gray-100 flex flex-row justify-between pl-2 text-base">
                    데이타 로드중...
                </div>
                <section className="dark:text-white w-full h-[80%] flex flex-col justify-center items-center">
                    <img
                        src="/loading.svg"
                        className="pl-8 pr-8 max-h-8 w-[70%]"
                    ></img>
                    <div className="text-lg font-bold mt-2">
                        잠시만 기다려주세요.
                    </div>
                </section>
            </article>
        </div>
    );
}
