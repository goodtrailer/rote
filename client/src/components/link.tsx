import * as Joy from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import * as React from "react";
import * as ReactRouter from "react-router-dom";

class Props {
    ul: "none" | "hover" | "always" = "hover";
    to: string = "/";
    level?: keyof Joy.TypographySystem | "inherit" = undefined;
    disabled?: boolean = undefined;
    style?: SxProps = undefined;
}

export class Link extends React.Component<React.PropsWithChildren<Props>> {
    static defaultProps = new Props();

    render = (): React.ReactNode => {
        return <Joy.Link underline={this.props.ul}
            color="neutral"
            textColor="neutral.plainColor"
            level={this.props.level}
            component={ReactRouter.Link}
            to={this.props.to}
            disabled={this.props.disabled}
            sx={this.props.style}
        >
            {this.props.children}
        </Joy.Link>;
    }
}