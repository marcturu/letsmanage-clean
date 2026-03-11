import React from 'react';

class Player {
    constructor(object) {
        this._id = object.id
        this._name = object.name
        this._surname = object.surname
        this._surname2 = object.surname2
        this._height = object.height
        this._weight = object.weight
        this._phone = object.phone
        this._mail = object.mail
        this._DNI = object.DNI
        this._birthdate = object.birthdate
        this._nationality = object.nationality
        this._number = object.number
        this._photo = object.photo
        this._team = object.team
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get surname() {
        return this._surname;
    }
    get surname2() {
        return this._surname2;
    }
    get height() {   
        return this._height;
    }
    get weight() {   
        return this._weight;
    }
    get phone() {   
        return this._phone;
    }
    get mail() {   
        return this._mail;
    }
    get DNI() {   
        return this._DNI;
    }
    get birthdate() {   
        return this._birthdate;
    }
    get nationality() {   
        return this._nationality;
    }
    get number() {   
        return this._number;
    }
    get photo() {
        return this._photo;
    }
    get team() {
        return this._team;
    }
}

export default Player;