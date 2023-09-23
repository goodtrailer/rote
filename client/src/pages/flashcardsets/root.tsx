import * as Dayjs from "dayjs";
import * as RelativeTime from "dayjs/plugin/relativeTime";
import * as Joy from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import * as React from "react";
import * as ReactRouter from "react-router-dom";
import * as Typia from "typia";

import * as Components from "#~/components/components.js";
import * as Shared from "rote-shared/shared.js";
import * as Util from "#~/lib/util.js";

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
    }

    onUnhover = (): void => {
        this.setState({ isFront: true });
    }

    render = (): React.ReactNode => {
        const text = this.state.isFront ? this.props.front : this.props.back;

        return <ReactRouter.Link to={this.props.to}
            onMouseOver={this.onHover}
            onMouseOut={this.onUnhover}
        >
            <Components.Flashcard isFront={this.state.isFront} style={this.props.style}>
                {text}
            </Components.Flashcard>
        </ReactRouter.Link>;
    }
}

type Props = {
    queryParams: URLSearchParams,
    setQueryParams: ReactRouter.SetURLSearchParams,
}

class State {
    page: number = 0;
    pageCount?: number = undefined;
    flashcardsets: Shared.Flashcardset[] = [];
    error?: unknown = undefined;
}

class RootImpl extends React.Component<Props, State> {
    state = new State();

    onPageArrow = (page: number): void => {
        this.props.setQueryParams({ page: (page + 1).toString() });
        this.setPage(page);
    }

    componentDidMount = (): void => {
        let page = Number(this.props.queryParams.get("page") ?? NaN) - 1;
        this.setPage(page);
    }

    setPage = (page: number): void => {
        type ResponseBodyType = {
            count: number,
            flashcardsets: Shared.Flashcardset[],
        };

        const begin = page * SETS_PER_PAGE;
        const count = SETS_PER_PAGE;

        const validate = Typia.createValidate<ResponseBodyType>();
        const reviver = Util.dateReviver("createDate");

        Util.get(`flashcardsets?begin=${begin}&count=${count}`, validate, reviver)
            .then(async b => {
                const pageCount = Math.ceil(b.count / SETS_PER_PAGE);
                let flashcardsets = b.flashcardsets;

                if (!Number.isInteger(page) || page < 0 || page >= pageCount)
                {
                    this.props.queryParams.delete("page");
                    this.props.setQueryParams(this.props.queryParams);
                    page = 0;

                    const b1 = await Util.get(`flashcardsets?begin=0&count=${count}`, validate, reviver);
                    flashcardsets = b1.flashcardsets;
                }

                this.setState({ page, pageCount, flashcardsets });
            })
            .catch(e => this.setState({ error: e }));
    }

    render = (): React.ReactNode => {
        if (this.state.error !== undefined)
            throw this.state.error;

        const links = this.state.flashcardsets.map(s => {
            const to = `/users/${s.creatorId}`;

            return <Joy.Grid xs={12} md={6} lg={4} key={s.id}>
                <FlashcardLink front={s.name}
                    back={s.description || "no description"}
                    to={s.id.toString()}
                    style={{ minWidth: 300 }}
                />
                <div style={{ display: "flex", margin: 8}}>
                    <Joy.Typography level="body-md">
                        By <Components.Link to={to}>{s.creator}</Components.Link>
                    </Joy.Typography>
                    <div style={{ flex: "1" }}/>
                    <Joy.Tooltip title={s.createDate.toLocaleString()}>
                        <Joy.Typography level="body-md">
                            {Dayjs().to(s.createDate)}
                        </Joy.Typography>
                    </Joy.Tooltip>
                </div>
            </Joy.Grid>
        });

        return <Components.Wrapper style={{ gap: 20, height: "100%" }}>
            <Components.PageArrows pageCount={this.state.pageCount}
                page={this.state.page}
                onClick={this.onPageArrow}
            />
            <Joy.Grid container spacing={4} sx={{ flex: "1", width: "100%" }}>
                {links}
            </Joy.Grid>
            <Components.PageArrows pageCount={this.state.pageCount}
                page={this.state.page}
                onClick={this.onPageArrow}
            />
        </Components.Wrapper>
    }
}

export function Root(): React.ReactNode {
    const [queryParams, setQueryParams] = ReactRouter.useSearchParams();
    return <RootImpl queryParams={queryParams} setQueryParams={setQueryParams}/>;
}
