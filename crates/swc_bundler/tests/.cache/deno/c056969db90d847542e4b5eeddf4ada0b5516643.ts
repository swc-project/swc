// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isSvg.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const htmlCommentRegex = /<!--([\s\S]*?)-->/g;

/**
 * @ignore
 */
const entityRegex = /\s*<!Entity\s+\S*\s*(?:"|')[^"]+(?:"|')\s*>/gim;

/**
 * @ignore
 */
const svgRegex = /^\s*(?:<\?xml[^>]*>\s*)?(?:<!doctype svg[^>]*\s*(?:\[?(?:\s*<![^>]*>\s*)*\]?)*[^>]*>\s*)?(?:<svg[^>]*>[^]*<\/svg>|<svg[^/>]*\/\s*>)\s*$/i;

/**
 * @example
 * ```ts
 * import {segno} from 'https://deno.land/x/segno/mod.ts';
 *
 * segno.isSvg('<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [ <!ENTITY Smile " <rect x='.5' y='.5' width='29' height='39' fill='black' stroke='red'/> <g transform='translate(0, 5)'> <circle cx='15' cy='15' r='10' fill='yellow'/><circle cx='12' cy='12' r='1.5' fill='black'/><circle cx='17' cy='12' r='1.5' fill='black'/><path d='M 10 19 L 15 23 20 19' stroke='black' stroke-width='2'/></g>"> ]>
      <svg width="850px" height="700px" version="1.1" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(16,0,0,16,0,0)">&Smile;</g></svg>'); // true
 * segno.isSvg('this string ends with an svg <svg></svg>'); // false
 * ```
 */
export const isSvg = (str: string) => {
  assertString(str);

  return svgRegex.test(
    str.replace(entityRegex, '').replace(htmlCommentRegex, '')
  );
};
