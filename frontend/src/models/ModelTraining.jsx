import React from 'react';

class Training {
    constructor(object) {
        this._id = object.id
        this._name = object.name
        this._address = object.address
        this._city = object.city
        this._year = object.year
        this._month = object.month
        this._day = object.day
        this._hour = object.hour
        this._pitchZone = object.pitchZone
        this._team = object.team
        this._coach = object.coach
        this._duration = object.duration
        this._exercises = object.exercises
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
    get year() {   
        return this._year;
    }
    get month() {   
        return this._month;
    }
    get day() {   
        return this._day;
    }
    get hour() {   
        return this._hour;
    }
    get pitchZone() {   
        return this._pitchZone;
    }
    get team() {   
        return this._team;
    }
    get coach() {   
        return this._coach;
    }
    get duration() {   
        return this._duration;
    }
    get exercises() {   
        return this._exercises;
    }
}

export default Training;