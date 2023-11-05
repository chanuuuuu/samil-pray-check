import "next-auth";

declare module "next-auth" {
    interface User {
        id: number;
        memberId: number;
        name: string;
        groupId: number;
        cellId: number;
        role: number;
        birth: string;
        password: string;
    }

    interface Session extends DefaultSession {
        user: User;
        expires: string;
    }
}
