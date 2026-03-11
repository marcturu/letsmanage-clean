import React from 'react';

class PlayerStats {
    constructor(object) {
        this._id = object.id
        this._timePlayed = object.timePlayed
        this._goals = object.goals
        this._assists = object.assists
        this._yellowCards = object.yellowCards
        this._redCards = object.redCards
        this._shots = object.shots
        this._shotsOnTarget = object.shotsOnTarget
        this._player = object.player
    }
    get id() {
        return this._id;
    }
    get timePlayed() {
        return this._timePlayed;
    }
    get goals() {
        return this._goals;
    }
    get assists() {
        return this._assists;
    }
    get yellowCards() {   
        return this._yellowCards;
    }
    get redCards() {   
        return this._redCards;
    }
    get shots() {   
        return this._shots;
    }
    get shotsOnTarget() {   
        return this._shotsOnTarget;
    }
    get player() {   
        return this._player;
    }
}

export default PlayerStats;