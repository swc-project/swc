#!/usr/bin/env bash

set -eu	


find ./tests/terser -name 'input.js' | while read -r input; do	
  dir="$(dirname $input)"	
  conf_json="$(dirname $input)/config.json"	
  conf_json="$(cat $conf_json)"	
  mangle_json="$(dirname $input)/mangle.json"	
  if [[ -f "$mangle_json" ]] ; then	
    mangle_json="Some(r###\"$(cat $mangle_json)\"###)"	
  else	
    mangle_json='None'	
  fi
  
  output="$(dirname $input)/output.js"	
  output_terser="$(dirname $input)/output.terser.js"	
  output="$(cat $output)"	
  output_terser="$(cat $output_terser)"	
  
  
  test_name="${dir/\.\//}";	
  test_name="${test_name//\//_}";	
  test_name="${test_name//\-/_}";	
  ignore_tag=""	

  if [[ "$test_name" = *"."* ]]; then	
    ignore_tag="#[ignore]"	
  fi	

  test_name="${test_name//\./}";	

  echo "	
#[test]$ignore_tag	
fn $test_name() {	
    let src = r###\"$(cat $input)\"###;	
    let compress = r###\"$conf_json\"###;	
    let mangle = $mangle_json;	
    
    let expected = r###\"$(cat $output)\"###;	
    let expected_terser = r###\"$(cat $output_terser)\"###;	
    
    run_test(src, compress, mangle);	
}"	
done 	
