/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { HVal } from "../core/HVal";
import { HBool } from "../core/HBool";
import { TokenType } from "./TokenType";
import { Token } from "./Token";
import { HaysonVal } from "../core/hayson";

/**
 * A token that has a decoded haystack value.
 */
export class TokenValue implements Token {
    /**
     * The token type.
     */
    public readonly type: TokenType;

    /**
     * The haystack value.
     */
    public readonly value: HVal;

    /**
     * Flag used to identify a token value.
     */
    public readonly _isATokenValue = true;

    /**
     * Contructs a new token value.
     *
     * @param type The token type.
     * @param text The token's text.
     * @param value The tokens value.
     */
    public constructor(type: TokenType, value: HVal) {
        this.type = type;
        this.value = value;
    }

    /**
     * Return a boolean token value.
     *
     * @param value The boolean value.
     * @returns The token value.
     */
    public static makeBool(value: boolean): TokenValue {
        return new TokenValue(TokenType.boolean, HBool.make(value));
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
        if (!isTokenValue(token)) {
            return false;
        }

        return this.type === token.type && this.value.equals(token.value);
    }

    /**
     * @returns A string representation of the token.
     */
    public toString(): string {
        return this.value.toString();
    }

    /**
     * @returns The encoded value that can be used in a haystack filter.
     */
    public toFilter(): string {
        return this.value.toFilter();
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
            val: this.value.toJSON(),
        };
    }
}

/**
 * Test to see if the value is an instance of a token value.
 */
export function isTokenValue(value: unknown): value is TokenValue {
    return !!(value && (value as TokenValue)._isATokenValue);
}
