//// [staticPropertyNameConflicts.ts]
//! 
//!   x the name `default` is exported multiple times
//!      ,-[133:1]
//!  133 |     // length
//!  134 |     module TestOnDefaultExportedClass_3 {
//!  135 | ,->     export default class StaticLength {
//!  136 | |           static length: number; // error
//!  137 | |           length: string; // ok
//!  138 | |->     }
//!      : `---- previous exported here
//!  139 |     }
//!  140 |     
//!  141 |     module TestOnDefaultExportedClass_4 {
//!  142 | ,->     export default class StaticLengthFn {
//!  143 | |           static length() {} // error
//!  144 | |           length() {} // ok
//!  145 | |->     }
//!      : `---- exported more than once
//!  146 |     }
//!      `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
//! 
//!   x the name `default` is exported multiple times
//!      ,-[140:1]
//!  140 |     
//!  141 |     module TestOnDefaultExportedClass_4 {
//!  142 | ,->     export default class StaticLengthFn {
//!  143 | |           static length() {} // error
//!  144 | |           length() {} // ok
//!  145 | |->     }
//!      : `---- previous exported here
//!  146 |     }
//!  147 |     
//!  148 |     // prototype
//!  149 |     module TestOnDefaultExportedClass_5 {    
//!  150 | ,->     export default class StaticPrototype {
//!  151 | |           static prototype: number; // error
//!  152 | |           prototype: string; // ok
//!  153 | |->     }
//!      : `---- exported more than once
//!  154 |     }
//!      `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
//! 
//!   x the name `default` is exported multiple times
//!      ,-[148:1]
//!  148 |     // prototype
//!  149 |     module TestOnDefaultExportedClass_5 {    
//!  150 | ,->     export default class StaticPrototype {
//!  151 | |           static prototype: number; // error
//!  152 | |           prototype: string; // ok
//!  153 | |->     }
//!      : `---- previous exported here
//!  154 |     }
//!  155 |     
//!  156 |     module TestOnDefaultExportedClass_6 {
//!  157 | ,->     export default class StaticPrototypeFn {
//!  158 | |           static prototype() {} // error
//!  159 | |           prototype() {} // ok
//!  160 | |->     }
//!      : `---- exported more than once
//!  161 |     }
//!      `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
//! 
//!   x the name `default` is exported multiple times
//!      ,-[155:1]
//!  155 |     
//!  156 |     module TestOnDefaultExportedClass_6 {
//!  157 | ,->     export default class StaticPrototypeFn {
//!  158 | |           static prototype() {} // error
//!  159 | |           prototype() {} // ok
//!  160 | |->     }
//!      : `---- previous exported here
//!  161 |     }
//!  162 |     
//!  163 |     // caller
//!  164 |     module TestOnDefaultExportedClass_7 {
//!  165 | ,->     export default class StaticCaller {
//!  166 | |           static caller: number; // error
//!  167 | |           caller: string; // ok
//!  168 | |->     }
//!      : `---- exported more than once
//!  169 |     }
//!      `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
//! 
//!   x the name `default` is exported multiple times
//!      ,-[163:1]
//!  163 |     // caller
//!  164 |     module TestOnDefaultExportedClass_7 {
//!  165 | ,->     export default class StaticCaller {
//!  166 | |           static caller: number; // error
//!  167 | |           caller: string; // ok
//!  168 | |->     }
//!      : `---- previous exported here
//!  169 |     }
//!  170 |     
//!  171 |     module TestOnDefaultExportedClass_8 {
//!  172 | ,->     export default class StaticCallerFn {
//!  173 | |           static caller() {} // error
//!  174 | |           caller() {} // ok
//!  175 | |->     }
//!      : `---- exported more than once
//!  176 |     }
//!      `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
//! 
//!   x the name `default` is exported multiple times
//!      ,-[170:1]
//!  170 |     
//!  171 |     module TestOnDefaultExportedClass_8 {
//!  172 | ,->     export default class StaticCallerFn {
//!  173 | |           static caller() {} // error
//!  174 | |           caller() {} // ok
//!  175 | |->     }
//!      : `---- previous exported here
//!  176 |     }
//!  177 |     
//!  178 |     // arguments
//!  179 |     module TestOnDefaultExportedClass_9 {
//!  180 | ,->     export default class StaticArguments {
//!  181 | |           static arguments: number; // error
//!  182 | |           arguments: string; // ok
//!  183 | |->     }
//!      : `---- exported more than once
//!  184 |     }
//!      `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
//! 
//!   x the name `default` is exported multiple times
//!      ,-[178:1]
//!  178 |     // arguments
//!  179 |     module TestOnDefaultExportedClass_9 {
//!  180 | ,->     export default class StaticArguments {
//!  181 | |           static arguments: number; // error
//!  182 | |           arguments: string; // ok
//!  183 | |->     }
//!      : `---- previous exported here
//!  184 |     }
//!  185 |     
//!  186 |     module TestOnDefaultExportedClass_10 {
//!  187 | ,->     export default class StaticArgumentsFn {
//!  188 | |           static arguments() {} // error
//!  189 | |           arguments() {} // ok
//!  190 | |->     }
//!      : `---- exported more than once
//!  191 |     }
//!      `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
