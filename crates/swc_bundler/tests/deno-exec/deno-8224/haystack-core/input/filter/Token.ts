/*
 * Copyright (c) 2019, J2 Innovations. All Rights Reserved
 */

/**
 * Base token definitions.
 *
 * @module
 */

import { TokenType } from "./TokenType";
import { HaysonVal } from "../core/hayson";

/**
 * A token created when parsing a string.
 */
export interface Token {
    /**
     * @returns The type of token.
     */
    type: TokenType;

    /**
     * Returns true if the type matches this token's type.
     *
     * @param type The token type.
     * @return True if the type matches.
     */
    is(type: TokenType): boolean;

    /**
     * Returns true if the object matches this one.
     *
     * @param type The token type.
     * @param text The text.
     * @return True if the objects are equal.
     */
    equals(token: Token): boolean;

    /**
     * @returns A string representation of the token.
     */
    toString(): string;

    /**
     * Encodes to an encoded zinc value that can be used
     * in a haystack filter string.
     *
     * The encoding for a haystack filter is mostly zinc but contains
     * some exceptions.
     *
     * @returns The encoded value that can be used in a haystack filter.
     */
    toFilter(): string;

    /**
     * @returns A JSON representation of the token.
     */
    toJSON(): {
        type: string;
        [prop: string]: string | string[] | HaysonVal;
    };
}
