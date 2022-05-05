/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { TokenObj } from "./TokenObj";
import { TokenType } from "./TokenType";

/**
 * A collection of constant tokens.
 */
export const tokens = {
    eof: new TokenObj(TokenType.eof, "<eof>"),
    equals: new TokenObj(TokenType.equals, "=="),
    notEquals: new TokenObj(TokenType.notEquals, "!="),
    lessThan: new TokenObj(TokenType.lessThan, "<"),
    lessThanOrEqual: new TokenObj(TokenType.lessThanOrEqual, "<="),
    greaterThan: new TokenObj(TokenType.greaterThan, ">"),
    greaterThanOrEqual: new TokenObj(TokenType.greaterThanOrEqual, ">="),
    leftBrace: new TokenObj(TokenType.leftBrace, "("),
    rightBrace: new TokenObj(TokenType.rightBrace, ")"),
    and: new TokenObj(TokenType.text, "and"),
    or: new TokenObj(TokenType.text, "or"),
    not: new TokenObj(TokenType.text, "not"),
    wildcardEq: new TokenObj(TokenType.wildcardEq, "*=="),
};
