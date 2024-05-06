import Requests from "./Request.js"

/**
 * Manages agents and their token. Use this class to create agents and save them to browser storage.
 */
export default class AgentManager {
    /**
     * @property key used to save and retrieve agents from browser local storage
     * @private
     */
    #key = 'agents'
    
    /**
     * @property a request manager to handle API requests
     * @private
     */
    #requestManager = null

    /*
     * Example schema to save agents to browser localStorage
     * {
     *      agents: [
     *          {"CALLSIGN": "TOKEN"}
     *      ]
     * }
     * 
     */

    /**
     * the current agent for this session. Its token will be used for futher requests
     */
    currentAgent = null
    
    /**
     * @class
     */
    constructor() {
        this.#requestManager = new Requests()
    }

    /**
     * Create a new agent and save to storage
     * 
     * @param {String} callsign the username for the new agent
     * @param {String} faction the faction
     * @function
     * @async
     */
    async createAgent(callsign, faction) {
        const trimmedCallsign = callsign.trim()
        const trimmedFaction = faction.trim()
        
        const body = await this.#requestManager.postGuest('/register', {
            symbol: trimmedCallsign,
            faction: trimmedFaction,
        })
    
        
        const { token, agent: { symbol } } = body.data

        this.#saveAgentToStorage(symbol, token)
        console.log('Agent created');
    }

    /**
     * Retrieves information about a given agent
     * 
     * @param {String} token the token unique to the agent
     * @function
     */
    getAgent(token) {
        
        this.#requestManager.get('/my/agent', token).then(body =>
            console.log(body)
        )

        return agent
    }

    /**
     * Retrieve the agents saved in local storage
     * 
     * @returns {Array} an array containing the agents
     * @function
     */
    getAgents() {
        const a = window.localStorage.getItem(this.#key)
        const agents = (a != null) ? JSON.parse(a).agents : []

        return agents.map(agent => new Agent(agent.callsign, agent.token))
    }

    /**
     * Set the current agent for this session
     * 
     * @param {Agent} agent the agent currently active for this session
     */
    setCurrentAgent(agent) {
        this.currentAgent = agent
    }

    /**
     * Save callsign and token to local storage
     * 
     * @param {String} callsign the username... I guess?
     * @param {String} token the unique token for this agent
     * @function
     * @private
     */
    #saveAgentToStorage(callsign, token) {
        // everything is a string so
        // we retrieve the string 'agents' saved in JSON format
        const a = window.localStorage.getItem(this.#key)

        // if not null then parse it as an Object
        // otherwise create a new one using the schema described above
        const agents = (a != null) ? JSON.parse(a) : { agents: [] }

        //const newAgent = { [callsign]: token}
        const newAgent = {
            callsign: callsign,
            token: token
        }

        agents.agents.push(newAgent)

        const json = JSON.stringify(agents)
        window.localStorage.setItem(this.#key, json)
    }
}

/**
 * Represents an agent in game.
 */
class Agent {

    /**
     * @param {String} callsign the agent's name
     * @param {String} token the unique token that identifies the agent
     * @class
     */
    constructor(callsign, token) {
        this.callsign = callsign
        this.token = token
    }
}
