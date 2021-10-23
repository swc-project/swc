export default function test() {
    const hasDataInReplicache = async (replicache) => {
        for await (const _ of []) {
            return true
        }
        return false
    }

    console.log(hasDataInReplicache())
    console.log(hasDataInReplicache())

}

test()
test()