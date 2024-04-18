import { NextApiRequest, NextApiResponse } from "next";
import { doConnectionQuery, doQuery } from "./models/doQuery";
import pool from "./models/connectionPool";
import { getWeekDay, getInsertId } from "@/app/utils";
import { PrayerRequest } from "@/app/(common)/requestProps";
import {
    Check,
    CheckDto,
    convertCheckList,
    convertMemberList,
} from "@/app/(common)/checkProps";
import { Member } from "@/app/(common)/requestProps";

const MEMBER_TABLE = process.env.MEMBER_TARGET_TABLE;
const CHECK_TABLE = process.env.CHECK_TARGET_TABLE;

const fetchCheckInitData = ({
    cellId,
    groupId,
}: {
    cellId: string;
    groupId: string;
}): Promise<CheckDto> => {
    const cellMemberQuery = `
                SELECT groupId, memberId, name, birth
                FROM ${MEMBER_TABLE}
                WHERE groupId = ? AND cellId = ?`;

    const checkQuery = `
                SELECT groupId, birth, memberId, insertId, name, cellId, worship, community
                FROM ${CHECK_TABLE} JOIN Member USING (memberId, groupId)
                WHERE groupId = ?
                AND weekId = ?
                ORDER BY memberId, insertId DESC
                `;

    const nowWeekId = getWeekDay(); // 이번주에 대해서만 확인

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                Promise.all([
                    doConnectionQuery({
                        connection,
                        queryState: cellMemberQuery,
                        params: [groupId, cellId],
                    }) as Promise<Member[]>,
                    doConnectionQuery({
                        connection,
                        queryState: checkQuery,
                        params: [groupId, `${nowWeekId}`],
                    }) as Promise<PrayerRequest[]>,
                    new Promise((resolve) => setTimeout(resolve, 1500)),
                ])
                    .then(([cellMemberData, checkListData, unknown]) => {
                        const myCellMember = convertMemberList(cellMemberData);
                        const myCheckList = convertCheckList(checkListData);
                        connection.release();
                        resolve({
                            myCellMember,
                            myCheckList,
                        });
                    })
                    .catch((errorData) => {
                        errorData.point = "fetchCheckInitData()";
                        connection.release();
                        reject(errorData);
                    });
            }
        });
    });
};

const insertCheckList = (checkList: Check[]): Promise<number> =>
    new Promise((resolve, reject) => {
        const insertId = getInsertId();
        const weekId = getWeekDay();
        const rawQuery = checkList.reduce(
            (str, { groupId, memberId, community, worship }) =>
                `${str}('${groupId}', '${weekId}', '${memberId}', '${insertId}', 
            '${!!community ? 1 : 0}', '${!!worship ? 1 : 0}'),`,
            ""
        );
        const conditionQuery = `${rawQuery.slice(0, -1)}`;
        const insertQuery = `
        INSERT INTO ${CHECK_TABLE}
        (groupId, weekId, memberId, insertId, community, worship)
        VALUES ${conditionQuery};
        `;
        Promise.all([
            doQuery(insertQuery, []),
            new Promise((resolve) => setTimeout(resolve, 1000)),
        ])
            .then(() => {
                resolve(checkList.length);
            })
            .catch((error) => {
                reject(error);
            });
    });

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req?.headers?.referer) {
        const url = new URL(req.headers.referer);
        if (url.pathname.includes("check")) {
            if (req.method === "POST") {
                const { checkList } = req.body;
                await insertCheckList(checkList)
                    .then(() => {
                        res.status(201).end();
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(501).end();
                    });
                res.status(201).end();
            } else if (req.method === "GET") {
                let result: CheckDto = {
                    myCellMember: [],
                    myCheckList: [],
                };

                await fetchCheckInitData({
                    cellId: req.query.cellId as string,
                    groupId: req.query.groupId as string,
                })
                    .then((values) => {
                        if (values) result = values;
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(501).end();
                    });
                res.status(200).json(result);
            }
        }
    }
    res.status(404).end();
}
