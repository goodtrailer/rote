import * as Joy from "@mui/joy";
import * as React from "react";
import * as ReactRouter from "react-router-dom";

import * as Components from "#~/components/components.js";

class Props {
    error: any = undefined;
}

class ErrorImpl extends React.Component<Props>
{
    render = (): React.ReactNode => {
        return <Components.Wrapper style={{
            flex: "1 1 auto",
            justifyContent: "center",
        }}>
            <Joy.Typography level="h1">Oops!</Joy.Typography>
            <Joy.Typography level="body-lg">
                <i>{this.props.error.statusText || this.props.error.message}</i>
            </Joy.Typography>
        </Components.Wrapper>;
    }
}

export function Error(): React.ReactNode {
    const error = ReactRouter.useRouteError();

    return <ErrorImpl error={error}/>;
}
