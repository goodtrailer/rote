import * as React from "react";

import * as Components from "#~/components/components.js";

export class Root extends React.Component {
    render = (): React.ReactNode => {
        return <Components.Wrapper style={{ gap: 20, height: "100%" }}>
            <Components.FlashcardsetListing path={"/flashcardsets"}
                style={{ flex: "1" }}
            />
        </Components.Wrapper>;
    };
}
