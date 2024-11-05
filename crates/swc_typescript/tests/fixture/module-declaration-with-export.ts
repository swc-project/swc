export namespace OnlyOneExport {
  export const a = 0;
}


export namespace TwoExports {
  export const c = 0;
  export const a:  typeof c = 0;
}


export namespace OneExportReferencedANonExported {
  const c = 0;
  export const a: typeof c = c;
}

declare module "OnlyOneExport" {
  export const a = 0;
}


declare module "TwoExports" {
  export const c = 0;
  export const a:  typeof c;
}


declare module "OneExportReferencedANonExported" {
  const c = 0;
  export const a: typeof c;
}

declare global {
  const c = 0;
  export const a: typeof c;
}