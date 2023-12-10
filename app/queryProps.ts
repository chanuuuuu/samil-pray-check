export interface Member {
    memberId: number;
    name: string;
    groupId: number;
    cellId: number;
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
