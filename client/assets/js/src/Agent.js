import Requests from "./Request.js"

/**
 * Manages agents and their token. Use this class to create agents and save them to browser storage.
 */
export default class AgentManager {
    /**
     * Key used to saved and retrieve agents to browser localStorage
     */
    #key = 'agents'
    
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
    

    constructor() {
        this.#requestManager = new Requests()
    }

    /**
     * Create a new agent and return token if successful
     * @param {String} callsign the username for the new agent
     * @param {String} faction the faction
     */
    createAgent(callsign, faction) {
        const trimmedCallsign = callsign.trim()
        const trimmedFaction = faction.trim()
        
        this.#requestManager.send('/register', {
            symbol: trimmedCallsign,
            faction: trimmedFaction,
          })
          .then(res => res.json())
          .then(json => {
            console.log(json);
            const { token, agent: { symbol } } = json.data

            this.#saveAgentToStorage(symbol, token)
            console.log('Agent created');
          })
    }

    getAgents() {
        const a = window.localStorage.getItem(this.#key)
        return  (a != null) ? JSON.parse(a).agents : null
    }

    /**
     * 
     * @param {Agent} agent the agent currently active for this session
     */
    setCurrentAgent(agent) {
        this.currentAgent = agent
    }

    /**
     * 
     * @param {String} callsign the username... I guess?
     * @param {String} token the unique token for this agent
     */
    #saveAgentToStorage(callsign, token) {
        // everything is a string so
        // we retrieve the string 'agents' saved in JSON format
        const a = window.localStorage.getItem(this.#key)

        // if not null then parse it as an Object
        // otherwise create a new one using the schema described above
        const agents = (a != null) ? JSON.parse(a) : { agents: [] }

        const newAgent = { [callsign]: token}

        agents.agents.push(newAgent)

        const json = JSON.stringify(agents)
        window.localStorage.setItem(this.#key, json)
    }
}

class Agent {
    callsign
    token

    constructor(callsign, token) {
        this.callsign = callsign
        this.token = token
    }
}