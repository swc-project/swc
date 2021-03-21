// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/specifiedRules.js


// Spec Section: "Executable Definitions"
import { ExecutableDefinitionsRule } from './rules/ExecutableDefinitionsRule.js'; // Spec Section: "Operation Name Uniqueness"

import { UniqueOperationNamesRule } from './rules/UniqueOperationNamesRule.js'; // Spec Section: "Lone Anonymous Operation"

import { LoneAnonymousOperationRule } from './rules/LoneAnonymousOperationRule.js'; // Spec Section: "Subscriptions with Single Root Field"

import { SingleFieldSubscriptionsRule } from './rules/SingleFieldSubscriptionsRule.js'; // Spec Section: "Fragment Spread Type Existence"

import { KnownTypeNamesRule } from './rules/KnownTypeNamesRule.js'; // Spec Section: "Fragments on Composite Types"

import { FragmentsOnCompositeTypesRule } from './rules/FragmentsOnCompositeTypesRule.js'; // Spec Section: "Variables are Input Types"

import { VariablesAreInputTypesRule } from './rules/VariablesAreInputTypesRule.js'; // Spec Section: "Leaf Field Selections"

import { ScalarLeafsRule } from './rules/ScalarLeafsRule.js'; // Spec Section: "Field Selections on Objects, Interfaces, and Unions Types"

import { FieldsOnCorrectTypeRule } from './rules/FieldsOnCorrectTypeRule.js'; // Spec Section: "Fragment Name Uniqueness"

import { UniqueFragmentNamesRule } from './rules/UniqueFragmentNamesRule.js'; // Spec Section: "Fragment spread target defined"

import { KnownFragmentNamesRule } from './rules/KnownFragmentNamesRule.js'; // Spec Section: "Fragments must be used"

import { NoUnusedFragmentsRule } from './rules/NoUnusedFragmentsRule.js'; // Spec Section: "Fragment spread is possible"

import { PossibleFragmentSpreadsRule } from './rules/PossibleFragmentSpreadsRule.js'; // Spec Section: "Fragments must not form cycles"

import { NoFragmentCyclesRule } from './rules/NoFragmentCyclesRule.js'; // Spec Section: "Variable Uniqueness"

import { UniqueVariableNamesRule } from './rules/UniqueVariableNamesRule.js'; // Spec Section: "All Variable Used Defined"

import { NoUndefinedVariablesRule } from './rules/NoUndefinedVariablesRule.js'; // Spec Section: "All Variables Used"

import { NoUnusedVariablesRule } from './rules/NoUnusedVariablesRule.js'; // Spec Section: "Directives Are Defined"

import { KnownDirectivesRule } from './rules/KnownDirectivesRule.js'; // Spec Section: "Directives Are Unique Per Location"

import { UniqueDirectivesPerLocationRule } from './rules/UniqueDirectivesPerLocationRule.js'; // Spec Section: "Argument Names"

import { KnownArgumentNamesRule, KnownArgumentNamesOnDirectivesRule } from './rules/KnownArgumentNamesRule.js'; // Spec Section: "Argument Uniqueness"

import { UniqueArgumentNamesRule } from './rules/UniqueArgumentNamesRule.js'; // Spec Section: "Value Type Correctness"

import { ValuesOfCorrectTypeRule } from './rules/ValuesOfCorrectTypeRule.js'; // Spec Section: "Argument Optionality"

import { ProvidedRequiredArgumentsRule, ProvidedRequiredArgumentsOnDirectivesRule } from './rules/ProvidedRequiredArgumentsRule.js'; // Spec Section: "All Variable Usages Are Allowed"

import { VariablesInAllowedPositionRule } from './rules/VariablesInAllowedPositionRule.js'; // Spec Section: "Field Selection Merging"

import { OverlappingFieldsCanBeMergedRule } from './rules/OverlappingFieldsCanBeMergedRule.js'; // Spec Section: "Input Object Field Uniqueness"

import { UniqueInputFieldNamesRule } from './rules/UniqueInputFieldNamesRule.js'; // SDL-specific validation rules

import { LoneSchemaDefinitionRule } from './rules/LoneSchemaDefinitionRule.js';
import { UniqueOperationTypesRule } from './rules/UniqueOperationTypesRule.js';
import { UniqueTypeNamesRule } from './rules/UniqueTypeNamesRule.js';
import { UniqueEnumValueNamesRule } from './rules/UniqueEnumValueNamesRule.js';
import { UniqueFieldDefinitionNamesRule } from './rules/UniqueFieldDefinitionNamesRule.js';
import { UniqueDirectiveNamesRule } from './rules/UniqueDirectiveNamesRule.js';
import { PossibleTypeExtensionsRule } from './rules/PossibleTypeExtensionsRule.js';
/**
 * This set includes all validation rules defined by the GraphQL spec.
 *
 * The order of the rules in this list has been adjusted to lead to the
 * most clear output when encountering multiple validation errors.
 */

export const specifiedRules = Object.freeze([ExecutableDefinitionsRule, UniqueOperationNamesRule, LoneAnonymousOperationRule, SingleFieldSubscriptionsRule, KnownTypeNamesRule, FragmentsOnCompositeTypesRule, VariablesAreInputTypesRule, ScalarLeafsRule, FieldsOnCorrectTypeRule, UniqueFragmentNamesRule, KnownFragmentNamesRule, NoUnusedFragmentsRule, PossibleFragmentSpreadsRule, NoFragmentCyclesRule, UniqueVariableNamesRule, NoUndefinedVariablesRule, NoUnusedVariablesRule, KnownDirectivesRule, UniqueDirectivesPerLocationRule, KnownArgumentNamesRule, UniqueArgumentNamesRule, ValuesOfCorrectTypeRule, ProvidedRequiredArgumentsRule, VariablesInAllowedPositionRule, OverlappingFieldsCanBeMergedRule, UniqueInputFieldNamesRule]);
/**
 * @internal
 */

export const specifiedSDLRules = Object.freeze([LoneSchemaDefinitionRule, UniqueOperationTypesRule, UniqueTypeNamesRule, UniqueEnumValueNamesRule, UniqueFieldDefinitionNamesRule, UniqueDirectiveNamesRule, KnownTypeNamesRule, KnownDirectivesRule, UniqueDirectivesPerLocationRule, PossibleTypeExtensionsRule, KnownArgumentNamesOnDirectivesRule, UniqueArgumentNamesRule, UniqueInputFieldNamesRule, ProvidedRequiredArgumentsOnDirectivesRule]);