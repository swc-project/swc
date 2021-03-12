// Loaded from https://deno.land/x/mongo@v0.20.0/src/error.ts


export interface MongoErrorInfo {
  ok: 0;
  errmsg: string;
  code: number;
  codeName: string;
}

export class MongoError extends Error {
  constructor(info: MongoErrorInfo) {
    super(`MongoError: ${JSON.stringify(info)}`);
  }
}
