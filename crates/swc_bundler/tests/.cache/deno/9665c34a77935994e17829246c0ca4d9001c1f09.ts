// Loaded from https://deno.land/x/dnit@dnit-v1.11.0/adl-gen/runtime/utils.ts


import type * as AST from "./sys/adlast.ts";

export function isEnum(union : AST.Union) : boolean {
  for (let field of union.fields) {
    if (!isVoid(field.typeExpr)) {
      return false;
    }
  }
  return true;
}

export function isVoid(texpr : AST.TypeExpr) : boolean {
  if (texpr.typeRef.kind === "primitive") {
    return texpr.typeRef.value === "Void";
  }
  return false;
}

export function typeExprsEqual(texpr1 : AST.TypeExpr, texpr2 : AST.TypeExpr) : boolean {
  if (!typeRefsEqual(texpr1.typeRef, texpr2.typeRef)) {
    return false;
  }
  if (texpr1.parameters.length != texpr2.parameters.length) {
    return false;
  }
  for (let i = 0; i < texpr1.parameters.length; i++) {
    if(!typeExprsEqual(texpr1.parameters[i], texpr2.parameters[i])) {
      return false;
    }
  }
  return true;
}

export function typeRefsEqual(tref1 : AST.TypeRef, tref2 : AST.TypeRef) : boolean {
  if (tref1.kind === "primitive" && tref2.kind === "primitive") {
    return tref1.value === tref2.value;
  } else if (tref1.kind === "typeParam" && tref2.kind === "typeParam") {
    return tref1.value === tref2.value;
  } else if (tref1.kind === "reference" && tref2.kind === "reference") {
    return scopedNamesEqual(tref1.value, tref2.value);
  }
  return false;
}

export function scopedNamesEqual(sn1: AST.ScopedName, sn2: AST.ScopedName): boolean {
  return sn1.moduleName === sn2.moduleName && sn1.name === sn2.name;
}

function typeExprToStringImpl(te: AST.TypeExpr, withScopedNames: boolean) : string {
  let result = "";
  if (te.typeRef.kind == "primitive") {
    result = te.typeRef.value;
  } else if (te.typeRef.kind == "typeParam") {
    result = te.typeRef.value;
  } else if (te.typeRef.kind == "reference") {
    result = withScopedNames
      ? te.typeRef.value.moduleName + "." + te.typeRef.value.name
      : te.typeRef.value.name;
  }
  if (te.parameters.length > 0) {
    result = result + "<" + te.parameters.map(p => typeExprToStringImpl(p, withScopedNames)) + ">";
  }
  return result;
}

/* Convert a type expression to a string, with fully scoped names */

export function typeExprToString(te: AST.TypeExpr) : string {
  return typeExprToStringImpl(te, true);
}

/* Convert a type expression to a string, with unscoped names */

export function typeExprToStringUnscoped(te: AST.TypeExpr) : string {
  return typeExprToStringImpl(te, false);
}

// "Flavoured" nominal typing.
// https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/
const symS = Symbol();
const symT = Symbol();
const symU = Symbol();
const symV = Symbol();

/// Zero ADL type params - literal string type Name (fully scoped module name)
/// eg for 'newtype X = string' -> 'type X = Flavouring0<"X">;'
type Flavoring0<Name> = {
  readonly [symS]?: Name;
}

/// 1 ADL type param
/// eg for 'newtype X<T> = string' -> 'type X<T> = Flavouring1<"X",T>;'
type Flavoring1<Name, T> = Flavoring0<Name> & {
  readonly [symT]?: T;
}

/// 2 ADL type params
/// eg for 'newtype X<T,U> = string' -> 'type X<T,U> = Flavouring2<"X",T,U>;'
type Flavoring2<Name,T,U> = Flavoring1<Name, T> & {
  readonly [symU]?: U;
}

/// 3 ADL type params
/// eg for 'newtype X<T,U,V> = string' -> 'type X<T,U,V> = Flavouring3<"X",T,U,V>;'
type Flavoring3<Name,T,U,V> = Flavoring2<Name, T,U> & {
  readonly [symV]?: V;
}
export type Flavored0<A, Name> = A & Flavoring0<Name>;
export type Flavored1<A, Name, T> = A & Flavoring1<Name, T>;
export type Flavored2<A, Name, T,U> = A & Flavoring2<Name, T,U>;
export type Flavored3<A, Name, T,U,V> = A & Flavoring3<Name, T,U,V>;
