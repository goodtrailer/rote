import * as Joy from "@mui/joy";
import * as React from "react";

import * as Components from "#~/components/components.js";

export class Root extends React.Component {
    render = (): React.ReactNode => {
        return <Components.Wrapper>
            <Joy.Typography level="body-lg">flashcardsets/root!</Joy.Typography>
        </Components.Wrapper>
    }
}
