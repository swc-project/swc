// Loaded from https://deno.land/x/dnit@dnit-v1.11.0/adl-gen/runtime/adl.ts


import type * as AST from "./sys/adlast.ts";
import type * as utils from "./utils.ts";

export type ScopedName = AST.ScopedName;
export type ScopedDecl = AST.ScopedDecl;
export type ATypeRef<_T> = {value: AST.TypeRef};
export type ATypeExpr<_T> = {value : AST.TypeExpr};

/**
 * A function to obtain details on a declared type.
 */
export interface DeclResolver {
    (decl : AST.ScopedName): AST.ScopedDecl;
};

export function declResolver(...astMaps : ({[key:string] : AST.ScopedDecl})[]) {
  const astMap :  {[key:string] : AST.ScopedDecl} = {};
  for (let map of astMaps) {
    for (let scopedName in map) {
      astMap[scopedName] = map[scopedName];
    }
  }

  function resolver(scopedName : AST.ScopedName) : AST.ScopedDecl {
    const scopedNameStr = scopedName.moduleName + "." + scopedName.name;
    const result = astMap[scopedNameStr];
    if (result === undefined) {
      throw new Error("Unable to resolve ADL type " + scopedNameStr);
    }
    return result;
  }

  return resolver;
}

type Unknown = {} | null;
type Json = {} | null;

/* Type expressions for primitive types */

function texprPrimitive(ptype: string): ATypeExpr<Unknown> {
  return {
    value: {
      typeRef: { kind: "primitive", value: ptype },
      parameters: []
    }
  };
};

function texprPrimitive1(ptype: string, etype: ATypeExpr<Unknown>): ATypeExpr<Unknown> {
  return {
    value: {
      typeRef: { kind: "primitive", value: ptype },
      parameters: [etype.value]
    }
  };
};

export function texprVoid() : ATypeExpr<null> {return texprPrimitive("Void");}
export function texprBool() : ATypeExpr<boolean> {return texprPrimitive("Bool");}
export function texprInt8() : ATypeExpr<number> {return texprPrimitive("Int8");}
export function texprInt16() : ATypeExpr<number> {return texprPrimitive("Int16");}
export function texprInt32() : ATypeExpr<number> {return texprPrimitive("Int32");}
export function texprInt64() : ATypeExpr<number> {return texprPrimitive("Int64");}
export function texprWord8() : ATypeExpr<number> {return texprPrimitive("Word8");}
export function texprWord16() : ATypeExpr<number> {return texprPrimitive("Word16");}
export function texprWord32() : ATypeExpr<number> {return texprPrimitive("Word32");}
export function texprWord64() : ATypeExpr<number> {return texprPrimitive("Word64");}
export function texprFloat() : ATypeExpr<number> {return texprPrimitive("Float");}
export function texprDouble() : ATypeExpr<number> {return texprPrimitive("Double");}
export function texprJson() : ATypeExpr<Json> {return texprPrimitive("Json");}
export function texprByteVector() : ATypeExpr<Uint8Array> {return texprPrimitive("ByteVector");}
export function texprString() : ATypeExpr<string> {return texprPrimitive("String");}

export function texprVector<T>(etype: ATypeExpr<T>) : ATypeExpr<T[]> {
  return texprPrimitive1("Vector", etype);
}

export function texprStringMap<T>(etype: ATypeExpr<T>) : ATypeExpr<{[key:string]:T}> {
  return texprPrimitive1("StringMap", etype);
}

export function texprNullable<T>(etype: ATypeExpr<T>) : ATypeExpr<T|null> {
  return texprPrimitive1("Nullable", etype);
}
// "Flavoured" nominal typing.
// https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/
export type Flavored0<A, Name> = utils.Flavored0<A, Name>;
export type Flavored1<A, Name, T> = utils.Flavored1<A, Name, T>;
export type Flavored2<A, Name, T,U> = utils.Flavored2<A, Name, T,U>;
export type Flavored3<A, Name, T,U,V> = utils.Flavored3<A, Name, T,U,V>;
