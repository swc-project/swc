
set -eu

while IFS= read -r line
do
  echo "Checking $line"
  export TEST="$line"
  output=$(cargo test --test tests -- conformance || true)
  if [[ $output == *'Parser.parse_module'* ]]; then
    echo $line >> ./tests/ignored-parser-recovery-tests.txt
    echo "It's there!"
  fi
  # Check for Parser.parse_module returned Err()
done < "./tests/failure.txt"