import Requests from "./Request.js";

/**
 * Manage systems, waypoints and navigation
 */
export default class NavigationManager{
    #requestManager
    #token

    constructor(token) {
        this.#requestManager = new Requests()
        this.#token = token
    }

    /**
     * get the systems available in the universe
     * @returns 
     */
    getSystems() {
        return this.#requestManager.get('/systems', this.#token)
    }

    /**
     * 
     * @param {String} system the system to look for waypoints
     */
    getWaypoint(system) {
        return this.#requestManager.get(`/systems/${system}/waypoints`, this.#token)
    }
}