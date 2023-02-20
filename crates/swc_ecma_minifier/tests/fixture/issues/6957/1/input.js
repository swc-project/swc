// prettier-ignore
export function foo() {
                                //    actual | expected
    alert(1..toFixed(1))        //     '1.0'   '1.0'
    alert(0..toFixed(0))        //       '0'   '0'
    alert(0..toFixed(1))        //       '0'   '0.0'
    alert(0..toFixed(2))        //       '0'   '0.00'
    alert(0..toFixed(3))        //       '0'   '0.000'
    alert(10..toFixed(1))       //      '10'   '10.0'
    alert(20..toFixed(2))       //    '20.0'   '20.00' 
    alert(30..toFixed(3))       //   '30.00'   '30.000' 
    alert(100..toFixed(1))      //     '100'   '100.0'
    alert(100..toFixed(2))      //     '100'   '100.00'
    alert(100..toFixed(3))      //   '100.0'   '100.000'
    alert(110..toFixed(1))      //     '110'   '110.0'
    alert(110..toFixed(2))      //     '110'   '110.00'
    alert(110..toFixed(3))      //   '110.0'   '110.000'
    alert(110..toFixed(4))      //  '110.00'   '110.000'
    alert(1110..toFixed(4))     //  '1110.0'   '1110.0000'
    alert(11110..toFixed(4))    //   '11110'   '11110.0000'
}
