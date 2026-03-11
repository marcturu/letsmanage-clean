import React from 'react';

class PlayerCharacteristics {
    constructor(object) {
        this._id = object.id
        this._position1 = object.position1
        this._position2 = object.position2
        this._dominantFoot = object.dominantFoot
        this._avgTechnicalLevel = object.avgTechnicalLevel
        this._avgTacticalLevel = object.avgTacticalLevel
        this._avgFatigue = object.avgFatigue
        this._avgHeartRate = object.avgHeartRate
        this._personalLifeLevel = object.personalLifeLevel
        this._drugUseLevel = object.drugUseLevel
        this._allergies = object.allergies
        this._player = object.player
    }
    get id() {
        return this._id;
    }
    get position1() {
        return this._position1;
    }
    get position2() {
        return this._position2;
    }
    get dominantFoot() {
        return this._dominantFoot;
    }
    get avgTechnicalLevel() {   
        return this._avgTechnicalLevel;
    }
    get avgTacticalLevel() {   
        return this._avgTacticalLevel;
    }
    get avgFatigue() {   
        return this._avgFatigue;
    }
    get avgHeartRate() {   
        return this._avgHeartRate;
    }
    get personalLifeLevel() {   
        return this._personalLifeLevel;
    }
    get drugUseLevel() {   
        return this._drugUseLevel;
    }
    get allergies() {   
        return this._allergies;
    }
    get player() {   
        return this._player;
    }
}

export default PlayerCharacteristics;