import AgentManager from "./Agent.js";
import NavigationManager from "./Navigation.js";

/**
 * Class representing a game instance. Get agents saved in local storage and create game Sessions.
 * 
 * This class is the main gateway to interact with the game.
 * 
 * First, a Session instance is needed. A Session encapsulates all interactions of the user with the game
 * and the lifetime from login to logout.
 * 
 * To do so, you can create an agent using {@linkcode createAgent()}. This will return a Session instance, which you can use to start interacting with the game.
 * 
 * If you already have an agent token, use {@linkcode startSession()} to start a new session with this agent.
 * 
 * @see{@link Session}
 */
class SpaceTradersClient {
    #agentManager = null
    
    #session = null

    /**
     * Create a Space Traders client.
     * Ideally, only one instance should exist at any time.
     * @class
     */
    constructor() {
        this.#agentManager = new AgentManager()
    }

    /**
     * Create a new agent and start a new session with it.
     * @param {string} callsign the name of the agent. All names are turned into uppercase.
     * @param {string} faction the starting faction.
     * @returns {Session} a session instance.
     * 
     * @see{@linkcode Session}
     */
    async createAgent(callsign, faction) {
        const agent = await this.#agentManager.createAgent(callsign, faction)
        this.#session = new Session(agent)
        return this.#session
    }

    /**
     * Retrieve all agents saves in the browser local storage.
     * @returns {Object} an object containing pairs of {callsign, token} for each agent.
     */
    getAgents() {
        const agents = this.#agentManager.getAgents()
        return agents
    }
    
    /**
     * Start a new session with the given agent token.
     * @param {string} token the agent token that will be use to log in.
     * @returns {Session} a session instance.
     * 
     * @see{@linkcode Session}
     */
    async startSession(token) {
        const agent = await this.#agentManager.getAgent(token)
        this.#session = new Session(agent)
        return this.#session
    }

    /**
     * Retrieve the current session.
     * 
     * @returns {Session|null} a session instance or null if there is no active session.
     */
    getSession() {
        return this.#session
    }

    /**
     * Finish the current session.
     */
    logout() {
        this.#session = null
    }
}

/**
 * Class representing the lifecycle of a session.
 */
class Session {
    #agent
    #navigationManager
    #factionManager

    /**
     * Create a new session with the Agent as owner.
     * @param {Agent} agent An Agent instance.
     * @class
     */
    constructor(agent) {
        this.#agent = agent
        this.#navigationManager = new NavigationManager(agent.token)
    }

    /**
     * Get the agent owner of this session.
     * @returns {Agent} the owner of this session.
     */
    getAgentInfo() {
        return this.#agent
    }

    /**
     * Get the ships that belong to this agent.
     * 
     * @returns {Array<Ship>} an array that contains Ships instances.
     */
    async getAgentShips() {
        return await this.#navigationManager.getShips()
    }

    /**
     * Get all the systems in the universe.
     * Note: Since the are thousand of systems, pagination is applied.
     * By default, the limit is 10 systems per page. To see more systems, increment {@linkcode page}.
     * @param {number} page the page number for pagination.
     * @returns {Array<Object>} an array that contains each system information.
     */
    async getSystems(page=1) {
        return await this.#navigationManager.getSystems(page)
    }
}

export default SpaceTradersClient