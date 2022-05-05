/*
 * Copyright (c) 2019, J2 Innovations. All Rights Reserved
 */

import { FilterParser } from "./FilterParser";
import { FilterLexer } from "./FilterLexer";
import { isNode, Node } from "./Node";
import { EvalContext } from "./EvalContext";
import { GenerateHaystackFilterVisitor } from "./GenerateHaystackFilterVisitor";
import { Scanner } from "../util/Scanner";

/**
 * Parses haystack filters so they can be validated and converted into different
 * types of queries.
 *
 * This class serves as the main entry point for working with Haystack Filters
 * in this module.
 *
 * As well as static methods, this class also utilizes the builder pattern
 * for the instance methods.
 */
export class HFilter {
    /**
     * The internal parsed node of the current haystack filter.
     */
    public readonly node: Node;

    /**
     * Constructs a new haystack filter from the string.
     *
     * This will parse the filter string to a node.
     *
     * @param filter The haystack filter or an already parsed AST node.
     * @throws An error if the filter is invalid.
     */
    public constructor(filter: string | Node) {
        this.node = isNode(filter)
            ? (filter as Node)
            : HFilter.parse(filter as string);
    }

    /**
     * Parse a Haystack Filter and returns it's base AST node.
     *
     * @param filter The Haystack Filter to parse.
     * @returns The base AST node for the haystack filter.
     * @throws An error if the haystack filter isn't valid.
     */
    public static parse(filter: string): Node {
        return new FilterParser(
            new FilterLexer(new Scanner(filter)).toNextTokenFunc()
        ).parse();
    }

    /**
     * Evalulate a node against an object. The object contains properties used
     * in the evaluation.
     *
     * @param node The AST node to evaluate.
     * @param context The evaluation context.
     * @returns The result of the evaluation.
     */
    public static eval(node: Node, context: EvalContext): boolean {
        return node.eval(context);
    }

    /**
     * Evalulate a node against an object. The object contains properties used
     * in the evaluation.
     *
     * @param context The evaluation context.
     * @returns The result of the evaluation.
     */
    public eval(context: EvalContext): boolean {
        return HFilter.eval(this.node, context);
    }

    /**
     * Generate a Haystack Filter string from a node.
     *
     * @param node The AST node to generate the Haystack Filter string from.
     * @returns The haystack filter.
     * @throws An error is thrown if the haystack filter is invalid.
     */
    public static toFilter(node: Node): string {
        // Generate the Haystack Filter string.
        const visitor = new GenerateHaystackFilterVisitor();
        node.accept(visitor);

        const filter = visitor.filter;

        // Validate by reparsing.
        HFilter.parse(filter);

        return filter;
    }

    /**
     * Generate a Haystack Filter string from a node.
     *
     * @returns The haystack filter.
     * @throws An error is thrown if the haystack filter is invalid.
     */
    public toFilter(): string {
        return HFilter.toFilter(this.node);
    }
}
