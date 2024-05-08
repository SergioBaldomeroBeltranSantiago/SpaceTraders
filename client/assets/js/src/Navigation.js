import Requests from "./Request.js";

/**
 * Manage systems, waypoints and navigation.
 * This class needs a agent token so we don't have to pass it every request.
 */
class NavigationManager {
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
    async getSystems(page=1, limit=10) {
        const { data, meta } = await this.#requestManager.get(`/systems?page=${page}&limit=${limit}`, this.#token)
        const total = meta.total

        return data
    }

    /**
     * Get the waypoints for a given system.
     * @param {String} system the system to look for waypoints
     * @return {Promise}
     * @todo Return a proper data structure for the waypoints
     */
    async getWaypoints(system, page = 1, limit = 10) {
        const { data, meta } = await this.#requestManager.get(`/systems/${system}/waypoints?page=${page}&limit=${limit}`, this.#token)
        const total = meta.total

        return data.waypoints
    }

    async getShips() {
        const { data: ships } = await this.#requestManager.get('/my/ships', this.#token)
        console.log(ships);
        return ships.map(it => {
            return new Ship(it, this)
        })
    }

    /**
     * Command a ship to orbit.
     * A ship must be orbiting before it can travel.
     * 
     * @param {string} ship the ship symbol to command
     * @returns {Promise}
     */
    async orbit(ship) {
        const { data: { nav } } = await this.#requestManager.post(`/my/ships/${ship}/orbit`, this.#token)
        return nav
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
    async dock(ship) {
        const { data: { nav } } = await this.#requestManager.post(`/my/ships/${ship}/dock`, this.#token)
        return nav
    }

    async navigate(ship, waypoint) {
        const { data: { nav } } = await this.#requestManager.post(`/my/ships/${ship}/navigate`, this.#token, { waypointSymbol: waypoint })
        return nav
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

    survey(ship) {
        return this.#requestManager.post(`/my/ships/${ship}/survey`, this.#token)
    }

    extract(ship, survey = null) {
        return this.#requestManager.post(`/my/ships/${ship}/extract`, this.#token, survey ?? {})
    }
}

/**
 * Class representing a ship.
 * 
 * Use this class to command and give order.
 */
class Ship {
    #navigationManager

    #symbol
    #cargo
    #cooldown
    #crew
    #engine
    #frame
    #fuel
    #modules
    #mounts
    #nav
    #reactor
    #registration

    /**
     * Get the symbol that represents this ship.
     */
    get symbol() {
        return this.#symbol
    }
    /**
     * Get information about the cargo and capacity.
     */
    get cargo() {
        return this.#cargo
    }
    /**
     * Get the action cooldown for the ship.
     */
    get cooldown() {
        return this.#cooldown
    }
    /**
     * Get information about the crew.
     */
    get crew() {
        return this.#crew
    }
    /**
     * Get information about the engine equiped in the ship.
     */
    get engine() {
        return this.#engine
    }
    /**
     * Get information about the ship frame.
     */
    get frame() {
        return this.#frame
    }
    /**
     * Get information about the fuel.
     */
    get fuel() {
        return this.#fuel
    }
    /**
     * Get information about the modules installed in the ship.
     */
    get modules() {
        return this.#modules
    }
    /**
     * Get information about the mounts installed in the ship.
     */
    get mounts() {
        return this.#mounts
    }
    /**
     * Get information about the navegation.
     */
    get nav() {
        return this.#nav
    }
    /**
     * Get information about the reactor installed.
     */
    get reactor() {
        return this.#reactor
    }
    /**
     * Get information about the ship's owner.
     */
    get registration() {
        return this.#registration
    }

    /**
     * Create a new ship instance.
     * @class
     */
    constructor({ symbol, cargo, cooldown, crew, engine, frame, fuel, modules, mounts, nav, reactor, registration }, navigationManager) {
        this.#symbol = symbol
        this.#cargo = cargo
        this.#cooldown = cooldown
        this.#crew = crew
        this.#engine = engine
        this.#frame = frame
        this.#fuel = fuel
        this.#modules = modules
        this.#mounts = mounts
        this.#nav = nav
        this.#reactor = reactor
        this.#registration = registration

        this.#navigationManager = navigationManager
    }

    /**
     * Jump to the target system.
     * @param {string} system the symbol of the target system.
     * @returns 
     */
    async jumpTo(system) {
        return await this.#navigationManager.jump(this.#symbol, system)
    }

    /**
     * Warp to the target system.
     * @param {string} system the symbol of the target system.
     * @returns 
     */
    async warpTo(system) {
        return await this.#navigationManager.warp(this.#symbol, system)
    }

    /**
     * Command the ship to orbit.
     * @returns {boolean} true if the operation succeded. False otherwise.
     */
    async orbit() {
        try {
            const nav = await this.#navigationManager.orbit(this.#symbol)
            this.#nav = nav
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    /**
     * Command the ship to dock.
     * 
     * This command may fail if the ship is in transit.
     * @returns {boolean} true if the operation succeded. False otherwise.
     */
    async dock() {
        try {
            const nav = await this.#navigationManager.dock(this.#symbol)
            this.#nav = nav
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    /**
     * 
     * @param {string} waypoint the symbol of the target waypoint.
     * @returns {Object} an object with information about the navigation.
     */
    async navigate(waypoint) {
        const nav = await this.#navigationManager.navigate(this.#symbol, waypoint)
        return nav
    }

    /**
     * Set the ship's flight mode.
     * @param {FlightMode} flightMode the flight mode
     * @returns 
     */
    setFlightMode(flightMode) {
        return this.#navigationManager.setFlightMode(this.#symbol, flightMode)
    }

    /**
     * Survey the current waypoint for mining sites.
     * @returns {boolean} true if the operation succeded. False otherwise.
     */
    async survey() {
        try {
            const data = await this.#navigationManager.survey(this.#symbol)
            console.log(data);
            return true
        } catch (error) {
            console.error(error);
            return false
        }
    }

    /**
     * 
     * @param {Object} survey the survey object. Default is null.
     * @returns {boolean} true if the operation succeded. False otherwise.
     */
    async extract(survey = null) {
        try {
            const data = await this.#navigationManager.extract(this.#symbol, survey ?? {})
            console.log(data);
            return true
        } catch (error) {
            console.error(error);
            return false
        }
    }

    /**
     * 
     * @returns {Array<Object>} an array that contains waypoints for the current system the ship is in.
     */
    async getWaypoints() {
        return await this.#navigationManager.getWaypoints(this.#nav.systemSymbol)
    }
}

/**
 * Represents each possible navigation status.
 * 
 * @enum {string}
 * @class
 */
class ShipNavStatus {
    /**
     * The ship is in orbit.
     */
    static get IN_ORBIT() {
        return 'IN_ORBIT'
    }

    /**
     * The ship is docked.
     */
    static get DOCKED() {
        return 'DOCKED'
    }

    /**
     * The ship is traveling from a source to a destination.
     * See Ship#nav for more information.
     */
    static get IN_TRANSIT() {
        return 'IN_TRANSIT'
    }
}

/**
 * Represents each possible flight mode.
 * 
 * @enum {string}
 * @class
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

export default NavigationManager