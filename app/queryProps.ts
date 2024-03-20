export interface Member {
    memberId: number;
    name: string;
    groupId: number; // 팀별
    cellId: number; // 조별
    role: number;
    birth: string;
    password: string;
}

export interface MemberStorage {
    memberId: number;
    name: string;
    cellId: number;
    groupId: number;
    role: number;
}
