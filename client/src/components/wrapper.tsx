import * as Joy from "@mui/joy";
import * as React from "react";
import * as ReactRouter from "react-router-dom";
import * as Typia from "typia";

import * as Shared from "rote-shared/shared.js";
import * as Util from "#~/lib/util.js";
import { Link } from "./link";

class PageLinkProps {
    to: string = "";
    disabled?: boolean = undefined;
    location?: ReactRouter.Location = undefined;
}

class PageLinkImpl extends React.Component<React.PropsWithChildren<PageLinkProps>> {
    static defaultProps = new PageLinkProps();

    render = (): React.ReactNode => {
        const underline = this.props.location?.pathname === this.props.to ? "always" : "hover";

        return <Link level="body-md"
            to={this.props.to}
            style={{ marginY: "auto", transform: "translateY(4px)" }}
            ul={underline}
            disabled={this.props.disabled}
        >
            {this.props.children}
        </Link>
    }
}

function PageLink(props: React.PropsWithChildren<PageLinkProps>) {
    const location = ReactRouter.useLocation();
    return <PageLinkImpl to={props.to} disabled={props.disabled} location={location}>{props.children}</PageLinkImpl>;
}

class Props {
    style?: React.CSSProperties = undefined;
}

class State {
    user?: Shared.User = undefined;
}

export class Wrapper extends React.Component<React.PropsWithChildren<Props>, State> {
    static defaultProps = new Props();

    state = new State();

    componentDidMount = (): void => {
        type ResponseBodyType = {
            user: Shared.User,
            flashcardsets: Shared.Flashcardset[],
        };

        Util.get("users", Typia.createValidate<ResponseBodyType>(), Util.dateReviver("createDate"))
            .then(b => this.setState({ user: b.user }))
            .catch(_ => this.setState({ user: undefined }));
    }

    render = (): React.ReactNode => {
        const user = this.state.user;

        return <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            display: "flex",
            flexDirection: "column",
            gap: 15,
        }}>
            <div style={{
                paddingTop: 10,
                paddingLeft: 20,
                paddingRight: 30,
                display: "flex",
                gap: 30,
                zIndex: 50,
            }}>
                <Joy.Link level="h1" variant="plain" color="neutral"
                    component={ReactRouter.Link}
                    to={user ? "/flashcardsets" : "/"}
                    sx={{ marginY: "auto" }}
                >
                    rote
                </Joy.Link>
                <PageLink to={"/flashcardsets"}>flashcards</PageLink>
                <PageLink disabled={user === undefined} to={`/users/${user?.id}`}>
                    {user?.username ?? "profile"}
                </PageLink>
                <PageLink to={"/about"}>about</PageLink>
                <div style={{ flex: "1" }}/>
                <PageLink to={user ? "/logout" : "/signup"}>
                    {user ? "log out" : "sign up"}
                </PageLink>
            </div>
            <div style={{
                padding: 30,
                margin: 0,
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
