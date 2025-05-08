//! 13.3.3 Destructuring Binding Patterns

use swc_common::Spanned;

use super::*;
use crate::{
    common::parser::{
        class_and_fn::parse_decorators,
        is_not_this,
        pat::{parse_binding_element, parse_binding_pat_or_ident},
        typescript::{
            eat_any_ts_modifier, parse_ts_modifier, parse_ts_type_ann, try_parse_ts_type_ann,
        },
    },
    token::Token,
};

impl<I: Tokens<TokenAndSpan>> Parser<I> {
    pub fn parse_pat(&mut self) -> PResult<Pat> {
        parse_binding_pat_or_ident(self, false)
    }

    /// spec: 'FormalParameter'
    ///
    /// babel: `parseAssignableListItem`
    fn parse_formal_param_pat(&mut self) -> PResult<Pat> {
        let start = cur_pos!(self);

        let has_modifier = eat_any_ts_modifier(self)?;

        let pat_start = cur_pos!(self);
        let mut pat = parse_binding_element(self)?;
        let mut opt = false;

        if self.input.syntax().typescript() {
            if eat!(self, '?') {
                match pat {
                    Pat::Ident(BindingIdent {
                        id:
                            Ident {
                                ref mut optional, ..
                            },
                        ..
                    })
                    | Pat::Array(ArrayPat {
                        ref mut optional, ..
                    })
                    | Pat::Object(ObjectPat {
                        ref mut optional, ..
                    }) => {
                        *optional = true;
                        opt = true;
                    }
                    _ if self.input.syntax().dts() || self.ctx().contains(Context::InDeclare) => {}
                    _ => {
                        syntax_error!(
                            self,
                            self.input.prev_span(),
                            SyntaxError::TsBindingPatCannotBeOptional
                        );
                    }
                }
            }

            match pat {
                Pat::Array(ArrayPat {
                    ref mut type_ann,
                    ref mut span,
                    ..
                })
                | Pat::Object(ObjectPat {
                    ref mut type_ann,
                    ref mut span,
                    ..
                })
                | Pat::Rest(RestPat {
                    ref mut type_ann,
                    ref mut span,
                    ..
                }) => {
                    let new_type_ann = try_parse_ts_type_ann(self)?;
                    if new_type_ann.is_some() {
                        *span = Span::new(pat_start, self.input.prev_span().hi);
                    }
                    *type_ann = new_type_ann;
                }

                Pat::Ident(BindingIdent {
                    ref mut type_ann, ..
                }) => {
                    let new_type_ann = try_parse_ts_type_ann(self)?;
                    *type_ann = new_type_ann;
                }

                Pat::Assign(AssignPat { ref mut span, .. }) => {
                    if try_parse_ts_type_ann(self)?.is_some() {
                        *span = Span::new(pat_start, self.input.prev_span().hi);
                        self.emit_err(*span, SyntaxError::TSTypeAnnotationAfterAssign);
                    }
                }
                Pat::Invalid(..) => {}
                _ => unreachable!("invalid syntax: Pat: {:?}", pat),
            }
        }

        let pat = if eat!(self, '=') {
            // `=` cannot follow optional parameter.
            if opt {
                self.emit_err(pat.span(), SyntaxError::TS1015);
            }

            let right = self.parse_assignment_expr()?;
            if self.ctx().contains(Context::InDeclare) {
                self.emit_err(span!(self, start), SyntaxError::TS2371);
            }

            AssignPat {
                span: span!(self, start),
                left: Box::new(pat),
                right,
            }
            .into()
        } else {
            pat
        };

        if has_modifier {
            self.emit_err(span!(self, start), SyntaxError::TS2369);
            return Ok(pat);
        }

        Ok(pat)
    }

    pub(super) fn parse_constructor_params(&mut self) -> PResult<Vec<ParamOrTsParamProp>> {
        let mut params = Vec::new();
        let mut rest_span = Span::default();

        while !eof!(self) && !is!(self, ')') {
            if !rest_span.is_dummy() {
                self.emit_err(rest_span, SyntaxError::TS1014);
            }

            let param_start = cur_pos!(self);
            let decorators = parse_decorators(self, false)?;
            let pat_start = cur_pos!(self);

            let mut is_rest = false;
            if eat!(self, "...") {
                is_rest = true;
                let dot3_token = span!(self, pat_start);

                let pat = parse_binding_pat_or_ident(self, false)?;
                let type_ann = if self.input.syntax().typescript() && is!(self, ':') {
                    let cur_pos = cur_pos!(self);
                    Some(parse_ts_type_ann(self, /* eat_colon */ true, cur_pos)?)
                } else {
                    None
                };

                rest_span = span!(self, pat_start);
                let pat = RestPat {
                    span: rest_span,
                    dot3_token,
                    arg: Box::new(pat),
                    type_ann,
                }
                .into();
                params.push(ParamOrTsParamProp::Param(Param {
                    span: span!(self, param_start),
                    decorators,
                    pat,
                }));
            } else {
                params.push(self.parse_constructor_param(param_start, decorators)?);
            }

            if !is!(self, ')') {
                expect!(self, ',');
                if is!(self, ')') && is_rest {
                    self.emit_err(self.input.prev_span(), SyntaxError::CommaAfterRestElement);
                }
            }
        }

        Ok(params)
    }

    fn parse_constructor_param(
        &mut self,
        param_start: BytePos,
        decorators: Vec<Decorator>,
    ) -> PResult<ParamOrTsParamProp> {
        let (accessibility, is_override, readonly) = if self.input.syntax().typescript() {
            let accessibility = self.parse_access_modifier()?;
            (
                accessibility,
                parse_ts_modifier(self, &["override"], false)?.is_some(),
                parse_ts_modifier(self, &["readonly"], false)?.is_some(),
            )
        } else {
            (None, false, false)
        };
        if accessibility.is_none() && !is_override && !readonly {
            let pat = self.parse_formal_param_pat()?;
            Ok(ParamOrTsParamProp::Param(Param {
                span: span!(self, param_start),
                decorators,
                pat,
            }))
        } else {
            let param = match self.parse_formal_param_pat()? {
                Pat::Ident(i) => TsParamPropParam::Ident(i),
                Pat::Assign(a) => TsParamPropParam::Assign(a),
                node => syntax_error!(self, node.span(), SyntaxError::TsInvalidParamPropPat),
            };
            Ok(ParamOrTsParamProp::TsParamProp(TsParamProp {
                span: span!(self, param_start),
                accessibility,
                is_override,
                readonly,
                decorators,
                param,
            }))
        }
    }

    #[allow(dead_code)]
    pub(super) fn parse_setter_param(&mut self, key_span: Span) -> PResult<Param> {
        let params = self.parse_formal_params()?;
        let cnt = params.iter().filter(|p| is_not_this(p)).count();

        if cnt != 1 {
            self.emit_err(key_span, SyntaxError::SetterParam);
        }

        if !params.is_empty() {
            if let Pat::Rest(..) = params[0].pat {
                self.emit_err(params[0].pat.span(), SyntaxError::RestPatInSetter);
            }
        }

        if params.is_empty() {
            syntax_error!(self, SyntaxError::SetterParamRequired);
        }

        Ok(params.into_iter().next().unwrap())
    }

    pub(super) fn parse_formal_params(&mut self) -> PResult<Vec<Param>> {
        let mut params = Vec::new();
        let mut rest_span = Span::default();

        while !eof!(self) && !is!(self, ')') {
            if !rest_span.is_dummy() {
                self.emit_err(rest_span, SyntaxError::TS1014);
            }

            let param_start = cur_pos!(self);
            let decorators = parse_decorators(self, false)?;
            let pat_start = cur_pos!(self);

            let pat = if eat!(self, "...") {
                let dot3_token = span!(self, pat_start);

                let mut pat = parse_binding_pat_or_ident(self, false)?;

                if eat!(self, '=') {
                    let right = self.parse_assignment_expr()?;
                    self.emit_err(pat.span(), SyntaxError::TS1048);
                    pat = AssignPat {
                        span: span!(self, pat_start),
                        left: Box::new(pat),
                        right,
                    }
                    .into();
                }

                let type_ann = if self.input.syntax().typescript() && is!(self, ':') {
                    let cur_pos = cur_pos!(self);
                    let ty = parse_ts_type_ann(self, /* eat_colon */ true, cur_pos)?;
                    Some(ty)
                } else {
                    None
                };

                rest_span = span!(self, pat_start);
                let pat = RestPat {
                    span: rest_span,
                    dot3_token,
                    arg: Box::new(pat),
                    type_ann,
                }
                .into();

                if self.syntax().typescript() && eat!(self, '?') {
                    self.emit_err(self.input.prev_span(), SyntaxError::TS1047);
                    //
                }

                pat
            } else {
                self.parse_formal_param_pat()?
            };
            let is_rest = matches!(pat, Pat::Rest(_));

            params.push(Param {
                span: span!(self, param_start),
                decorators,
                pat,
            });

            if !is!(self, ')') {
                expect!(self, ',');
                if is_rest && is!(self, ')') {
                    self.emit_err(self.input.prev_span(), SyntaxError::CommaAfterRestElement);
                }
            }
        }

        Ok(params)
    }

    pub(super) fn parse_unique_formal_params(&mut self) -> PResult<Vec<Param>> {
        // FIXME: This is wrong
        self.parse_formal_params()
    }
}
