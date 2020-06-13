import {Options} from "../types";

export interface BundleOptions{
    nameL:string
    entry:EntryInput,
    working_dir?:string
    options?:Options
    minify?:boolean
}

export type EntryInput =string|{
    [name:string]:string
}

