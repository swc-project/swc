/*
 * Copyright (c) 2019, J2 Innovations. All Rights Reserved
 */

/* eslint  @typescript-eslint/no-explicit-any: "off", @typescript-eslint/explicit-module-boundary-types: "off", 
  @typescript-eslint/no-empty-function: "off" */

import { Token } from "./Token";
import { TokenObj } from "./TokenObj";
import { TokenValue } from "./TokenValue";
import { TokenType } from "./TokenType";
import { TokenPaths } from "./TokenPaths";
import { HaysonVal } from "../core/hayson";
import { EvalContext } from "./EvalContext";
import { HVal } from "../core/HVal";
import { valueIsKind } from "../core/HVal";
import { Kind } from "../core/Kind";
import { HDict } from "../core/HDict";
import { HRef } from "../core/HRef";
import { HSymbol } from "../core/HSymbol";
import { TokenRelationship } from "./TokenRelationship";

/**
 * AWT Node Implementation for a Haystack Filter.
 *
 * Please see `Parser` for a description of the grammar being used.
 *
 * @module
 */

/**
 * Defines all the different node types in the hierarchy.
 *
 * Each type of node should declare and use a unique node type enumeration.
 */
export enum NodeType {
    condOr,
    condAnd,
    has,
    missing,
    parens,
    cmp,
    isa,
    rel,
    wildcardEq,
}

/**
 * JSON data representation of an AST node.
 */
export interface NodeData {
    /**
     * The type of node. Each node has a unique identifier.
     */
    type: string;

    /**
     * Any tokens the node might have.
     */
    tokens?: {
        type: string;
        [prop: string]: string | string[] | HaysonVal;
    }[];

    /**
     * Any child nodes the node might have.
     */
    nodes?: NodeData[];
}

/**
 * A visitor interface used for working with a generated AST.
 *
 * Each type of node has a assign method that invokes the relevant visitor method.
 */
export interface Visitor {
    visitCondOr(node: CondOrNode): void;

    visitCondAnd(node: CondAndNode): void;

    visitParens(node: ParensNode): void;

    visitHas(node: HasNode): void;

    visitMissing(node: MissingNode): void;

    visitCmp(node: CmpNode): void;

    visitIsA(node: IsANode): void;

    visitRelationship(node: RelationshipNode): void;

    visitWildcardEquals(node: WildcardEqualsNode): void;
}

/**
 * Returns true is the argument is a node.
 *
 * This method acts as a type guard for Node.
 *
 * @param node The object to test.
 * @returns true if the object is a node.
 */
export function isNode(node: any): node is Node {
    return !!(
        node &&
        typeof node.accept === "function" &&
        typeof node.eval === "function"
    );
}

/**
 * Get a value from a path.
 *
 * @param context The evaluation context.
 * @param paths The path to find.
 */
function get(context: EvalContext, paths: string[]): HVal | undefined | null {
    if (!paths.length) {
        return undefined;
    }

    let hval = context.dict.get(paths[0]);

    if (!hval) {
        return undefined;
    }

    for (let i = 1; i < paths.length; ++i) {
        if (valueIsKind<HDict>(hval, Kind.Dict)) {
            // If a dict then simply look up a property.
            hval = hval.get(paths[i]);
        } else if (
            typeof context.resolve === "function" &&
            valueIsKind<HRef>(hval, Kind.Ref)
        ) {
            // If the value is a ref then look up the record. Then
            // resolve record before resolving the value from it.
            hval = context.resolve(hval)?.get(paths[i]);
        } else {
            hval = undefined;
        }

        if (!hval) {
            break;
        }
    }

    return hval;
}

/**
 * The interface for a Node.
 */
export interface Node {
    /**
     * The type of node.
     */
    type: NodeType;

    /**
     * @returns A JSON representation of the node.
     */
    toJSON(): NodeData;

    /**
     * A list of tokens for this node.
     */
    tokens: readonly Token[];

    /**
     * A list of child nodes for this node.
     */
    nodes: readonly Node[];

    /**
     * Accept a visitor for this.
     *
     * Please note, each new subtype of Node must have a corresponding
     * enumeration and visitor method.
     *
     * @param visitor The visitor for this node.
     */
    accept(visitor: Visitor): void;

    /**
     * Accept the visitor on all child nodes.
     *
     * @param visitor The visitor for the child nodes.
     */
    acceptChildNodes(visitor: Visitor): void;

    /**
     * Evaluate the node against the evaluation context
     * and return the result.
     *
     * @param context The evaluation context.
     * @returns the resultant evaluation.
     */
    eval(context: EvalContext): boolean;
}

/**
 * A node that contains child nodes and no tokens.
 */
export abstract class ParentNode implements Node {
    protected $nodes: Node[];

    protected constructor(nodes: Node[]) {
        this.$nodes = nodes;
    }

    public abstract get type(): NodeType;

    public get tokens(): readonly Token[] {
        return [];
    }

    public get nodes(): readonly Node[] {
        return this.$nodes;
    }

    public toJSON(): NodeData {
        const data: NodeData = {
            type: NodeType[this.type],
        };

        const nodes = this.nodes;

        if (nodes && nodes.length) {
            data.nodes = nodes.map((node: Node): NodeData => node.toJSON());
        }

        return data;
    }

    public abstract accept(visitor: Visitor): void;

    public acceptChildNodes(visitor: Visitor): void {
        // By default, visit all child nodes.
        this.nodes.forEach((node: Node): void => node.accept(visitor));
    }

    public abstract eval(context: EvalContext): boolean;
}

/**
 * A node that contains no child nodes and has one of more tokens.
 */
export abstract class LeafNode implements Node {
    protected $tokens: Token[];

    protected constructor(tokens: Token[]) {
        this.$tokens = tokens;
    }

    public abstract get type(): NodeType;

    public get tokens(): readonly Token[] {
        return this.$tokens;
    }

    public get nodes(): readonly Node[] {
        return [];
    }

    public toJSON(): NodeData {
        const data: NodeData = {
            type: NodeType[this.type],
        };

        const tokens = this.tokens;

        if (tokens && tokens.length) {
            data.tokens = tokens.map(
                (
                    token: Token
                ): {
                    type: string;
                    [prop: string]: string | string[] | HaysonVal;
                } => token.toJSON()
            );
        }

        return data;
    }

    public abstract accept(visitor: Visitor): void;

    public acceptChildNodes(): void {}

    public abstract eval(context: EvalContext): boolean;
}

/**
 * An OR condition node.
 */
export class CondOrNode extends ParentNode {
    public constructor(condAnds: CondAndNode[]) {
        super(condAnds);
    }

    public get type(): NodeType {
        return NodeType.condOr;
    }

    public get condAnds(): CondAndNode[] {
        return this.$nodes as CondAndNode[];
    }

    public set condAnds(condAnds: CondAndNode[]) {
        this.$nodes = condAnds;
    }

    public accept(visitor: Visitor): void {
        visitor.visitCondOr(this);
    }

    public eval(context: EvalContext): boolean {
        for (const condAnd of this.$nodes) {
            if (condAnd.eval(context)) {
                return true;
            }
        }
        return false;
    }
}

export type TermNode =
    | HasNode
    | MissingNode
    | ParensNode
    | CmpNode
    | IsANode
    | RelationshipNode
    | WildcardEqualsNode;

/**
 * An AND condition node.
 */
export class CondAndNode extends ParentNode {
    public constructor(terms: TermNode[]) {
        super(terms);
    }

    public get type(): NodeType {
        return NodeType.condAnd;
    }

    public get terms(): TermNode[] {
        return this.$nodes as TermNode[];
    }

    public set terms(terms: TermNode[]) {
        this.$nodes = terms;
    }

    public accept(visitor: Visitor): void {
        visitor.visitCondAnd(this);
    }

    public eval(context: EvalContext): boolean {
        if (this.$nodes.length) {
            for (const node of this.$nodes) {
                if (!node.eval(context)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}

/**
 * A parentheses node.
 */
export class ParensNode extends ParentNode {
    public constructor(condOr: CondOrNode) {
        super([condOr]);
    }

    public get type(): NodeType {
        return NodeType.parens;
    }

    public get condOr(): CondOrNode {
        return this.$nodes[0] as CondOrNode;
    }

    public set condOr(condOr: CondOrNode) {
        this.$nodes = [condOr];
    }

    public accept(visitor: Visitor): void {
        visitor.visitParens(this);
    }

    public eval(context: EvalContext): boolean {
        return this.$nodes[0].eval(context);
    }
}

/**
 * A has node.
 */
export class HasNode extends LeafNode {
    public constructor(path: TokenObj | TokenPaths) {
        super([path]);
    }

    public get type(): NodeType {
        return NodeType.has;
    }

    public get path(): TokenObj | TokenPaths {
        return this.$tokens[0] as TokenObj;
    }

    public set path(path: TokenObj | TokenPaths) {
        this.$tokens[0] = path as TokenObj | TokenPaths;
    }

    public accept(visitor: Visitor): void {
        visitor.visitHas(this);
    }

    public eval(context: EvalContext): boolean {
        return !!get(context, this.path.paths);
    }
}

/**
 * A missing node.
 */
export class MissingNode extends LeafNode {
    public constructor(path: TokenObj | TokenPaths) {
        super([path]);
    }

    public get type(): NodeType {
        return NodeType.missing;
    }

    public get path(): TokenObj | TokenPaths {
        return this.$tokens[0] as TokenObj | TokenPaths;
    }

    public set path(path: TokenObj | TokenPaths) {
        this.$tokens[0] = path as TokenObj | TokenPaths;
    }

    public accept(visitor: Visitor): void {
        visitor.visitMissing(this);
    }

    public eval(context: EvalContext): boolean {
        return !get(context, this.path.paths);
    }
}

/**
 * A comparison node.
 */
export class CmpNode extends LeafNode {
    public constructor(
        path: TokenObj | TokenPaths,
        cmpOp: TokenObj,
        val: TokenValue
    ) {
        super([path, cmpOp, val]);
    }

    public get path(): TokenObj | TokenPaths {
        return this.$tokens[0] as TokenObj | TokenPaths;
    }

    public set path(path: TokenObj | TokenPaths) {
        this.$tokens[0] = path as TokenObj | TokenPaths;
    }

    public get cmpOp(): TokenObj {
        return this.$tokens[1] as TokenObj;
    }

    public set cmpOp(cmpOp: TokenObj) {
        this.$tokens[1] = cmpOp;
    }

    public get val(): TokenValue {
        return this.$tokens[2] as TokenValue;
    }

    public set val(val: TokenValue) {
        this.$tokens[2] = val;
    }

    public get type(): NodeType {
        return NodeType.cmp;
    }

    public accept(visitor: Visitor): void {
        visitor.visitCmp(this);
    }

    public eval(context: EvalContext): boolean {
        const pathValue = get(context, this.path.paths);
        const value = this.val.value;

        if (pathValue && pathValue.isKind(value.getKind())) {
            switch (this.cmpOp.type) {
                case TokenType.equals:
                    return pathValue.equals(value);
                case TokenType.notEquals:
                    return !pathValue.equals(value);
                case TokenType.greaterThan:
                    return pathValue.compareTo(value) === 1;
                case TokenType.greaterThanOrEqual:
                    return pathValue.compareTo(value) >= 0;
                case TokenType.lessThan:
                    return pathValue.compareTo(value) === -1;
                case TokenType.lessThanOrEqual:
                    return pathValue.compareTo(value) <= 0;
            }
        }

        return false;
    }
}

/**
 * An 'is a' node.
 */
export class IsANode extends LeafNode {
    public constructor(val: TokenValue) {
        super([val]);
    }

    public get type(): NodeType {
        return NodeType.isa;
    }

    public get val(): TokenValue {
        return this.$tokens[0] as TokenValue;
    }

    public set val(val: TokenValue) {
        this.$tokens[0] = val;
    }

    public accept(visitor: Visitor): void {
        visitor.visitIsA(this);
    }

    public eval(context: EvalContext): boolean {
        const value = this.val.value as HSymbol;
        return !!context?.namespace?.reflect(context.dict)?.fits(value);
    }
}

/**
 * A relationship node.
 */
export class RelationshipNode extends LeafNode {
    public constructor(rel: TokenRelationship, ref?: TokenValue) {
        super(ref ? [rel, ref] : [rel]);
    }

    public get type(): NodeType {
        return NodeType.rel;
    }

    public get rel(): TokenRelationship {
        return this.$tokens[0] as TokenRelationship;
    }

    public set rel(val: TokenRelationship) {
        this.$tokens[0] = val;
    }

    public get ref(): TokenValue | undefined {
        return this.$tokens[1] as TokenValue;
    }

    public set ref(ref: TokenValue | undefined) {
        if (ref) {
            this.$tokens[1] = ref;
        } else {
            delete this.$tokens[1];
        }
    }

    public accept(visitor: Visitor): void {
        visitor.visitRelationship(this);
    }

    public eval(context: EvalContext): boolean {
        const relName = this.rel.relationship;
        const relTerm = this.rel.term;
        const ref = this.ref?.value as HRef;

        return !!context?.namespace?.hasRelationship({
            subject: context.dict,
            relName,
            relTerm,
            ref,
            resolve: context?.resolve,
        });
    }
}

/**
 * A wildcard equality node.
 */
export class WildcardEqualsNode extends LeafNode {
    public constructor(path: TokenObj, ref: TokenValue) {
        super([path, ref]);
    }

    public get type(): NodeType {
        return NodeType.wildcardEq;
    }

    public get id(): TokenObj {
        return this.$tokens[0] as TokenObj;
    }

    public set id(path: TokenObj) {
        this.$tokens[0] = path as TokenObj;
    }

    public get ref(): TokenValue {
        return this.$tokens[1] as TokenValue;
    }

    public accept(visitor: Visitor): void {
        visitor.visitWildcardEquals(this);
    }

    public eval(context: EvalContext): boolean {
        const wcRef = this.ref.value as HRef;
        const paths = this.id.paths;

        // Stop circular dependencies.
        const allRefs = new Set<string>();

        // Keep resolving until we find the reference we're looking.
        let ref = get(context, paths);

        let matched = false;

        while (valueIsKind<HRef>(ref, Kind.Ref)) {
            if (ref.equals(wcRef)) {
                matched = true;
                break;
            }

            if (context.resolve) {
                if (allRefs.has(ref.value)) {
                    break;
                }

                allRefs.add(ref.value);

                const dict = context.resolve(ref);

                if (dict) {
                    ref = get({ ...context, dict }, paths);
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        return matched;
    }
}
