// Loaded from https://deno.land/x/mysql/src/constant/errors.ts


export class ConnnectionError extends Error {
  constructor(msg?: string) {
    super(msg);
  }
}

export class WriteError extends ConnnectionError {
  constructor(msg?: string) {
    super(msg);
  }
}

export class ReadError extends ConnnectionError {
  constructor(msg?: string) {
    super(msg);
  }
}

export class ResponseTimeoutError extends ConnnectionError {
  constructor(msg?: string) {
    super(msg);
  }
}

export class ProtocolError extends ConnnectionError {
  constructor(msg?: string) {
    super(msg);
  }
}
