/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

/**
 * Haystack core methods
 *
 * @module
 */

import { Kind } from "./Kind";
import { HVal, isHVal, OptionalHVal } from "./HVal";
import { HBool } from "./HBool";
import { HDate } from "./HDate";
import { HNum } from "./HNum";
import { HRef } from "./HRef";
import { HStr } from "./HStr";
import { HTime } from "./HTime";
import { HUri } from "./HUri";
import { HDict } from "./HDict";
import {
    HaysonDict,
    HaysonVal,
    HaysonCoord,
    HaysonXStr,
    HaysonDate,
    HaysonDateTime,
    HaysonNum,
    HaysonSymbol,
    HaysonTime,
    HaysonUri,
    HaysonList,
    HaysonGrid,
    HaysonRef,
} from "./hayson";
import { HDateTime } from "./HDateTime";
import { HMarker } from "./HMarker";
import { HRemove } from "./HRemove";
import { HNa } from "./HNa";
import { HCoord } from "./HCoord";
import { HXStr } from "./HXStr";
import { HSymbol } from "./HSymbol";
import { HList } from "./HList";
import { HGrid } from "./HGrid";
import { Scanner } from "../util/Scanner";

/**
 * Make the haystack value based on the supplied data.
 *
 * @param options.value The JS value.
 * @param options.kind The kind of value.
 * @param options.unit Any units.
 * @param options.type Any type information for an xstring.
 */
export function makeValue(val: HaysonVal | HVal): OptionalHVal {
    if (val === null) {
        return null;
    }

    if (isHVal(val)) {
        return val as HVal;
    }

    switch (typeof val) {
        case "string":
            return HStr.make(val as string);
        case "number":
            return HNum.make(val as number);
        case "boolean":
            return HBool.make(val as boolean);
    }

    if (!val) {
        throw new Error("Invalid value");
    }

    if (Array.isArray(val)) {
        return HList.make(val as HaysonList);
    }

    const obj = val as { _kind?: string };

    // Support new and old Hayson for decoding values.
    switch (obj._kind) {
        case Kind.Marker:
        case "Marker":
            return HMarker.make();
        case Kind.Remove:
        case "Remove":
            return HRemove.make();
        case Kind.NA:
        case "NA":
            return HNa.make();
        case Kind.Coord:
        case "Coord":
            return HCoord.make(obj as HaysonCoord);
        case Kind.XStr:
        case "XStr":
        case Kind.Bin:
        case "Bin":
            return HXStr.make(obj as HaysonXStr);
        case Kind.Date:
        case "Date":
            return HDate.make(obj as HaysonDate);
        case Kind.DateTime:
        case "DateTime":
            return HDateTime.make(obj as HaysonDateTime);
        case Kind.Number:
        case "Number":
            return HNum.make(obj as HaysonNum);
        case Kind.Ref:
        case "Ref":
            return HRef.make(obj as HaysonRef);
        case Kind.Symbol:
        case "Symbol":
            return HSymbol.make(obj as HaysonSymbol);
        case Kind.Time:
        case "Time":
            return HTime.make(obj as HaysonTime);
        case Kind.Uri:
        case "Uri":
            return HUri.make(obj as HaysonUri);
        case Kind.Dict:
        case "Dict":
        case undefined:
            return HDict.make(obj as HaysonDict);
        case Kind.Grid:
        case "Grid":
            return HGrid.make(obj as HaysonGrid);
        default:
            throw new Error("Could not resolve value from kind: " + obj._kind);
    }
}

/**
 * Converts a numerical digit into a name.
 *
 * @param digit The digit to convert.
 * @returns The name of the number.
 */
function convertDigitToName(digit: string): string {
    let name: string;
    switch (digit) {
        case "1":
            name = "one";
            break;
        case "2":
            name = "two";
            break;
        case "3":
            name = "three";
            break;
        case "4":
            name = "four";
            break;
        case "5":
            name = "five";
            break;
        case "6":
            name = "six";
            break;
        case "7":
            name = "seven";
            break;
        case "8":
            name = "eight";
            break;
        case "9":
            name = "nine";
            break;
        default:
            name = "zero";
    }

    return name;
}

/**
 * Return a valid tag name from the input string.
 *
 * A valid tag name has to match...
 * ```
 * <alphaLo> (<alphaLo> | <alphaHi> | <digit> | '_')*
 * ```
 *
 * For more information regarding grammar please see https://project-haystack.org/doc/Zinc
 *
 * @param name The name to convert.
 * @returns A name to convert into a tag.
 */
export function toTagName(name: string): string {
    name = String(name) || "";
    name = name.replace(/[^a-z0-9_ ]/gi, "").trim();

    if (!name) {
        return "empty";
    }

    const parts = name.split(" ");

    // Convert a from a sentance into a camel case string.
    // Ensure the first character is a lower case letter.
    return parts
        .filter((part: string): boolean => part.trim().length > 0)
        .map((part: string, index: number): string => {
            const start = part[0];
            if (index === 0) {
                // The start of a tag can only be a lower case letter (a-z).
                if (Scanner.isDigit(start)) {
                    part = part.substring(1, part.length);
                    part = convertDigitToName(start) + part;
                } else if (start === "_") {
                    part = part.substring(1, part.length);
                    part = "us" + part;
                } else if (Scanner.isUpperCase(start)) {
                    part = part.substring(1, part.length);
                    part = start.toLowerCase() + part;
                }
            } else if (Scanner.isLetter(start) && Scanner.isLowerCase(start)) {
                // Anything after the first space needs to be coverted to camel case.
                // Therefore the first letter needs to be upper case.
                part = part.substring(1, part.length);
                part = start.toUpperCase() + part;
            }

            return part;
        })
        .join("");
}

/**
 * Test to see if the name is a valid tag name.
 *
 * A valid tag name has to match...
 * ```
 * <alphaLo> (<alphaLo> | <alphaHi> | <digit> | '_')*
 * ```
 *
 * For more information regarding grammar please see https://project-haystack.org/doc/Zinc
 *
 * @param name The name to test.
 * @returns True if the tag name is valid.
 */
export function isValidTagName(name: string): boolean {
    return /^[a-z][a-zA-Z0-9_]+$/.test(String(name));
}
