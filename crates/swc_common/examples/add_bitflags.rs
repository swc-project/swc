#![allow(non_upper_case_globals)]
#![recursion_limit = "512"]

use swc_common::add_bitflags;

fn main() {
    // NOOP
}

pub struct ListFormat {
    bits: u32,
}

add_bitflags!(
    ListFormat,
    // Handled by bitflags! macro.
    // Values { None: 0 },
    /// Line separators
    Values {
        /// Prints the list on a single line (default).
        SingleLine: 0,
        /// Prints the list on multiple lines.
        MultiLine: 1 << 0,
        /// Prints the list using line preservation if possible.
        PreserveLines: 1 << 1,
        LinesMask: SingleLine | MultiLine | PreserveLines,
    },
    /// Delimiters
    Values {
        /// There is no delimiter between list items (default).
        NotDelimited: 0,
        /// Each list item is space-and-bar (" |") delimited.
        BarDelimited: 1 << 2,
        /// Each list item is space-and-ampersand (" &") delimited.
        AmpersandDelimited: 1 << 3,
        /// Each list item is comma (",") delimited.
        CommaDelimited: 1 << 4,
        DelimitersMask: BarDelimited | AmpersandDelimited | CommaDelimited,
    },
    Values {
        /// Write a trailing comma (",") if present.
        AllowTrailingComma: 1 << 5,
    },
    /// Whitespace
    Values {
        /// The list should be indented.
        Indented: 1 << 6,
        /// Inserts a space after the opening brace and before the closing
        /// brace.
        SpaceBetweenBraces: 1 << 7,
        /// Inserts a space between each sibling node.
        SpaceBetweenSiblings: 1 << 8,
    },
    /// Brackets/Braces
    Values {
        /// The list is surrounded by "{" and "}".
        Braces: 1 << 9,
        /// The list is surrounded by "(" and ")".
        Parenthesis: 1 << 10,
        /// The list is surrounded by "<" and ">".
        AngleBrackets: 1 << 11,
        /// The list is surrounded by "[" and "]".
        SquareBrackets: 1 << 12,
        BracketsMask: Braces | Parenthesis | AngleBrackets | SquareBrackets,
    },
    Values {
        /// Do not emit brackets if the list is undefined.
        OptionalIfUndefined: 1 << 13,
        /// Do not emit brackets if the list is empty.
        OptionalIfEmpty: 1 << 14,
        Optional: OptionalIfUndefined | OptionalIfEmpty,
    },
    /// Others
    Values {
        /// Prefer adding a LineTerminator between synthesized nodes.
        PreferNewLine: 1 << 15,
        /// Do not emit a trailing NewLine for a MultiLine list.
        NoTrailingNewLine: 1 << 16,
        /// Do not emit comments between each node
        NoInterveningComments: 1 << 17,
        /// If the literal is empty, do not add spaces between braces.
        NoSpaceIfEmpty: 1 << 18,
        SingleElement: 1 << 19,
    },
    /// Precomputed Formats
    Values {
        Modifiers: SingleLine | SpaceBetweenSiblings | NoInterveningComments,
        HeritageClauses: SingleLine | SpaceBetweenSiblings,
        SingleLineTypeLiteralMembers: SingleLine
            | SpaceBetweenBraces
            | SpaceBetweenSiblings
            | Indented,
        MultiLineTypeLiteralMembers: MultiLine | Indented,
        TupleTypeElements: CommaDelimited | SpaceBetweenSiblings | SingleLine | Indented,
        UnionTypeConstituents: BarDelimited | SpaceBetweenSiblings | SingleLine,
        IntersectionTypeConstituents: AmpersandDelimited | SpaceBetweenSiblings | SingleLine,
        ObjectBindingPatternElements: SingleLine
            | AllowTrailingComma
            | SpaceBetweenBraces
            | CommaDelimited
            | SpaceBetweenSiblings
            | NoSpaceIfEmpty,
        ArrayBindingPatternElements: SingleLine
            | AllowTrailingComma
            | CommaDelimited
            | SpaceBetweenSiblings
            | NoSpaceIfEmpty,
        ObjectLiteralExpressionProperties: PreserveLines
            | CommaDelimited
            | SpaceBetweenSiblings
            | SpaceBetweenBraces
            | Indented
            | Braces
            | NoSpaceIfEmpty,
        ArrayLiteralExpressionElements: PreserveLines
            | CommaDelimited
            | SpaceBetweenSiblings
            | AllowTrailingComma
            | Indented
            | SquareBrackets,
        CommaListElements: CommaDelimited | SpaceBetweenSiblings | SingleLine,
        CallExpressionArguments: CommaDelimited | SpaceBetweenSiblings | SingleLine | Parenthesis,
        NewExpressionArguments: CommaDelimited
            | SpaceBetweenSiblings
            | SingleLine
            | Parenthesis
            | OptionalIfUndefined,
        TemplateExpressionSpans: SingleLine | NoInterveningComments,
        SingleLineBlockStatements: SpaceBetweenBraces | SpaceBetweenSiblings | SingleLine,
        MultiLineBlockStatements: Indented | MultiLine,
        VariableDeclarationList: CommaDelimited | SpaceBetweenSiblings | SingleLine,
        SingleLineFunctionBodyStatements: SingleLine | SpaceBetweenSiblings | SpaceBetweenBraces,
        MultiLineFunctionBodyStatements: MultiLine,
        ClassHeritageClauses: SingleLine | SpaceBetweenSiblings,
        ClassMembers: Indented | MultiLine,
        InterfaceMembers: Indented | MultiLine,
        EnumMembers: CommaDelimited | Indented | MultiLine,
        CaseBlockClauses: Indented | MultiLine,
        NamedImportsOrExportsElements: CommaDelimited
            | SpaceBetweenSiblings
            | AllowTrailingComma
            | SingleLine
            | SpaceBetweenBraces,
        JsxElementOrFragmentChildren: SingleLine | NoInterveningComments,
        JsxElementAttributes: SingleLine | SpaceBetweenSiblings | NoInterveningComments,
        CaseOrDefaultClauseStatements: Indented | MultiLine | NoTrailingNewLine | OptionalIfEmpty,
        HeritageClauseTypes: CommaDelimited | SpaceBetweenSiblings | SingleLine,
        SourceFileStatements: MultiLine | NoTrailingNewLine,
        Decorators: MultiLine | Optional,
        TypeArguments: CommaDelimited
            | SpaceBetweenSiblings
            | SingleLine
            | AngleBrackets
            | Optional,
        TypeParameters: CommaDelimited
            | SpaceBetweenSiblings
            | SingleLine
            | AngleBrackets
            | Optional,
        Parameters: CommaDelimited | SpaceBetweenSiblings | SingleLine | Parenthesis,
        IndexSignatureParameters: CommaDelimited
            | SpaceBetweenSiblings
            | SingleLine
            | Indented
            | SquareBrackets,
    },
);
