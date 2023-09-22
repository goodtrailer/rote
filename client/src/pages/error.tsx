import * as Joy from "@mui/joy";
import * as React from "react";
import * as ReactRouter from "react-router-dom";

import * as Components from "#~/components/components.js";

class Props {
    error: unknown = undefined;
}

class ErrorImpl extends React.Component<Props> {
    static defaultProps = new Props();

    render = (): React.ReactNode => {
        const msg = (this.props.error as Response).statusText
            || (this.props.error as Error).message
            || "Unknown error";
        
        const stack = (this.props.error as Error).stack || "";

        return <Components.Wrapper style={{
            position: "absolute", top: 0, left: 0, bottom: 0, right: 0,
            justifyContent: "center",
            textAlign: "center",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
        }}>
            <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", gap: 10 }}>
                <Joy.Typography level="h1">Oops!</Joy.Typography>
                <Joy.Typography level="body-lg"><i>{msg}</i></Joy.Typography>
                <Joy.Typography level="body-lg" sx={{ height: 0, transform: "translate(0, 30px)" }}>
                    <i>{stack}</i>
                </Joy.Typography>
            </div>
        </Components.Wrapper>;
    };
}

export function Error(): React.ReactNode {
    const error = ReactRouter.useRouteError();

    return <ErrorImpl error={error}/>;
}
