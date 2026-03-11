import React from 'react';

class Club {
    constructor(object) {
        this._id = object.id
        this._city = object.city
        this._location = object.location
        this._photo = object.photo

    }
    get id() {
        return this._id;
    }
    get city() {
        return this._city;
    }
    get location() {
        return this._location;
    }
    get photo() {   
        return this._photo;
    }
}

export default Club;