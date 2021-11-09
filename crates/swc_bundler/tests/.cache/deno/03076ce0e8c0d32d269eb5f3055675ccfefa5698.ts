// Loaded from https://deno.land/x/status@0.1.0/codes.ts


// Copyright 2020 Filippo Rossi. All rights reserved. MIT license.

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.3
 *
 * The request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing.
 */
export const ACCEPTED = 202;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.3
 *
 * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
 */
export const BAD_GATEWAY = 502;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.1
 *
 * This response means that server could not understand the request due to invalid syntax.
 */
export const BAD_REQUEST = 400;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.8
 *
 * This response is sent when a request conflicts with the current state of the server.
 */
export const CONFLICT = 409;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.1
 *
 * This interim response indicates that everything so far is OK and that the client should continue with the request or ignore it if it is already finished.
 */
export const CONTINUE = 100;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.2
 *
 * The request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request.
 */
export const CREATED = 201;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.14
 *
 * This response code means the expectation indicated by the Expect request header field can't be met by the server.
 */
export const EXPECTATION_FAILED = 417;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.5
 *
 * The request failed due to failure of a previous request.
 */
export const FAILED_DEPENDENCY = 424;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.3
 *
 * The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
 */
export const FORBIDDEN = 403;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.5
 *
 * This error response is given when the server is acting as a gateway and cannot get a response in time.
 */
export const GATEWAY_TIMEOUT = 504;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.9
 *
 * This response would be sent when the requested content has been permenantly deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
 */
export const GONE = 410;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.6
 *
 * The HTTP version used in the request is not supported by the server.
 */
export const HTTP_VERSION_NOT_SUPPORTED = 505;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc2324#section-2.3.2
 *
 * Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot". The resulting entity body MAY be short and stout.
 */
export const IM_A_TEAPOT = 418;

/**
 * UNOFFICIAL w/ NO DOCS
 */
export const INSUFFICIENT_SPACE_ON_RESOURCE = 419;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
 *
 * The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
 */
export const INSUFFICIENT_STORAGE = 507;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.1
 *
 * The server has encountered a situation it doesn't know how to handle.
 */
export const INTERNAL_SERVER_ERROR = 500;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.10
 *
 * Server rejected the request because the Content-Length header field is not defined and the server requires it.
 */
export const LENGTH_REQUIRED = 411;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.4
 *
 * The resource that is being accessed is locked.
 */
export const LOCKED = 423;

/**
 * @deprecated
 * A deprecated response used by the Spring Framework when a method has failed.
 */
export const METHOD_FAILURE = 420;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.5
 *
 * The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.
 */
export const METHOD_NOT_ALLOWED = 405;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.2
 *
 * This response code means that URI of requested resource has been changed. Probably, new URI would be given in the response.
 */
export const MOVED_PERMANENTLY = 301;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.3
 *
 * This response code means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
 */
export const MOVED_TEMPORARILY = 302;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.2
 *
 * A Multi-Status response conveys information about multiple resources in situations where multiple status codes might be appropriate.
 */
export const MULTI_STATUS = 207;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.1
 *
 * The request has more than one possible responses. User-agent or user should choose one of them. There is no standardized way to choose one of the responses.
 */
export const MULTIPLE_CHOICES = 300;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-6
 *
 * The 511 status code indicates that the client needs to authenticate to gain network access.
 */
export const NETWORK_AUTHENTICATION_REQUIRED = 511;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.5
 *
 * There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
 */
export const NO_CONTENT = 204;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.4
 * This response code means returned meta-information set is not exact set as available from the origin server, but collected from a local or a third party copy. Except this condition, 200 OK response should be preferred instead of this response.
 */
export const NON_AUTHORITATIVE_INFORMATION = 203;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.6
 *
 * This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content following the criteria given by the user agent.
 */
export const NOT_ACCEPTABLE = 406;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.4
 *
 * The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web.
 */
export const NOT_FOUND = 404;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.2
 *
 * The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
 */
export const NOT_IMPLEMENTED = 501;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.1
 *
 * This is used for caching purposes. It is telling to client that response has not been modified. So, client can continue to use same cached version of response.
 */
export const NOT_MODIFIED = 304;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.1
 *
 * The request has succeeded. The meaning of a success varies depending on the HTTP method:
 * GET: The resource has been fetched and is transmitted in the message body.
 * HEAD: The entity headers are in the message body.
 * POST: The resource describing the result of the action is transmitted in the message body.
 * TRACE: The message body contains the request message as received by the server
 */
export const OK = 200;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.1
 *
 * This response code is used because of range header sent by the client to separate download into multiple streams.
 */
export const PARTIAL_CONTENT = 206;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.2
 *
 * This response code is reserved for future use. Initial aim for creating this code was using it for digital payment systems however this is not used currently.
 */
export const PAYMENT_REQUIRED = 402;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7538#section-3
 *
 * This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
 */
export const PERMANENT_REDIRECT = 308;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.2
 *
 * The client has indicated preconditions in its headers which the server does not meet.
 */
export const PRECONDITION_FAILED = 412;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-3
 *
 * The origin server requires the request to be conditional. Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
 */
export const PRECONDITION_REQUIRED = 428;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.1
 *
 * This code indicates that the server has received and is processing the request, but no response is available yet.
 */
export const PROCESSING = 102;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.2
 *
 * This is similar to 401 but authentication is needed to be done by a proxy.
 */
export const PROXY_AUTHENTICATION_REQUIRED = 407;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-5
 *
 * The server is unwilling to process the request because its header fields are too large. The request MAY be resubmitted after reducing the size of the request header fields.
 */
export const REQUEST_HEADER_FIELDS_TOO_LARGE = 431;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.7
 *
 * This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
 */
export const REQUEST_TIMEOUT = 408;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.11
 *
 * Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field.
 */
export const REQUEST_TOO_LONG = 413;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.12
 *
 * The URI requested by the client is longer than the server is willing to interpret.
 */
export const REQUEST_URI_TOO_LONG = 414;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.4
 *
 * The range specified by the Range header field in the request can't be fulfilled; it's possible that the range is outside the size of the target URI's data.
 */
export const REQUESTED_RANGE_NOT_SATISFIABLE = 416;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.6
 *
 * This response code is sent after accomplishing request to tell user agent reset document view which sent this request.
 */
export const RESET_CONTENT = 205;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.4
 *
 * Server sent this response to directing client to get requested resource to another URI with an GET request.
 */
export const SEE_OTHER = 303;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.4
 *
 * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This responses should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
 */
export const SERVICE_UNAVAILABLE = 503;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.2
 *
 * This code is sent in response to an Upgrade request header by the client, and indicates the protocol the server is switching too.
 */
export const SWITCHING_PROTOCOLS = 101;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.7
 *
 * Server sent this response to directing client to get requested resource to another URI with same method that used prior request. This has the same semantic than the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
 */
export const TEMPORARY_REDIRECT = 307;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-4
 *
 * The user has sent too many requests in a given amount of time ("rate limiting").
 */
export const TOO_MANY_REQUESTS = 429;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.1
 *
 * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
 */
export const UNAUTHORIZED = 401;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.3
 *
 * The request was well-formed but was unable to be followed due to semantic errors.
 */
export const UNPROCESSABLE_ENTITY = 422;

/**
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.13
 *
 * The media format of the requested data is not supported by the server, so the server is rejecting the request.
 */
export const UNSUPPORTED_MEDIA_TYPE = 415;

/**
 * @deprecated
 * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.6
 *
 * Was defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.
 */
export const USE_PROXY = 305;

/**
 * Array with all the supported status codes.
 */
export const ALL: number[] = [
  ACCEPTED,
  BAD_GATEWAY,
  BAD_REQUEST,
  CONFLICT,
  CONTINUE,
  CREATED,
  EXPECTATION_FAILED,
  FAILED_DEPENDENCY,
  FORBIDDEN,
  GATEWAY_TIMEOUT,
  GONE,
  HTTP_VERSION_NOT_SUPPORTED,
  IM_A_TEAPOT,
  INSUFFICIENT_SPACE_ON_RESOURCE,
  INSUFFICIENT_STORAGE,
  INTERNAL_SERVER_ERROR,
  LENGTH_REQUIRED,
  LOCKED,
  METHOD_FAILURE,
  METHOD_NOT_ALLOWED,
  MOVED_PERMANENTLY,
  MOVED_TEMPORARILY,
  MULTI_STATUS,
  MULTIPLE_CHOICES,
  NETWORK_AUTHENTICATION_REQUIRED,
  NO_CONTENT,
  NON_AUTHORITATIVE_INFORMATION,
  NOT_ACCEPTABLE,
  NOT_FOUND,
  NOT_IMPLEMENTED,
  NOT_MODIFIED,
  OK,
  PARTIAL_CONTENT,
  PAYMENT_REQUIRED,
  PERMANENT_REDIRECT,
  PRECONDITION_FAILED,
  PRECONDITION_REQUIRED,
  PROCESSING,
  PROXY_AUTHENTICATION_REQUIRED,
  REQUEST_HEADER_FIELDS_TOO_LARGE,
  REQUEST_TIMEOUT,
  REQUEST_TOO_LONG,
  REQUEST_URI_TOO_LONG,
  REQUESTED_RANGE_NOT_SATISFIABLE,
  RESET_CONTENT,
  SEE_OTHER,
  SERVICE_UNAVAILABLE,
  SWITCHING_PROTOCOLS,
  TEMPORARY_REDIRECT,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
  UNSUPPORTED_MEDIA_TYPE,
  USE_PROXY,
];
