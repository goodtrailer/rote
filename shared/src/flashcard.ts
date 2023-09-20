export type Flashcard = {
    front: string,
    back: string,
    id: number,
}

export namespace Flashcard {
    export const Empty: Flashcard = {
        front: "",
        back: "",
        id: 0,
    };
}
