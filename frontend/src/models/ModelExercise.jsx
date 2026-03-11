import React from 'react';

class Exercise {
    constructor(object) {
        this._id = object.id
        this._description = object.description
        this._duration = object.duration
        this._material = object.material
        this._personalized = object.personalized
        this._photo = object.photo
        this._type = object._type

    }
    get id() {
        return this._id;
    }
    get description() {
        return this._description;
    }
    get duration() {
        return this._duration;
    }
    get material() {   
        return this._material;
    }
    get personalized() {   
        return this._personalized;
    }
    get photo() {   
        return this._photo;
    }
    get type() {   
        return this._type;
    }
}

export default Exercise;