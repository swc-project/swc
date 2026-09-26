use swc_atoms::Atom;

bitflags::bitflags! {
  /// Lexical state shared with a [`crate::input::Tokens`] implementation.
  ///
  /// Grammar and parser control-flow state are intentionally not exposed here;
  /// they are owned and restored by [`crate::Parser`].
  #[derive(Debug, Clone, Copy, Default)]
  pub struct Context: u8 {

      /// `true` while backtracking
      const IgnoreError = 1 << 0;

      /// Is in module code?
      const Module = 1 << 1;
      const Strict = 1 << 2;

      const InType = 1 << 3;
      /// Typescript extension.
      const ShouldNotLexLtOrGtAsType = 1 << 4;
  }
}

impl Context {
    #[cfg_attr(not(feature = "verify"), inline(always))]
    pub fn is_reserved_word(self, word: &Atom) -> bool {
        if !cfg!(feature = "verify") {
            return false;
        }

        match &**word {
            "let" => self.contains(Context::Strict),
            // SyntaxError in the module only, not in the strict.
            // ```JavaScript
            // function foo() {
            //     "use strict";
            //     let await = 1;
            // }
            // ```
            "await" => self.contains(Context::Module),
            "yield" => self.contains(Context::Strict),

            "null" | "true" | "false" | "break" | "case" | "catch" | "continue" | "debugger"
            | "default" | "do" | "export" | "else" | "finally" | "for" | "function" | "if"
            | "return" | "switch" | "throw" | "try" | "var" | "const" | "while" | "with"
            | "new" | "this" | "super" | "class" | "extends" | "import" | "in" | "instanceof"
            | "typeof" | "void" | "delete" => true,

            // Future reserved word
            "enum" => true,

            "implements" | "package" | "protected" | "interface" | "private" | "public"
                if self.contains(Context::Strict) =>
            {
                true
            }

            _ => false,
        }
    }
}
