import * as Joy from "@mui/joy";
import * as React from "react";
import * as ReactRouter from "react-router-dom";

import * as Components from "#~/components/components.js";
import * as Util from "#~/lib/util.js";

type Props = {
    navigate: ReactRouter.NavigateFunction,
}

class State {
    error?: unknown = undefined;
    issue?: string = undefined;
}

class LoginImpl extends React.Component<Props, State> {
    state = new State();

    onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);

        const username = data.get("username");
        const password = data.get("password");

        Util.post("login", { username, password })
            .then(async res => {
                if (res.status !== 200 && res.status < 500)
                {
                    this.setState({ issue: await res.text() });
                    return;
                }

                if (res.status >= 500)
                    throw new Error(`${res.status}: ${await res.text()}`);

                this.props.navigate("/flashcardsets");
            })
            .catch(e => this.setState({ error: e }));
    }

    render = (): React.ReactNode => {
        if (this.state.error !== undefined)
            throw this.state.error;

        const issueNode = this.state.issue
            ? <Joy.Alert color="danger">{this.state.issue}</Joy.Alert>
            : <></>;

        return <Components.Wrapper>
            <Joy.Typography level="h1" style={{ marginTop: 40, marginBottom: 10 }}>Log In</Joy.Typography>
            {issueNode}
            <form onSubmit={this.onSubmit} style={{ marginTop: 10 }}>
                <Joy.Card style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                    <Joy.FormControl>
                        <Joy.FormLabel>Username (8&ndash;16 bytes)</Joy.FormLabel>
                        <Joy.Input name="username"/>
                    </Joy.FormControl>
                    <Joy.FormControl>
                        <Joy.FormLabel>Password (8&ndash;72 bytes)</Joy.FormLabel>
                        <Joy.Input name="password" type="password"/>
                    </Joy.FormControl>
                    <Joy.Button type="submit" color="neutral" style={{ marginTop: 20 }}>Submit</Joy.Button>
                </Joy.Card>
            </form>
            <Joy.Typography level="body-md" style={{ marginTop: 10 }}>
                Don't have an account? <Components.Link ul="always" to="/signup">Sign up</Components.Link>
            </Joy.Typography>
        </Components.Wrapper>;
    }
}

export function Login(): React.ReactNode {
    const navigate = ReactRouter.useNavigate();
    return <LoginImpl navigate={navigate}/>;
}
