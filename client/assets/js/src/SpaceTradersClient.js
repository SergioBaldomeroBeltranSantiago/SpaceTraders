import AgentManager from "./Agent.js";
import NavigationManager from "./Navigation.js";

/**
 * Class representing a game instance. Get agents saved in local storage and create game Sessions.
 */
export default class SpaceTradersClient {
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
     * @param {string} callsign 
     * @param {string} faction 
     * @returns 
     */
    async createAgent(callsign, faction) {
        const agent = await this.#agentManager.createAgent(callsign, faction)
        this.#session = new Session(agent)
        return this.#session
    }

    getAgents() {
        const agents = this.#agentManager.getAgents()
        return agents
    }
    
    async startSession(token) {
        const agent = await this.#agentManager.getAgent(token)
        this.#session = new Session(agent)
        return this.#session
    }

    getSession() {
        return this.#session
    }

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

    constructor(agent) {
        this.#agent = agent
        this.#navigationManager = new NavigationManager(agent.token)
    }

    getAgentInfo() {
        return this.#agent
    }

    async getAgentShips() {
        return await this.#navigationManager.getShips()
    }
}