// Loaded from https://deno.land/x/abc@v1.2.4/http_exception.ts


import { Status } from "./vendor/https/deno.land/std/http/http_status.ts";

export interface HttpExceptionBody {
  message?: string;
  error?: string;
  statusCode?: number;
}

export function createHttpExceptionBody(
  message: string,
  error?: string,
  statusCode?: number,
): HttpExceptionBody;
export function createHttpExceptionBody<T extends Record<string, any>>(
  body: T,
): T;
export function createHttpExceptionBody<T extends Record<string, any>>(
  msgOrBody: string | T,
  error?: string,
  statusCode?: number,
): HttpExceptionBody | T {
  if (typeof msgOrBody === "object" && !Array.isArray(msgOrBody)) {
    return msgOrBody;
  } else if (typeof msgOrBody === "string") {
    return { statusCode, error, message: msgOrBody };
  }
  return { statusCode, error };
}

export class HttpException extends Error {
  readonly message: any;
  constructor(
    readonly response: string | Record<string, any>,
    readonly status: number,
  ) {
    super();
    this.message = response;
  }
}

export class BadGatewayException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Bad Gateway",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.BadGateway),
      Status.BadGateway,
    );
  }
}

export class BadRequestException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Bad Request",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.BadRequest),
      Status.BadRequest,
    );
  }
}

export class ConflictException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Conflict",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.Conflict),
      Status.Conflict,
    );
  }
}

export class ForbiddenException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Forbidden",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.Forbidden),
      Status.Forbidden,
    );
  }
}

export class GatewayTimeoutException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Gateway Timeout",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.GatewayTimeout),
      Status.GatewayTimeout,
    );
  }
}

export class GoneException extends HttpException {
  constructor(message?: string | Record<string, any> | any, error = "Gone") {
    super(createHttpExceptionBody(message, error, Status.Gone), Status.Gone);
  }
}

export class TeapotException extends HttpException {
  constructor(message?: string | Record<string, any> | any, error = "Teapot") {
    super(
      createHttpExceptionBody(message, error, Status.Teapot),
      Status.Teapot,
    );
  }
}

export class MethodNotAllowedException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Method Not Allowed",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.MethodNotAllowed),
      Status.MethodNotAllowed,
    );
  }
}

export class NotAcceptableException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Not Acceptable",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.NotAcceptable),
      Status.NotAcceptable,
    );
  }
}

export class NotFoundException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Not Found",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.NotFound),
      Status.NotFound,
    );
  }
}

export class NotImplementedException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Not Implemented",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.NotImplemented),
      Status.NotImplemented,
    );
  }
}

export class RequestEntityTooLargeException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Request Entity Too Large",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.RequestEntityTooLarge),
      Status.RequestEntityTooLarge,
    );
  }
}

export class RequestTimeoutException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Request Timeout",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.RequestTimeout),
      Status.RequestTimeout,
    );
  }
}

export class ServiceUnavailableException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Service Unavailable",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.ServiceUnavailable),
      Status.ServiceUnavailable,
    );
  }
}

export class UnauthorizedException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Unauthorized",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.Unauthorized),
      Status.Unauthorized,
    );
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Unprocessable Entity",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.UnprocessableEntity),
      Status.UnprocessableEntity,
    );
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Internal Server Error",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.InternalServerError),
      Status.InternalServerError,
    );
  }
}

export class UnsupportedMediaTypeException extends HttpException {
  constructor(
    message?: string | Record<string, any> | any,
    error = "Unsupported Media Type",
  ) {
    super(
      createHttpExceptionBody(message, error, Status.UnsupportedMediaType),
      Status.UnsupportedMediaType,
    );
  }
}
