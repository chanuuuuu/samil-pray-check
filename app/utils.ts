import { MemberStorage } from "@/app/queryProps";
import { Session } from "next-auth";

const SAMIL_PR_LS_KEY = process.env.SAMIL_PR_LS_KEY || "temp-key";

export const MAX_INPUT_LENGTH = 70;
export const REGIST_GUIDE = {
    LOADING: "기도제목을 등록하고 있습니다..",
    SUCCESS: "등록이 완료되었습니다!",
    FAIL: "등록이 실패하였습니다.\n간사님께 문의하세요.",
    OVER_LENGTH: "한 번에 5개까지 공유가 가능합니다.",
};

export function getInsertId() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2);
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const day = ("0" + now.getDate()).slice(-2);
    const hour = now.getHours();
    const min = now.getMinutes();
    const formattedHour = (hour < 10 ? "0" : "") + hour;
    const formattedMin = (min < 10 ? "0" : "") + min;
    const result = parseInt(
        `${year}${month}${day}${formattedHour}${formattedMin}`
    );
    if (result) return result;
    return 0;
}

export function getWeekDay(day?: string) {
    const now = day ? new Date(day) : new Date();
    const start = new Date(now.getFullYear(), 0, 1);

    let diffDate = now.getTime() - start.getTime();
    diffDate = diffDate / (1000 * 60 * 60 * 24);

    var weekDay = Math.floor(diffDate / 7) + 1;
    if (now.getDay() < start.getDay()) weekDay += 1;

    const year = now.getFullYear().toString().slice(2);
    const formattedWeekDay = (weekDay < 10 ? "0" : "") + weekDay;

    return parseInt(year + formattedWeekDay);
}

export function activeElement(element: HTMLElement | null) {
    if (element) {
        element.dataset.active = "true";
    }
}

export const ElementUtils = (() => {
    function activate(element: HTMLElement | null) {
        if (element) {
            element.dataset.active = "true";
        }
    }

    function deactivate(element: HTMLElement | null) {
        if (element) {
            element?.removeAttribute("data-active");
        }
    }

    function fitHeight(element: HTMLElement) {
        element.style.height = "auto";
        element.style.height = element.scrollHeight + "px";
    }

    function forEach(
        elements: HTMLElement[] | HTMLCollectionOf<Element>,
        callback: (
            element: HTMLElement | HTMLInputElement,
            index: number
        ) => void
    ) {
        const array = elements?.length >= 0 ? elements : [elements];
        Array.prototype.forEach.call(array, callback);
    }

    function map(
        array: HTMLElement[],
        callback: (element: HTMLElement) => any
    ) {
        return Array.prototype.map.call(array, callback);
    }

    return {
        activate,
        deactivate,
        fitHeight,
        forEach,
        map,
    };
})();

export const Validator = (() => {
    function maxLength(element: HTMLElement): boolean {
        const prayerRequest = (element as HTMLInputElement).value.trim();
        const id = parseInt(element.dataset.id || "0");
        const maxLengthElement = document.getElementById(`max-length-${id}`);
        if (!maxLengthElement) return true;
        if (prayerRequest.length > MAX_INPUT_LENGTH) {
            maxLengthElement.style.display = "block";
            return false;
        } else {
            maxLengthElement.style.display = "none";
            return true;
        }
    }

    function minLength(element: HTMLElement): boolean {
        const prayerRequest = (element as HTMLInputElement).value.trim();
        const id = parseInt(element.dataset.id || "0");
        const minLengthElement = document.getElementById(`min-length-${id}`);
        if (!minLengthElement) return true;
        if (prayerRequest.length === 0) {
            minLengthElement.style.display = "block";
            return false;
        } else {
            minLengthElement.style.display = "none";
            return true;
        }
    }

    function test(element: HTMLInputElement) {
        return [maxLength, minLength].every((func: Function) =>
            func(element as Element)
        );
    }

    function getText(element: HTMLElement): string {
        return (element as HTMLInputElement).value.trim();
    }

    return {
        test,
        getText,
    };
})();

export function getMember(session: Session | null): MemberStorage | null {
    function getMemberByLocalStorage() {
        if (typeof window !== "undefined") {
            const member = localStorage.getItem(SAMIL_PR_LS_KEY);
            if (member) {
                return JSON.parse(member) as MemberStorage;
            }
        }
    }

    function setMemberByLocalStorage(member: MemberStorage) {
        if (typeof window !== "undefined") {
            localStorage.setItem(SAMIL_PR_LS_KEY, JSON.stringify(member));
        }
    }

    if (session?.user) {
        const { user } = session;
        const member = {
            memberId: user.memberId,
            name: user.name,
            cellId: user.cellId,
            groupId: user.groupId,
            role: user.role,
        };
        setMemberByLocalStorage(member);
        return member;
    } else {
        const member = getMemberByLocalStorage();
        if (!member) return null;
        return member;
    }
}

export function deleteMemberInLocalStorage() {
    if (typeof window !== "undefined") {
        localStorage.removeItem(SAMIL_PR_LS_KEY);
    }
}

export function redirectKakaoToBrowser() {
    const useragt = navigator.userAgent.toLowerCase();
    const target_url = location.href;
    if (useragt.match(/kakaotalk/i)) {
        location.href =
            "kakaotalk://web/openExternal?url=" +
            encodeURIComponent(target_url);
    }
}

export function resizeMWsize() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
}
