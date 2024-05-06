import AgentManager from "./Agent.js";
import NavegationManager from "./Navigation.js";

export default class SpaceTradersClient {
    static instance = null

    #agentManager = null
    
    #session = null

    static getInstance() {
        if (this.instance == null) {
            this.instance = new SpaceTradersClient()
        }
        return this.instance
    }

    constructor() {
        this.#agentManager = new AgentManager()
    }

    getAgents() {
        const agents = this.#agentManager.getAgents()
        console.log(agents)
        return agents
    }
    
    newSession(token) {
        const agent = this.#agentManager.getAgent(token)

        session = new Session(agent)
    }

    logout() {

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


}