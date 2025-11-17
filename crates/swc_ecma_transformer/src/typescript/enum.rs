//! TypeScript enum transformation.
//!
//! Transforms TypeScript enum declarations into JavaScript IIFE patterns
//! that create bidirectional mappings between enum members and their values.
//!
//! # Example
//!
//! Input:
//! ```typescript
//! enum Color {
//!   Red = 1,
//!   Green,
//!   Blue
//! }
//! ```
//!
//! Output:
//! ```javascript
//! var Color = ((Color) => {
//!   Color[Color["Red"] = 1] = "Red";
//!   Color[Color["Green"] = 2] = "Green";
//!   Color[Color["Blue"] = 3] = "Blue";
//!   return Color;
//! })(Color || {});
//! ```

use rustc_hash::FxHashMap;
use swc_atoms::{Atom, Wtf8Atom};
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

/// Handles TypeScript enum transformations.
///
/// This transformer maintains state about enum members and their values
/// to support:
/// - Constant folding for numeric enums
/// - Auto-increment for members without initializers
/// - String enum handling
/// - Const enum inlining (future enhancement)
pub struct TypeScriptEnum {
    /// Map of enum members to their computed values
    #[allow(dead_code)]
    enum_values: FxHashMap<(Id, Atom), EnumValue>,
}

/// Represents the value of an enum member.
#[derive(Debug, Clone)]
#[allow(dead_code)]
enum EnumValue {
    /// A numeric value
    Number(f64),
    /// A string value
    String(Wtf8Atom),
    /// An opaque expression that couldn't be evaluated
    Opaque(Box<Expr>),
}

impl EnumValue {
    /// Increments a numeric value by 1, or returns None for non-numeric values.
    #[allow(dead_code)]
    fn increment(&self) -> Option<EnumValue> {
        match self {
            EnumValue::Number(n) => Some(EnumValue::Number(n + 1.0)),
            _ => None,
        }
    }

    /// Converts the enum value to an expression.
    #[allow(dead_code)]
    fn to_expr(&self) -> Expr {
        match self {
            EnumValue::Number(n) => Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: *n,
                raw: None,
            })),
            EnumValue::String(s) => Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: s.clone(),
                raw: None,
            })),
            EnumValue::Opaque(expr) => *expr.clone(),
        }
    }
}

impl TypeScriptEnum {
    /// Creates a new enum transformer.
    pub fn new() -> Self {
        Self {
            enum_values: FxHashMap::default(),
        }
    }

    /// Transforms a TypeScript enum declaration.
    ///
    /// This is a placeholder method that will be called from the main
    /// TypeScript transformer to convert enum declarations.
    pub fn transform_enum(&mut self, _enum_decl: &mut TsEnumDecl) {
        // TODO: Implement full enum transformation
        // This will:
        // 1. Evaluate all enum member initializers
        // 2. Generate the IIFE pattern
        // 3. Create bidirectional mappings
        // 4. Handle const enums specially
    }

    /// Evaluates an enum member initializer to a constant value if possible.
    #[allow(dead_code)]
    fn evaluate_initializer(&self, expr: &Expr, _enum_id: &Id) -> EnumValue {
        match expr {
            // Literal values
            Expr::Lit(Lit::Num(num)) => EnumValue::Number(num.value),
            Expr::Lit(Lit::Str(s)) => EnumValue::String(s.value.clone()),

            // Unary expressions
            Expr::Unary(UnaryExpr {
                op: op!(unary, "-"),
                arg,
                ..
            }) => {
                if let EnumValue::Number(n) = self.evaluate_initializer(arg, _enum_id) {
                    EnumValue::Number(-n)
                } else {
                    EnumValue::Opaque(Box::new(expr.clone()))
                }
            }
            Expr::Unary(UnaryExpr {
                op: op!(unary, "+"),
                arg,
                ..
            }) => self.evaluate_initializer(arg, _enum_id),

            // Binary expressions
            Expr::Bin(BinExpr {
                left, op, right, ..
            }) => self.evaluate_binary_expr(left, *op, right, _enum_id),

            // Parenthesized expressions
            Expr::Paren(ParenExpr { expr, .. }) => self.evaluate_initializer(expr, _enum_id),

            // References to other enum members
            Expr::Member(_) | Expr::Ident(_) => {
                // TODO: Look up the referenced enum member
                EnumValue::Opaque(Box::new(expr.clone()))
            }

            // Everything else is opaque
            _ => EnumValue::Opaque(Box::new(expr.clone())),
        }
    }

    /// Evaluates a binary expression to a constant value if possible.
    #[allow(dead_code)]
    fn evaluate_binary_expr(
        &self,
        left: &Expr,
        op: BinaryOp,
        right: &Expr,
        enum_id: &Id,
    ) -> EnumValue {
        let left_val = self.evaluate_initializer(left, enum_id);
        let right_val = self.evaluate_initializer(right, enum_id);

        // Only evaluate if both sides are numeric
        if let (EnumValue::Number(l), EnumValue::Number(r)) = (&left_val, &right_val) {
            use BinaryOp::*;
            let result = match op {
                Add => l + r,
                Sub => l - r,
                Mul => l * r,
                Div => l / r,
                Mod => l % r,
                LShift => ((*l as i32) << (*r as i32)) as f64,
                RShift => ((*l as i32) >> (*r as i32)) as f64,
                ZeroFillRShift => ((*l as u32) >> (*r as u32)) as f64,
                BitAnd => ((*l as i32) & (*r as i32)) as f64,
                BitOr => ((*l as i32) | (*r as i32)) as f64,
                BitXor => ((*l as i32) ^ (*r as i32)) as f64,
                _ => {
                    return EnumValue::Opaque(Box::new(Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        op,
                        left: Box::new(left_val.to_expr()),
                        right: Box::new(right_val.to_expr()),
                    })))
                }
            };
            EnumValue::Number(result)
        } else {
            // Can't evaluate, return opaque
            EnumValue::Opaque(Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op,
                left: Box::new(left.clone()),
                right: Box::new(right.clone()),
            })))
        }
    }

    /// Generates an IIFE pattern for an enum.
    ///
    /// Creates the pattern:
    /// ```javascript
    /// (function (EnumName) {
    ///   // member assignments
    ///   return EnumName;
    /// })(EnumName || {})
    /// ```
    #[allow(dead_code)]
    fn generate_enum_iife(
        &self,
        enum_name: &Ident,
        members: &[TsEnumMember],
        _is_const: bool,
    ) -> Expr {
        let param = Param {
            span: DUMMY_SP,
            decorators: vec![],
            pat: Pat::Ident(BindingIdent {
                id: enum_name.clone(),
                type_ann: None,
            }),
        };

        // Generate member assignments
        let mut stmts = Vec::new();
        let mut _current_value = EnumValue::Number(0.0);

        for _member in members {
            // TODO: Generate assignment statements
            // EnumName[EnumName["MemberName"] = value] = "MemberName";
        }

        // Add return statement
        stmts.push(Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(Expr::Ident(enum_name.clone()))),
        }));

        // Create the IIFE
        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(Box::new(Expr::Paren(ParenExpr {
                span: DUMMY_SP,
                expr: Box::new(Expr::Fn(FnExpr {
                    ident: None,
                    function: Box::new(Function {
                        params: vec![param],
                        decorators: vec![],
                        span: DUMMY_SP,
                        body: Some(BlockStmt {
                            span: DUMMY_SP,
                            stmts,
                            ..Default::default()
                        }),
                        is_generator: false,
                        is_async: false,
                        type_params: None,
                        return_type: None,
                        ..Default::default()
                    }),
                })),
            }))),
            args: vec![ExprOrSpread {
                spread: None,
                expr: Box::new(Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    op: op!("||"),
                    left: Box::new(Expr::Ident(enum_name.clone())),
                    right: Box::new(Expr::Object(ObjectLit {
                        span: DUMMY_SP,
                        props: vec![],
                    })),
                })),
            }],
            ..Default::default()
        })
    }
}

impl Default for TypeScriptEnum {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use swc_common::SyntaxContext;

    use super::*;

    #[test]
    fn test_evaluate_numeric_literal() {
        let transformer = TypeScriptEnum::new();
        let expr = Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value: 42.0,
            raw: None,
        }));
        let enum_id = (Atom::from("TestEnum"), SyntaxContext::empty());

        match transformer.evaluate_initializer(&expr, &enum_id) {
            EnumValue::Number(n) => assert_eq!(n, 42.0),
            _ => panic!("Expected numeric value"),
        }
    }

    #[test]
    fn test_evaluate_string_literal() {
        let transformer = TypeScriptEnum::new();
        let expr = Expr::Lit(Lit::Str(Str {
            span: DUMMY_SP,
            value: "test".into(),
            raw: None,
        }));
        let enum_id = (Atom::from("TestEnum"), SyntaxContext::empty());

        match transformer.evaluate_initializer(&expr, &enum_id) {
            EnumValue::String(s) => assert_eq!(&*s, "test"),
            _ => panic!("Expected string value"),
        }
    }

    #[test]
    fn test_evaluate_unary_minus() {
        let transformer = TypeScriptEnum::new();
        let expr = Expr::Unary(UnaryExpr {
            span: DUMMY_SP,
            op: op!(unary, "-"),
            arg: Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: 10.0,
                raw: None,
            }))),
        });
        let enum_id = (Atom::from("TestEnum"), SyntaxContext::empty());

        match transformer.evaluate_initializer(&expr, &enum_id) {
            EnumValue::Number(n) => assert_eq!(n, -10.0),
            _ => panic!("Expected numeric value"),
        }
    }

    #[test]
    fn test_evaluate_binary_addition() {
        let transformer = TypeScriptEnum::new();
        let left = Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value: 5.0,
            raw: None,
        }));
        let right = Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value: 3.0,
            raw: None,
        }));
        let enum_id = (Atom::from("TestEnum"), SyntaxContext::empty());

        match transformer.evaluate_binary_expr(&left, BinaryOp::Add, &right, &enum_id) {
            EnumValue::Number(n) => assert_eq!(n, 8.0),
            _ => panic!("Expected numeric value"),
        }
    }

    #[test]
    fn test_increment_numeric_value() {
        let value = EnumValue::Number(5.0);
        match value.increment() {
            Some(EnumValue::Number(n)) => assert_eq!(n, 6.0),
            _ => panic!("Expected incremented numeric value"),
        }
    }

    #[test]
    fn test_increment_string_value() {
        let value = EnumValue::String("test".into());
        assert!(value.increment().is_none());
    }
}
