// Loaded from https://deno.land/x/oak@v6.3.1/body.ts


// Copyright 2018-2020 the oak authors. All rights reserved. MIT license.

import { assert } from "./deps.ts";
import { httpErrors } from "./httpError.ts";
import { isMediaType } from "./isMediaType.ts";
import { FormDataReader } from "./multipart.ts";
import type { ServerRequest } from "./types.d.ts";

export type BodyType =
  | "form"
  | "form-data"
  | "json"
  | "text"
  | "raw"
  | "reader"
  | "undefined";

// deno-lint-ignore no-explicit-any
export type BodyJson = { type: "json"; readonly value: Promise<any> };
export type BodyForm = {
  type: "form";
  readonly value: Promise<URLSearchParams>;
};
export type BodyFormData = {
  type: "form-data";
  readonly value: FormDataReader;
};
export type BodyText = { type: "text"; readonly value: Promise<string> };
export type BodyRaw = { type: "raw"; readonly value: Promise<Uint8Array> };
export type BodyUndefined = { type: "undefined"; readonly value: undefined };

export type BodyReader = { type: "reader"; readonly value: Deno.Reader };

export type Body =
  | BodyJson
  | BodyForm
  | BodyFormData
  | BodyText
  | BodyRaw
  | BodyUndefined;

export interface BodyOptions<T extends BodyType = BodyType> {
  /** Instead of utilizing the content type of the request, return the body
   * as the type specified. */
  type?: T;
  /** A map of extra content types to determine how to parse the body. */
  contentTypes?: {
    /** Content types listed here will always return a "raw" Uint8Array. */
    raw?: string[];
    /** Content types listed here will be parsed as a JSON string. */
    json?: string[];
    /** Content types listed here will be parsed as form data and return
       * `URLSearchParameters` as the value of the body. */
    form?: string[];
    /** Content types listed here will be parsed as from data and return a
       * `FormDataBody` interface as the value of the body. */
    formData?: string[];
    /** Content types listed here will be parsed as text. */
    text?: string[];
  };
}

export interface BodyContentTypes {
  json?: string[];
  form?: string[];
  text?: string[];
}

const defaultBodyContentTypes = {
  json: ["json", "application/*+json", "application/csp-report"],
  form: ["urlencoded"],
  formData: ["multipart"],
  text: ["text"],
};

const decoder = new TextDecoder();

export class RequestBody {
  #body: Deno.Reader;
  #formDataReader?: FormDataReader;
  #has?: boolean;
  #headers: Headers;
  #readAllBody?: Promise<Uint8Array>;
  #type?: "form-data" | "raw" | "reader" | "undefined";

  #valuePromise = () => {
    return this.#readAllBody ?? (this.#readAllBody = Deno.readAll(this.#body));
  };

  constructor(request: ServerRequest) {
    const { body, headers } = request;
    this.#body = body;
    this.#headers = headers;
  }

  get({ type, contentTypes }: BodyOptions): Body | BodyReader {
    if (type === "reader" && this.#type && this.#type !== "reader") {
      throw new TypeError(
        "Body already consumed and cannot be returned as a reader.",
      );
    }
    if (type === "form-data" && this.#type && this.#type !== "form-data") {
      throw new TypeError(
        "Body already consumed and cannot be returned as form data.",
      );
    }
    if (this.#type === "reader" && type !== "reader") {
      throw new TypeError(
        "Body already consumed as a reader and can only be returned as a reader.",
      );
    }
    if (this.#type === "form-data" && type !== "form-data") {
      throw new TypeError(
        "Body already consumed as form data and can only be returned as form data.",
      );
    }
    if (type && contentTypes) {
      throw new TypeError(
        `"type" and "contentTypes" cannot be specified at the same time`,
      );
    }
    if (type === "reader") {
      this.#type = "reader";
      return { type, value: this.#body };
    }
    if (!this.has()) {
      this.#type = "undefined";
    } else if (!this.#type) {
      const encoding = this.#headers.get("content-encoding") ?? "identity";
      if (encoding !== "identity") {
        throw new httpErrors.UnsupportedMediaType(
          `Unsupported content-encoding: ${encoding}`,
        );
      }
    }
    if (this.#type === "undefined") {
      if (type) {
        throw new TypeError(
          `Body is undefined and cannot be returned as "${type}".`,
        );
      }
      return { type: "undefined", value: undefined };
    }
    if (!type) {
      const contentType = this.#headers.get("content-type");
      assert(contentType);
      contentTypes = contentTypes ?? {};
      const contentTypesJson = [
        ...defaultBodyContentTypes.json,
        ...(contentTypes.json ?? []),
      ];
      const contentTypesForm = [
        ...defaultBodyContentTypes.form,
        ...(contentTypes.form ?? []),
      ];
      const contentTypesFormData = [
        ...defaultBodyContentTypes.formData,
        ...(contentTypes.formData ?? []),
      ];
      const contentTypesText = [
        ...defaultBodyContentTypes.text,
        ...(contentTypes.text ?? []),
      ];
      if (contentTypes.raw && isMediaType(contentType, contentTypes.raw)) {
        type = "raw";
      } else if (isMediaType(contentType, contentTypesJson)) {
        type = "json";
      } else if (isMediaType(contentType, contentTypesForm)) {
        type = "form";
      } else if (isMediaType(contentType, contentTypesFormData)) {
        type = "form-data";
      } else if (isMediaType(contentType, contentTypesText)) {
        type = "text";
      } else {
        type = "raw";
      }
    }
    assert(type);
    let value: () => Body["value"];
    switch (type) {
      case "form":
        this.#type = "raw";
        value = async () =>
          new URLSearchParams(
            decoder.decode(await this.#valuePromise()).replace(/\+/g, " "),
          );
        break;
      case "form-data":
        this.#type = "form-data";
        value = () => {
          const contentType = this.#headers.get("content-type");
          assert(contentType);
          return this.#formDataReader ??
            (this.#formDataReader = new FormDataReader(
              contentType,
              this.#body,
            ));
        };
        break;
      case "json":
        this.#type = "raw";
        value = async () =>
          JSON.parse(decoder.decode(await this.#valuePromise()));
        break;
      case "raw":
        this.#type = "raw";
        value = () => this.#valuePromise();
        break;
      case "text":
        this.#type = "raw";
        value = async () => decoder.decode(await this.#valuePromise());
        break;
      default:
        throw new TypeError(`Invalid body type: "${type}"`);
    }
    return {
      type,
      get value() {
        return value();
      },
    } as Body;
  }

  has(): boolean {
    return this.#has !== undefined
      ? this.#has
      : (this.#has = this.#headers.get("transfer-encoding") !== null ||
        !!parseInt(this.#headers.get("content-length") ?? "", 10));
  }
}
