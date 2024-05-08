import AgentManager from "./Agent.js";
import NavigationManager from "./Navigation.js";

export default class SpaceTradersClient {
    #agentManager = null
    
    #session = null

    constructor() {
        this.#agentManager = new AgentManager()
    }

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