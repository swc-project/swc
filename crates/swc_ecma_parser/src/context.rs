bitflags::bitflags! {
  #[derive(Debug, Clone, Copy, Default)]
  pub struct Context: u32 {

      /// `true` while backtracking
      const IgnoreError = 1 << 0;

      /// Is in module code?
      const Module = 1 << 1;
      const CanBeModule = 1 << 2;
      const Strict = 1 << 3;

      const ForLoopInit = 1 << 4;
      const ForAwaitLoopInit = 1 << 5;

      const IncludeInExpr = 1 << 6;
      /// If true, await expression is parsed, and "await" is treated as a
      /// keyword.
      const InAsync = 1 << 7;
      /// If true, yield expression is parsed, and "yield" is treated as a
      /// keyword.
      const InGenerator = 1 << 8;

      /// If true, await is treated as a keyword.
      const InStaticBlock = 1 << 9;

      const IsContinueAllowed = 1 << 10;
      const IsBreakAllowed = 1 << 11;

      const InType = 1 << 12;
      /// Typescript extension.
      const ShouldNotLexLtOrGtAsType = 1 << 13;
      /// Typescript extension.
      const InDeclare = 1 << 14;

      /// If true, `:` should not be treated as a type annotation.
      const InCondExpr = 1 << 15;
      const WillExpectColonForCond = 1 << 16;

      const InClass = 1 << 17;

      const InClassField = 1 << 18;

      const InFunction = 1 << 19;

      /// This indicates current scope or the scope out of arrow function is
      /// function declaration or function expression or not.
      const InsideNonArrowFunctionScope = 1 << 20;

      const InParameters = 1 << 21;

      const HasSuperClass = 1 << 22;

      const InPropertyName = 1 << 23;

      const InForcedJsxContext = 1 << 24;

      // If true, allow super.x and super[x]
      const AllowDirectSuper = 1 << 25;

      const IgnoreElseClause = 1 << 26;

      const DisallowConditionalTypes = 1 << 27;

      const AllowUsingDecl = 1 << 28;

      const TopLevel = 1 << 29;

      const TsModuleBlock = 1 << 30;
  }
}
