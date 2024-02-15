export interface Member {
    groupId?: number;
    memberId: number;
    name: string;
    birth?: string;
    gisu?: number;
}

export interface PrayerRequest extends Member {
    insertId: number;
    request: string;
}

export interface PrayerRequestGroup extends Member {
    insertId: number;
    requests: string[];
}

export interface HomeDto {
    myCellMember: number[];
    myPrayerRequests: PrayerRequest[];
}

export function getPrayerRequestGroup(prayerRequests: PrayerRequest[]) {
    const groupMap = new Map<number, PrayerRequestGroup>();
    prayerRequests.forEach(({ memberId, insertId, name, request }) => {
        if (groupMap.has(memberId)) {
            const group = groupMap.get(memberId);
            if (group && group.insertId === insertId) {
                groupMap.set(memberId, {
                    ...group,
                    requests: [...group.requests, request],
                });
            }
            return;
        }
        groupMap.set(memberId, {
            memberId,
            insertId,
            name,
            requests: [request],
        });
    });
    const returnGroups = Array.from(groupMap.values());
    returnGroups.sort((a, b) => {
        if (a.name >= b.name) return 1;
        return -1;
    });
    return returnGroups;
}

export interface PrayerRequestInput {
    text: string;
    id: number;
}

// DB to PrayerRequest
export function convertPrayerResult(queryList: any[]): PrayerRequest[] {
    const result: PrayerRequest[] = [];
    let exHash = "";
    let exInsertId = 0;
    if (queryList.length > 0) {
        queryList.forEach((data) => {
            const { memberId, insertId, name, text, weekId } = data;
            const hash = `${memberId}${weekId}`;
            if (exHash === hash && exInsertId > insertId) return;
            const pr: PrayerRequest = {
                memberId,
                insertId,
                name,
                request: text,
            };
            result.push(pr);
            exHash = hash;
            exInsertId = insertId;
        });
        return result;
    }
    return [];
}

export function convertCellMember(cellMemberData: any[]) {
    let myCellMember: number[] = [];
    if (cellMemberData && cellMemberData.length > 0) {
        myCellMember = cellMemberData.map((row: any) => parseInt(row.memberId));
    }
    return myCellMember;
}
