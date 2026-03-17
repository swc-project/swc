/*
 * When [+Yield], `yield` isn't a valid IdentifierReference.
 * #prod-AssignmentProperty -> #prod-IdentifierReference
 */
(function*() { 0, { yield } = {}; });
