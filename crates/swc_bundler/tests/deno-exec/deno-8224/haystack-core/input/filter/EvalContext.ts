/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { HRef } from "../core/HRef";
import { HDict } from "../core/HDict";
import { HNamespace } from "../core/HNamespace";

export interface EvalContextResolve {
    (ref: HRef): HDict | undefined;
}

/**
 * The evaluation context.
 *
 * The context is queried during the evaluation of a node for property values.
 */
export interface EvalContext {
    /**
     * The dict to evaluate the filter on.
     */
    dict: HDict;

    /**
     * An optional method used to resolve a dict from a ref.
     *
     * If not defined, the reference will not be resolved.
     *
     * @param ref The ref to resolve.
     * @returns The dict for the ref or undefined if not found.
     */
    resolve?: EvalContextResolve;

    /**
     * An optional namespace used for resolving def related queries.
     */
    namespace?: HNamespace;
}
