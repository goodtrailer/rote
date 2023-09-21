import * as Joy from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import * as React from "react";

class Props {
    isFront: boolean = true;
    sx?: SxProps = undefined;

    onFlip: (isFront: boolean) => void = () => {};
}

export class Flashcard extends React.Component<React.PropsWithChildren<Props>> {
    static defaultProps = new Props();

    onClick = (): void => this.props.onFlip(!this.props.isFront);

    onToggle = (_e: unknown, value: string | null): void => {
        if (value === null)
            return;

        const isFront = value === "front";
        this.props.onFlip(isFront);
    };

    render = (): React.ReactNode => {
        const side = this.props.isFront ? "front" : "back";

        return <Joy.Card variant="outlined" size="lg"
            sx={{
                cursor: "pointer",
                textAlign: "center",
                boxShadow: "lg",
                ...this.props.sx,
            }}
        >
            <Joy.CardOverflow>
                <Joy.AspectRatio variant="plain" onClick={this.onClick}>
                    <Joy.Typography level="body-lg" color="primary"
                        sx={{
                            fontSize: 28,
                        }}
                        style={{
                            padding: "1em 2.5em",
                            overflowY: "scroll",
                            overflowWrap: "anywhere",
                            whiteSpace: "pre-wrap",
                            alignItems: "safe center",
                        }}
                    >
                        {this.props.children}
                    </Joy.Typography>
                </Joy.AspectRatio>

                <Joy.ToggleButtonGroup size="sm" variant="plain"
                    value={side} onChange={this.onToggle}
                    sx={{
                        position: "absolute", bottom: 7, left: 7,
                        transformOrigin: "top left",
                        transform: "translate(0%, 100%) rotate(-90deg)",
                    }}
                >
                    <Joy.Button value="back">back</Joy.Button>
                    <Joy.Button value="front">front</Joy.Button>
                </Joy.ToggleButtonGroup>
            </Joy.CardOverflow>
        </Joy.Card>;
    };
}
