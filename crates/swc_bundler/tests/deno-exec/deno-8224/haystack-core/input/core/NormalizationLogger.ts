/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

/**
 * Normalization logger.
 *
 * Each handler has a default message provided as well as a lexicon id
 * and arguments. A handler can use the default message or use the lexicon
 * key to look up and localized version of it accordingly.
 */
export interface NormalizationLogger {
    /**
     * Handle a warning.
     *
     * Halting normalization when this method is called
     * is down to the implementation. To halt normalization
     * here simply throw an error.
     *
     * @param message The default message.
     * @param lex The lexicon id the warning relates to.
     * @param args Any arguments used in the warning.
     * @throws An error if normalization is to halt.
     */
    warning(message: string, lex: string, args?: Record<string, string>): void;

    /**
     * Handle a error.
     *
     * Halting normalization when this method is called
     * is down to the implementation of the logger. To halt normalization
     * here simply throw an error to be strict.
     *
     * @param message The default message.
     * @param lex The lexicon id the warning relates to.
     * @param args Any arguments used in the warning.
     * @throws An error if normalization is to halt.
     */
    error(message: string, lex: string, args?: Record<string, string>): void;

    /**
     * Handle a fatal error message.
     *
     * Normalization cannot continue if this is reached.
     *
     * An error is always thrown indepentently of this method
     * being called.
     *
     * @param message The default message.
     * @param lex The lexicon id the warning relates to.
     * @param args Any arguments used in the warning.
     */
    fatal(message: string, lex: string, args?: Record<string, string>): void;
}

/**
 * The default normalization logger that logs all output directly
 * to the console without any localization.
 */
export class DefaultNormalizationLogger implements NormalizationLogger {
    public warning(message: string): void {
        console.warn(message);
    }

    public error(message: string): void {
        console.error(message);
    }

    public fatal(message: string): void {
        console.error(message);
    }
}

/**
 * The default messages to used in logging.
 *
 * It's expected these default messages are duplicated in any
 * localization handling used elsewhere. These are just a reference.
 */
const defaultNormalizationMessages: Record<string, string> = {
    invalidLib:
        "Invalid lib '{{libName}}'. Ensure a valid 'lib.trio' has been created with a valid lib dict",
    dictIsNotDefOrDefx:
        "Dict in '{{libName}}' is not a def or defx. A dict has been found in a lib that is not a def or defx",
    defAlreadyExists:
        "Def '{{libName}}.{{defName}}' already exists in lib '{{originalLibName}}'",
    couldNotFindLibForDef: "Could not find lib for '{{defName}}'",
    libNotFound:
        "'{{libName}}' not found. Please check all lib dependencies in '{{originalLibName}}' to ensure they exist and are valid",
    tagNotFoundInAnyLib:
        "Tag '{{defName}}' not found in any lib. Please ensure the tag is defined as a def in a dependent lib",
    defNotFound: "Def '{{defName}}' not found",
    invalidFeature:
        "Invalid feature for '{{defName}}'. Please ensure the feature name is formatted properly as 'feature:key'",
    defDoesNotDeclareIs:
        "Def '{{defName}}' does not declare an 'is' tag. Defaulting to marker. Please declare an 'is' tag for all non-feature defs",
    featureShouldNotDeclareIs:
        "Def feature '{{defName}}' should not declare an 'is' tag",
    cannotFindDefForDefx:
        "Cannot find def '{{defName}}' for defx declared in '{{libName}}'",
    cannotOverwriteDefTagFromDefx:
        "Cannot overwrite existing tag in def '{{defName}}.{{tag}}' using defx from '{{libName}}'. " +
        "A defx cannot overwrite an existing tag declared on a def. It can only add new tags.",
    cannotFindDefNode: "Cannot find def node for '{{defName}}'",
    tagIsNotKind: "Tag '{{defName}}.{{tag}}' should be '{{kind}}'",
    noComputed:
        "Cannot declare computed def '{{defName}}.{{tag}}'. It's illegal to declare the def '{{tag}}' in a def because it's marked as 'computed'",
    noDefIndex: "No def named 'index' allowed",
    tagInConjunctNotMarker:
        "'{{tag}}' is not a marker in conjunct '{{defName}}'",
    ofChoiceNotMarker: "`of` in choice '{{defName}}' must extend marker",
    cannotUseTagOnInConjunctOrFeature:
        "Cannot use 'tagOn' in conjunct or feature def '{{defName}}'",
    relationshipCannotBeUsedOnNonRef:
        "Relationship '{{tag}}' cannot be used on non-ref '{{defName}}",
};

/**
 * Returns the default message used for logging.
 *
 * @param lex The lexicon message id.
 * @param args The arguments for the message.
 * @returns The formatted message.
 */
export function formatNormalizationMessage(
    lex: string,
    args?: Record<string, string>
): string {
    let message = defaultNormalizationMessages[lex] ?? "Unknown";

    if (args) {
        for (const key of Object.keys(args)) {
            message = message.replace(`{{${key}}}`, args[key]);
        }
    }

    return message;
}
