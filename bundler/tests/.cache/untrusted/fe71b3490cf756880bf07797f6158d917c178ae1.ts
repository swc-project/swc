// Loaded from https://raw.githubusercontent.com/colinhacks/zod/654680afc2ede388e71e09104eac5a0088fe3207/deno/lib/helpers/errorUtil.ts


export namespace errorUtil {
  export type ErrMessage = string | { message?: string };
  export const errToObj = (message?: ErrMessage) =>
    typeof message === "string" ? { message } : message || {};
}
