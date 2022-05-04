/*
 * Copyright (c) 2019, J2 Innovations. All Rights Reserved
 */

import { Token } from "./Token";
import { tokens } from "./tokens";
import { TokenObj, isTokenObj } from "./TokenObj";
import { TokenPaths } from "./TokenPaths";
import { TokenValue, isTokenValue } from "./TokenValue";
import { TokenType } from "./TokenType";
import { TokenRelationship } from "./TokenRelationship";
import {
    Node,
    CondOrNode,
    CondAndNode,
    HasNode,
    MissingNode,
    ParensNode,
    CmpNode,
    IsANode,
    TermNode,
    RelationshipNode,
    WildcardEqualsNode,
} from "./Node";
import { LocalizedError } from "../util/LocalizedError";
import { Kind } from "../core/Kind";
import { valueIsKind } from "../core/HVal";
const { eof, or, and, not } = tokens;

export const enum booleanOperators {
    or = "or",
    and = "and",
    not = "not",
}

/**
 * A parser for a haystack filter.
 *
 * @see https://project-haystack.org/doc/Filters
 * @see https://bitbucket.org/brianfrank/haystack-java/src/default/
 *
 * The formal grammar of the filter language is as follows...
 *
 * <filter>      := <condOr>
 * <condOr>      := <condAnd> ("or" <condAnd>)*
 * <condAnd>     := <term> ("and" <term>)*
 * <term>        := <parens> | <missing> | <cmp> | <has> | <isa> | <rel> | <wildcardEq>
 * <parens>      := "(" <filter> ")"
 * <has>         := <path>
 * <missing>     := "not" <path>
 * <isa>         := <symbol>
 * <cmp>         := <path> <cmpOp> <val>
 * <cmpOp>       := "=" | "!=" | "<" | "<=" | ">" | ">="
 * <path>        := <name> ("->" <name>)*
 * <name>        := <id>
 * <rel>         := <id> ("-" <id>)* "?" <ref>?
 * <wildcardEq>  := <id> "*==" <ref>
 *
 * <val>         :=  <bool> | <str> | <number> | <date> | <time> | <uri> | <ref>
 * <bool>        := "true" or "false"
 * <number>      := <decimal>
 * <decimal>     := ["-"] <digits> ["." <digits>] [<exp>] [<unit>]
 * <unit>        := <unitChar>*
 * <unitChar>    := <alpha> | "%" | "_" | "/" | "$" | any char > 128
 * <exp>         := ("e"|"E") ["+"|"-"] <digits>
 * <digits>      := <digit> (<digit> | "_")*
 * <digit>       := ('0' - '9')
 * <ref>         := "@" <refChar>* [ " " <str> ]
 * <refChar>     := <alpha> | <digit> | "_" | ":" | "-" | "." | "~"
 * <str>         := """ <strChar>* """
 * <uri>         := "`" <uriChar>* "`"
 * <strChar>     := <unicodeChar> | <strEscChar>
 * <uriChar>     := <unicodeChar> | <uriEscChar>
 * <unicodeChar> := any 16-bit Unicode char >= 0x20 (except str/uri quote)
 * <strEscChar>  := "\b" | "\f" | "\n" | "\r" | "\r" | "\t" | "\"" | "\\" | "\$" | <uEscChar>
 * <uriEscChar>  := "\:" | "\/" | "\?" | "\#" | "\[" | "\]" | "\@" | "\`" | "\\" | "\&" | "\=" | "\;" | <uEscChar>
 * <uEscChar>    := "\u" <hexDigit> <hexDigit> <hexDigit> <hexDigit>
 * <hexDigit>    := ('a'-'f') | ('A'-'F') | digit
 * <id>          :=  <alphaLo> (<alphaLo> | <alphaHi> | <digit> | '_')*
 * <alphaLo>     := ('a' - 'z')
 * <alphaHi>     := ('A' - 'Z')
 * <date>        := YYYY-MM-DD
 * <time>        := hh:mm:ss.FFFFFFFFF
 * <symbol>      := "^" <alpha> | <digit> | "_" | ":" | "-" | "." | "~"
 */
export class FilterParser {
    private readonly nextToken: () => Token;
    private current: Token = eof;
    private next: Token = eof;

    /**
     * Construct a new parser with a function that supplies tokens.
     *
     * @param nextToken A function that supplies tokens for the parser to use.
     */
    public constructor(nextToken: () => Token) {
        this.nextToken = nextToken;

        // Prime
        this.current = this.nextToken();
        this.next = this.nextToken();
    }

    /**
     * Consumes the next token.
     */
    private consume(): void {
        this.current = this.next;
        this.next = this.nextToken();
    }

    /**
     * Match at least one of the token types (OR).
     *
     * If a match is found then advance otherwise throw an error.
     *
     * @param types The types to match against.
     * @throws An error if a match can't be found.
     */
    private match(...types: TokenType[]): void {
        if (types.filter((type): boolean => this.current.is(type)).length) {
            this.consume();
        } else {
            const typesStr = types
                .map((type): string => TokenType[type])
                .join(", ");

            throw new LocalizedError({
                message: `Invalid expression. Could not find ${typesStr}`,
                lex: "parserInvalidExpression",
                args: { typesStr },
            });
        }
    }

    /**
     * Match the token type and text.
     *
     * If a match is found then advance otherwise throw an error.
     *
     * @param type The token type.
     * @param text The token text.
     * @throws An error if a match can't be found.
     */
    private equalsToken(token: Token): void {
        if (this.current.equals(token)) {
            this.consume();
        } else {
            throw new LocalizedError({
                message: `Invalid expression. Could not find ${
                    TokenType[token.type]
                }`,
                lex: "parserInvalidExpression",
                args: { arg: TokenType[token.type] },
            });
        }
    }

    /**
     * Parse each token an return the resultant AST node.
     *
     * @returns The abstract syntax tree for the filter.
     * @throws If there's an error parsing the filter.
     */
    public parse(): Node {
        const node = this.condOr();

        // If we're finished parsing and there's still tokens left over
        // then throw an error.
        if (!this.current.is(TokenType.eof)) {
            throw new LocalizedError({
                message: `Unexpected token: ${this.current.toFilter()}`,
                lex: "parserUnexpectedToken",
                args: { arg: this.current.toFilter() },
            });
        }

        return node;
    }

    //////////////////////////////////////////////////////////////////////////
    // AST parsing methods
    //////////////////////////////////////////////////////////////////////////

    private condOr(): CondOrNode {
        const condAnds = [this.condAnd()];

        while (this.current.equals(or)) {
            this.equalsToken(or);
            condAnds.push(this.condAnd());
        }

        return new CondOrNode(condAnds);
    }

    private condAnd(): CondAndNode {
        const terms = [this.term()];

        while (this.current.equals(and)) {
            this.equalsToken(and);
            terms.push(this.term());
        }

        return new CondAndNode(terms);
    }

    private term(): TermNode {
        let term: TermNode;

        if (this.current.is(TokenType.leftBrace)) {
            term = this.parens();
        } else if (
            this.current.equals(not) &&
            (this.next.is(TokenType.text) || this.next.is(TokenType.paths))
        ) {
            term = this.missing();
        } else if (
            (this.current.is(TokenType.text) ||
                this.current.is(TokenType.paths)) &&
            (this.next.is(TokenType.equals) ||
                this.next.is(TokenType.notEquals) ||
                this.next.is(TokenType.lessThan) ||
                this.next.is(TokenType.lessThanOrEqual) ||
                this.next.is(TokenType.greaterThan) ||
                this.next.is(TokenType.greaterThanOrEqual))
        ) {
            term = this.cmp();
        } else if (
            this.current.is(TokenType.text) &&
            this.next.is(TokenType.wildcardEq)
        ) {
            term = this.wildcard();
        } else if (
            this.current.is(TokenType.text) ||
            this.current.is(TokenType.paths)
        ) {
            term = this.has();
        } else if (this.current.is(TokenType.symbol)) {
            term = this.isa();
        } else if (this.current.is(TokenType.rel)) {
            term = this.rel();
        } else {
            throw new LocalizedError({
                message: "Invalid expression. Could not find valid term",
                lex: "parserInvalidExpressionTerm",
            });
        }

        return term;
    }

    private parens(): ParensNode {
        this.match(TokenType.leftBrace);
        const parens = new ParensNode(this.condOr());
        this.match(TokenType.rightBrace);
        return parens;
    }

    private missing(): MissingNode {
        this.equalsToken(not);
        const missing = new MissingNode(this.current as TokenObj | TokenPaths);
        this.match(TokenType.text, TokenType.paths);
        return missing;
    }

    private cmp(): CmpNode {
        const path = this.current as TokenObj | TokenPaths;
        this.match(TokenType.text, TokenType.paths);

        const cmpOp = this.current as TokenObj;
        this.match(
            TokenType.equals,
            TokenType.notEquals,
            TokenType.lessThan,
            TokenType.lessThanOrEqual,
            TokenType.greaterThan,
            TokenType.greaterThanOrEqual
        );

        let val = this.current;
        this.match(
            TokenType.string,
            TokenType.number,
            TokenType.text,
            TokenType.boolean,
            TokenType.date,
            TokenType.time,
            TokenType.uri,
            TokenType.ref,
            TokenType.symbol
        );

        // At this point the parsed text token must be a boolean or an error.
        if (val.type === TokenType.text && isTokenObj(val)) {
            if (val.text === "true" || val.text === "false") {
                val = TokenValue.makeBool(val.text === "true");
            } else {
                throw new LocalizedError({
                    message: `Expected boolean but found ${val.text}`,
                    lex: "parserExpectedBoolean",
                    args: { arg: val.text },
                });
            }
        }

        return new CmpNode(path, cmpOp, val as TokenValue);
    }

    private has(): HasNode {
        const has = new HasNode(this.current as TokenObj | TokenPaths);
        this.match(TokenType.text, TokenType.paths);
        return has;
    }

    private isa(): IsANode {
        const isa = new IsANode(this.current as TokenValue);
        this.match(TokenType.symbol);
        return isa;
    }

    private rel(): RelationshipNode {
        const rel = this.current as TokenRelationship;
        this.match(TokenType.rel);

        let ref: TokenValue | undefined;

        // A relationship can be followed by a ref so see if this exists.
        if (
            isTokenValue(this.current) &&
            valueIsKind(this.current.value, Kind.Ref)
        ) {
            ref = this.current as TokenValue;
            this.match(TokenType.ref);
        }

        return new RelationshipNode(rel, ref);
    }

    private wildcard(): WildcardEqualsNode {
        const id = this.current as TokenObj;
        this.match(TokenType.text);

        this.match(TokenType.wildcardEq);

        const ref = this.current as TokenValue;
        this.match(TokenType.ref);

        return new WildcardEqualsNode(id, ref);
    }
}
