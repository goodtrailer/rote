import * as Joy from "@mui/joy";
import * as React from "react";

class Props {
    pageCount: number = 0;
    page: number = 0;
    onClick: (page: number) => void = () => {};
    style?: React.CSSProperties = undefined;
}

export class PageArrows extends React.Component<Props> {
    static defaultProps = new Props();

    onLeft = (): void => {
        this.props.onClick(Math.max(0, this.props.page - 1));
    };

    onRight = (): void => {
        this.props.onClick(Math.min(this.props.pageCount - 1, this.props.page + 1));
    };

    render = (): React.ReactNode => {
        const isLeftDisabled = this.props.page <= 0;
        const isRightDisabled = this.props.page >= this.props.pageCount - 1;

        return <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            ...this.props.style,
        }}>
            <Joy.Button size="lg" variant="plain" color="neutral" onClick={this.onLeft} disabled={isLeftDisabled}>
                {"<-"}
            </Joy.Button>
            <Joy.Typography>
                {this.props.page + 1} / {this.props.pageCount}
            </Joy.Typography>
            <Joy.Button size="lg" variant="plain" color="neutral" onClick={this.onRight} disabled={isRightDisabled}>
                {"->"}
            </Joy.Button>
        </div>;
    };
}
