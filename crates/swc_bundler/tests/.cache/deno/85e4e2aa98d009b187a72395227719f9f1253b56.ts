// Loaded from https://deno.land/x/denodb@v1.0.18/lib/translators/translator.ts


import type { Query, QueryDescription } from "../query-builder.ts";
import type { FieldAlias } from "../data-types.ts";

/** Translator interface for translating `QueryDescription` objects to regular queries. */
export class Translator {
  /** Translate a query description into a regular query. */
  translateToQuery(query: QueryDescription): Query {
    return "";
  }

  /** Format a field to the database format, e.g. `userName` to `user_name`. */
  formatFieldNameToDatabase(
    fieldName: string | FieldAlias,
  ): string | FieldAlias {
    return fieldName;
  }
}
