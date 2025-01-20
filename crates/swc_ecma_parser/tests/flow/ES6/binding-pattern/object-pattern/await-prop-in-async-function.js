/*
 * When [+Await], `await` isn't a valid IdentifierReference.
 * #prod-AssignmentProperty -> #prod-IdentifierReference
 */
(async function() { 0, { await } = {}; });
