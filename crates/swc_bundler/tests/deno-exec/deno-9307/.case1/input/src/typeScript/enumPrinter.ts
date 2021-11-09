import { Enums } from "../types.d.ts";
import { upperSnakeCase } from "../utils/upperSnakeCase.ts";

const printEnum = (name: string, values: string[]): string =>
  `export enum ${name} {
${values.map((v) => `  ${upperSnakeCase(v)} = "${v}",`).join(`\n`)}
}`;

export const printEnums = (enums: Enums): string =>
  Array.from(enums.entries()).map(([name, values]) => printEnum(name, values))
    .join(`\n`);
