/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { TokenType } from "./TokenType";
import { Token } from "./Token";
import { HaysonVal } from "../core/hayson";

/**
 * A token object with some parsed text.
 */
export class TokenObj implements Token {
    /**
     * The token type.
     */
    public readonly type: TokenType;

    /**
     * The token text value.
     */
    public readonly text: string;

    /**
     * Flag used to identify a token object.
     */
    public readonly _isATokenObj = true;

    /**
     * Contructs a new token value.
     *
     * @param type The token type.
     * @param text The token's text.
     * @param value The tokens value.
     */
    public constructor(type: TokenType, text: string) {
        this.type = type;
        this.text = text;
    }

    /**
     * @returns The text value as a paths array.
     */
    public get paths(): string[] {
        return [this.text];
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
        if (!isTokenObj(token)) {
            return false;
        }

        return this.type === token.type && this.text === token.text;
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
        return this.text;
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
            text: this.text,
        };
    }
}

/**
 * Test to see if the value is an instance of a token object.
 */
export function isTokenObj(value: unknown): value is TokenObj {
    return !!(value && (value as TokenObj)._isATokenObj);
}
