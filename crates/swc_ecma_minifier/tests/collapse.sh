#!/usr/bin/env bash

set -eu	


find ./tests/exec -name 'input.js' | while read -r input; do	
  dir="$(dirname $input)"	
  conf_json="$(dirname $input)/config.json"	
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
    let config = r###\"$(cat $conf_json)\"###;	
    run_exec_test(src, config);	
}"	
done 	
