/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { HBool } from "./core/HBool";
import { HCoord, CoordObj } from "./core/HCoord";
import { HDate, DateObj } from "./core/HDate";
import { HDateTime } from "./core/HDateTime";
import { HSymbol } from "./core/HSymbol";
import { HDict, HValObj } from "./core/HDict";
import { HGrid, GridObj } from "./core/HGrid";
import { HList } from "./core/HList";
import { HVal, OptionalHVal } from "./core/HVal";
import { HMarker } from "./core/HMarker";
import { HNa } from "./core/HNa";
import { HNum } from "./core/HNum";
import { HRef } from "./core/HRef";
import { HRemove } from "./core/HRemove";
import { HStr } from "./core/HStr";
import { HTime, TimeObj } from "./core/HTime";
import { HUri } from "./core/HUri";
import { HXStr } from "./core/HXStr";
import { ZincReader } from "./core/ZincReader";
import { TrioReader } from "./core/TrioReader";
import { HNamespace } from "./core/HNamespace";
import {
    HaysonDate,
    HaysonCoord,
    HaysonDateTime,
    HaysonSymbol,
    HaysonGrid,
    HaysonList,
    HaysonVal,
    HaysonNum,
    HaysonTime,
    HaysonUri,
    HaysonXStr,
    HaysonRef,
    HaysonDict,
} from "./core/hayson";

import { makeValue, toTagName, isValidTagName } from "./core/util";
import { HUnit } from "./core/HUnit";

/**
 * Core Haystack utility shorthand functions.
 *
 * These functions are a facade around the underlying APIs
 * in order to provide a easier to use API for creating haystack value types
 * and reading data.
 *
 * @module
 */

export function bool(bool: boolean): HBool {
    return HBool.make(bool);
}

export const TRUE = HBool.make(true);
export const FALSE = HBool.make(false);

export function coord(value: CoordObj | HaysonCoord): HCoord {
    return HCoord.make(value);
}

export function date(value: string | Date | DateObj | HaysonDate): HDate {
    return HDate.make(value);
}

export function dateTime(value: string | Date | HaysonDateTime): HDateTime {
    return HDateTime.make(value);
}

export function symbol(value: string | HaysonSymbol): HSymbol {
    return HSymbol.make(value);
}

export function dict(values?: HValObj | HaysonDict | HVal): HDict {
    return HDict.make(values);
}

export function grid(values: GridObj | HaysonGrid | HVal): HGrid {
    return HGrid.make(values);
}

export function list<T extends HVal>(
    ...values: (T | HaysonVal | T[] | HaysonList)[]
): HList<T> {
    return HList.make(...values);
}

export const MARKER = HMarker.make();

export const NA = HNa.make();

export function num(value: number | HaysonNum, unit?: string): HNum {
    return HNum.make(value, unit);
}

export function ref(value: string | HaysonRef, displayName?: string): HRef {
    return HRef.make(value, displayName);
}

export const REMOVE = HRemove.make();

export function str(value: string): HStr {
    return HStr.make(value);
}

export function time(value: string | Date | TimeObj | HaysonTime): HTime {
    return HTime.make(value);
}

export function uri(value: string | HaysonUri): HUri {
    return HUri.make(value);
}

export function xstr(type: string | HaysonXStr, value?: string): HXStr {
    return HXStr.make(type, value);
}

export function zinc(input: string): OptionalHVal | undefined {
    return ZincReader.readValue(input);
}

export function trio(input: string): HGrid | undefined {
    return TrioReader.readGrid(input);
}

export function make(value: HaysonVal): OptionalHVal {
    return makeValue(value);
}

export function tagName(name: string): string {
    return toTagName(name);
}

export function isTagName(name: string): boolean {
    return isValidTagName(name);
}

export function defs(grid: HGrid): HNamespace {
    return new HNamespace(grid);
}

export function unit(id: string): HUnit | undefined {
    return HUnit.get(id);
}
