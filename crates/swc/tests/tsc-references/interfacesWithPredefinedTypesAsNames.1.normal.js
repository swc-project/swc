//// [interfacesWithPredefinedTypesAsNames.ts]
//!   x interface name is invalid
//!    ,-[1:1]
//!  1 | interface any { }
//!    :           ^^^
//!  2 | interface number { }
//!  3 | interface string { }
//!  4 | interface boolean { }
//!    `----
//!   x interface name is invalid
//!    ,-[2:1]
//!  1 | interface any { }
//!  2 | interface number { }
//!    :           ^^^^^^
//!  3 | interface string { }
//!  4 | interface boolean { }
//!  5 | interface void {}
//!    `----
//!   x interface name is invalid
//!    ,-[3:1]
//!  1 | interface any { }
//!  2 | interface number { }
//!  3 | interface string { }
//!    :           ^^^^^^
//!  4 | interface boolean { }
//!  5 | interface void {}
//!  6 | interface unknown {}
//!    `----
//!   x interface name is invalid
//!    ,-[4:1]
//!  1 | interface any { }
//!  2 | interface number { }
//!  3 | interface string { }
//!  4 | interface boolean { }
//!    :           ^^^^^^^
//!  5 | interface void {}
//!  6 | interface unknown {}
//!  7 | interface never {}
//!    `----
//!   x interface name is invalid
//!    ,-[5:1]
//!  2 | interface number { }
//!  3 | interface string { }
//!  4 | interface boolean { }
//!  5 | interface void {}
//!    :           ^^^^
//!  6 | interface unknown {}
//!  7 | interface never {}
//!    `----
//!   x interface name is invalid
//!    ,-[6:1]
//!  3 | interface string { }
//!  4 | interface boolean { }
//!  5 | interface void {}
//!  6 | interface unknown {}
//!    :           ^^^^^^^
//!  7 | interface never {}
//!    `----
//!   x interface name is invalid
//!    ,-[7:1]
//!  4 | interface boolean { }
//!  5 | interface void {}
//!  6 | interface unknown {}
//!  7 | interface never {}
//!    :           ^^^^^
//!    `----
