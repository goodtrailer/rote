import * as Joy from "@mui/joy";
import * as React from "react";
import * as ReactRouter from "react-router-dom";

class Props {
    style?: React.CSSProperties = undefined;
}

export class Wrapper extends React.Component<React.PropsWithChildren<Props>> {
    static defaultProps = new Props();

    render = (): React.ReactNode => {
        return <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            display: "flex",
            flexDirection: "column",
            gap: 15,
        }}>
            <div style={{
                paddingTop: 10,
                paddingLeft: 20,
            }}>
                <Joy.Link level="h1" variant="plain" color="neutral" component={ReactRouter.Link} to={"/"}>rote</Joy.Link>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                ...this.props.style,
            }}>
                {this.props.children}
            </div>
        </div>;
    };
}
