import * as Joy from "@mui/joy";
import * as React from "react";
import * as ReactRouter from "react-router";
import * as Typia from "typia";

import * as Components from "#~/components/components.js";
import * as Shared from "rote-shared/shared.js";
import * as Util from "#~/lib/util.js";

type Props = {
    navigate: ReactRouter.NavigateFunction,
}

class State {
    error?: unknown = undefined;
    issue?: string = undefined;
}

class SignupImpl extends React.Component<Props, State> {
    state = new State();

    componentDidMount = (): void => {
        type ResponseBodyType = {
            user: Shared.User,
            flashcardsets: Shared.Flashcardset[],
        };

        Util.get("users", Typia.createValidate<ResponseBodyType>(), Util.dateReviver("createDate"))
            .then(_ => this.props.navigate("/flashcardsets"))
            .catch(console.log);
    }

    onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);

        const username = data.get("username");
        const password = data.get("password");
        const confirm = data.get("confirm");

        if (password !== confirm)
        {
            this.setState({ issue: "Passwords do not match" });
            return;
        }

        Util.post("users", { username, password })
            .then(async res => {
                if (res.status !== 201)
                {
                    this.setState({ issue: await res.text() });
                    return;
                }

                const loginRes = await Util.post("login", { username, password });

                if (loginRes.status !== 200)
                    throw new Error("Failed to automatically log in; try logging in manually?");

                this.props.navigate(res.headers.get("Location") ?? "/users");
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
            <Joy.Typography level="h1" style={{ marginTop: 40, marginBottom: 10 }}>Sign Up</Joy.Typography>
            {issueNode}
            <form onSubmit={this.onSubmit} style={{ marginTop: 10 }}>
                <Joy.Card style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                    <Joy.FormControl>
                        <Joy.FormLabel>Username (8&ndash;16 bytes)</Joy.FormLabel>
                        <Joy.Input name="username" placeholder="john doe"/>
                    </Joy.FormControl>
                    <Joy.FormControl>
                        <Joy.FormLabel>Password (8&ndash;72 bytes)</Joy.FormLabel>
                        <Joy.Input name="password" type="password" placeholder="it better be strong"/>
                    </Joy.FormControl>
                    <Joy.FormControl>
                        <Joy.FormLabel>Confirm password</Joy.FormLabel>
                        <Joy.Input name="confirm" type="password" placeholder="don't mistype!"/>
                    </Joy.FormControl>
                    <Joy.Button type="submit" color="neutral" style={{ marginTop: 20 }}>Submit</Joy.Button>
                </Joy.Card>
            </form>
            <Joy.Typography level="body-md" style={{ marginTop: 10 }}>
                Already have an account? <Components.Link ul="always" to="/login">Log in</Components.Link>
            </Joy.Typography>
        </Components.Wrapper>;
    }
}

export function Signup(): React.ReactNode {
    const navigate = ReactRouter.useNavigate();
    return <SignupImpl navigate={navigate}/>;
}
