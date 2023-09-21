import * as Joy from "@mui/joy";
import * as React from "react";
import * as ReactRouter from "react-router-dom";

class PageLinkProps {
    to: string = "/";
}

class PageLink extends React.Component<React.PropsWithChildren<PageLinkProps>> {
    static defaultProps = new PageLinkProps();

    render = (): React.ReactNode => {
        return <Joy.Link level="body-md"
            color="neutral"
            textColor="neutral.plainColor"
            component={ReactRouter.Link}
            to={this.props.to}
            sx={{ marginY: "auto", transform: "translateY(4px)" }}
        >
            {this.props.children}
        </Joy.Link>
    }
}

class Props {
    style?: React.CSSProperties = undefined;
}

export class Wrapper extends React.Component<React.PropsWithChildren<Props>> {
    static defaultProps = new Props();

    render = (): React.ReactNode => {
        return <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            display: "flex",
            flexDirection: "column",
            gap: 15,
        }}>
            <div style={{
                paddingTop: 10,
                paddingLeft: 20,
                display: "flex",
                gap: 30,
            }}>
                <Joy.Link level="h1" variant="plain" color="neutral" component={ReactRouter.Link} to={"/"} sx={{ marginY: "auto" }}>rote</Joy.Link>
                <PageLink to={"/flashcardsets"}>flashcards</PageLink>
                <PageLink to={"/profile"}>profile</PageLink>
                <PageLink to={"/about"}>about</PageLink>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                ...this.props.style,
            }}>
                {this.props.children}
            </div>
        </div>;
    };
}
