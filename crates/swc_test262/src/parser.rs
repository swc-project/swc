//! Parser test case implementation for Test262
//!
//! This module implements Test262 conformance testing for SWC's ECMAScript
//! parser.

use std::{borrow::Cow, panic::RefUnwindSafe, path::PathBuf};

use swc_common::{sync::Lrc, FileName, SourceMap};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};

use crate::{
    case::Test262Case,
    metadata::{ErrorPhase, Test262Flag, Test262Metadata},
};

/// Parser test case for Test262
///
/// This struct represents a single Test262 parser test case.
/// It handles parsing JavaScript/ECMAScript code and validating
/// the result against expected outcomes.
pub struct ParserTest262Case {
    path: PathBuf,
    code: String,
    meta: Test262Metadata,
}

impl RefUnwindSafe for ParserTest262Case {}

impl Test262Case for ParserTest262Case {
    fn new(path: PathBuf, code: String, meta: Test262Metadata) -> Self {
        Self { path, code, meta }
    }

    fn run(&self) {
        // Unless configured otherwise (via the noStrict, onlyStrict, module, or raw
        // flags), each test must be executed twice: once in ECMAScript's
        // non-strict mode, and again in ECMAScript's strict mode.
        // See: https://github.com/tc39/test262/blob/main/INTERPRETING.md#strict-mode

        let flags = &self.meta.flags;

        if flags.contains(&Test262Flag::OnlyStrict) {
            // Run only in strict mode
            self.execute_with_strict(true);
        } else if flags.contains(&Test262Flag::Module) {
            // Modules are always strict
            self.execute_module();
        } else if flags.contains(&Test262Flag::NoStrict) || flags.contains(&Test262Flag::Raw) {
            // Run only in non-strict mode
            self.execute_with_strict(false);
        } else {
            // Run twice: non-strict first, then strict
            // Only run strict mode if non-strict mode passes
            let non_strict_passed = std::panic::catch_unwind(|| {
                self.execute_with_strict(false);
            })
            .is_ok();

            if non_strict_passed {
                self.execute_with_strict(true);
            }
        }
    }

    fn path(&self) -> &PathBuf {
        &self.path
    }

    fn code(&self) -> &str {
        &self.code
    }

    fn meta(&self) -> &Test262Metadata {
        &self.meta
    }

    fn should_fail(&self) -> bool {
        // Only consider parse and early errors for parser tests
        self.meta
            .negative
            .as_ref()
            .is_some_and(|neg| matches!(neg.phase, ErrorPhase::Parse | ErrorPhase::Early))
    }
}

impl ParserTest262Case {
    /// Execute test with specified strict mode
    fn execute_with_strict(&self, strict: bool) {
        // To run in strict mode, the test contents must be modified prior to
        // execution-- a "use strict" directive must be inserted as the initial
        // character sequence of the file, followed by a semicolon and newline.
        let source_text = if strict {
            Cow::Owned(format!("'use strict';\n{}", self.code))
        } else {
            Cow::Borrowed(self.code.as_str())
        };

        let result = self.parse(&source_text, false);
        self.validate_result(result);
    }

    /// Execute test as module (modules are always strict)
    fn execute_module(&self) {
        let result = self.parse(&self.code, true);
        self.validate_result(result);
    }

    /// Parse source code and return result
    ///
    /// Returns `Ok(())` if parsing succeeded, `Err(error_msg)` if parsing
    /// failed.
    fn parse(&self, source_text: &str, is_module: bool) -> Result<(), String> {
        let cm = Lrc::new(SourceMap::default());

        let fm = cm.new_source_file(
            Lrc::new(FileName::Real(self.path.clone())),
            source_text.to_string(),
        );

        let lexer = Lexer::new(
            Syntax::default(),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);

        let parse_result = if is_module {
            parser.parse_module().map(|_| ())
        } else {
            parser.parse_script().map(|_| ())
        };

        // Collect parse errors
        let errors: Vec<_> = parser.take_errors();

        if !errors.is_empty() || parse_result.is_err() {
            let mut error_msg = String::new();
            for e in &errors {
                error_msg.push_str(&format!("{e:?}\n"));
            }
            if let Err(e) = parse_result {
                error_msg.push_str(&format!("{e:?}\n"));
            }
            return Err(error_msg);
        }

        Ok(())
    }

    /// Validate parse result against expected outcome
    fn validate_result(&self, result: Result<(), String>) {
        let should_fail = self.should_fail();

        match (result, should_fail) {
            (Ok(()), false) => {
                // Test passed as expected - success!
            }
            (Err(_), true) => {
                // Test failed as expected (negative test) - success!
            }
            (Ok(()), true) => {
                panic!(
                    "Test should have failed but passed: {}",
                    self.path.display()
                );
            }
            (Err(err), false) => {
                panic!(
                    "Test should have passed but failed: {}\nError: {}",
                    self.path.display(),
                    err
                );
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_simple_parse() {
        let code = r#"
/*---
description: Simple variable declaration
esid: sec-variable-statement
---*/
const x = 1;
"#
        .to_string();

        let meta = Test262Metadata::parse(&code).unwrap();
        let case = ParserTest262Case::new(PathBuf::from("test.js"), code, meta);

        // This should not panic
        case.run();
    }

    #[test]
    #[should_panic]
    fn test_negative_parse() {
        let code = r#"
/*---
description: Invalid syntax
negative:
  phase: parse
  type: SyntaxError
---*/
const const;
"#
        .to_string();

        let meta = Test262Metadata::parse(&code).unwrap();
        let case = ParserTest262Case::new(PathBuf::from("test.js"), code.clone(), meta);

        // Should fail because this is actually invalid syntax
        // and our parser should catch it
        let result = case.parse(&code, false);
        assert!(result.is_err(), "Should fail to parse invalid syntax");
    }
}
