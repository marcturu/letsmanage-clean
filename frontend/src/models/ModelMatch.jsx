import React from 'react';

class Match {
    constructor(object) {
        this._id = object.id
        this._name = object.name
        this._address = object.address
        this._city = object.city
        this._date = object.date
        this._hour = object.hour
        this._calledups = object.calledups
        this._finished = object.finished
        this._formation = object.formation
        this._imLocal = object.imLocal
        this._myTeam = object.myTeam
        this._myCorners = object.myCorners
        this._myFouls = object.myFouls
        this._myGoals = object.myGoals
        this._myPossession = object.myPossession
        this._myShots = object.myShots
        this._rivalTeam = object.rivalTeam
        this._rivalCorners = object.rivalCorners
        this._rivalFouls = object.rivalFouls
        this._rivalGoals = object.rivalGoals
        this._rivalPossession = object.rivalPossession
        this._rivalShots = object.rivalShots
        this._starters = object.starters
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get address() {
        return this._address;
    }
    get city() {
        return this._city;
    }
    get date() {   
        return this._date;
    }
    get hour() {   
        return this._hour;
    }
    get finished() {   
        return this._finished;
    }
    get formation() {   
        return this._formation;
    }
    get imLocal() {   
        return this._imLocal;
    }
    get myTeam() {   
        return this._myTeam;
    }
    get myCorners() {   
        return this._myCorners;
    }
    get myFouls() {   
        return this._myFouls;
    }
    get myGoals() {   
        return this._myGoals;
    }
    get myPossession() {   
        return this._myPossession;
    }
    get myShots() {   
        return this._myShots;
    }
    get rivalTeam() {   
        return this._rivalTeam;
    }
    get rivalCorners() {   
        return this._rivalCorners;
    }
    get rivalFouls() {   
        return this._rivalFouls;
    }
    get rivalGoals() {   
        return this._rivalGoals;
    }
    get rivalPossession() {   
        return this._rivalPossession;
    }
    get rivalShots() {   
        return this._rivalShots;
    }
    get starters() {   
        return this.starters;
    }
}

export default Match;