import { AbstractBuilder, AbstractSeqBuilder } from "./AbstractBuilders";
import { hash, mapBuildArg, mapBuildArgs } from "./Builder.utils";
import { image } from "./ElementBuilder";

import type {
    Body,
    BodyStage,
    TrustBox,
    RichText,
    Opener,
    BodyHeader,
    Stage,
    ArticleSource,
    ArticleSources,
} from "@paper/models";
import type {
    BuildArg,
    BuildArgs,
    CreateBuilder,
    SeqElement,
    SeqNextElementConverter,
} from "./types";

/**
 * @deprecated use {Builder.body.node.img()}
 */
export * from "./BodyNodesBuilder";
export * as node from "./BodyNodesBuilder";

export const create: CreateBuilder<BodyBuilder> = () => new BodyBuilder();
export const trustBox: CreateBuilder<TrustBoxBuilder> = () =>
    new TrustBoxBuilder();
export const opener: CreateBuilder<OpenerBuilder> = () => new OpenerBuilder();
export const stage: CreateBuilder<BodyStageBuilder> = () =>
    new BodyStageBuilder();
export const header: CreateBuilder<BodyHeaderBuilder> = () =>
    new BodyHeaderBuilder();
export const source: CreateBuilder<
    ArticleSourceBuilder,
    BuildArgs<RichText.Node>
> = (nodes: BuildArgs<RichText.Node> = []) =>
    new ArticleSourceBuilder(...nodes);
export const sources: CreateBuilder<ArticleSourcesBuilder> = () =>
    new ArticleSourcesBuilder();

export const seq = {
    stage: (() =>
        new BodyStageSeqBuilder()) as CreateBuilder<BodyStageSeqBuilder>,
    source: (() =>
        new ArticleSourceSeqBuilder()) as CreateBuilder<ArticleSourceSeqBuilder>,
} as const;

class BodyBuilder extends AbstractBuilder<Body> {
    #stages: BodyStage[] = [];
    #trustBox?: TrustBox = undefined;
    #disclaimer?: RichText.Node[] = undefined;
    #articleSources?: ArticleSources = undefined;

    stages(...stages: BuildArgs<BodyStage>): this {
        this.#stages = stages.map(mapBuildArg);
        return this;
    }

    trustBox(trustBox?: BuildArg<TrustBox>): this {
        this.#trustBox = mapBuildArg(trustBox);
        return this;
    }

    disclaimer(disclaimer?: BuildArgs<RichText.Node>): this {
        this.#disclaimer = disclaimer?.map(mapBuildArg);
        return this;
    }

    articleSources(articleSources?: BuildArg<ArticleSources>): this {
        this.#articleSources = mapBuildArg(articleSources);
        return this;
    }

    build(): Body {
        return {
            stages: this.#stages,
            trustBox: this.#trustBox,
            disclaimer: this.#disclaimer,
            articleSources: this.#articleSources,
        };
    }
}

class TrustBoxBuilder extends AbstractBuilder<TrustBox> {
    #nodes: RichText.Node[] = [];
    #hidden: RichText.Node[] = [];

    nodes(nodes: BuildArgs<RichText.Node>): this {
        this.#nodes = nodes.map(mapBuildArg);
        return this;
    }

    hidden(hidden: BuildArgs<RichText.Node>): this {
        this.#hidden = hidden.map(mapBuildArg);
        return this;
    }

    build(): TrustBox {
        return {
            nodes: this.#nodes,
            hidden: this.#hidden,
        };
    }
}

class OpenerBuilder extends AbstractBuilder<Opener> {
    #element: Opener["element"] = image().build();

    element(element: BuildArg<Opener["element"]>): this {
        this.#element = mapBuildArg(element);
        return this;
    }

    build(): Opener {
        return {
            element: this.#element,
        };
    }
}

class BodyStageSeqBuilder extends AbstractSeqBuilder<BodyStage> {
    #nodes: SeqElement<RichText.Node[]> = [];
    #header?: SeqElement<BodyHeader> = undefined;
    #companions: SeqElement<Stage.CompanionItem[]> = [];
    #commercialsEndOfStage: SeqElement<RichText.Node[]> = [];

    nodes(nodes: SeqElement<BuildArgs<RichText.Node>>): this {
        this.#nodes = nodes.map(mapBuildArgs);
        return this;
    }

    header(header?: SeqElement<BuildArg<BodyHeader>>): this {
        this.#header = mapBuildArgs(header ?? []);
        return this;
    }

    companions(companions: SeqElement<BuildArgs<Stage.CompanionItem>>): this {
        this.#companions = companions.map(mapBuildArgs);
        return this;
    }

    commercialsEndOfStage(
        commercialsEndOfStage: SeqElement<BuildArgs<RichText.Node>>
    ): this {
        this.#commercialsEndOfStage = commercialsEndOfStage.map(mapBuildArgs);
        return this;
    }

    buildListItem(seqNextElement: SeqNextElementConverter): BodyStage {
        return {
            id: hash(
                "bodyStage",
                this.#nodes,
                this.#companions,
                this.#commercialsEndOfStage,
                this.#header
            ),
            nodes: seqNextElement.array(this.#nodes),
            header: seqNextElement.maybe(this.#header),
            companions: seqNextElement.array(this.#companions),
            commercialsEndOfStage: seqNextElement.array(
                this.#commercialsEndOfStage
            ),
        };
    }
}

class BodyStageBuilder extends AbstractBuilder<BodyStage> {
    #seqBuilder: BodyStageSeqBuilder = new BodyStageSeqBuilder();

    nodes(nodes: BuildArgs<RichText.Node>): this {
        this.#seqBuilder.nodes([nodes]);
        return this;
    }

    header(header?: BuildArg<BodyHeader>): this {
        if (header) {
            this.#seqBuilder.header([header]);
        }
        return this;
    }

    companions(companions: BuildArgs<Stage.CompanionItem>): this {
        this.#seqBuilder.companions([companions]);
        return this;
    }

    commercialsEndOfStage(
        commercialsEndOfStage: BuildArgs<RichText.Node>
    ): this {
        this.#seqBuilder.commercialsEndOfStage([commercialsEndOfStage]);
        return this;
    }

    build(): BodyStage {
        return this.#seqBuilder.build();
    }
}

class BodyHeaderBuilder extends AbstractBuilder<BodyHeader> {
    #variant: BodyHeader["variant"] = "full";
    #opener?: Opener = undefined;

    variant(variant: BodyHeader["variant"]): this {
        this.#variant = variant;
        return this;
    }

    opener(opener: BuildArg<Opener>): this {
        this.#opener = mapBuildArg(opener);
        return this;
    }

    build(): BodyHeader {
        return {
            variant: this.#variant,
            opener: this.#opener,
        };
    }
}

class ArticleSourceSeqBuilder extends AbstractSeqBuilder<ArticleSource> {
    #nodes: SeqElement<RichText.Node[]> = [];

    nodes(nodes: SeqElement<BuildArgs<RichText.Node>>): this {
        this.#nodes = nodes.map(mapBuildArgs);
        return this;
    }

    buildListItem(seqNextElement: SeqNextElementConverter): ArticleSource {
        const id = hash("article-source", this.#nodes);
        return {
            id,
            nodes: seqNextElement.array(this.#nodes),
        };
    }
}

class ArticleSourceBuilder extends AbstractBuilder<ArticleSource> {
    #seqBuilder: ArticleSourceSeqBuilder = new ArticleSourceSeqBuilder();

    constructor(...nodes: BuildArgs<RichText.Node>) {
        super();
        this.nodes(...nodes);
    }

    nodes(...nodes: BuildArgs<RichText.Node>): this {
        this.#seqBuilder.nodes([nodes]);
        return this;
    }

    build(): ArticleSource {
        return this.#seqBuilder.build();
    }
}

class ArticleSourcesBuilder extends AbstractBuilder<ArticleSources> {
    #nodes: ArticleSource[] = [];
    #hidden: ArticleSource[] = [];

    nodes(...nodes: BuildArgs<ArticleSource>): this {
        this.#nodes = nodes.map(mapBuildArg);
        return this;
    }

    hidden(...hidden: BuildArgs<ArticleSource>): this {
        this.#hidden = hidden.map(mapBuildArg);
        return this;
    }

    build(): ArticleSources {
        return {
            nodes: this.#nodes,
            hidden: this.#hidden,
        };
    }
}
