---
swc_core: minor
swc_ecma_lexer: minor
swc_ecma_parser: minor
swc_ecma_transforms_react: patch
---

fix(es/parser): Preserve invalid JSX numeric entities as literal text and safely decode lone and paired surrogates.

Expose `jsx::decode_jsx_entity` and reuse it in both lexers and the React transform to preserve entity-derived whitespace and prevent entity mask panics with long references and invalid sequences.

Add `read_jsx_entity_code_point` to the legacy lexer for consumers that need to retain lone surrogates.
