// macro_rules! chain {
//     ($a:expr, $b:expr) => {{
//         use crate::pass::JoinedPass;

//         JoinedPass {
//             first: $a,
//             second: $b,
//         }
//     }};

//     ($a:expr, $b:expr,) => {
//         chain!($a, $b)
//     };

//     ($a:expr, $b:expr,  $($rest:tt)+) => {{
//         use crate::pass::JoinedPass;

//         JoinedPass {
//             first: $a,
//             second: chain!($b, $($rest)*),
//         }
//     }};
// }
