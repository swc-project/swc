// Loaded from https://deno.land/x/oak@v6.3.1/negotiation/charset.ts


/*!
 * Adapted directly from negotiator at https://github.com/jshttp/negotiator/
 * which is licensed as follows:
 *
 * (The MIT License)
 *
 * Copyright (c) 2012-2014 Federico Romero
 * Copyright (c) 2012-2014 Isaac Z. Schlueter
 * Copyright (c) 2014-2015 Douglas Christopher Wilson
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { compareSpecs, isQuality, Specificity } from "./common.ts";

interface CharsetSpecificity extends Specificity {
  charset: string;
}

const SIMPLE_CHARSET_REGEXP = /^\s*([^\s;]+)\s*(?:;(.*))?$/;

function parseCharset(str: string, i: number): CharsetSpecificity | undefined {
  const match = SIMPLE_CHARSET_REGEXP.exec(str);
  if (!match) {
    return;
  }

  const [, charset] = match;
  let q = 1;
  if (match[2]) {
    const params = match[2].split(";");
    for (const param of params) {
      const [key, value] = param.trim().split("=");
      if (key === "q") {
        q = parseFloat(value);
        break;
      }
    }
  }

  return { charset, q, i };
}

function parseAcceptCharset(accept: string): CharsetSpecificity[] {
  const accepts = accept.split(",");
  const result: CharsetSpecificity[] = [];

  for (let i = 0; i < accepts.length; i++) {
    const charset = parseCharset(accepts[i].trim(), i);
    if (charset) {
      result.push(charset);
    }
  }
  return result;
}

function specify(
  charset: string,
  spec: CharsetSpecificity,
  i: number,
): Specificity | undefined {
  let s = 0;
  if (spec.charset.toLowerCase() === charset.toLocaleLowerCase()) {
    s |= 1;
  } else if (spec.charset !== "*") {
    return;
  }

  return { i, o: spec.i, q: spec.q, s };
}

function getCharsetPriority(
  charset: string,
  accepted: CharsetSpecificity[],
  index: number,
): Specificity {
  let priority: Specificity = { i: -1, o: -1, q: 0, s: 0 };
  for (const accepts of accepted) {
    const spec = specify(charset, accepts, index);
    if (
      spec &&
      ((priority.s ?? 0) - (spec.s ?? 0) || priority.q - spec.q ||
          (priority.o ?? 0) - (spec.o ?? 0)) < 0
    ) {
      priority = spec;
    }
  }
  return priority;
}

export function preferredCharsets(accept = "*", provided?: string[]): string[] {
  const accepts = parseAcceptCharset(accept);

  if (!provided) {
    return accepts
      .filter(isQuality)
      .sort(compareSpecs)
      .map((spec) => spec.charset);
  }

  const priorities = provided
    .map((type, index) => getCharsetPriority(type, accepts, index));

  return priorities
    .filter(isQuality)
    .sort(compareSpecs)
    .map((priority) => provided[priorities.indexOf(priority)]);
}
