import { NextApiRequest, NextApiResponse } from "next";
import { doConnectionQuery, doQuery } from "./models/doQuery";
import pool from "./models/connectionPool";
import { getWeekDay, getInsertId } from "@/app/utils";
import { PrayerRequest, convertCellMember } from "@/app/(common)/requestProps";
import { CheckDto, convertCheckList } from "@/app/(common)/checkProps";

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
                SELECT memberId
                FROM ${MEMBER_TABLE}
                WHERE groupId = ? AND cellId = ?`;

    // LEFT JOIN 필요
    const requestQuery = `
                SELECT memberId, insertId, name, cellId, worship, community
                FROM ${CHECK_TABLE} JOIN Member USING (memberId)
                WHERE groupId = ?
                AND weekId = ?
                ORDER BY memberId, insertId DESC;
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
                    }) as Promise<number[]>,
                    doConnectionQuery({
                        connection,
                        queryState: requestQuery,
                        params: [groupId, nowWeekId],
                    }) as Promise<PrayerRequest[]>,
                    new Promise((resolve) => setTimeout(resolve, 1500)),
                ])
                    .then(([cellMemberData, prayerRequestData, unknown]) => {
                        const myCellMember = convertCellMember(cellMemberData);
                        const myCheckList = convertCheckList(prayerRequestData);
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

const insertPrayerRequest = (
    memberId: number,
    prayerRequests: string[]
): Promise<number> =>
    new Promise((resolve, reject) => {
        const insertId = getInsertId();
        const weekId = getWeekDay();
        const rawQuery = prayerRequests.reduce(
            (str, requests) =>
                `${str}('${memberId}', '${requests}', '${insertId}', '${weekId}'),`,
            ""
        );
        const conditionQuery = `${rawQuery.slice(0, -1)}`;
        const insertQuery = `
        INSERT INTO ${CHECK_TABLE}
        (memberId, text, insertId, weekId)
        VALUES ${conditionQuery};
        `;
        Promise.all([
            doQuery(insertQuery, []),
            new Promise((resolve) => setTimeout(resolve, 1500)),
        ])
            .then(() => {
                resolve(prayerRequests.length);
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
        if (url.pathname.includes("home")) {
            if (req.method === "POST") {
                const { memberId, prayerRequests } = req.body;
                await insertPrayerRequest(memberId, prayerRequests)
                    .then(() => {
                        res.status(201).end();
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(501).end();
                    });
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
