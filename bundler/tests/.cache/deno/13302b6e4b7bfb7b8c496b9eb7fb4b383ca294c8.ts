// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/KnownArgumentNamesRule.js


import didYouMean from '../../jsutils/didYouMean.js';
import suggestionList from '../../jsutils/suggestionList.js';
import { GraphQLError } from '../../error/GraphQLError.js';
import { Kind } from '../../language/kinds.js';
import { specifiedDirectives } from '../../type/directives.js';

/**
 * Known argument names
 *
 * A GraphQL field is only valid if all supplied arguments are defined by
 * that field.
 */
export function KnownArgumentNamesRule(context) {
  return { ...KnownArgumentNamesOnDirectivesRule(context),

    Argument(argNode) {
      const argDef = context.getArgument();
      const fieldDef = context.getFieldDef();
      const parentType = context.getParentType();

      if (!argDef && fieldDef && parentType) {
        const argName = argNode.name.value;
        const knownArgsNames = fieldDef.args.map(arg => arg.name);
        const suggestions = suggestionList(argName, knownArgsNames);
        context.reportError(new GraphQLError(`Unknown argument "${argName}" on field "${parentType.name}.${fieldDef.name}".` + didYouMean(suggestions), argNode));
      }
    }

  };
}
/**
 * @internal
 */

export function KnownArgumentNamesOnDirectivesRule(context) {
  const directiveArgs = Object.create(null);
  const schema = context.getSchema();
  const definedDirectives = schema ? schema.getDirectives() : specifiedDirectives;

  for (const directive of definedDirectives) {
    directiveArgs[directive.name] = directive.args.map(arg => arg.name);
  }

  const astDefinitions = context.getDocument().definitions;

  for (const def of astDefinitions) {
    if (def.kind === Kind.DIRECTIVE_DEFINITION) {
      /* istanbul ignore next (See https://github.com/graphql/graphql-js/issues/2203) */
      const argsNodes = def.arguments ?? [];
      directiveArgs[def.name.value] = argsNodes.map(arg => arg.name.value);
    }
  }

  return {
    Directive(directiveNode) {
      const directiveName = directiveNode.name.value;
      const knownArgs = directiveArgs[directiveName];

      if (directiveNode.arguments && knownArgs) {
        for (const argNode of directiveNode.arguments) {
          const argName = argNode.name.value;

          if (knownArgs.indexOf(argName) === -1) {
            const suggestions = suggestionList(argName, knownArgs);
            context.reportError(new GraphQLError(`Unknown argument "${argName}" on directive "@${directiveName}".` + didYouMean(suggestions), argNode));
          }
        }
      }

      return false;
    }

  };
}