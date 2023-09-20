export type Flashcardset = {
    name: string,
    description: string,
    creatorId: number,
    createDate: Date,
    stars: number,
    views: number,
    id: number,
};

export namespace Flashcardset {
    export const Empty: Flashcardset = {
        name: "",
        description: "",
        creatorId: 0,
        createDate: new Date(0),
        stars: 0,
        views: 0,
        id: 0,
    };
}
