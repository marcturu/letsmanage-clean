import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlayer } from '../api/Player/GetPlayer';
import { getPlayerCharacteristics } from '../api/Player/GetPlayerCharacteristics';
import { getPlayerStats } from '../api/Player/GetPlayerStats';
import { updatePlayer } from '../api/Player/UpdatePlayer';
import { updatePlayerCharacteristics } from '../api/Player/UpdatePlayerCharacteristics';
import '../CSS/CSSPlayer.css';

const ComponentPlayer = () => {
  const { idT, idP } = useParams();
  const [player, setPlayer] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [playerCharacteristics, setPlayerCharacteristics] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [selectedTab, setSelectedTab] = useState('characteristics');
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlayer, setEditedPlayer] = useState({});
  const [editedCharacteristics, setEditedCharacteristics] = useState({});

  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playerData = await getPlayer(username, idT, idP);
        setPlayer(playerData);

        const characteristicsData = await getPlayerCharacteristics(username, idT, idP);
        setPlayerCharacteristics(characteristicsData);

        const statsData = await getPlayerStats(username, idT, idP);
        setPlayerStats(statsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [username, idT, idP]);

  const handleEditButtonClick = () => {
    setIsEditing(true);

    setEditedPlayer({
      name: player.name || '',
      surname: player.surname || '',
      surname2: player.surname2 || '',
      number: player.number || '',
      height: player.height || '',
      weight: player.weight || '',
      phone: player.phone || '',
      mail: player.mail || '',
      birthdate: player.birthdate || '',
      DNI: player.DNI || '',
      nationality: player.nationality || '',
      photo: player.photo || '',
      team: player.team || ''
    });

    setEditedCharacteristics({
      position1: playerCharacteristics.position1 || '',
      position2: playerCharacteristics.position2 || '',
      dominantFoot: playerCharacteristics.dominantFoot || '',
      avgTechnicalLevel: playerCharacteristics.avgTechnicalLevel || '',
      avgTacticalLevel: playerCharacteristics.avgTacticalLevel || '',
      avgFatigue: playerCharacteristics.avgFatigue || '',
      avgHeartRate: playerCharacteristics.avgHeartRate || '',
      personalLifeLevel: playerCharacteristics.personalLifeLevel || '',
      drugUseLevel: playerCharacteristics.drugUseLevel || '',
      allergies: Array.isArray(playerCharacteristics.allergies) ? playerCharacteristics.allergies : [] 
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'height' || name === 'weight' || name === 'number' || name.startsWith('avg')) {
      formattedValue = parseFloat(value);
      if (isNaN(formattedValue)) {
        formattedValue = '';
      }
    }

    if (name === 'personalLifeLevel' || name === 'drugUseLevel') {
      formattedValue = parseFloat(value);
      if (isNaN(formattedValue)) {
        formattedValue = ''; 
      }
    }

    if (name === 'allergies') {
      formattedValue = value.split(',').map(item => item.trim()); 
    }

    setEditedPlayer((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));

    setEditedCharacteristics((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const handleSaveButtonClick = async () => {
    const dniRegex = /^\d{8}[A-Za-z]$/;
    if (!dniRegex.test(editedPlayer.DNI)) {
      alert('DNI must contain 8 digits followed by a letter.');
      return;
    }

    const height = parseFloat(editedPlayer.height);
    const weight = parseFloat(editedPlayer.weight);
    if (isNaN(height) || isNaN(weight)) {
      alert('Height and weight must be valid numbers.');
      return;
    }

    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(editedPlayer.phone)) {
      alert('Phone number must be exactly 9 digits.');
      return;
    }

    const birthdateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!birthdateRegex.test(editedPlayer.birthdate)) {
      alert('Birthdate must be in the format DD/MM/YYYY.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedPlayer.mail)) {
      alert('Email must contain a valid @ symbol.');
      return;
    }

    const validPositions = ['GK', 'CB', 'LB', 'RB', 'DM', 'CAM', 'RM', 'LM', 'AM', 'CF', 'LW', 'RW', 'ST'];
    if (!validPositions.includes(editedCharacteristics.position1)) {
      alert('Position1 must be one of the following: ' + validPositions.join(', '));
      return;
    }

    if (!validPositions.includes(editedCharacteristics.position2)) {
      alert('Position2 must be one of the following: ' + validPositions.join(', '));
      return;
    }

    const validFoots = ['Left', 'Right'];
    if (!validFoots.includes(editedCharacteristics.dominantFoot)) {
      alert('Dominant foot must be either "Left" or "Right".');
      return;
    }

    
    if (isNaN(editedCharacteristics.avgTechnicalLevel) || editedCharacteristics.avgTechnicalLevel < 0 || editedCharacteristics.avgTechnicalLevel > 10) {
      alert('Average technical level must be a number between 0 and 10.');
      return;
    }

    if (isNaN(editedCharacteristics.avgTacticalLevel) || editedCharacteristics.avgTacticalLevel < 0 || editedCharacteristics.avgTacticalLevel > 10) {
      alert('Average tactical level must be a number between 0 and 10.');
      return;
    }

    if (isNaN(editedCharacteristics.avgFatigue) || editedCharacteristics.avgFatigue < 0 || editedCharacteristics.avgFatigue > 10) {
      alert('Average fatigue must be a number between 0 and 10.');
      return;
    }

    if (isNaN(editedCharacteristics.avgHeartRate) || editedCharacteristics.avgHeartRate <= 0 || !Number.isInteger(editedCharacteristics.avgHeartRate)) {
      alert('Average heart rate must be a positive integer.');
      return;
    }

    if (isNaN(editedCharacteristics.personalLifeLevel) || editedCharacteristics.personalLifeLevel < 0 || editedCharacteristics.personalLifeLevel > 10) {
      alert('Personal life level must be a number between 0 and 10.');
      return;
    }

    if (isNaN(editedCharacteristics.drugUseLevel) || editedCharacteristics.drugUseLevel < 0 || editedCharacteristics.drugUseLevel > 10) {
      alert('Drug use level must be a number between 0 and 10.');
      return;
    }

    
    const filteredPlayerData = Object.keys(editedPlayer).reduce((acc, key) => {
      if (!key.startsWith('_')) {
        acc[key] = editedPlayer[key];
      }
      return acc;
    }, {});

    const filteredPlayerCharacteristicsData = Object.keys(editedCharacteristics).reduce((acc, key) => {
      if (!key.startsWith('_')) {
        acc[key] = editedCharacteristics[key];
      }
      return acc;
    }, {});

    filteredPlayerCharacteristicsData.allergies = Array.isArray(filteredPlayerCharacteristicsData.allergies) 
  ? filteredPlayerCharacteristicsData.allergies 
  : [];

    try {
      const formData = new FormData();
      for (const key in filteredPlayerData) {
        if (filteredPlayerData.hasOwnProperty(key)) {
          formData.append(key, filteredPlayerData[key]);
        }
      }
    
      if (photoFile) {
        formData.append('photo', photoFile);
      }
    
      const { response, responseBody } = await updatePlayer(username, idT, idP, formData);
      if (response.ok) {
        console.log('Player updated successfully:', responseBody);
    
        setPlayer({
          ...player,
          ...filteredPlayerData,
          photo: filteredPlayerData.photo || player.photo,
        }); 
      } else {
        console.error('Failed to update player data', response.status, response.statusText);
      }
        
      const { response: characteristicsResponse, responseBody: characteristicsResponseBody } = await updatePlayerCharacteristics(username, idT, idP, filteredPlayerCharacteristicsData);
      if (characteristicsResponse.ok) {
        console.log('Player characteristics updated successfully:', characteristicsResponseBody);

        setPlayerCharacteristics(filteredPlayerCharacteristicsData);
        } else {
          console.error('Failed to update player characteristics data', response.status, response.statusText);
        } 
    
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating player:', error);
    }
  };

  const handleCancelButtonClick = () => {
    setIsEditing(false);
    setEditedPlayer({});
    setEditedCharacteristics({});
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setEditedPlayer((prevData) => ({
        ...prevData,
        photo: URL.createObjectURL(file),
      }));
    }
  };

  if (!player) {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading players...</p>
        </div>
    );
  }

  return (
    <div className="player-detail">
      <div className="player-header">
        <div className="player-photo-corrected">
          {isEditing ? (
            <>
              <label> Photo:
                <input type="file" name="photo" onChange={handlePhotoChange} />
              </label>
              <img src={editedPlayer.photo || player.photo} alt={`${player.name} ${player.surname}`} />
              <div className="player-details">
                <label> Number: 
                  <input type="text" name="number" value={editedPlayer.number} onChange={handleInputChange} />
                </label>
              </div>
            </>
          ) : (
            <>
              <img src={player.photo} alt={`${player.name} ${player.surname}`} />
              <div className="player-number">
                Number: <strong>{player.number}</strong>
              </div>
            </>
          )}
        </div>
        <div className="player-info">
          <h2>{player.name} {player.surname} {player.surname2}</h2>
        </div>
        <div className="player-details">
          {isEditing ? (
            <>
              <label>Height: <input type="text" name="height" value={editedPlayer.height} onChange={handleInputChange} /></label>
              <label>Weight: <input type="text" name="weight" value={editedPlayer.weight} onChange={handleInputChange} /></label>
              <label>Phone: <input type="text" name="phone" value={editedPlayer.phone} onChange={handleInputChange} /></label>
              <label>Email: <input type="text" name="mail" value={editedPlayer.mail} onChange={handleInputChange} /></label>
              <label>DNI: <input type="text" name="DNI" value={editedPlayer.DNI} onChange={handleInputChange} /></label>
              <label>Birthdate: <input type="text" name="birthdate" value={editedPlayer.birthdate} onChange={handleInputChange} /></label>
              <label>Nationality: <input type="text" name="nationality" value={editedPlayer.nationality} onChange={handleInputChange} /></label>
              <div className="player-button-container">
                <button className="player-save-button" onClick={handleSaveButtonClick}>Save</button>
                <button className="player-cancel-button" onClick={handleCancelButtonClick}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p>Height: <strong>{player.height}</strong> cm</p>
              <p>Weight: <strong>{player.weight}</strong> kg</p>
              <p>Phone: <strong>{player.phone}</strong> </p>
              <p>Email: <strong>{player.mail}</strong> </p>
              <p>DNI: <strong>{player.DNI}</strong> </p>
              <p>Birthdate: <strong>{player.birthdate}</strong> </p>
              <p>Nationality: <strong>{player.nationality}</strong> </p>
            </>
          )}
        </div>
      </div>

      <div className="player-tabs">
        <div className="left-buttons">
          <button
            className={`button-player-3 ${selectedTab === 'characteristics' ? 'active' : ''}`}
            onClick={() => setSelectedTab('characteristics')}
          >
            Characteristics
          </button>
          <button
            className={`button-player-3 ${selectedTab === 'stats' ? 'active' : ''}`}
            onClick={() => setSelectedTab('stats')}
          >
            Stats
          </button>
        </div>
        <button
          className="button-player-3 player-edit-button"
          onClick={() => {
            handleEditButtonClick();
            setSelectedTab('characteristics');
          }}
        >
          Edit Player Information
        </button>
      </div>

      <div className="player-stats">
        <div className="player-stats-content">
          {selectedTab === 'characteristics' ? (
            <div className="player-characteristics">
              {isEditing ? (
                <>
                  <label>Position 1: <input type="text" name="position1" value={editedCharacteristics.position1} onChange={handleInputChange} /></label>
                  <label>Position 2: <input type="text" name="position2" value={editedCharacteristics.position2} onChange={handleInputChange} /></label>
                  <label>Dominant Foot: <input type="text" name="dominantFoot" value={editedCharacteristics.dominantFoot} onChange={handleInputChange} /></label>
                  <label>Avg Technical Level: <input type="number" name="avgTechnicalLevel" value={editedCharacteristics.avgTechnicalLevel} onChange={handleInputChange} /></label>
                  <label>Avg Tactical Level: <input type="number" name="avgTacticalLevel" value={editedCharacteristics.avgTacticalLevel} onChange={handleInputChange} /></label>
                  <label>Avg Fatigue: <input type="number" name="avgFatigue" value={editedCharacteristics.avgFatigue} onChange={handleInputChange} /></label>
                  <label>Avg Heart Rate: <input type="text" name="avgHeartRate" value={editedCharacteristics.avgHeartRate} onChange={handleInputChange} /></label>
                  <label>Personal Life Level: <input type="number" name="personalLifeLevel" value={editedCharacteristics.personalLifeLevel} onChange={handleInputChange} /></label>
                  <label>Drug Use Level: <input type="number" name="drugUseLevel" value={editedCharacteristics.drugUseLevel} onChange={handleInputChange} /></label>
                  <label>Allergies: <input type="text" name="allergies" value={editedCharacteristics.allergies} onChange={handleInputChange} /></label>
                </>
              ) : (
                <>
                  <div className="player-characteristic-item">
                    <strong>Position 1:</strong> {playerCharacteristics?.position1}
                  </div>
                  <div className="player-characteristic-item">
                    <strong>Position 2:</strong> {playerCharacteristics?.position2}
                  </div>
                  <div className="player-characteristic-item">
                    <strong>Dominant Foot:</strong> {playerCharacteristics?.dominantFoot}
                  </div>
                  <div className="player-characteristic-item">
                    <strong>Avg Technical Level:</strong> {playerCharacteristics?.avgTechnicalLevel}
                  </div>
                  <div className="player-characteristic-item">
                    <strong>Avg Tactical Level:</strong> {playerCharacteristics?.avgTacticalLevel}
                  </div>
                  <div className="player-characteristic-item">
                    <strong>Avg Fatigue:</strong> {playerCharacteristics?.avgFatigue}
                  </div>
                  <div className="player-characteristic-item">
                    <strong>Avg Heart Rate:</strong> {playerCharacteristics?.avgHeartRate}
                  </div>
                  <div className="player-characteristic-item">
                    <strong>Personal Life Level:</strong> {playerCharacteristics?.personalLifeLevel}
                  </div>
                  <div className="player-characteristic-item">
                    <strong>Drug Use Level:</strong> {playerCharacteristics?.drugUseLevel}
                  </div>
                  <div className="player-characteristic-item">
                    <strong>Allergies:</strong> {playerCharacteristics?.allergies?.join(', ') || ''}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="player-characteristics">
            <>
                  <div className="player-stat-item">
                    <strong>Time played:</strong> {playerStats?.timePlayed}
                  </div>
                  <div className="player-stat-item">
                    <strong>Goals:</strong> {playerStats?.goals}
                  </div>
                  <div className="player-stat-item">
                    <strong>Assists:</strong> {playerStats?.assists}
                  </div>
                  <div className="player-stat-item">
                    <strong>Yellow cards:</strong> {playerStats?.yellowCards}
                  </div>
                  <div className="player-stat-item">
                    <strong>Red cards:</strong> {playerStats?.redCards}
                  </div>
                  <div className="player-stat-item">
                    <strong>Shots:</strong> {playerStats?.shots}
                  </div>
                  <div className="player-stat-item">
                    <strong>Shots on target:</strong> {playerStats?.shotsOnTarget}
                  </div>
                  </>
                  </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentPlayer;
