// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/ProvidedRequiredArgumentsRule.js


import inspect from '../../jsutils/inspect.js';
import keyMap from '../../jsutils/keyMap.js';
import { GraphQLError } from '../../error/GraphQLError.js';
import { Kind } from '../../language/kinds.js';
import { print } from '../../language/printer.js';
import { specifiedDirectives } from '../../type/directives.js';
import { isType, isRequiredArgument } from '../../type/definition.js';

/**
 * Provided required arguments
 *
 * A field or directive is only valid if all required (non-null without a
 * default value) field arguments have been provided.
 */
export function ProvidedRequiredArgumentsRule(context) {
  return { ...ProvidedRequiredArgumentsOnDirectivesRule(context),
    Field: {
      // Validate on leave to allow for deeper errors to appear first.
      leave(fieldNode) {
        const fieldDef = context.getFieldDef();

        if (!fieldDef) {
          return false;
        }
        /* istanbul ignore next (See https://github.com/graphql/graphql-js/issues/2203) */


        const argNodes = fieldNode.arguments ?? [];
        const argNodeMap = keyMap(argNodes, arg => arg.name.value);

        for (const argDef of fieldDef.args) {
          const argNode = argNodeMap[argDef.name];

          if (!argNode && isRequiredArgument(argDef)) {
            const argTypeStr = inspect(argDef.type);
            context.reportError(new GraphQLError(`Field "${fieldDef.name}" argument "${argDef.name}" of type "${argTypeStr}" is required, but it was not provided.`, fieldNode));
          }
        }
      }

    }
  };
}
/**
 * @internal
 */

export function ProvidedRequiredArgumentsOnDirectivesRule(context) {
  const requiredArgsMap = Object.create(null);
  const schema = context.getSchema();
  const definedDirectives = schema ? schema.getDirectives() : specifiedDirectives;

  for (const directive of definedDirectives) {
    requiredArgsMap[directive.name] = keyMap(directive.args.filter(isRequiredArgument), arg => arg.name);
  }

  const astDefinitions = context.getDocument().definitions;

  for (const def of astDefinitions) {
    if (def.kind === Kind.DIRECTIVE_DEFINITION) {
      /* istanbul ignore next (See https://github.com/graphql/graphql-js/issues/2203) */
      const argNodes = def.arguments ?? [];
      requiredArgsMap[def.name.value] = keyMap(argNodes.filter(isRequiredArgumentNode), arg => arg.name.value);
    }
  }

  return {
    Directive: {
      // Validate on leave to allow for deeper errors to appear first.
      leave(directiveNode) {
        const directiveName = directiveNode.name.value;
        const requiredArgs = requiredArgsMap[directiveName];

        if (requiredArgs) {
          /* istanbul ignore next (See https://github.com/graphql/graphql-js/issues/2203) */
          const argNodes = directiveNode.arguments ?? [];
          const argNodeMap = keyMap(argNodes, arg => arg.name.value);

          for (const argName of Object.keys(requiredArgs)) {
            if (!argNodeMap[argName]) {
              const argType = requiredArgs[argName].type;
              const argTypeStr = isType(argType) ? inspect(argType) : print(argType);
              context.reportError(new GraphQLError(`Directive "@${directiveName}" argument "${argName}" of type "${argTypeStr}" is required, but it was not provided.`, directiveNode));
            }
          }
        }
      }

    }
  };
}

function isRequiredArgumentNode(arg) {
  return arg.type.kind === Kind.NON_NULL_TYPE && arg.defaultValue == null;
}