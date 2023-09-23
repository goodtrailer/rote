import * as Dayjs from "dayjs";
import * as Joy from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import * as React from "react";
import * as ReactRouter from "react-router-dom";
import * as RelativeTime from "dayjs/plugin/relativeTime";
import * as Typia from "typia";

import * as Shared from "rote-shared/shared.js";
import * as Util from "#~/lib/util.js";
import { Flashcard } from "./flashcard";
import { Link } from "./link";
import { PageArrows } from "./pageArrows";

Dayjs.extend(RelativeTime);

const SETS_PER_PAGE = 12;

type FlashcardLinkProps = {
    front: string,
    back: string,
    to: string,
    style?: SxProps,
}

class FlashcardLinkState {
    isFront: boolean = true;
}

class FlashcardLink extends React.Component<FlashcardLinkProps, FlashcardLinkState> {
    static defaultProps = { style: undefined };

    state = new FlashcardLinkState();

    onHover = (): void => {
        this.setState({ isFront: false });
    };

    onUnhover = (): void => {
        this.setState({ isFront: true });
    };

    render = (): React.ReactNode => {
        const text = this.state.isFront ? this.props.front : this.props.back;

        return <ReactRouter.Link to={this.props.to}
            onMouseOver={this.onHover}
            onMouseOut={this.onUnhover}
        >
            <Flashcard isFront={this.state.isFront} style={this.props.style}>
                {text}
            </Flashcard>
        </ReactRouter.Link>;
    };
}

type Props = {
    path: string;
    queryParams: URLSearchParams;
    setQueryParams: ReactRouter.SetURLSearchParams;
    style?: React.CSSProperties;
}

class State {
    page: number = 0;
    pageCount?: number = undefined;
    flashcardsets: Shared.Flashcardset[] = [];
    error?: unknown = undefined;
}

class FlashcardsetListingImpl extends React.Component<Props, State> {
    static defaultProps = { style: undefined };

    state = new State();

    onPageArrow = (page: number): void => {
        this.props.setQueryParams({ page: (page + 1).toString() }, { replace: true });
        this.setPage(page);
    };

    componentDidMount = (): void => {
        const page = Number(this.props.queryParams.get("page") ?? NaN) - 1;
        this.setPage(page);
    };

    setPage = (page: number): void => {
        type ResponseBodyType = {
            count: number,
            flashcardsets: Shared.Flashcardset[],
        };

        const begin = page * SETS_PER_PAGE;
        const count = SETS_PER_PAGE;

        const validate = Typia.createValidate<ResponseBodyType>();
        const reviver = Util.dateReviver("createDate");

        const path = this.props.path;

        Util.get(`${path}?begin=${begin}&count=${count}`, validate, reviver)
            .then(async b => {
                const pageCount = Math.ceil(b.count / SETS_PER_PAGE);
                let flashcardsets = b.flashcardsets;

                if (!Number.isInteger(page) || page < 0 || page >= pageCount) {
                    this.props.queryParams.delete("page");
                    this.props.setQueryParams(this.props.queryParams, { replace: true });
                    page = 0;

                    const b1 = await Util.get(`${path}?begin=0&count=${count}`, validate, reviver);
                    flashcardsets = b1.flashcardsets;
                }

                this.setState({ page, pageCount, flashcardsets });
            })
            .catch(e => this.setState({ error: e }));
    };

    render = (): React.ReactNode => {
        if (this.state.error !== undefined)
            throw this.state.error;

        const links = this.state.flashcardsets.map(s => {
            const to = `/users/${s.creatorId}`;

            return <Joy.Grid xs={12} md={6} lg={4} key={s.id}>
                <FlashcardLink front={s.name}
                    back={s.description || "no description"}
                    to={`/flashcardsets/${s.id.toString()}`}
                    style={{ minWidth: 300 }}
                />
                <div style={{ display: "flex", margin: 8}}>
                    <Joy.Typography level="body-md">
                        by <Link to={to}>{s.creator}</Link>
                    </Joy.Typography>
                    <div style={{ flex: "1" }}/>
                    <Joy.Tooltip title={s.createDate.toLocaleString()}>
                        <Joy.Typography level="body-md">
                            {Dayjs().to(s.createDate)}
                        </Joy.Typography>
                    </Joy.Tooltip>
                </div>
            </Joy.Grid>;
        });

        return <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            ...this.props.style
        }}>
            <PageArrows pageCount={this.state.pageCount}
                page={this.state.page}
                onClick={this.onPageArrow}
            />
            <Joy.Grid container spacing={4} sx={{ flex: "1", width: "100%" }}>
                {links}
            </Joy.Grid>
            <PageArrows pageCount={this.state.pageCount}
                page={this.state.page}
                onClick={this.onPageArrow}
            />
        </div>;
    };
}

export function FlashcardsetListing(props: Omit<Props, "queryParams" | "setQueryParams">) {
    const [queryParams, setQueryParams] = ReactRouter.useSearchParams();
    return <FlashcardsetListingImpl
        path={props.path}
        style={props.style}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
    />;
}
