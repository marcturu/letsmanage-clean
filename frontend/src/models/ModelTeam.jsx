import React from 'react';

class Team {
    constructor(object) {
        this._id = object.id
        this._club = object.club
        this._category = object.category
        this._letter = object.letter
        this._league = object.league
        this._points = object.points
        this._pointsRatio = object.pointsRatio
        this._gamesWon = object.gamesWon
        this._gamesLost = object.gamesLost
        this._localGoals = object.localGoals
        this._awayGoals = object.awayGoals
        this._localGoalsConceded = object.localGoalsConceded
        this._awayGoalsConceded = object.awayGoalsConceded
        this._winningStreak = object.winningStreak
        this._losingStreak = object.losingStreak
        this._strengths = object.strengths
        this._weaknesses = object.weaknesses
        this._teamPhoto = object.teamPhoto
    }
    get id() {
        return this._id;
    }
    get club() {
        return this._club;
    }
    get category() {
        return this._category;
    }
    get letter() {
        return this._letter;
    }
    get league() {   
        return this._league;
    }
    get points() {   
        return this._points;
    }
    get pointsRatio() {   
        return this._pointsRatio;
    }
    get gamesWon() {   
        return this._gamesWon;
    }
    get gamesLost() {   
        return this._gamesLost;
    }
    get localGoals() {   
        return this._localGoals;
    }
    get awayGoals() {   
        return this._awayGoals;
    }
    get localGoalsConceded() {   
        return this._localGoalsConceded;
    }
    get awayGoalsConceded() {   
        return this._awayGoalsConceded;
    }
    get winningStreak() {   
        return this._winningStreak;
    }
    get losingStreak() {   
        return this._losingStreak;
    }
    get strengths() {   
        return this._strengths;
    }
    get weaknesses() {   
        return this._weaknesses;
    }
    get teamPhoto() { 
        return this._teamPhoto;
    }
}

export default Team;