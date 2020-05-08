/**
 * Remove all service workers
 */
function unregister() {
    if (window.navigator && navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations()
            .then(function (registrations) {
                for (let registration of registrations) {
                    registration.unregister()
                }
            })
    }
}

unregister()
