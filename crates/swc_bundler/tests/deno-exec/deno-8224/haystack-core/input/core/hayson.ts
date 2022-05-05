/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

/* eslint @typescript-eslint/no-empty-interface: "off" */

/**
 * Haystack JSON format types.
 *
 * As described in https://bitbucket.org/finproducts/hayson/src/master/
 *
 * @module
 */

import { Kind } from "./Kind";

export type HaysonNumVal = number | string;

export interface HaysonNum {
    _kind?: Kind;
    val: HaysonNumVal;
    unit?: string;
}

export interface HaysonSingleton {
    _kind?: Kind;
}

export type HaysonMarker = HaysonSingleton;
export type HaysonNa = HaysonSingleton;
export type HaysonRemove = HaysonSingleton;

export interface HaysonRef {
    _kind?: Kind;
    val: string;
    dis?: string;
}

export interface HaysonKindVal {
    _kind?: Kind;
    val: string;
}

export type HaysonUri = HaysonKindVal;
export type HaysonSymbol = HaysonKindVal;
export type HaysonTime = HaysonKindVal;
export type HaysonDate = HaysonKindVal;

export interface HaysonDateTime {
    _kind?: Kind;
    val: string;
    tz?: string;
}

export interface HaysonCoord {
    _kind?: Kind;
    lat: number;
    lng: number;
}

export interface HaysonXStr {
    _kind?: Kind;
    type: string;
    val: string;
}

export type HaysonVal =
    | string
    | number
    | boolean
    | HaysonNum
    | HaysonSingleton
    | HaysonRef
    | HaysonTime
    | HaysonDate
    | HaysonUri
    | HaysonDateTime
    | HaysonSymbol
    | HaysonCoord
    | HaysonXStr
    | HaysonList
    | HaysonDict
    | HaysonGrid
    | null;

export interface HaysonList extends Array<HaysonVal> {}

export interface HaysonDict {
    [prop: string]: HaysonVal;
}

export interface HaysonGrid {
    _kind?: Kind;
    meta?: HaysonDict;
    cols?: { name: string; meta?: HaysonDict }[];
    rows?: HaysonDict[];
}

/**
 * The MIME type for Haystack JSON (a.k.a Hayson)
 */
export const HAYSON_MIME_TYPE = "application/vnd.haystack+json";
