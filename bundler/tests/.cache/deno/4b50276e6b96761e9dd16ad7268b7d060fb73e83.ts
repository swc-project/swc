// Loaded from https://deno.land/x/dnit@dnit-v1.11.0/adl-gen/runtime/json.ts


import type {DeclResolver,ATypeExpr} from "./adl.ts";
import type * as AST from "./sys/adlast.ts";
//import * as b64 from 'base64-js';
import {isVoid, isEnum, scopedNamesEqual} from "./utils.ts";

/** A type for json serialised values */

export type Json = {} | null;
export type JsonObject = { [member: string]: Json };
export type JsonArray = Json[];

function asJsonObject(jv: Json): JsonObject | undefined {
  if (jv instanceof Object && !(jv instanceof Array)) {
    return jv as JsonObject;
  }
  return undefined;
}

function asJsonArray(jv: Json): JsonArray | undefined{
  if(jv instanceof Array) {
    return jv as JsonArray;
  }
  return undefined;
}

/** A type alias for values of an Unknown type */
type Unknown = {}|null;

/**
 * A JsonBinding is a de/serialiser for a give ADL type
 */
export interface JsonBinding<T> {
  typeExpr : AST.TypeExpr;

  // Convert a value of type T to Json
  toJson (t : T): Json;

  // Parse a json blob into a value of type T. Throws
  // JsonParseExceptions on failure.
  fromJson(json : Json) : T;

  // Variant of fromJson that throws Errors on failure
  fromJsonE(json : Json) : T;
};

/**
 * Construct a JsonBinding for an arbitrary type expression
 */
export function createJsonBinding<T>(dresolver : DeclResolver, texpr : ATypeExpr<T>) : JsonBinding<T> {
  const jb0 = buildJsonBinding(dresolver, texpr.value, {}) as JsonBinding0<T>;
  function fromJsonE(json :Json): T {
    try {
      return jb0.fromJson(json);
    } catch (e) {
      throw mapJsonException(e);
    }
  }
  return {typeExpr : texpr.value, toJson:jb0.toJson, fromJson:jb0.fromJson, fromJsonE};
};

/**
 * Interface for json parsing exceptions.
 * Any implementation should properly show the parse error tree.
 *
 *  @interface JsonParseException
 */
export interface JsonParseException {
  kind: 'JsonParseException';
  getMessage(): string;
  pushField(fieldName: string): void;
  pushIndex(index: number): void;
  toString(): string;
}

// Map a JsonException to an Error value
export function mapJsonException(exception:{}): {} {
  if (exception && (exception as {kind:string})['kind'] == "JsonParseException") {
    const jserr: JsonParseException = exception as JsonParseException;
    return new Error(jserr.getMessage());
  } else {
    return exception;
  }
}

/** Convenience function for generating a json parse exception.
 *  @param {string} message - Exception message.
 */
export function jsonParseException(message: string): JsonParseException {
  const context: string[] = [];
  let createContextString: () => string = () => {
    const rcontext: string[] = context.slice(0);
    rcontext.push('$');
    rcontext.reverse();
    return rcontext.join('.');
  };
  return {
    kind: 'JsonParseException',
    getMessage(): string {
      return message + ' at ' + createContextString();
    },
    pushField(fieldName: string): void {
      context.push(fieldName);
    },
    pushIndex(index: number): void {
      context.push('[' + index + ']');
    },
    toString(): string {
      return this.getMessage();
    }
  };
}

/**
 * Check if a javascript error is of the json parse exception type.
 * @param exception The exception to check.
 */
export function isJsonParseException(exception: {}): exception is JsonParseException {
  return (<JsonParseException> exception).kind === 'JsonParseException';
}

interface JsonBinding0<T> {
  toJson (t : T): Json;
  fromJson(json : Json) : T;
};

interface BoundTypeParams {
  [key: string]: JsonBinding0<Unknown>;
}

function buildJsonBinding(dresolver : DeclResolver, texpr : AST.TypeExpr, boundTypeParams : BoundTypeParams) : JsonBinding0<Unknown> {
  if (texpr.typeRef.kind === "primitive") {
    return primitiveJsonBinding(dresolver, texpr.typeRef.value, texpr.parameters, boundTypeParams);
  } else if (texpr.typeRef.kind === "reference") {
    const ast = dresolver(texpr.typeRef.value);
    if (ast.decl.type_.kind === "struct_") {
      return structJsonBinding(dresolver, ast.decl.type_.value, texpr.parameters, boundTypeParams);
    } else if (ast.decl.type_.kind === "union_") {
      const union = ast.decl.type_.value;
      if (isEnum(union)) {
        return enumJsonBinding(dresolver, union, texpr.parameters, boundTypeParams);
      } else {
        return unionJsonBinding(dresolver, union, texpr.parameters, boundTypeParams);
      }
    } else if (ast.decl.type_.kind === "newtype_") {
      return newtypeJsonBinding(dresolver, ast.decl.type_.value, texpr.parameters, boundTypeParams);
    } else if (ast.decl.type_.kind === "type_") {
      return typedefJsonBinding(dresolver, ast.decl.type_.value, texpr.parameters, boundTypeParams);
    }
  } else if (texpr.typeRef.kind === "typeParam") {
    return boundTypeParams[texpr.typeRef.value];
  }
  throw new Error("buildJsonBinding : unimplemented ADL type");
};

function primitiveJsonBinding(dresolver : DeclResolver, ptype : string, params : AST.TypeExpr[], boundTypeParams : BoundTypeParams ) : JsonBinding0<Unknown> {
  if      (ptype === "String")     { return identityJsonBinding("a string", (v) => typeof(v) === 'string'); }
  else if (ptype === "Int8")       { return identityJsonBinding("a number", (v) => typeof(v) === 'number'); }
  else if (ptype === "Void")       { return identityJsonBinding("a null", (v) => v === null); }
  else if (ptype === "Bool")       { return identityJsonBinding("a bool", (v) => typeof(v) === 'boolean'); }
  else if (ptype === "Int8")       { return identityJsonBinding("a number", (v) => typeof(v) === 'number'); }
  else if (ptype === "Int16")      { return identityJsonBinding("a number", (v) => typeof(v) === 'number'); }
  else if (ptype === "Int32")      { return identityJsonBinding("a number", (v) => typeof(v) === 'number'); }
  else if (ptype === "Int64")      { return identityJsonBinding("a number", (v) => typeof(v) === 'number'); }
  else if (ptype === "Word8")      { return identityJsonBinding("a number", (v) => typeof(v) === 'number'); }
  else if (ptype === "Word16")     { return identityJsonBinding("a number", (v) => typeof(v) === 'number'); }
  else if (ptype === "Word32")     { return identityJsonBinding("a number", (v) => typeof(v) === 'number'); }
  else if (ptype === "Word64")     { return identityJsonBinding("a number", (v) => typeof(v) === 'number'); }
  else if (ptype === "Float")      { return identityJsonBinding("a number", (v) => typeof(v) === 'number'); }
  else if (ptype === "Double")     { return identityJsonBinding("a number", (v) => typeof(v) === 'number'); }
  else if (ptype === "Json")       { return identityJsonBinding("a json value", (_v) => true); }
  else if (ptype === "Bytes")      { return bytesJsonBinding(); }
  else if (ptype === "Vector")     { return vectorJsonBinding(dresolver, params[0], boundTypeParams); }
  else if (ptype === "StringMap")  { return stringMapJsonBinding(dresolver, params[0], boundTypeParams); }
  else if (ptype === "Nullable")   { return nullableJsonBinding(dresolver, params[0], boundTypeParams); }
  else throw new Error("Unimplemented json binding for primitive " + ptype);
};

function identityJsonBinding<T>(expected : string, predicate : (json : Json) => boolean) : JsonBinding0<T>{

  function toJson(v : T) : Json {
    return (v as Unknown as Json);
  }

  function fromJson(json : Json) : T {
    if( !predicate(json)) {
      throw jsonParseException("expected " + expected);
    }
    return json as Unknown as T;
  }

  return {toJson, fromJson};
}

function bytesJsonBinding() : JsonBinding0<Uint8Array> {
  function toJson(v : Uint8Array) : Json {
    //return b64.fromByteArray(v);
    throw new Error("bytesJsonBinding not implemented");
  }

  function fromJson(json : Json) : Uint8Array {
    if (typeof(json) != 'string') {
      throw jsonParseException('expected a string');
    }
    //return b64.toByteArray(json);
    throw new Error("bytesJsonBinding not implemented");
  }

  return {toJson, fromJson};
}

function vectorJsonBinding(dresolver : DeclResolver, texpr : AST.TypeExpr, boundTypeParams : BoundTypeParams) : JsonBinding0<Unknown[]> {
  const elementBinding = once(() => buildJsonBinding(dresolver, texpr, boundTypeParams));

  function toJson(v : Unknown[]) : Json {
    return v.map(elementBinding().toJson);
  }

  function fromJson(json : Json) : Unknown[] {
      const jarr = asJsonArray(json);
      if (jarr == undefined) {
        throw jsonParseException('expected an array');
      }
      let result : Unknown[] = [];
      jarr.forEach( (eljson:Json,i:number) => {
        try {
          result.push(elementBinding().fromJson(eljson));
        } catch(e) {
          if (isJsonParseException(e)) {
            e.pushIndex(i);
          }
          throw e;
        }
      });
    return result;
  }

  return {toJson, fromJson};
}

type StringMap<T> = {[key:string]: T};

function stringMapJsonBinding(dresolver : DeclResolver, texpr : AST.TypeExpr, boundTypeParams : BoundTypeParams) : JsonBinding0<StringMap<Unknown>> {
  const elementBinding = once(() => buildJsonBinding(dresolver, texpr, boundTypeParams));

  function toJson(v : StringMap<Unknown>) : Json {
    const result: JsonObject = {};
    for (let k in v) {
      result[k] = elementBinding().toJson(v[k]);
    }
    return result;
  }

  function fromJson(json : Json) : StringMap<Unknown> {
    const jobj = asJsonObject(json);
    if (!jobj) {
      throw jsonParseException('expected an object');
    }
    let result: JsonObject  = {};
    for (let k in jobj) {
      try {
        result[k] = elementBinding().fromJson(jobj[k]);
      } catch(e) {
        if (isJsonParseException(e)) {
          e.pushField(k);
        }
      }
    }
    return result;
  }

  return {toJson, fromJson};
}

function nullableJsonBinding(dresolver : DeclResolver, texpr : AST.TypeExpr, boundTypeParams : BoundTypeParams) : JsonBinding0<Unknown> {
  const elementBinding = once(() => buildJsonBinding(dresolver, texpr, boundTypeParams));

  function toJson(v : Unknown) : Json {
    if (v === null) {
      return null;
    }
    return elementBinding().toJson(v);
  }

  function fromJson(json : Json) : Unknown {
    if (json === null) {
      return null;
    }
    return elementBinding().fromJson(json);
  }

  return {toJson,fromJson};
}

interface StructFieldDetails {
  field : AST.Field,
  jsonBinding : () => JsonBinding0<Unknown>,
  buildDefault : () => { value : Unknown } | null
};

function structJsonBinding(dresolver : DeclResolver, struct : AST.Struct, params : AST.TypeExpr[], boundTypeParams : BoundTypeParams ) : JsonBinding0<Unknown> {
  const newBoundTypeParams = createBoundTypeParams(dresolver, struct.typeParams, params, boundTypeParams);
  const fieldDetails : StructFieldDetails[] = [];
  struct.fields.forEach( (field) => {
    let buildDefault = once( () => {
      if (field.default.kind === "just")  {
        const json = field.default.value;
        return { 'value' : buildJsonBinding(dresolver, field.typeExpr, newBoundTypeParams).fromJson(json)};
      } else {
        return null;
      }
    });

    fieldDetails.push( {
      field : field,
      jsonBinding : once(() => buildJsonBinding(dresolver, field.typeExpr, newBoundTypeParams)),
      buildDefault : buildDefault,
    });
  });

  function toJson(v0: Unknown) : Json {
    const v = v0 as {[key:string]:Unknown};
    const json: JsonObject = {};
    fieldDetails.forEach( (fd) => {
      json[fd.field.serializedName] = fd.jsonBinding().toJson(v && v[fd.field.name]);
    });
    return json;
  }

  function fromJson(json: Json): Unknown {
    const jobj = asJsonObject(json);
    if (!jobj) {
      throw jsonParseException("expected an object");
    }

    const v : {[member:string]: Unknown} = {};
    fieldDetails.forEach( (fd) => {
      if (jobj[fd.field.serializedName] === undefined) {
        const defaultv = fd.buildDefault();
        if (defaultv === null)  {
          throw jsonParseException("missing struct field " + fd.field.serializedName );
        } else {
          v[fd.field.name] = defaultv.value;
        }
      } else {
        try {
          v[fd.field.name] = fd.jsonBinding().fromJson(jobj[fd.field.serializedName]);
        } catch(e) {
          if (isJsonParseException(e)) {
            e.pushField(fd.field.serializedName);
          }
          throw e;
        }
      }
    });
    return v;
  }

  return {toJson, fromJson};
}

function enumJsonBinding(_dresolver : DeclResolver, union : AST.Union, _params : AST.TypeExpr[], _boundTypeParams : BoundTypeParams ) : JsonBinding0<Unknown> {
  const fieldSerializedNames : string[] = [];
  const fieldNumbers : {[key:string]:number} = {};
  union.fields.forEach( (field,i) => {
    fieldSerializedNames.push(field.serializedName);
    fieldNumbers[field.serializedName] = i;
  });

  function toJson(v :Unknown) : Json {
    return fieldSerializedNames[v as number];
  }

  function fromJson(json : Json) : Unknown {
    if (typeof(json) !== 'string') {
      throw jsonParseException("expected a string for enum");
    }
    const result = fieldNumbers[json as string];
    if (result === undefined) {
      throw jsonParseException("invalid string for enum: " + json);
    }
    return result;
  }

  return {toJson, fromJson};
}

interface FieldDetails {
  field : AST.Field;
  isVoid : boolean;
  jsonBinding : () => JsonBinding0<Unknown>;
};

function unionJsonBinding(dresolver : DeclResolver, union : AST.Union, params : AST.TypeExpr[], boundTypeParams : BoundTypeParams ) : JsonBinding0<Unknown> {


  const newBoundTypeParams = createBoundTypeParams(dresolver, union.typeParams, params, boundTypeParams);
  const detailsByName : {[key: string]: FieldDetails} = {};
  const detailsBySerializedName : {[key: string]: FieldDetails} = {};
  union.fields.forEach( (field) => {
    const details = {
      field : field,
      isVoid : isVoid(field.typeExpr),
      jsonBinding : once(() => buildJsonBinding(dresolver, field.typeExpr, newBoundTypeParams))
    };
    detailsByName[field.name] = details;
    detailsBySerializedName[field.serializedName] = details;
  });

  function toJson(v0 : Unknown) : Json {
    const v = v0 as {kind:string, value:Unknown};
    const details = detailsByName[v.kind];
    if (details.isVoid) {
      return details.field.serializedName;
    } else {
      const result: JsonObject = {};
      result[details.field.serializedName] = details.jsonBinding().toJson(v.value);
      return result;
    }
  }

  function lookupDetails(serializedName : string) {
    let details = detailsBySerializedName[serializedName];
    if (details === undefined) {
      throw jsonParseException("invalid union field " + serializedName);
    }
    return details;
  }

  function fromJson(json : Json) : Unknown {
    if (typeof(json) === "string") {
      let details = lookupDetails(json);
      if (!details.isVoid) {
        throw jsonParseException("union field " + json + "needs an associated value");
      }
      return { kind : details.field.name };
    }
    const jobj = asJsonObject(json);
    if (jobj) {
      for (let k in jobj) {
        let details = lookupDetails(k);
        try {
          return {
            kind : details.field.name,
            value : details.jsonBinding().fromJson(jobj[k])
          }
        } catch(e) {
          if (isJsonParseException(e)) {
            e.pushField(k);
          }
          throw e;
        }
      }
      throw jsonParseException("union without a property");
    } else {
      throw jsonParseException("expected an object or string");
    }
  }

  return {toJson, fromJson};
}

function newtypeJsonBinding(dresolver : DeclResolver, newtype : AST.NewType, params : AST.TypeExpr[], boundTypeParams : BoundTypeParams ) : JsonBinding0<Unknown> {
  const newBoundTypeParams = createBoundTypeParams(dresolver, newtype.typeParams, params, boundTypeParams);
  return buildJsonBinding(dresolver, newtype.typeExpr, newBoundTypeParams);
}

function typedefJsonBinding(dresolver : DeclResolver, typedef : AST.TypeDef, params : AST.TypeExpr[], boundTypeParams : BoundTypeParams ) : JsonBinding0<Unknown> {
  const newBoundTypeParams = createBoundTypeParams(dresolver, typedef.typeParams, params, boundTypeParams);
  return buildJsonBinding(dresolver, typedef.typeExpr, newBoundTypeParams);
}

function createBoundTypeParams(dresolver : DeclResolver, paramNames : string[], paramTypes : AST.TypeExpr[], boundTypeParams : BoundTypeParams) : BoundTypeParams
{
  let result : BoundTypeParams = {};
  paramNames.forEach( (paramName,i) => {
    result[paramName] = buildJsonBinding(dresolver,paramTypes[i], boundTypeParams);
  });
  return result;
}

/**
 * Helper function that takes a thunk, and evaluates it only on the first call. Subsequent
 * calls return the previous value
 */
function once<T>(run : () => T) : () => T {
  let result : T | null = null;
  return () => {
    if(result === null) {
      result = run();
    }
    return result;
  };
}

/**
 * Get the value of an annotation of type T
 */
export function getAnnotation<T>(jb: JsonBinding<T>, annotations: AST.Annotations): T | undefined {
  if (jb.typeExpr.typeRef.kind != 'reference') {
    return undefined;
  }
  const annScopedName :AST.ScopedName = jb.typeExpr.typeRef.value;
  const ann = annotations.find(el => scopedNamesEqual(el.v1, annScopedName));
  if (ann === undefined) {
    return undefined;
  }
  return jb.fromJsonE(ann.v2);
}
