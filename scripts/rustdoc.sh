#!/bin/bash
set -eu

crate_name() {
    POSITIONAL=()
    while [[ $# -gt 0 ]]
    do
    key="$1"

    case $key in
        --crate-name)
        CRATE_NAME="$2"
        shift # past argument
        shift # past value
        ;;
        *)    # unknown option
        POSITIONAL+=("$1") # save it in an array for later
        shift # past argument
        ;;
    esac
    done
    set -- "${POSITIONAL[@]}" # restore positional parameters

    echo "$CRATE_NAME"
}

cr=$(crate_name "$@")
if [[ $cr == swc* ]]; then
    # We use this instead of --document-private-items to
    # make output simillar to usage from outside.
    #
    # e.g. this inlines self::stmt::*, and when we're using ecmascript::ast, 
    #   we can't use ecmascript::ast::stmt because it's private.  
#     rustdoc --passes strip-hidden,unindent-comments,\
# collapse-docs,strip-priv-imports,propagate-doc-cfg $@  
    rustdoc --document-private-items $@
else
    rustdoc $@
fi

