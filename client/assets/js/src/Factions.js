import Requests from "./Request.js"

class FactionManager {
    #requestsManager

    constructor() {
        this.#requestsManager = new Requests()
    }

    async getFactions() {
        return await this.#requestsManager.get('/my/factions')
    }

    async getAgentFaction(token) {
        const data = await this.#requestsManager.get('/my/factions', token)

        return data.map(it => {
            const { symbol, name, description, headquarters, t, isRecruiting } = it
            
            const traits = t.map(it => {
                const { symbol, name, description } = it
                return new Trait(symbol, name, description)
            })

            return new Faction(symbol, name, description, headquarters, traits, isRecruiting)
        })
    }
}

class Faction {
    #symbol
    #name
    #description
    #headquarters
    #traits = []
    #isRecruiting

    constructor(symbol, name, description, headquarters, traits, isRecruiting) {
        this.#symbol = symbol
        this.#name = name
        this.#description = description
        this.#headquarters = headquarters
        this.#traits = traits
        this.#isRecruiting = isRecruiting
    }

    get symbol() {
        return this.#symbol
    }

    get name() {
        return this.#name
    }

    get description() {
        return this.#description
    }

    get headquarters() {
        return this.#headquarters
    }
    
    get isRecruiting() {
        return this.#isRecruiting
    }

    get traits() {
        return [...this.#traits]
    }
}

class Trait {
    #symbol
    #name
    #description

    constructor(symbol, name, description) {
        this.#symbol = symbol
        this.#name = name
        this.#description = description
    }

    get symbol() {
        return this.#symbol
    }

    get name() {
        return this.#name
    }

    get description() {
        return this.#description
    }
}

