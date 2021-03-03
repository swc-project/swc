// Loaded from https://raw.githubusercontent.com/deno-postgres/deno-postgres/master/query/oid.ts


export const Oid = {
  bool: 16,
  bytea: 17,
  // TODO
  // Find out how to test char types
  char: 18,
  name: 19,
  int8: 20,
  int2: 21,
  // deno-lint-ignore camelcase
  _int2vector_0: 22,
  int4: 23,
  regproc: 24,
  text: 25,
  oid: 26,
  tid: 27,
  xid: 28,
  // deno-lint-ignore camelcase
  _cid_0: 29,
  // deno-lint-ignore camelcase
  _oidvector_0: 30,
  // deno-lint-ignore camelcase
  _pg_ddl_command: 32,
  // deno-lint-ignore camelcase
  _pg_type: 71,
  // deno-lint-ignore camelcase
  _pg_attribute: 75,
  // deno-lint-ignore camelcase
  _pg_proc: 81,
  // deno-lint-ignore camelcase
  _pg_class: 83,
  json: 114,
  // deno-lint-ignore camelcase
  _xml_0: 142,
  // deno-lint-ignore camelcase
  _xml_1: 143,
  // deno-lint-ignore camelcase
  _pg_node_tree: 194,
  // deno-lint-ignore camelcase
  json_array: 199,
  _smgr: 210,
  // deno-lint-ignore camelcase
  _index_am_handler: 325,
  point: 600,
  lseg: 601,
  path: 602,
  box: 603,
  polygon: 604,
  line: 628,
  // deno-lint-ignore camelcase
  line_array: 629,
  cidr: 650,
  // deno-lint-ignore camelcase
  cidr_array: 651,
  float4: 700,
  float8: 701,
  // deno-lint-ignore camelcase
  _abstime_0: 702,
  // deno-lint-ignore camelcase
  _reltime_0: 703,
  // deno-lint-ignore camelcase
  _tinterval_0: 704,
  _unknown: 705,
  circle: 718,
  // deno-lint-ignore camelcase
  circle_array: 719,
  // deno-lint-ignore camelcase
  _money_0: 790,
  // deno-lint-ignore camelcase
  _money_1: 791,
  macaddr: 829,
  inet: 869,
  // deno-lint-ignore camelcase
  bool_array: 1000,
  // deno-lint-ignore camelcase
  byte_array: 1001,
  // TODO
  // Find out how to test char types
  // deno-lint-ignore camelcase
  char_array: 1002,
  // deno-lint-ignore camelcase
  name_array: 1003,
  // deno-lint-ignore camelcase
  int2_array: 1005,
  // deno-lint-ignore camelcase
  _int2vector_1: 1006,
  // deno-lint-ignore camelcase
  int4_array: 1007,
  // deno-lint-ignore camelcase
  regproc_array: 1008,
  // deno-lint-ignore camelcase
  text_array: 1009,
  // deno-lint-ignore camelcase
  tid_array: 1010,
  // deno-lint-ignore camelcase
  xid_array: 1011,
  // deno-lint-ignore camelcase
  _cid_1: 1012,
  // deno-lint-ignore camelcase
  _oidvector_1: 1013,
  // deno-lint-ignore camelcase
  bpchar_array: 1014,
  // deno-lint-ignore camelcase
  varchar_array: 1015,
  // deno-lint-ignore camelcase
  int8_array: 1016,
  // deno-lint-ignore camelcase
  point_array: 1017,
  // deno-lint-ignore camelcase
  lseg_array: 1018,
  // deno-lint-ignore camelcase
  path_array: 1019,
  // deno-lint-ignore camelcase
  box_array: 1020,
  // deno-lint-ignore camelcase
  float4_array: 1021,
  // deno-lint-ignore camelcase
  float8_array: 1022,
  // deno-lint-ignore camelcase
  _abstime_1: 1023,
  // deno-lint-ignore camelcase
  _reltime_1: 1024,
  // deno-lint-ignore camelcase
  _tinterval_1: 1025,
  // deno-lint-ignore camelcase
  polygon_array: 1027,
  // deno-lint-ignore camelcase
  oid_array: 1028,
  // deno-lint-ignore camelcase
  _aclitem_0: 1033,
  // deno-lint-ignore camelcase
  _aclitem_1: 1034,
  // deno-lint-ignore camelcase
  macaddr_array: 1040,
  // deno-lint-ignore camelcase
  inet_array: 1041,
  bpchar: 1042,
  varchar: 1043,
  date: 1082,
  time: 1083,
  timestamp: 1114,
  // deno-lint-ignore camelcase
  timestamp_array: 1115,
  // deno-lint-ignore camelcase
  date_array: 1182,
  // deno-lint-ignore camelcase
  time_array: 1183,
  timestamptz: 1184,
  // deno-lint-ignore camelcase
  timestamptz_array: 1185,
  // deno-lint-ignore camelcase
  _interval_0: 1186,
  // deno-lint-ignore camelcase
  _interval_1: 1187,
  // deno-lint-ignore camelcase
  numeric_array: 1231,
  // deno-lint-ignore camelcase
  _pg_database: 1248,
  // deno-lint-ignore camelcase
  _cstring_0: 1263,
  timetz: 1266,
  // deno-lint-ignore camelcase
  timetz_array: 1270,
  // deno-lint-ignore camelcase
  _bit_0: 1560,
  // deno-lint-ignore camelcase
  _bit_1: 1561,
  // deno-lint-ignore camelcase
  _varbit_0: 1562,
  // deno-lint-ignore camelcase
  _varbit_1: 1563,
  numeric: 1700,
  // deno-lint-ignore camelcase
  _refcursor_0: 1790,
  // deno-lint-ignore camelcase
  _refcursor_1: 2201,
  regprocedure: 2202,
  regoper: 2203,
  regoperator: 2204,
  regclass: 2205,
  regtype: 2206,
  // deno-lint-ignore camelcase
  regprocedure_array: 2207,
  // deno-lint-ignore camelcase
  regoper_array: 2208,
  // deno-lint-ignore camelcase
  regoperator_array: 2209,
  // deno-lint-ignore camelcase
  regclass_array: 2210,
  // deno-lint-ignore camelcase
  regtype_array: 2211,
  // deno-lint-ignore camelcase
  _record_0: 2249,
  // deno-lint-ignore camelcase
  _cstring_1: 2275,
  _any: 2276,
  _anyarray: 2277,
  void: 2278,
  _trigger: 2279,
  // deno-lint-ignore camelcase
  _language_handler: 2280,
  _internal: 2281,
  _opaque: 2282,
  _anyelement: 2283,
  // deno-lint-ignore camelcase
  _record_1: 2287,
  _anynonarray: 2776,
  // deno-lint-ignore camelcase
  _pg_authid: 2842,
  // deno-lint-ignore camelcase
  _pg_auth_members: 2843,
  // deno-lint-ignore camelcase
  _txid_snapshot_0: 2949,
  uuid: 2950,
  // deno-lint-ignore camelcase
  uuid_varchar: 2951,
  // deno-lint-ignore camelcase
  _txid_snapshot_1: 2970,
  // deno-lint-ignore camelcase
  _fdw_handler: 3115,
  // deno-lint-ignore camelcase
  _pg_lsn_0: 3220,
  // deno-lint-ignore camelcase
  _pg_lsn_1: 3221,
  // deno-lint-ignore camelcase
  _tsm_handler: 3310,
  _anyenum: 3500,
  // deno-lint-ignore camelcase
  _tsvector_0: 3614,
  // deno-lint-ignore camelcase
  _tsquery_0: 3615,
  // deno-lint-ignore camelcase
  _gtsvector_0: 3642,
  // deno-lint-ignore camelcase
  _tsvector_1: 3643,
  // deno-lint-ignore camelcase
  _gtsvector_1: 3644,
  // deno-lint-ignore camelcase
  _tsquery_1: 3645,
  regconfig: 3734,
  // deno-lint-ignore camelcase
  regconfig_array: 3735,
  regdictionary: 3769,
  // deno-lint-ignore camelcase
  regdictionary_array: 3770,
  jsonb: 3802,
  // deno-lint-ignore camelcase
  jsonb_array: 3807,
  _anyrange: 3831,
  // deno-lint-ignore camelcase
  _event_trigger: 3838,
  // deno-lint-ignore camelcase
  _int4range_0: 3904,
  // deno-lint-ignore camelcase
  _int4range_1: 3905,
  // deno-lint-ignore camelcase
  _numrange_0: 3906,
  // deno-lint-ignore camelcase
  _numrange_1: 3907,
  // deno-lint-ignore camelcase
  _tsrange_0: 3908,
  // deno-lint-ignore camelcase
  _tsrange_1: 3909,
  // deno-lint-ignore camelcase
  _tstzrange_0: 3910,
  // deno-lint-ignore camelcase
  _tstzrange_1: 3911,
  // deno-lint-ignore camelcase
  _daterange_0: 3912,
  // deno-lint-ignore camelcase
  _daterange_1: 3913,
  // deno-lint-ignore camelcase
  _int8range_0: 3926,
  // deno-lint-ignore camelcase
  _int8range_1: 3927,
  // deno-lint-ignore camelcase
  _pg_shseclabel: 4066,
  regnamespace: 4089,
  // deno-lint-ignore camelcase
  regnamespace_array: 4090,
  regrole: 4096,
  // deno-lint-ignore camelcase
  regrole_array: 4097,
};
