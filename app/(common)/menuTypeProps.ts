export interface MenuType {
    code: string;
    name: string;
}

export const REQUEST_TYPE_CODE = {
    조별: "01",
    팀별: "02",
};

export const requestTypes: MenuType[] = [
    {
        code: REQUEST_TYPE_CODE.조별,
        name: "조별",
    },
    {
        code: REQUEST_TYPE_CODE.팀별,
        name: "팀별",
    },
];

export const CHECK_TYPE_CODE = {
    등록: "01",
    팀별현황: "02",
};

export const checkTypes: MenuType[] = [
    {
        code: CHECK_TYPE_CODE.등록,
        name: "등록",
    },
    {
        code: CHECK_TYPE_CODE.팀별현황,
        name: "팀별현황",
    },
];
