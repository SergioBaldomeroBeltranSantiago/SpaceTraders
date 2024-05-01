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

    /**
     * Command a ship to orbit.
     * A ship must be orbiting before it can travel.
     * 
     * @param {string} ship the ship symbol to command
     * @returns {Promise}
     */
    orbit(ship) {
        return this.#requestManager.post(`/my/ships/${ship}/orbit`, this.#token)
    }

    /**
     * Command a ship to dock.
     * Docked ships cannot travel.
     * They must be sent to orbit before they can travel.
     * Use the function orbit() to send a ship to orbit.
     * 
     * @param {string} ship the ship symbol to command
     * @return {Promise}
     */
    dock(ship) {
        return this.#requestManager.post(`/my/ships/${ship}/dock`, this.#token)
    }
}