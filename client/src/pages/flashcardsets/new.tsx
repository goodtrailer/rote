import * as Joy from "@mui/joy";
import * as React from "react";
import * as ReactRouter from "react-router";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import * as Components from "#~/components/components.js";
import * as Shared from "rote-shared/shared.js";
import * as Util from "#~/lib/util.js";

type Props = {
    navigate: ReactRouter.NavigateFunction,
};

class State {
    keys: number[] = [];
    nextKey: number = 0;
    error?: unknown = undefined;
    issue?: string = undefined;
}

export class NewImpl extends React.Component<Props, State> {
    state = new State();

    onAdd = (): void => {
        this.state.keys.push(this.state.nextKey);
        this.setState({ keys: this.state.keys, nextKey: this.state.nextKey + 1 });
    };

    onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);

        type RequestBodyType = {
            flashcardset: Omit<Shared.Flashcardset, "creator" | "creatorId" | "createDate" | "stars" | "views" | "id">,
            flashcards: Omit<Shared.Flashcard, "id">[],
        };

        const flashcardset = {
            name: data.get("name")?.toString() ?? "",
            description: data.get("description")?.toString() ?? "",
        };

        const flashcards = this.state.keys.map(key => {
            return {
                front: data.get(`${key}front`)?.toString() ?? "",
                back: data.get(`${key}back`)?.toString() ?? "",
            };
        });

        const body: RequestBodyType = { flashcardset, flashcards };

        Util.post("/flashcardsets", body)
            .then(async res => {
                if (res.status !== 201 && res.status < 500) {
                    this.setState({ issue: await res.text() });
                    return;
                }

                if (res.status >= 500)
                    throw new Error(`${res.status}: ${await res.text()}`);

                this.props.navigate(res.headers.get("Location") ?? "/flashcardsets");
            })
            .catch(e => this.setState({ error: e }));
    };

    onRemove = (index: number): void => {
        this.state.keys.splice(index, 1);
        this.setState({ keys: this.state.keys });
    };

    render = (): React.ReactNode => {
        if (this.state.error !== undefined)
            throw this.state.error;

        const issueNode = this.state.issue
            ? <Joy.Alert color="danger">{this.state.issue}</Joy.Alert>
            : <></>;

        const inputs = this.state.keys.map((key, i) => {
            const onRemove = () => this.onRemove(i);

            return <div key={key} style={{ display: "flex", gap: 20, width: "100%" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Joy.FormLabel>Front</Joy.FormLabel>
                    <Joy.Textarea name={`${key}front`}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Joy.FormLabel>Back</Joy.FormLabel>
                    <Joy.Textarea name={`${key}back`}/>
                </div>
                <div style={{ flex: 0 }}>
                    <Joy.FormLabel>&nbsp;</Joy.FormLabel>
                    <Joy.Button onClick={onRemove} variant="plain" color="neutral" sx={{ minWidth: 0 }}>
                        <RemoveIcon/>
                    </Joy.Button>
                </div>
            </div>;
        });

        return <Components.Wrapper>
            <Joy.Typography level="h1">New Flashcard Set</Joy.Typography>
            {issueNode}
            <form onSubmit={this.onSubmit} style={{ marginTop: 10, width: "50%", minWidth: 450 }}>
                <Joy.Card>
                    <Joy.FormLabel>Name</Joy.FormLabel>
                    <Joy.Input name="name" placeholder="ap literature"/>
                    <Joy.FormLabel>Description</Joy.FormLabel>
                    <Joy.Textarea name="description" placeholder="it's so sick!"/>
                    {inputs}
                    <Joy.Button onClick={this.onAdd} color="neutral" variant="plain" style={{ width: "fit-content" }}>
                        <AddIcon sx={{ marginRight: 1 }}/> Add flashcard
                    </Joy.Button>
                    <Joy.Button type="submit" color="neutral" style={{ marginTop: 20 }}>Submit</Joy.Button>
                </Joy.Card>
            </form>
        </Components.Wrapper>;
    };
}

export function New(): React.ReactNode {
    const navigate = ReactRouter.useNavigate();
    return <NewImpl navigate={navigate}/>;
}
