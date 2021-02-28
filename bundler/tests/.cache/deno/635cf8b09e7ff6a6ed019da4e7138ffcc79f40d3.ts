// Loaded from https://deno.land/x/denodb@v1.0.18/lib/helpers/results.ts


import type { ModelSchema } from "../model.ts";
import type { Values } from "../data-types.ts";

/** Transform a plain record object to a given model schema. */
export function formatResultToModelInstance(
  Schema: ModelSchema,
  fields: Values,
) {
  const instance = new Schema();

  for (const field in fields) {
    (instance as any)[Schema.formatFieldToClient(field) as string] =
      fields[field];
  }

  return instance;
}
