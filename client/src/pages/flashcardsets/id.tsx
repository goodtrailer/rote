import * as Joy from "@mui/joy";
import * as React from "react";
import * as ReactRouter from "react-router";
import * as Typia from "typia";

import * as Components from "#~/components/components.js";
import * as Shared from "rote-shared/shared.js";
import * as Util from "#~/lib/util.js";

class Props {
    id?: string = undefined;
}

class State {
    flashcardset?: Shared.Flashcardset = undefined;
    flashcards: Shared.Flashcard[] = [];
    error?: unknown = undefined;
}

class IdImpl extends React.Component<Props, State> {
    static defaultProps = new Props();

    state = new State();

    componentDidMount = (): void => {
        type ResponseBodyType = {
            flashcardset: Shared.Flashcardset,
            flashcards: Shared.Flashcard[],
        };

        Util.get(`flashcardsets/${Number(this.props.id)}`,
            Typia.createValidate<ResponseBodyType>(),
            Util.dateReviver("createDate"))
            .then(b => this.setState(b))
            .catch(e => this.setState({ error: e }));
    };

    render = (): React.ReactNode => {
        if (this.state.error !== undefined)
            throw this.state.error;

        return <Components.Wrapper style={{ marginLeft: 30, marginRight: 30 }}>
            <Components.FlashcardSlide cards={this.state.flashcards}
                style={{
                    width: "100%",
                    minWidth: 450, maxWidth: 700,
                    marginTop: 30, marginBottom: 30,
                }}
            />
            <Joy.Typography level="h3" variant="plain" color="neutral">{this.state.flashcardset?.name}</Joy.Typography>
            <Joy.Typography level="body-lg">{this.state.flashcardset?.description}</Joy.Typography>
        </Components.Wrapper>;
    };
}

export function Id(): React.ReactNode {
    const { id } = ReactRouter.useParams();
    return <IdImpl id={id}/>;
}
