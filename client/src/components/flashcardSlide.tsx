import * as Joy from "@mui/joy";
import * as React from "react";

import { Flashcard } from "#~/components/flashcard.js";
import * as Shared from "rote-shared/shared.js";

class Props {
    cards: Omit<Shared.Flashcard, "id">[] = [];
    style?: React.CSSProperties = undefined;
}

class State {
    index: number = 0;
    isFront: boolean = true;
    isGotoError: boolean = false;
}

export class FlashcardSlide extends React.Component<Props, State> {
    static defaultProps = new Props();

    state = new State();

    onFlip = (isFront: boolean): void => this.setState({ isFront });

    onLeft = (): void => this.setCardWrapped(this.state.index - 1);

    onRight = (): void => this.setCardWrapped(this.state.index + 1);

    onGotoKeyUp = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key !== "Enter")
            return;

        if (event.currentTarget.value === "")
        {
            this.setState({ isGotoError: false });
            return;
        }

        try
        {
            this.setCard(Number.parseInt(event.currentTarget.value) - 1);
            this.setState({ isGotoError: false });
            event.currentTarget.value = "";
        }
        catch (e)
        {
            this.setState({ isGotoError: true });
        }
    }

    setCard = (index: number) => {
        if (!Number.isInteger(index))
            throw new RangeError(`Non-integer index argument: ${index}`);

        if (index < 0 || index >= this.props.cards.length)
            throw new RangeError(`Out of bounds index: ${index}`);

        this.setState({ index, isFront: true });
    }

    setCardWrapped = (index: number) => {
        if (!Number.isInteger(index))
            throw new RangeError(`Non-integer index argument: ${index}`);

        const wrapped = (index + this.props.cards.length) % this.props.cards.length;
        this.setCard(wrapped);
    }

    render = (): React.ReactNode => {
        const card = this.props.cards[this.state.index] ?? { front: "", back: "" };

        const text = (this.state.isFront ? card.front : card.back).trim();

        return <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            ...this.props.style
        }}>
            <Flashcard isFront={this.state.isFront} onFlip={this.onFlip}>
                {text}
            </Flashcard>
            <div style={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
                gap: 10,
            }}>
                <div style={{
                    position: "absolute", top: "50%", left: 20,
                    transform: "translate(0%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                }}>
                    <Joy.Typography level="body-lg">
                        {this.state.index + 1} / {this.props.cards.length}
                    </Joy.Typography>
                    <Joy.Input placeholder="Goto..." size="sm" sx={{ width: 70 }} error={this.state.isGotoError} onKeyUp={this.onGotoKeyUp}/>
                </div>

                <Joy.Button size="lg" variant="plain" color="neutral" onClick={this.onLeft}>
                    {"<-"}
                </Joy.Button>
                
                <Joy.Button size="lg" variant="plain" color="neutral" onClick={this.onRight}>
                    {"->"}
                </Joy.Button>
            </div>
        </div>;
    }
}
