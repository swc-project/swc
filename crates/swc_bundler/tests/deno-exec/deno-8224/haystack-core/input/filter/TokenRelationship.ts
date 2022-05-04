/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { TokenType } from "./TokenType";
import { Token } from "./Token";
import { HaysonVal } from "../core/hayson";

/**
 * A token that identifies a relationship query.
 */
export class TokenRelationship implements Token {
    /**
     * The token type.
     */
    public readonly type: TokenType = TokenType.rel;

    /**
     * The relationship.
     */
    public readonly relationship: string;

    /**
     * The relationship term.
     */
    public readonly term: string;

    /**
     * Flag used to identify a token relationship object.
     */
    public readonly _isATokenRelationship = true;

    /**
     * Contructs a new token value.
     *
     * @param relationship The relationship.
     * @param term The relationship term.
     */
    public constructor(relationship: string, term: string) {
        this.relationship = relationship;
        this.term = term;
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
        if (!_isATokenRelationship(token)) {
            return false;
        }

        if (this.type !== token.type) {
            return false;
        }

        if (this.relationship !== token.relationship) {
            return false;
        }

        if (this.term !== token.term) {
            return false;
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
        return `${this.relationship}${this.term ? `-${this.term}` : ""}?`;
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
            relationship: this.relationship,
            term: this.term,
        };
    }
}

/**
 * Test to see if the value is an instance of a token object.
 */
export function _isATokenRelationship(
    value: unknown
): value is TokenRelationship {
    return !!(value && (value as TokenRelationship)._isATokenRelationship);
}
