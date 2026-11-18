import { TSESTree, AST_TOKEN_TYPES } from '../ts-estree';

namespace AST {
    export type TokenType = AST_TOKEN_TYPES;

    export type Token = TSESTree.Token;

    export type SourceLocation = TSESTree.SourceLocation;

    export type Range = TSESTree.Range;
}

export { AST };