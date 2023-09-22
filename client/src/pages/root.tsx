import * as Joy from "@mui/joy";
import * as React from "react";
import * as ReactRouter from "react-router-dom";

import * as Components from "#~/components/components.js";

class State {
    isFront: boolean = true;
}

export class Root extends React.Component<unknown, State> {
    state = new State();

    onFlip = (isFront: boolean): void => {
        this.setState({ isFront });
    }

    render = (): React.ReactNode => {
        const text = this.state.isFront
            ? "rote"
            : "mechanical or habitual repetition of something to be learned.\n\n".repeat(50);

        return <Components.Wrapper>
            <div style={{ marginTop: 50, display: "flex", flexDirection: "row", gap: 40, width: "80%" }}>
                <Components.Flashcard onFlip={this.onFlip} isFront={this.state.isFront}
                    style={{
                        flex: "1 0 400px",
                        minWidth: 300,
                    }}
                >
                    {text}
                </Components.Flashcard>
                <div style={{
                    flex: "1 0 300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 15
                }}>
                    <Joy.Typography level="h1" textColor="neutral.plainColor">
                        Study efficiently
                    </Joy.Typography>
                    <Joy.Typography textColor="neutral.plainColor" style={{ marginBottom: 5 }}>
                        Flashcards are the best way to quickly and easily memorize important vocabulary. Create, study, and share them with others.
                    </Joy.Typography>
                    <ReactRouter.Link to="/signup">
                        <Joy.Button color="neutral" sx={{ alignSelf: "flex-start" }}>
                            Sign up
                        </Joy.Button>
                    </ReactRouter.Link>
                </div>
            </div>
            <div style={{ height: 0, marginTop: 100, display: "flex", gap: 100 }}>
                <Joy.Typography level="h2" textColor="neutral.plainColor">XXX users</Joy.Typography>
                <Joy.Typography level="h2" textColor="neutral.plainColor">XXX flashcardsets</Joy.Typography>
                <Joy.Typography level="h2" textColor="neutral.plainColor">XXX flashcards</Joy.Typography>
            </div>
        </Components.Wrapper>;
    };
}
