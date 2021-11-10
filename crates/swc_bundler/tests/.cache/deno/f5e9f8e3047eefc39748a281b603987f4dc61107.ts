// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isURL.ts


/*
options for isURL method

requireProtocol - if set as true isURL will return false if protocol is not present in the URL
requireValidProtocol - isURL will check if the URL's protocol is present in the protocols option
protocols - valid protocols can be modified with this option
requireHost - if set as false isURL will not check if host is present in the URL
allowProtocolRelativeURLs - if set as true protocol relative URLs will be allowed

*/

// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';
// @ts-ignore allowing typedoc to build
import { isIP } from './isIP.ts';
// @ts-ignore allowing typedoc to build
import { isFQDN } from './isFQDN.ts';

type URLOptions = {
  protocols?: string[];
  requireTLD?: boolean;
  requireProtocol?: boolean;
  requireHost?: boolean;
  requireValidProtocol?: boolean;
  allowUnderscores?: boolean;
  allowTrailingDot?: boolean;
  allowProtocolRelativeURLs?: boolean;
  disallowAuth?: boolean;
  hostWhitelist?: boolean;
  hostBlacklist?: boolean;
  validateLength?: boolean;
};

/**
 * @ignore
 */
const defaultURLOptions = {
  protocols: ['http', 'https', 'ftp'],
  requireTLD: true,
  requireProtocol: false,
  requireHost: true,
  requireValidProtocol: true,
  allowUnderscores: false,
  allowTrailingDot: false,
  allowProtocolRelativeURLs: false,
  validateLength: true,
};

/**
 * @ignore
 */
const wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;

/**
 * @ignore
 */
const isRegExp = (obj: any) => {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
};

/**
 * @ignore
 */
const checkHost = (host: string, matches: any) => {
  for (let i = 0; i < matches.length; i++) {
    let match = matches[i];
    if (host === match || (isRegExp(match) && match.test(host))) {
      return true;
    }
  }
  return false;
};

export const isURL = (url: string, options?: URLOptions) => {
  assertString(url);

  if (!url || /[\s<>]/.test(url)) {
    return false;
  }

  if (url.indexOf('mailto:') === 0) {
    return false;
  }

  options = {
    ...defaultURLOptions,
    ...options,
  };

  if (options.validateLength && url.length >= 2083) {
    return false;
  }

  let protocol, auth, host, hostname, port, port_str, split, ipv6;

  split = url.split('#');
  url = split.shift() as string;

  split = url.split('?');
  url = split.shift() as string;

  split = url.split('://');
  if (split.length > 1) {
    protocol = (split.shift() as string).toLowerCase();
    if (
      options.requireValidProtocol &&
      options?.protocols?.indexOf(protocol) === -1
    ) {
      return false;
    }
  } else if (options.requireProtocol) {
    return false;
  } else if (url.substr(0, 2) === '//') {
    if (!options.allowProtocolRelativeURLs) {
      return false;
    }
    split[0] = url.substr(2);
  }
  url = split.join('://');

  if (url === '') {
    return false;
  }

  split = url.split('/');
  url = split.shift() as string;

  if (url === '' && !options.requireHost) {
    return true;
  }

  split = url.split('@');
  if (split.length > 1) {
    if (options.disallowAuth) {
      return false;
    }
    auth = split.shift() as string;
    if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
      return false;
    }
  }
  hostname = split.join('@');

  port_str = null;
  ipv6 = null;
  const ipv6_match = hostname.match(wrapped_ipv6);
  if (ipv6_match) {
    host = '';
    ipv6 = ipv6_match[1];
    port_str = ipv6_match[2] || null;
  } else {
    split = hostname.split(':');
    host = split.shift() as string;
    if (split.length) {
      port_str = split.join(':');
    }
  }

  if (port_str !== null) {
    port = parseInt(port_str, 10);
    if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
      return false;
    }
  }

  if (!isIP(host) && !isFQDN(host, options) && (!ipv6 || !isIP(ipv6, 6))) {
    return false;
  }

  host = (host || ipv6) as string;

  if (options.hostWhitelist && !checkHost(host, options.hostWhitelist)) {
    return false;
  }
  if (options.hostBlacklist && checkHost(host, options.hostBlacklist)) {
    return false;
  }

  return true;
};
