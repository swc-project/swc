// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/language/location.js


/**
 * Represents a location in a Source.
 */

/**
 * Takes a Source and a UTF-8 character offset, and returns the corresponding
 * line and column as a SourceLocation.
 */
export function getLocation(source, position) {
  const lineRegexp = /\r\n|[\n\r]/g;
  let line = 1;
  let column = position + 1;
  let match;

  while ((match = lineRegexp.exec(source.body)) && match.index < position) {
    line += 1;
    column = position + 1 - (match.index + match[0].length);
  }

  return {
    line,
    column
  };
}