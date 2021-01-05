/** @prettier */
import { Observable } from '../../Observable';
import { Subscriber } from '../../Subscriber';
import { TeardownLogic, PartialObserver } from '../../types';

export interface AjaxRequest {
  url?: string;
  body?: any;
  user?: string;
  async?: boolean;
  method?: string;
  headers?: object;
  timeout?: number;
  password?: string;
  hasContent?: boolean;
  crossDomain?: boolean;
  withCredentials?: boolean;
  createXHR?: () => XMLHttpRequest;
  progressSubscriber?: PartialObserver<ProgressEvent>;
  responseType?: string;
}

function isFormData(body: any): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
export class AjaxObservable<T> extends Observable<T> {
  private request: AjaxRequest;

  constructor(urlOrRequest: string | AjaxRequest) {
    super();

    const request: AjaxRequest = {
      async: true,
      createXHR: () => new XMLHttpRequest(),
      crossDomain: true,
      withCredentials: false,
      headers: {},
      method: 'GET',
      responseType: 'json',
      timeout: 0,
    };

    if (typeof urlOrRequest === 'string') {
      request.url = urlOrRequest;
    } else {
      for (const prop in urlOrRequest) {
        if (urlOrRequest.hasOwnProperty(prop)) {
          (request as any)[prop] = (urlOrRequest as any)[prop];
        }
      }
    }

    this.request = request;
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _subscribe(subscriber: Subscriber<T>): TeardownLogic {
    return new AjaxSubscriber(subscriber, this.request);
  }
}

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class AjaxSubscriber<T> extends Subscriber<Event> {
  // @ts-ignore: Property has no initializer and is not definitely assigned
  private xhr: XMLHttpRequest;
  private done: boolean = false;

  constructor(destination: Subscriber<T>, public request: AjaxRequest) {
    super(destination);

    const headers = (request.headers = request.headers || {});

    // force CORS if requested
    if (!request.crossDomain && !this.getHeader(headers, 'X-Requested-With')) {
      (headers as any)['X-Requested-With'] = 'XMLHttpRequest';
    }

    // ensure content type is set
    let contentTypeHeader = this.getHeader(headers, 'Content-Type');
    if (!contentTypeHeader && typeof request.body !== 'undefined' && !isFormData(request.body)) {
      (headers as any)['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }

    // properly serialize body
    request.body = this.serializeBody(request.body, this.getHeader(request.headers, 'Content-Type'));

    this.send();
  }

  next(e: Event): void {
    this.done = true;
    const destination = this.destination as Subscriber<any>;
    let result: AjaxResponse;
    try {
      result = new AjaxResponse(e, this.xhr, this.request);
    } catch (err) {
      return destination.error(err);
    }
    destination.next(result);
  }

  private send(): void {
    const {
      request,
      request: { user, method, url, async, password, headers, body },
    } = this;
    try {
      const xhr = (this.xhr = request.createXHR!());

      // set up the events before open XHR
      // https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
      // You need to add the event listeners before calling open() on the request.
      // Otherwise the progress events will not fire.
      this.setupEvents(xhr, request);
      // open XHR
      if (user) {
        xhr.open(method!, url!, async!, user, password);
      } else {
        xhr.open(method!, url!, async!);
      }

      // timeout, responseType and withCredentials can be set once the XHR is open
      if (async) {
        xhr.timeout = request.timeout!;
        xhr.responseType = request.responseType as any;
      }

      if ('withCredentials' in xhr) {
        xhr.withCredentials = !!request.withCredentials;
      }

      // set headers
      this.setHeaders(xhr, headers!);

      // finally send the request
      if (body) {
        xhr.send(body);
      } else {
        xhr.send();
      }
    } catch (err) {
      this.error(err);
    }
  }

  private serializeBody(body: any, contentType?: string) {
    if (!body || typeof body === 'string') {
      return body;
    } else if (isFormData(body)) {
      return body;
    }

    if (contentType) {
      const splitIndex = contentType.indexOf(';');
      if (splitIndex !== -1) {
        contentType = contentType.substring(0, splitIndex);
      }
    }

    switch (contentType) {
      case 'application/x-www-form-urlencoded':
        return Object.keys(body)
          .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`)
          .join('&');
      case 'application/json':
        return JSON.stringify(body);
      default:
        return body;
    }
  }

  private setHeaders(xhr: XMLHttpRequest, headers: Object) {
    for (let key in headers) {
      if (headers.hasOwnProperty(key)) {
        xhr.setRequestHeader(key, (headers as any)[key]);
      }
    }
  }

  private getHeader(headers: {}, headerName: string): any {
    for (let key in headers) {
      if (key.toLowerCase() === headerName.toLowerCase()) {
        return (headers as any)[key];
      }
    }

    return undefined;
  }

  private setupEvents(xhr: XMLHttpRequest, request: AjaxRequest) {
    const progressSubscriber = request.progressSubscriber;

    xhr.ontimeout = (e: ProgressEvent) => {
      progressSubscriber?.error?.(e);
      let error;
      try {
        error = new AjaxTimeoutError(xhr, request); // TODO: Make betterer.
      } catch (err) {
        error = err;
      }
      this.error(error);
    };

    if (progressSubscriber) {
      xhr.upload.onprogress = (e: ProgressEvent) => {
        progressSubscriber.next?.(e);
      };
    }

    xhr.onerror = (e: ProgressEvent) => {
      progressSubscriber?.error?.(e);
      this.error(new AjaxError('ajax error', xhr, request));
    };

    xhr.onload = (e: ProgressEvent) => {
      // 4xx and 5xx should error (https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)
      if (xhr.status < 400) {
        progressSubscriber?.complete?.();
        this.next(e);
        this.complete();
      } else {
        progressSubscriber?.error?.(e);
        let error;
        try {
          error = new AjaxError('ajax error ' + xhr.status, xhr, request);
        } catch (err) {
          error = err;
        }
        this.error(error);
      }
    };
  }

  unsubscribe() {
    const { done, xhr } = this;
    if (!done && xhr && xhr.readyState !== 4 && typeof xhr.abort === 'function') {
      xhr.abort();
    }
    super.unsubscribe();
  }
}

/**
 * A normalized AJAX response.
 *
 * @see {@link ajax}
 *
 * @class AjaxResponse
 */
export class AjaxResponse {
  /** @type {number} The HTTP status code */
  status: number;

  /** @type {string|ArrayBuffer|Document|object|any} The response data */
  response: any;

  /** @type {string} The raw responseText */
  // @ts-ignore: Property has no initializer and is not definitely assigned
  responseText: string;

  /** @type {string} The responseType (e.g. 'json', 'arraybuffer', or 'xml') */
  responseType: string;

  constructor(public originalEvent: Event, public xhr: XMLHttpRequest, public request: AjaxRequest) {
    this.status = xhr.status;
    this.responseType = xhr.responseType || request.responseType!;
    this.response = getXHRResponse(xhr);
  }
}

export type AjaxErrorNames = 'AjaxError' | 'AjaxTimeoutError';

/**
 * A normalized AJAX error.
 *
 * @see {@link ajax}
 *
 * @class AjaxError
 */
export interface AjaxError extends Error {
  /**
   * The XHR instance associated with the error
   */
  xhr: XMLHttpRequest;

  /**
   * The AjaxRequest associated with the error
   */
  request: AjaxRequest;

  /**
   *The HTTP status code
   */
  status: number;

  /**
   *The responseType (e.g. 'json', 'arraybuffer', or 'xml')
   */
  responseType: XMLHttpRequestResponseType;

  /**
   * The response data
   */
  response: any;
}

export interface AjaxErrorCtor {
  /**
   * Internal use only. Do not manually create instances of this type.
   * @internal
   */
  new(message: string, xhr: XMLHttpRequest, request: AjaxRequest): AjaxError;
}

const AjaxErrorImpl = (() => {
  function AjaxErrorImpl(this: any, message: string, xhr: XMLHttpRequest, request: AjaxRequest): AjaxError {
    Error.call(this);
    this.message = message;
    this.name = 'AjaxError';
    this.xhr = xhr;
    this.request = request;
    this.status = xhr.status;
    this.responseType = xhr.responseType;
    let response: any;
    try {
      response = getXHRResponse(xhr);
    } catch (err) {
      response = xhr.responseText;
    }
    this.response = response;
    return this;
  }
  AjaxErrorImpl.prototype = Object.create(Error.prototype);
  return AjaxErrorImpl;
})();

/**
 * Thrown when an error occurs during an AJAX request.
 * This is only exported because it is useful for checking to see if an error
 * is an `instanceof AjaxError`. DO NOT create new instances of `AjaxError` with
 * the constructor.
 *
 * @class AjaxError
 * @see ajax
 */
export const AjaxError: AjaxErrorCtor = AjaxErrorImpl as any;

function getXHRResponse(xhr: XMLHttpRequest) {
  switch (xhr.responseType) {
    case 'json': {
      if ('response' in xhr) {
        return xhr.response;
      } else {
        // IE
        const ieXHR: any = xhr;
        return JSON.parse(ieXHR.responseText);
      }
    }
    case 'document':
      return xhr.responseXML;
    case 'text':
    default: {
      if ('response' in xhr) {
        return xhr.response;
      } else {
        // IE
        const ieXHR: any = xhr;
        return ieXHR.responseText;
      }
    }
  }
}

export interface AjaxTimeoutError extends AjaxError { }

export interface AjaxTimeoutErrorCtor {
  /**
   * Internal use only. Do not manually create instances of this type.
   * @internal
   */
  new(xhr: XMLHttpRequest, request: AjaxRequest): AjaxTimeoutError;
}

const AjaxTimeoutErrorImpl = (() => {
  function AjaxTimeoutErrorImpl(this: any, xhr: XMLHttpRequest, request: AjaxRequest) {
    AjaxError.call(this, 'ajax timeout', xhr, request);
    this.name = 'AjaxTimeoutError';
    return this;
  }
  AjaxTimeoutErrorImpl.prototype = Object.create(AjaxError.prototype);
  return AjaxTimeoutErrorImpl;
})();

/**
 * Thrown when an AJAX request timesout. Not to be confused with {@link TimeoutError}.
 *
 * This is exported only because it is useful for checking to see if errors are an
 * `instanceof AjaxTimeoutError`. DO NOT use the constructor to create an instance of
 * this type.
 *
 * @class AjaxTimeoutError
 * @see ajax
 */
export const AjaxTimeoutError: AjaxTimeoutErrorCtor = AjaxTimeoutErrorImpl as any;