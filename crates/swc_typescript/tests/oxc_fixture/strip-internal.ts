/*
@internal
*/
class StripInternalClass {
  public test() {
    console.log("test");
  }
}

class StripInternalClassFields {
  /**
   * @internal
   */
  internalProperty: string = "internal";

  // @internal
  internalMethod(): void {}
}

/**
@internal
*/
function stripInternalFunction() {
  console.log("test");
}

export { stripInternalFunction, StripInternalClass, StripInternalClassFields };

/**
@internal
*/
export function stripInternalExportedFunction() {
  console.log("test");
}

/**
@internal*/
export const stripInternalExportedConst = "test";

/**
@internal*/
export interface StripInternalExportedInterface {}

export interface StripInternalInterfaceSignatures {
  /**
   * @internal
   */
  internalMethod(): void;
  /**
   * @internal
   */
  internalProperty: number;
  /**@internal */
  new (): any;
}

export type StripInternalTypeSignatures = {
  /**
   * @internal
   */
  internalMethod(): void;
  /**
   * @internal
   */
  internalProperty: number;
  /**@internal */
  new (): any;
};

export namespace StripInternalNamespaceInner {
  /**
   * @internal
   */
  export function internalFunction() {
    console.log("test");
  }
}

/**
 * @internal
 */
export namespace StripInternalNamespace {}