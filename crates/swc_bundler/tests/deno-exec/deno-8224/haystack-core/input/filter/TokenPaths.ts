/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { TokenType } from "./TokenType";
import { Token } from "./Token";
import { HaysonVal } from "../core/hayson";

/**
 * A token with multiple paths.
 *
 * This token is used to hold dereferenced path information.
 */
export class TokenPaths implements Token {
    /**
     * The token type.
     */
    public readonly type: TokenType = TokenType.paths;

    /**
     * The token text value.
     */
    public readonly paths: string[];

    /**
     * Flag used to identify a token paths object.
     */
    public readonly _isATokenPaths = true;

    /**
     * Contructs a new token value.
     *
     * @param paths The paths.
     * @param value The tokens value.
     */
    public constructor(paths: string[]) {
        this.paths = paths;
    }

    /**
     * Returns true if the type matches this token's type.
     *
     * @param type The token type.
     * @return True if the type matches.
     */
    public is(type: TokenType): boolean {
        return this.type === type;
    }

    /**
     * Returns true if the object matches this one.
     *
     * @param type The token type.
     * @param text The text.
     * @return True if the objects are equal.
     */
    public equals(token: Token): boolean {
        if (!isTokenPaths(token)) {
            return false;
        }

        if (this.type !== token.type) {
            return false;
        }

        if (this.paths.length !== token.paths.length) {
            return false;
        }

        for (let i = 0; i < this.paths.length; ++i) {
            if (this.paths[i] !== token.paths[i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * @returns A string representation of the token.
     */
    public toString(): string {
        return this.toFilter();
    }

    /**
     * @returns The encoded value that can be used in a haystack filter.
     */
    public toFilter(): string {
        return this.paths.join("->");
    }

    /**
     * @returns A JSON representation of the token.
     */
    public toJSON(): {
        type: string;
        [prop: string]: string | string[] | HaysonVal;
    } {
        return {
            type: TokenType[this.type],
            paths: this.paths,
        };
    }
}

/**
 * Test to see if the value is an instance of a token object.
 */
export function isTokenPaths(value: unknown): value is TokenPaths {
    return !!(value && (value as TokenPaths)._isATokenPaths);
}
