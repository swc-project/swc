/*
 * Copyright (c) 2019, J2 Innovations. All Rights Reserved
 */

/**
 * The type of token
 */
export enum TokenType {
    // End of file
    eof,
    // Text
    text,
    // Paths
    paths,
    // Value types
    string,
    number,
    date,
    time,
    uri,
    ref,
    boolean,
    symbol,
    // Operators
    equals,
    notEquals,
    lessThan,
    lessThanOrEqual,
    greaterThan,
    greaterThanOrEqual,
    leftBrace,
    rightBrace,
    // Relationship
    rel,
    // Wildcard equality
    wildcardEq,
}
