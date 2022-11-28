//// [staticPropertyNameConflicts.ts]
//! 
//!   x the name `default` is exported multiple times
//!      ,-[132:1]
//!  132 |     
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
//!  147 |     
//!  148 |     // prototype
//!      `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
//! 
//!   x the name `default` is exported multiple times
//!      ,-[139:1]
//!  139 |     }
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
//!  155 |     
//!  156 |     module TestOnDefaultExportedClass_6 {
//!      `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
//! 
//!   x the name `default` is exported multiple times
//!      ,-[147:1]
//!  147 |     
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
//!  162 |     
//!  163 |     // caller
//!      `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
//! 
//!   x the name `default` is exported multiple times
//!      ,-[154:1]
//!  154 |     }
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
//!  170 |     
//!  171 |     module TestOnDefaultExportedClass_8 {
//!      `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
//! 
//!   x the name `default` is exported multiple times
//!      ,-[162:1]
//!  162 |     
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
//!  177 |     
//!  178 |     // arguments
//!      `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
//! 
//!   x the name `default` is exported multiple times
//!      ,-[169:1]
//!  169 |     }
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
//!  185 |     
//!  186 |     module TestOnDefaultExportedClass_10 {
//!      `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
//! 
//!   x the name `default` is exported multiple times
//!      ,-[177:1]
//!  177 |     
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
