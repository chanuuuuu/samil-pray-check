import { NextApiRequest, NextApiResponse } from "next";
import { doConnectionQuery, doQuery } from "./models/doQuery";
import pool from "./models/connectionPool";
import { getWeekDay, getInsertId } from "@/app/utils";
import {
    PrayerRequest,
    convertPrayerResult,
    convertCellMember,
    HomeDto,
} from "@/app/(common)/requestProps";

const MEMBER_TABLE = process.env.MEMBER_TARGET_TABLE;
const PRAYER_REQUEST_TABLE = process.env.PRAYER_REQUEST_TARGET_TABLE;

const fetchHomeInitData = ({
    cellId,
    groupId,
}: {
    cellId: string;
    groupId: string;
}): Promise<HomeDto> => {
    const cellMemberQuery = `
                SELECT memberId
                FROM ${MEMBER_TABLE}
                WHERE groupId = ? AND cellId = ?`;

    const requestQuery = `
                SELECT memberId, requestId, weekId, text, insertId, name, cellId
                FROM ${PRAYER_REQUEST_TABLE} JOIN Member USING (memberId)
                WHERE groupId = ?
                AND weekId >= ?
                ORDER BY memberId, weekId DESC, insertId DESC;
                `;

    const nowWeekId = getWeekDay() - 2;

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
                        const myPrayerRequests =
                            convertPrayerResult(prayerRequestData);
                        connection.release();
                        resolve({
                            myCellMember,
                            myPrayerRequests,
                        });
                    })
                    .catch((errorData) => {
                        errorData.point = "fetchHomeInitData()";
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
        INSERT INTO ${PRAYER_REQUEST_TABLE}
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
                let result: HomeDto = {
                    myCellMember: [],
                    myPrayerRequests: [],
                };

                await fetchHomeInitData({
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
