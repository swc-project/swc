// Loaded from https://deno.land/x/mongo@v0.20.0/src/utils/uri.ts


// mongodb://username:password@example.com:27017,example2.com:27017,...,example.comN:27017/database?key=value&keyN=valueN
import { ConnectOptions } from "../types.ts";

export function parse(uri: string): ConnectOptions {
  const uriObject = new URL(decodeURIComponent(uri));
  const search: { [key: string]: any } = {};
  uriObject.searchParams.forEach((val, key) => {
    search[key] = val;
  });
  const domain_socket = getDomainSocket();

  const dbName = getDbName();
  const auth = {
    user: decodeURIComponent(uriObject.username),
    password: decodeURIComponent(uriObject.password),
  };
  return {
    servers: [
      {
        host: uriObject.hostname,
        port: parseInt(uriObject.port) || 27017,
        domainSocket: domain_socket,
      },
    ],
    dbName,
    auth,
    ...search,
  };

  function isSock(pathname: string, sockFlag: string) {
    return pathname.includes(sockFlag);
  }

  function getDomainSocket() {
    const pathname = uriObject.pathname;
    const sockFlag = ".sock";
    if (isSock(pathname, sockFlag)) {
      const index = pathname.indexOf(sockFlag);
      return decodeURIComponent(pathname.slice(0, index + 5));
    }
    return "";
  }

  function getDbName() {
    const defaultDbName = "admin";
    const pathname = uriObject.pathname;
    const sockFlag = ".sock";
    if (isSock(pathname, sockFlag)) {
      const index = pathname.indexOf(sockFlag) + sockFlag.length + 1;
      return pathname.slice(index) || defaultDbName;
    }
    return pathname.slice(1) || defaultDbName;
  }
}
