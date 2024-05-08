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
    async getSystems() {
        const { data: systems } = await this.#requestManager.get('/systems', this.#token)
        return systems
    }

    /**
     * Get the waypoints for a given system.
     * @param {String} system the system to look for waypoints
     * @return {Promise}
     * @todo Return a proper data structure for the waypoints
     */
    async getWaypoints(system, page = 1) {
        const data = await this.#requestManager.get(`/systems/${system}/waypoints?page=${page}`, this.#token)
        const total = data.meta.total
        console.log(data);
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

    get symbol() {
        return this.#symbol
    }
    get cargo() {
        return this.#cargo
    }
    get cooldown() {
        return this.#cooldown
    }
    get crew() {
        return this.#crew
    }
    get engine() {
        return this.#engine
    }
    get frame() {
        return this.#frame
    }
    get fuel() {
        return this.#fuel
    }
    get modules() {
        return this.#modules
    }
    get mounts() {
        return this.#mounts
    }
    get nav() {
        return this.#nav
    }
    get reactor() {
        return this.#reactor
    }
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

    async jumpTo(system) {
        return await this.#navigationManager.jump(this.#symbol, system)
    }

    async warpTo(system) {
        return await this.#navigationManager.warp(this.#symbol, system)
    }

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

    async navigate(waypoint) {
        const nav = await this.#navigationManager.navigate(this.#symbol, waypoint)
        return nav
    }

    setFlightMode(flightMode) {
        return this.#navigationManager.setFlightMode(this.#symbol, flightMode)
    }

    async survey() {
        return await this.#navigationManager.survey(this.#symbol)
    }

    async extract(survey) {
        return await this.#navigationManager.extract(this.#symbol, survey)
    }

    async getWaypoints() {
        return await this.#navigationManager.getWaypoints(this.#nav.systemSymbol)
    }
}

class ShipNavStatus {
    static get IN_ORBIT() {
        return 'IN_ORBIT'
    }

    static get DOCKED() {
        return 'DOCKED'
    }

    static get IN_TRANSIT() {
        return 'IN_TRANSIT'
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

export default NavigationManager