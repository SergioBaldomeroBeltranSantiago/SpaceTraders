import AgentManager from "./Agent.js";
import NavegationManager from "./Navigation.js";

export default class SpaceTradersClient {
    #agentManager = null
    
    #session = null

    constructor() {
        this.#agentManager = new AgentManager()
    }

    getAgents() {
        const agents = this.#agentManager.getAgents()
        return agents
    }
    
    async newSession(token) {
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
    #navegationManager
    #factionManager

    constructor(agent) {
        this.#agent = agent
        this.#navegationManager = new NavegationManager(agent.token)
    }

    getAgentInfo() {
        return this.#agent
    }
}