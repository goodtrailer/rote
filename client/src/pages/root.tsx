import * as React from "react";

import * as Components from "#~/components/components.js";

import "#~/lib/fetch.js";

export class Root extends React.Component {
    render = (): React.ReactNode => {
        const cards = [
            {
                front: "rote",
                back: "mechanical or habitual repetition of something to be learned.\n\n".repeat(50),
            },
            {
                front: "linear equation",
                back: "an equation whose graph is a line",
            },
            {
                front: "ordered pair (x, y)",
                back: "a pair of numbers used to locate a point on the coordinate plane",
            },
            {
                front: "horizontal line equation",
                back: "y = b\nevery point has y-coordinate of b\nslope is zero",
            },
            {
                front: "vertical line equation",
                back: "x = a\n(every point has an x-coordinate of a)\nslope is undefined",
            },
        ];

        return <Components.Wrapper>
            <Components.FlashcardSlide cards={cards} style={{
                width: "100%",
                minWidth: 450, maxWidth: 700,
            }}/>
        </Components.Wrapper>;
    };
}
