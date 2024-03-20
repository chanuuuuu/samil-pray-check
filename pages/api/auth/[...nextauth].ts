import NextAuth from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import CredentialsProvider from "next-auth/providers/credentials";
import { doQuery } from "../models/doQuery";
import { Member } from "@/app/queryProps";

const MEMBER_TABLE = process.env.MEMBER_TARGET_TABLE;

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    async function getMember(
        credentials: Record<"name" | "password" | "group", string> | undefined
    ) {
        // TODO: 그룹을 사용하도록 구현 필요
        const checkQuery = `
                    SELECT *
                    FROM ${MEMBER_TABLE}
                    WHERE name = ? AND birth = ?`;
        const _response = await doQuery(checkQuery, [
            credentials?.name,
            credentials?.password,
        ]);
        if (_response.error) {
            throw new Error("아이디 혹은 패스워드가 틀립니다.");
        }
        if (_response.result) {
            if (_response.result.length > 0) {
                const member: Member = _response.result[0];
                return { ...member };
            }
            throw new Error("아이디 혹은 패스워드가 틀립니다.");
        }
    }

    return await NextAuth(req, res, {
        providers: [
            CredentialsProvider({
                name: "local",
                credentials: {
                    group: { type: "text" },
                    name: { type: "text" },
                    password: { type: "text" },
                },
                async authorize(credentials): Promise<any> {
                    const member = await getMember(credentials);
                    return {
                        id: `${member?.memberId}`,
                        ...member,
                    };
                },
            }),
        ],
        callbacks: {
            async jwt({ token, user }) {
                if (user) {
                    return {
                        ...user,
                    };
                }
                return token;
            },
            async session({ session, token }) {
                return {
                    ...session,
                    user: {
                        ...token,
                    },
                };
            },
        },
    });
}
