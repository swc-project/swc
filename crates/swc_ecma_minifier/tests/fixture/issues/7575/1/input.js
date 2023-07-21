export const envKey = "staging" || "production"

const environmentResolver = () => {
    if (envKey === "production") {
        return "production"
    }
    if (envKey === "staging") {
        return "staging"
    }
    if (envKey === "test") {
        return "test"
    }
    if (envKey === "development") {
        return "development"
    }
    throw new Error(`Unknown environment: ${envKey}`)
}
export const environment = environmentResolver()