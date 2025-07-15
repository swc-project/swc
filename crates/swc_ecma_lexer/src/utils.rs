use swc_atoms::Atom;

use super::Context;
use crate::token::*;

impl Context {
    pub fn is_reserved(self, word: &Word) -> bool {
        match *word {
            Word::Keyword(Keyword::Let) | Word::Ident(IdentLike::Known(known_ident!("static"))) => {
                self.contains(Context::Strict)
            }
            Word::Keyword(Keyword::Await) => {
                self.contains(Context::InAsync)
                    || self.contains(Context::InStaticBlock)
                    || self.contains(Context::Strict)
            }
            Word::Keyword(Keyword::Yield) => {
                self.contains(Context::InGenerator) || self.contains(Context::Strict)
            }

            Word::Null
            | Word::True
            | Word::False
            | Word::Keyword(Keyword::Break)
            | Word::Keyword(Keyword::Case)
            | Word::Keyword(Keyword::Catch)
            | Word::Keyword(Keyword::Continue)
            | Word::Keyword(Keyword::Debugger)
            | Word::Keyword(Keyword::Default_)
            | Word::Keyword(Keyword::Do)
            | Word::Keyword(Keyword::Export)
            | Word::Keyword(Keyword::Else)
            | Word::Keyword(Keyword::Finally)
            | Word::Keyword(Keyword::For)
            | Word::Keyword(Keyword::Function)
            | Word::Keyword(Keyword::If)
            | Word::Keyword(Keyword::Return)
            | Word::Keyword(Keyword::Switch)
            | Word::Keyword(Keyword::Throw)
            | Word::Keyword(Keyword::Try)
            | Word::Keyword(Keyword::Var)
            | Word::Keyword(Keyword::Const)
            | Word::Keyword(Keyword::While)
            | Word::Keyword(Keyword::With)
            | Word::Keyword(Keyword::New)
            | Word::Keyword(Keyword::This)
            | Word::Keyword(Keyword::Super)
            | Word::Keyword(Keyword::Class)
            | Word::Keyword(Keyword::Extends)
            | Word::Keyword(Keyword::Import)
            | Word::Keyword(Keyword::In)
            | Word::Keyword(Keyword::InstanceOf)
            | Word::Keyword(Keyword::TypeOf)
            | Word::Keyword(Keyword::Void)
            | Word::Keyword(Keyword::Delete) => true,

            // Future reserved word
            Word::Ident(IdentLike::Known(known_ident!("enum"))) => true,

            Word::Ident(IdentLike::Known(
                known_ident!("implements")
                | known_ident!("package")
                | known_ident!("protected")
                | known_ident!("interface")
                | known_ident!("private")
                | known_ident!("public"),
            )) if self.contains(Context::Strict) => true,

            _ => false,
        }
    }

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
            "await" => {
                self.contains(Context::InAsync)
                    || self.contains(Context::InStaticBlock)
                    || self.contains(Context::Module)
            }
            "yield" => self.contains(Context::InGenerator) || self.contains(Context::Strict),

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
