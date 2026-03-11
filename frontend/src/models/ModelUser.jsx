import React from 'react';

class User {
    constructor(object) {
        this._username = object.username
        this._name = object.name
        this._surname = object.surname
        this._password = object.password
    }
    get username() {
        return this._username;
    }
    get name() {
        return this._name;
    }
    get surname() {
        return this._surname;
    }
    get password() {
        return this._password;
    }
}

export default User;