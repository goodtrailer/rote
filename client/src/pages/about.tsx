import * as Joy from "@mui/joy";
import * as React from "react";

import * as Components from "#~/components/components.js";

export class About extends React.Component {
    render = (): React.ReactNode => {
        return <Components.Wrapper>
            <Joy.Typography level="h1">About</Joy.Typography>
            <Components.Link to="https://github.com/goodtrailer/rote">https://github.com/goodtrailer/rote</Components.Link>
            <Components.Link to="/users/goodtrailer">/users/goodtrailer</Components.Link>
            <Joy.Typography style={{ marginTop: 20, maxWidth: "60%", minWidth: 400 }}>
                Hello! This is the first website I've ever made. It took roughly two weeks, much longer than anticipated. I feel like this is the kind of website you might see at a hackathon, and it only takes them a couple days. I mostly stick to desktop and low-level programming, so this has been quite the learning experience. Check out the GitHub repository for a rough outline of the tech stack I used.
            </Joy.Typography>
        </Components.Wrapper>;
    };
}
