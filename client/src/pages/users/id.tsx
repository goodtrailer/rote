import * as Joy from "@mui/joy";
import * as React from "react";
import * as ReactRouter from "react-router";
import * as Typia from "typia";

import * as Components from "#~/components/components.js";
import * as Shared from "rote-shared/shared.js";
import * as Util from "#~/lib/util.js";

type Props = {
    id?: string,
}

class State {
    user?: Shared.User = undefined;
    error?: unknown = undefined;
}

class IdImpl extends React.Component<Props> {
    state = new State();

    componentDidMount = (): void => {
        type ResponseBodyType = {
            user: Shared.User,
            count: number,
            flashcardsets: Shared.Flashcardset[],
        };

        const validate = Typia.createValidate<ResponseBodyType>();
        const reviver = Util.dateReviver("createDate");
        Util.get(`/users/${this.props.id}`, validate, reviver)
            .then(b => this.setState(b))
            .catch(e => this.setState({ error: e }));
    };

    render = (): React.ReactNode => {
        if (this.state.error !== undefined)
            throw this.state.error;

        const user = this.state.user;
        const createDate = user?.createDate.toLocaleDateString();

        return <Components.Wrapper>
            <Joy.Typography level="h1">{user?.username}</Joy.Typography>
            <Joy.Tooltip title={user?.createDate.toLocaleString()}>
                <Joy.Typography level="body-md">Joined {createDate}</Joy.Typography>
            </Joy.Tooltip>
            <Components.FlashcardsetListing path={`/users/${this.props.id}`}
                style={{
                    flex: "1",
                    marginTop: 40
                }}
            />
        </Components.Wrapper>;
    };
}

export function Id(): React.ReactNode {
    const { id } = ReactRouter.useParams();
    return <IdImpl id={id}/>;
}
