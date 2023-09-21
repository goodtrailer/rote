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
        const message = (this.props.error as Response).statusText
            || (this.props.error as Error).message
            || "Unknown error";
        
        const stack = (this.props.error as Error).stack;

        const text = `${message}\n\n\n${stack}`;

        return <Components.Wrapper style={{
            flex: "1 1 auto",
            justifyContent: "center",
        }}>
            <Joy.Typography level="h1">Oops!</Joy.Typography>
            <Joy.Typography level="body-lg"
                sx={{
                    maxWidth: "70%",
                    textAlign: "center",
                    whiteSpace: "pre-wrap",
                }}
            >
                <i>{text}</i>
            </Joy.Typography>
        </Components.Wrapper>;
    };
}

export function Error(): React.ReactNode {
    const error = ReactRouter.useRouteError();

    return <ErrorImpl error={error}/>;
}
