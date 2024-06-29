a || b ?? c || d

/**
 * `||` cannot be combined with `??` without parens. We assume `??` is lower
 * precedence and recover by pretending the parens were there:
 *
 *   a || b ...
 *   ^^^^^^ ok, a LogicalOrExpression
 *   a || b ?? ...
 *          ^^ error. to recover, give ?? lower precedence than ||:
 *   (a || b) ?? c || ...
 *                 ^^ error. to recover, give || higher precedence than ??:
 *   (a || b) ?? (c || d)
 */
