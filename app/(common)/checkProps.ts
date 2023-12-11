import { Member } from "./requestProps";

export interface CheckDto {
    myCellMember: number[];
    myCheckList: Check[];
}

export interface Check extends Member {
    worship: boolean;
    community: boolean;
}

// DB to CheckList
export function convertCheckList(queryList: any[]): Check[] {
    const result: Check[] = [];
    let exHash = "";
    let exInsertId = 0;
    if (queryList.length > 0) {
        queryList.forEach((data) => {
            const { memberId, insertId, name, weekId, worship, community } =
                data;
            const hash = `${memberId}${weekId}`;
            if (exHash === hash && exInsertId > insertId) return;
            const checkList: Check = {
                memberId,
                name,
                worship,
                community,
            };
            result.push(checkList);
            exHash = hash;
            exInsertId = insertId;
        });
        return result;
    }
    return [];
}
