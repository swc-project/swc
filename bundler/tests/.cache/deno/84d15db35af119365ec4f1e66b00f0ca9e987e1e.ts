// Loaded from https://deno.land/x/dnit@dnit-v1.11.0/ADLMap.ts


import type * as sys_types from "./adl-gen/runtime/sys/types.ts";

export class ADLMap<K, V> {
  constructor(
    public data: sys_types.Map<K, V>,
    private isEqual: (k1: K, k2: K) => boolean,
  ) {
  }
  has(k: K): boolean {
    return this.findIndex(k) !== -1;
  }
  get(k: K): V | undefined {
    const ind = this.findIndex(k);
    if (ind === -1) {
      return undefined;
    }
    return this.data[ind].v2;
  }
  getOrInsert(k: K, v: V): V {
    const existing = this.get(k);
    if (existing === undefined) {
      this.set(k, v);
      return v;
    }
    return existing;
  }
  set(k: K, v: V) {
    const ind = this.findIndex(k);
    if (ind === -1) {
      this.data.push({ v1: k, v2: v });
    }
    this.data[ind] = { v1: k, v2: v };
    return this;
  }
  keys(): K[] {
    return this.data.map((p) => p.v1);
  }
  values(): V[] {
    return this.data.map((p) => p.v2);
  }
  entries(): [K, V][] {
    return this.data.map((p) => [p.v1, p.v2]);
  }
  toData() {
    return this.data;
  }

  findIndex(k: K) {
    return this.data.findIndex((p) => this.isEqual(p.v1, k));
  }
}
