// Loaded from https://raw.githubusercontent.com/deno-postgres/deno-postgres/master/connection/connection_params.ts


import { parseDsn } from "../utils.ts";

/**
 * The connection string must match the following URI structure
 * 
 * ```ts
 * const connection = "postgres://user:password@hostname:port/database?application_name=application_name";
 * ```
 * 
 * Password, port and application name are optional parameters
 */
export type ConnectionString = string;

/**
 * This function retrieves the connection options from the environmental variables
 * as they are, without any extra parsing
 * 
 * It will throw if no env permission was provided on startup
 */
function getPgEnv(): ConnectionOptions {
  return {
    database: Deno.env.get("PGDATABASE"),
    hostname: Deno.env.get("PGHOST"),
    port: Deno.env.get("PGPORT"),
    user: Deno.env.get("PGUSER"),
    password: Deno.env.get("PGPASSWORD"),
    applicationName: Deno.env.get("PGAPPNAME"),
  };
}

export class ConnectionParamsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConnectionParamsError";
  }
}

interface TLSOptions {
  /**
   * This will force the connection to run over TLS
   * If the server doesn't support TLS, the connection will fail
   * 
   * default: `false`
   * */
  enforce: boolean;
}

export interface ConnectionOptions {
  applicationName?: string;
  database?: string;
  hostname?: string;
  password?: string;
  port?: string | number;
  tls?: TLSOptions;
  user?: string;
}

export interface ConnectionParams {
  applicationName: string;
  database: string;
  hostname: string;
  password?: string;
  port: number;
  tls: TLSOptions;
  user: string;
}

function formatMissingParams(missingParams: string[]) {
  return `Missing connection parameters: ${
    missingParams.join(
      ", ",
    )
  }`;
}

/**
 * This validates the options passed are defined and have a value other than null
 * or empty string, it throws a connection error otherwise
 * 
 * @param has_env_access This parameter will change the error message if set to true,
 * telling the user to pass env permissions in order to read environmental variables
 */
function assertRequiredOptions(
  options: ConnectionOptions,
  requiredKeys: (keyof ConnectionOptions)[],
  // deno-lint-ignore camelcase
  has_env_access: boolean,
) {
  const missingParams: (keyof ConnectionOptions)[] = [];
  for (const key of requiredKeys) {
    if (
      options[key] === "" ||
      options[key] === null ||
      options[key] === undefined
    ) {
      missingParams.push(key);
    }
  }

  if (missingParams.length) {
    // deno-lint-ignore camelcase
    let missing_params_message = formatMissingParams(missingParams);
    if (!has_env_access) {
      missing_params_message +=
        "\nConnection parameters can be read from environment variables only if Deno is run with env permission";
    }

    throw new ConnectionParamsError(missing_params_message);
  }
}

function parseOptionsFromDsn(connString: string): ConnectionOptions {
  const dsn = parseDsn(connString);

  if (dsn.driver !== "postgres") {
    throw new ConnectionParamsError(
      `Supplied DSN has invalid driver: ${dsn.driver}.`,
    );
  }

  return {
    ...dsn,
    applicationName: dsn.params.application_name,
  };
}

const DEFAULT_OPTIONS = {
  applicationName: "deno_postgres",
  hostname: "127.0.0.1",
  port: "5432",
  tls: {
    enforce: false,
  },
};

export function createParams(
  params: string | ConnectionOptions = {},
): ConnectionParams {
  if (typeof params === "string") {
    params = parseOptionsFromDsn(params);
  }

  let pgEnv: ConnectionOptions = {};
  // deno-lint-ignore camelcase
  let has_env_access = true;
  try {
    pgEnv = getPgEnv();
  } catch (e) {
    if (e instanceof Deno.errors.PermissionDenied) {
      has_env_access = false;
    } else {
      throw e;
    }
  }

  let port: string;
  if (params.port) {
    port = String(params.port);
  } else if (pgEnv.port) {
    port = String(pgEnv.port);
  } else {
    port = DEFAULT_OPTIONS.port;
  }

  // TODO
  // Perhaps username should be taken from the PC user as a default?
  // deno-lint-ignore camelcase
  const connection_options = {
    applicationName: params.applicationName ?? pgEnv.applicationName ??
      DEFAULT_OPTIONS.applicationName,
    database: params.database ?? pgEnv.database,
    hostname: params.hostname ?? pgEnv.hostname ?? DEFAULT_OPTIONS.hostname,
    password: params.password ?? pgEnv.password,
    port,
    tls: {
      enforce: !!params?.tls?.enforce ?? DEFAULT_OPTIONS.tls.enforce,
    },
    user: params.user ?? pgEnv.user,
  };

  assertRequiredOptions(
    connection_options,
    ["database", "hostname", "port", "user", "applicationName"],
    has_env_access,
  );

  // By this point all required parameters have been checked out
  // by the assert function
  // deno-lint-ignore camelcase
  const connection_parameters: ConnectionParams = {
    ...connection_options,
    database: connection_options.database as string,
    port: parseInt(connection_options.port, 10),
    user: connection_options.user as string,
  };

  if (isNaN(connection_parameters.port)) {
    throw new ConnectionParamsError(
      `Invalid port ${connection_parameters.port}`,
    );
  }

  return connection_parameters;
}
