/*
 * When [+Yield], `yield` isn't a valid IdentifierReference.
 * #prod-AssignmentProperty -> #prod-IdentifierReference
 */
"use strict";
(function*() { 0, { yield } = {}; });
