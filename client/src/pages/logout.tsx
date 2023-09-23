import * as React from "react";
import * as ReactRouter from "react-router";

import * as Components from "#~/components/components.js";
import * as Util from "#~/lib/util.js";

type Props = {
    navigate: ReactRouter.NavigateFunction;
}

class State {
    error?: unknown = undefined;
}

class LogoutImpl extends React.Component<Props, State> {
    state = new State();

    componentDidMount(): void {
        Util.req("/logout", { method: "DELETE" })
            .then(async res => {
                if (res.status !== 200)
                    throw new Error(`${res.status}: ${await res.text()}`);

                this.props.navigate("/");
            })
            .catch(e => this.setState({ error: e }));
    }

    render = (): React.ReactNode => {
        if (this.state.error !== undefined)
            throw this.state.error;

        return <Components.Wrapper/>;
    }
}

export function Logout(): React.ReactNode {
    const navigate = ReactRouter.useNavigate();

    return <LogoutImpl navigate={navigate}/>;
}
