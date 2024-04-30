import Requests from "./Request.js";

/**
 * Manage systems, waypoints and navigation.
 * This class needs a agent token so we don't have to pass it every request.
 */
export default class NavigationManager {
    #requestManager
    #token

    /**
     * @param {String} token the agent's token that will be used for futher requests
     * @class
     */
    constructor(token) {
        this.#requestManager = new Requests()
        this.#token = token
    }

    /**
     * Get the systems available in the universe.
     * @returns {Promise}
     * @todo Return a proper data structure for the system
     */
    getSystems() {
        return this.#requestManager.get('/systems', this.#token)
    }

    /**
     * Get the waypoints for a given system.
     * @param {String} system the system to look for waypoints
     * @return {Promise}
     * @todo Return a proper data structure for the waypoints
     */
    getWaypoint(system) {
        return this.#requestManager.get(`/systems/${system}/waypoints`, this.#token)
    }
}