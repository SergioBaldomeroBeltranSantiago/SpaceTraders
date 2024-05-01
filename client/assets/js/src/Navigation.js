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

    /**
     * Command a ship to warp to a given system.
     * Warping your ship moves it into interdimensional space, and it behaves very similar to normal waypoint travel in that it takes time and consumes normal fuel.
     * 
     * @param {string} ship the ship symbol to command
     * @param {string} system the symbol of the target system
     * @returns {Promise}
     */
    warp(ship, system) {
        const body = {
            systemSymbol: system,
          }
        return this.#requestManager.post(`/my/ships/${ship}/warp`, this.#token, body)
    }

    /**
     * Command a ship to jump to a given system.
     * Jumping a ship however is instantaneous, but it requires a jump drive and a unit of antimatter.
     * 
     * @param {string} ship the ship symbol to command
     * @param {string} system the symbol of the target system
     * @returns {Promise}
     */
    jump(ship, system) {
        const body = {
            systemSymbol: system,
          }
        return this.#requestManager.post(`/my/ships/${ship}/jump`, this.#token, body)
    }

    /**
     * Set flight mode for a ship.
     * 
     * @param {string} ship the ship symbol to command
     * @param {FlightMode} flightMode the flight mode
     * @returns {Promise}
     */
    setFlightMode(ship, flightMode) {

        if (!(flightMode in FlightMode)) throw TypeError('Incorrect flight mode')

        const body = {
            flightMode: flightMode,
          }

        return this.#requestManager.patch(`/my/ships/${ship}/nav`, this.#token, body)
    }
}

/**
 * Enum class for flight mode.
 * 
 * @enum {string}
 */
class FlightMode {

    /**
     * Cruise flight mode is the default mode for all ships. It consumes fuel at a normal rate and travels at a normal speed.
     * @readonly
     */
    static get CRUISE() {
        return 'CRUISE'
    }

    /**
     * Burn flight mode consumes fuel at a faster rate and travels at a faster speed.
     * @readonly
     */
    static get BURN() {
        return 'BURN'
    }

    /**
     * Drift flight mode consumes the least fuel and travels at a much slower speed. Drift mode is useful when your ship has run out of fuel and you need to conserve what little fuel you have left.
     * @readonly
     */
    static get DRIFT() {
        return 'DRIFT'
    }

    /**
     * Stealth flight mode runs with systems at a minimum, making it difficult to detect. It consumes fuel at a normal rate but travels at a reduced speed.
     * @readonly
     */
    static get STEALTH() {
        return 'STEALTH'
    }
}