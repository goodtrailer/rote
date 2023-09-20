export type User = {
    username: string,
    createDate: Date,
    id: number,
};

export namespace User {
    export const Empty: User = {
        username: "",
        createDate: new Date(0),
        id: 0,
    };
}
