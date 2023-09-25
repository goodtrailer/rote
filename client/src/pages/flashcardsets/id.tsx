import * as Joy from "@mui/joy";
import * as React from "react";
import * as ReactRouter from "react-router";
import * as Typia from "typia";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import * as Components from "#~/components/components.js";
import * as Shared from "rote-shared/shared.js";
import * as Util from "#~/lib/util.js";

type Props = {
    navigate: ReactRouter.NavigateFunction,
    id?: string,
}

class State {
    isDeleting: boolean = false;
    flashcardset?: Shared.Flashcardset = undefined;
    flashcards: Shared.Flashcard[] = [];
    user?: Shared.User = undefined;
    error?: unknown = undefined;
}

class IdImpl extends React.Component<Props, State> {
    state = new State();

    componentDidMount = (): void => {
        {
            type ResponseBodyType = {
                flashcardset: Shared.Flashcardset,
                flashcards: Shared.Flashcard[],
            };
    
            Util.get(
                `flashcardsets/${Number(this.props.id)}`,
                Typia.createValidate<ResponseBodyType>(),
                Util.dateReviver("createDate")
            )
                .then(b => this.setState(b))
                .catch(e => this.setState({ error: e }));
        }

        {
            type ResponseBodyType = {
                user: Shared.User,
                flashcardsets: Shared.Flashcardset[],
            };

            Util.get(
                "users",
                Typia.createValidate<ResponseBodyType>(),
                Util.dateReviver("createDate")
            )
                .then(b => this.setState({ user: b.user }))
                .catch(console.log);
        }
    };

    onCancel = (): void => {
        this.setState({ isDeleting: false });
    };

    onDelete = (): void => {
        this.setState({ isDeleting: true });
    };

    onConfirm = (): void => {
        Util.req(`/flashcardsets/${this.props.id}`, { method: "DELETE" })
            .then(async res => {
                if (res.status !== 200)
                    throw new Error(`${res.status}: ${await res.text()}`);

                this.props.navigate("/flashcardsets");
            })
            .catch(e => this.setState({error: e}));
    };

    onStar = (): void => {
    };

    render = (): React.ReactNode => {
        if (this.state.error !== undefined)
            throw this.state.error;

        const isDeleting = this.state.isDeleting;
        const cards = this.state.flashcards;
        const set = this.state.flashcardset;
        const user = this.state.user;

        const isOwner = set !== undefined && user?.id === set?.creatorId;

        return <Components.Wrapper style={{ textAlign: "center" }}>
            <Components.FlashcardSlide cards={cards}
                style={{
                    width: "100%",
                    minWidth: 450, maxWidth: 700,
                    marginBottom: 30,
                }}
            >
                <Joy.Button onClick={this.onDelete} disabled={!isOwner} size="sm" variant="outlined" color="neutral">
                    <DeleteForeverIcon/>
                </Joy.Button>
                <Joy.Tooltip title="WIP">
                    <Joy.Button onClick={this.onStar} size="sm" variant="outlined" color="neutral">
                        <StarBorderIcon/>
                    </Joy.Button>
                </Joy.Tooltip>
            </Components.FlashcardSlide>
            <Joy.Typography level="h3" variant="plain" color="neutral">{set?.name}</Joy.Typography>
            <Joy.Typography level="title-lg">
                by <Components.Link to={`/users/${set?.creatorId}`}>{set?.creator}</Components.Link>
            </Joy.Typography>
            <Joy.Typography level="body-lg" sx={{ maxWidth: "50%", minWidth: 450 }}>
                {set?.description}
            </Joy.Typography>
            <Joy.Modal open={isDeleting} onClose={this.onCancel}>
                <Joy.ModalDialog>
                    <Joy.ModalClose/>
                    <Joy.Typography level="title-lg">Are you sure?</Joy.Typography>
                    <Joy.Typography>Do you really want to delete this set of flashcards forever?</Joy.Typography>
                    <Joy.Button onClick={this.onConfirm} color="danger" style={{ marginTop: 20 }}>
                        Yes, delete forever
                    </Joy.Button>
                </Joy.ModalDialog>
            </Joy.Modal>
        </Components.Wrapper>;
    };
}

export function Id(): React.ReactNode {
    const { id } = ReactRouter.useParams();
    const navigate = ReactRouter.useNavigate();
    return <IdImpl id={id} navigate={navigate}/>;
}
