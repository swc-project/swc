/*
 * Copyright (c) 2019, J2 Innovations. All Rights Reserved
 */

import { Token } from "./Token";
import { tokens } from "./tokens";
import { TokenValue } from "./TokenValue";
import { TokenObj } from "./TokenObj";
import { TokenPaths } from "./TokenPaths";
import { TokenType } from "./TokenType";
import { TokenRelationship } from "./TokenRelationship";
import { LocalizedError } from "../util/LocalizedError";
import { ZincReader } from "../core/ZincReader";
import { Scanner } from "../util/Scanner";
import { Kind } from "../core/Kind";

const {
    eof,
    equals,
    notEquals,
    lessThan,
    lessThanOrEqual,
    greaterThan,
    greaterThanOrEqual,
    leftBrace,
    rightBrace,
    and,
    or,
    not,
    wildcardEq,
} = tokens;

/**
 * Common constant text tokens.
 *
 * By reusing immutable tokens we can save memory when parsing common queries.
 */
const constTextTokens = new Map<string, Token>();

constTextTokens.set("and", and);
constTextTokens.set("or", or);
constTextTokens.set("not", not);

/**
 * A lexer for a haystack filter.
 */
export class FilterLexer {
    /**
     * The input string to read from.
     *
     * All state for the lexer is delegated to this object. It's shared between the filter
     * and Zinc lexers accordingly.
     *
     * No state regarding parsing should be directly held in the filter lexer.
     */
    private readonly scanner: Scanner;

    /**
     * The underlying zinc reader.
     *
     * Haystack filters use 'some' standard encoded zinc parsing. Therefore we delegate
     * some parsing to a Zinc reader where appropriate.
     */
    private readonly zinc: ZincReader;

    /**
     * Constructors a new lexer.
     *
     * @param scanner The scanner used for the input.
     * @param zinc Optional zinc lexer.
     */
    public constructor(scanner: Scanner) {
        this.scanner = scanner;
        this.zinc = new ZincReader(scanner);
    }

    /**
     * Return a function that when invoked returns the next token.
     *
     * This is designed to be feed into a parser.
     *
     * @returns A function that when invoked, returns the next token.
     */
    public toNextTokenFunc(): () => Token {
        return (): Token => this.nextToken();
    }

    /**
     * Process the next token to return.
     *
     * @returns The next token.
     */
    public nextToken(): Token {
        // Please note, this must match up with ZincLexer#nextToken()
        while (!this.scanner.isEof()) {
            switch (this.scanner.current) {
                case " ":
                case "\t":
                case "\n":
                case "\r":
                    this.scanner.consumeWhiteSpace();
                    continue;
                case '"':
                    return this.string();
                case "`":
                    return this.uri();
                case "@":
                    return this.ref();
                case "^":
                    return this.symbol();
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "-":
                    return this.numberDateTime();
                case "a":
                case "b":
                case "c":
                case "d":
                case "e":
                case "f":
                case "g":
                case "h":
                case "i":
                case "j":
                case "k":
                case "l":
                case "m":
                case "n":
                case "o":
                case "p":
                case "q":
                case "r":
                case "s":
                case "t":
                case "u":
                case "v":
                case "w":
                case "x":
                case "y":
                case "z":
                    return this.textOrRelationship();
                case "(":
                    return this.leftBrace();
                case ")":
                    return this.rightBrace();
                case "=":
                    return this.equality();
                case "!":
                    return this.notEquals();
                case "<":
                    return this.lessThan();
                case ">":
                    return this.greaterThan();
                case "*":
                    return this.wildcardEq();
                default:
                    throw new LocalizedError({
                        message: "Invalid character",
                        lex: "lexerInvalidChar",
                        index: this.scanner.index,
                    });
            }
        }

        return eof;
    }

    /**
     * Consume the data stream and return a string token.
     *
     * @returns A string token.
     * @throws If the end of the string can't be found.
     */
    private string(): TokenValue {
        return new TokenValue(TokenType.string, this.zinc.string());
    }

    /**
     * Consume the data stream and return an uri token.
     *
     * @returns A uri token.
     * @throws If the end of the uri can't be found if an invalid character is found.
     */
    private uri(): TokenValue {
        return new TokenValue(TokenType.uri, this.zinc.uri());
    }

    /**
     * Consume the data stream and return n ref token.
     *
     * @returns A ref token.
     * @throws If there's an error parsing the ref.
     */
    private ref(): TokenValue {
        return new TokenValue(TokenType.ref, this.zinc.ref());
    }

    /**
     * Consume the data stream and return a symbol token.
     *
     * @returns A symbol token.
     * @throws If there's an error parsing the symbol.
     */
    private symbol(): TokenValue {
        return new TokenValue(TokenType.symbol, this.zinc.symbol());
    }

    /**
     * Consume the data stream and return a number, date or time token.
     *
     * @returns A number, date or time token.
     * @throws If we don't have a valid number.
     */
    private numberDateTime(): TokenValue {
        const value = this.zinc.numberDateTime();

        if (value.isKind(Kind.Number)) {
            return new TokenValue(TokenType.number, value);
        } else if (value.isKind(Kind.Date)) {
            return new TokenValue(TokenType.date, value);
        } else if (value.isKind(Kind.Time)) {
            return new TokenValue(TokenType.time, value);
        } else {
            throw new LocalizedError({
                message: `Unsupported kind ${value.getKind()}`,
                lex: "lexerUnsupportedKind",
                args: { arg: value.getKind() },
                index: this.scanner.index,
            });
        }
    }

    /**
     * Consume the data stream and return a text or relationship token.
     *
     * @returns A text or relationship token.
     */
    private textOrRelationship(): Token {
        let str = String(this.scanner.current);
        let paths: string[] | undefined;

        let relationship = "";
        let term = "";
        let endRelationship = false;

        while (!this.scanner.isEof()) {
            this.scanner.consume();

            if (
                this.scanner.isLetter() ||
                this.scanner.isDigit() ||
                this.scanner.is("_")
            ) {
                str += this.scanner.current;
            } else if (
                this.scanner.is("?") ||
                (this.scanner.is("-") &&
                    (Scanner.isLetter(this.scanner.next) ||
                        Scanner.isDigit(this.scanner.next) ||
                        this.scanner.next === "_"))
            ) {
                if (this.scanner.is("?")) {
                    if (!relationship) {
                        relationship = str;
                    } else {
                        term = str;
                    }

                    this.scanner.consume();
                    endRelationship = true;
                    break;
                } else {
                    if (!relationship) {
                        relationship = str;
                        str = "";
                    } else {
                        str += this.scanner.current;
                    }
                }
            } else if (
                this.scanner.current === "-" &&
                this.scanner.next === ">"
            ) {
                this.scanner.consume();

                // If we have the dereference operator, we must have a valid path after it.
                if (
                    str &&
                    (Scanner.isLetter(this.scanner.next) ||
                        Scanner.isDigit(this.scanner.next) ||
                        String(this.scanner.next) === "_")
                ) {
                    paths = paths || [];
                    paths.push(str);
                    str = "";
                } else {
                    throw new LocalizedError({
                        message: `Invalid dereference path. There must be a path following ->`,
                        lex: "lexerInvalidDeref",
                        args: { arg: str },
                        index: this.scanner.index,
                    });
                }
            } else {
                break;
            }
        }

        let token: Token;

        if (relationship) {
            if (!endRelationship) {
                throw new LocalizedError({
                    message: `Invalid relationship. Missing ?`,
                    lex: "lexerInvalidRelationship",
                    args: { arg: str },
                    index: this.scanner.index,
                });
            }

            token = new TokenRelationship(relationship, term);
        } else {
            if (paths) {
                if (str) {
                    paths.push(str);
                }

                token = new TokenPaths(paths);
            } else {
                token =
                    constTextTokens.get(str) ||
                    new TokenObj(TokenType.text, str);
            }
        }

        return token;
    }

    /**
     * Consume the data stream to the left brace token.
     *
     * @returns A left brace token.
     */
    private leftBrace(): Token {
        this.scanner.consume();
        return leftBrace;
    }

    /**
     * Consume the data stream to the equals token.
     *
     * @returns A equals token.
     */
    private rightBrace(): Token {
        this.scanner.consume();
        return rightBrace;
    }

    /**
     * Consume the data stream to the equals token.
     *
     * @returns A equals token.
     */
    private equality(): Token {
        this.scanner.consume();

        if (this.scanner.is("=")) {
            this.scanner.consume();
            return equals;
        } else {
            throw new LocalizedError({
                message: "Expected equals operator (==)",
                lex: "lexerExpectedEquals",
                index: this.scanner.index,
            });
        }
    }

    /**
     * Consume the data stream and return a not equals token.
     *
     * @returns A not equals token.
     * @throws An error if we don't have a not equals operator.
     */
    private notEquals(): Token {
        this.scanner.consume();

        if (this.scanner.is("=")) {
            this.scanner.consume();
            return notEquals;
        } else {
            throw new LocalizedError({
                message: "Expected not equals operator (!=)",
                lex: "lexerExpectedNotEquals",
                index: this.scanner.index,
            });
        }
    }

    /**
     * Consume the data stream and return either a less than or less than or equal
     * to operator.
     *
     * @returns A less than or less than or equals to token.
     * @throws An error if we don't have a valid less than or less than or equals to operator.
     */
    private lessThan(): Token {
        this.scanner.consume();

        if (this.scanner.is("=")) {
            this.scanner.consume();
            return lessThanOrEqual;
        } else {
            return lessThan;
        }
    }

    /**
     * Consume the data stream and return either a greater than or greater than or equal
     * to operator.
     *
     * @returns A greater than or greater than or equals to token.
     * @throws An error if we don't have a valid greater than or greater than or equals to operator.
     */
    private greaterThan(): Token {
        this.scanner.consume();

        if (this.scanner.is("=")) {
            this.scanner.consume();
            return greaterThanOrEqual;
        } else {
            return greaterThan;
        }
    }

    /**
     * Consume a wildcard equality operator and return the token.
     *
     * @returns A wildcard equality token.
     * @throws An error if the wildcard equality operator isn't found.
     */
    private wildcardEq(): Token {
        if (this.scanner.consume().is("=") && this.scanner.consume().is("=")) {
            this.scanner.consume();
            return wildcardEq;
        } else {
            throw new LocalizedError({
                message: "Expected wildcard equality operator (*==)",
                lex: "lexerExpectedWildcardEquality",
                index: this.scanner.index,
            });
        }
    }
}
