import { Member } from "./requestProps";

export interface CheckDto {
    myCellMember: Member[];
    myCheckList: Check[];
}

export interface CheckItems {
    worship: boolean;
    community: boolean;
}

export interface Check extends Member, Partial<CheckItems> {
    checked?: boolean;
}

// DB to CheckList
export function convertCheckList(queryList: any[]): Check[] {
    const result: Check[] = [];
    let exHash = "";
    let exInsertId = 0;
    if (queryList.length > 0) {
        queryList.forEach((data) => {
            const {
                groupId,
                memberId,
                insertId,
                name,
                weekId,
                worship,
                community,
                birth,
                cellId,
            } = data;
            const hash = `${memberId}${weekId}`;
            if (exHash === hash && exInsertId > insertId) return;
            const checkList: Check = {
                groupId,
                memberId,
                name,
                worship,
                community,
                gisu: getGisu(birth),
                cellId,
            };
            result.push(checkList);
            exHash = hash;
            exInsertId = insertId;
        });
        return result;
    }
    return [];
}

export function getGisu(birth: string) {
    if (!birth) return 0;
    const BASE = {
        fullYear: "1994",
        gisu: 35,
    };
    const year = birth.slice(0, 2);
    const fullYear = (parseInt(year) > 80 ? "19" : "20") + year;
    const gap = parseInt(fullYear) - parseInt(BASE.fullYear);
    const targetGisu = BASE.gisu + (gap || 0);
    return targetGisu;
}

export function convertMemberList(targetMemberList: Member[]) {
    return targetMemberList.map((targetMember) => {
        const { birth } = targetMember;
        if (!birth) return targetMember;
        return {
            ...targetMember,
            gisu: getGisu(birth),
        };
    });
}

export interface CheckTotalType {
    community: { [key: number]: string[] };
    worship: { [key: number]: string[] };
}
