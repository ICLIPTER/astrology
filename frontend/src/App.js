// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaHeart, FaSun, FaMoon, FaVenusMars } from 'react-icons/fa';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('daily');
  const [sign, setSign] = useState('Aries');
  const [horoscope, setHoroscope] = useState(null);
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [birthTime, setBirthTime] = useState('12:00');
  const [birthPlace, setBirthPlace] = useState('');
  const [compatibilitySign1, setCompatibilitySign1] = useState('Aries');
  const [compatibilitySign2, setCompatibilitySign2] = useState('Taurus');
  const [compatibility, setCompatibility] = useState(null);
  const [birthChart, setBirthChart] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'daily' && sign) {
      fetchHoroscope();
    }
  }, [activeTab, sign]);

  const fetchHoroscope = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/horoscope/${sign}`);
      setHoroscope(response.data);
    } catch (error) {
      console.error("Error fetching horoscope:", error);
      setHoroscope({
        sign,
        date: new Date().toLocaleDateString(),
        horoscope: "Unable to fetch horoscope at this time. Please try again later.",
        luckyNumber: Math.floor(Math.random() * 10) + 1,
        compatibility: ['Leo', 'Sagittarius'],
        mood: 'Unknown',
        color: 'Silver'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateBirthChart = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/birth-chart', {
        date: birthDate,
        time: birthTime,
        location: birthPlace
      });
      setBirthChart(response.data);
    } catch (error) {
      console.error("Error calculating birth chart:", error);
      setBirthChart({
        sunSign: sign,
        moonSign: 'Gemini',
        risingSign: 'Scorpio',
        mercurySign: 'Aquarius',
        venusSign: 'Pisces',
        marsSign: 'Leo',
        dominantPlanet: 'Jupiter',
        houses: [
          { house: 1, sign: 'Scorpio', planets: ['Sun'] },
          { house: 4, sign: 'Aquarius', planets: ['Moon'] },
          { house: 7, sign: 'Taurus', planets: ['Venus'] },
          { house: 10, sign: 'Leo', planets: ['Mars', 'Jupiter'] }
        ],
        aspects: [
          { planets: ['Sun', 'Moon'], aspect: 'Trine', influence: 'Harmonious energy between emotions and identity' },
          { planets: ['Mercury', 'Venus'], aspect: 'Conjunction', influence: 'Creative communication and social charm' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCompatibility = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/compatibility/${compatibilitySign1}/${compatibilitySign2}`);
      setCompatibility(response.data);
    } catch (error) {
      console.error("Error calculating compatibility:", error);
      setCompatibility({
        sign1: compatibilitySign1,
        sign2: compatibilitySign2,
        score: Math.floor(Math.random() * 40) + 60,
        strengths: [
          'Strong emotional connection',
          'Shared values and goals',
          'Mutual respect for independence'
        ],
        challenges: [
          'Different communication styles',
          'Potential for power struggles'
        ],
        advice: 'Focus on open communication and appreciate your differences. Your complementary qualities can create a powerful dynamic.'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderDailyHoroscope = () => (
    <div className="tab-content">
      <div className="sign-selector">
        <label>Select your zodiac sign:</label>
        <select value={sign} onChange={(e) => setSign(e.target.value)}>
          <option value="Aries">Aries ♈</option>
          <option value="Taurus">Taurus ♉</option>
          <option value="Gemini">Gemini ♊</option>
          <option value="Cancer">Cancer ♋</option>
          <option value="Leo">Leo ♌</option>
          <option value="Virgo">Virgo ♍</option>
          <option value="Libra">Libra ♎</option>
          <option value="Scorpio">Scorpio ♏</option>
          <option value="Sagittarius">Sagittarius ♐</option>
          <option value="Capricorn">Capricorn ♑</option>
          <option value="Aquarius">Aquarius ♒</option>
          <option value="Pisces">Pisces ♓</option>
        </select>
        <button onClick={fetchHoroscope} disabled={loading}>
          {loading ? 'Loading...' : 'Get Horoscope'}
        </button>
      </div>

      {horoscope && !loading && (
        <div className="horoscope-card">
          <div className="card-header">
            <h2>{horoscope.sign} Daily Horoscope</h2>
            <p>{horoscope.date}</p>
          </div>
          <div className="card-body">
            <p className="description">{horoscope.horoscope}</p>
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Mood:</span>
                <span className="value">{horoscope.mood}</span>
              </div>
              <div className="detail-item">
                <span className="label">Lucky Number:</span>
                <span className="value">{horoscope.luckyNumber}</span>
              </div>
              <div className="detail-item">
                <span className="label">Compatibility:</span>
                <span className="value">{horoscope.compatibility.join(', ')}</span>
              </div>
              <div className="detail-item">
                <span className="label">Color:</span>
                <span className="value">{horoscope.color}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBirthChart = () => (
    <div className="tab-content">
      <div className="birth-form">
        <h2>Calculate Your Birth Chart</h2>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input 
            type="date" 
            value={birthDate} 
            onChange={(e) => setBirthDate(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Time of Birth:</label>
          <input 
            type="time" 
            value={birthTime} 
            onChange={(e) => setBirthTime(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Place of Birth:</label>
          <input 
            type="text" 
            placeholder="City, Country" 
            value={birthPlace} 
            onChange={(e) => setBirthPlace(e.target.value)} 
          />
        </div>
        <button onClick={calculateBirthChart} disabled={loading}>
          {loading ? 'Calculating...' : 'Generate Birth Chart'}
        </button>
      </div>

      {birthChart && !loading && (
        <div className="birth-chart-results">
          <h2>Your Astrological Profile</h2>
          
          <div className="chart-section">
            <h3><FaSun /> Key Positions</h3>
            <div className="positions-grid">
              <div className="position-item">
                <span className="label">Sun Sign:</span>
                <span className="value">{birthChart.sunSign}</span>
              </div>
              <div className="position-item">
                <span className="label">Moon Sign:</span>
                <span className="value">{birthChart.moonSign}</span>
              </div>
              <div className="position-item">
                <span className="label">Rising Sign:</span>
                <span className="value">{birthChart.risingSign}</span>
              </div>
              <div className="position-item">
                <span className="label">Mercury Sign:</span>
                <span className="value">{birthChart.mercurySign}</span>
              </div>
              <div className="position-item">
                <span className="label">Venus Sign:</span>
                <span className="value">{birthChart.venusSign}</span>
              </div>
              <div className="position-item">
                <span className="label">Mars Sign:</span>
                <span className="value">{birthChart.marsSign}</span>
              </div>
              <div className="position-item">
                <span className="label">Dominant Planet:</span>
                <span className="value">{birthChart.dominantPlanet}</span>
              </div>
            </div>
          </div>

          <div className="chart-section">
            <h3><FaStar /> Notable Aspects</h3>
            <div className="aspects-list">
              {birthChart.aspects.map((aspect, index) => (
                <div key={index} className="aspect-item">
                  <div className="aspect-planets">
                    {aspect.planets.join(' - ')} <span className="aspect-type">{aspect.aspect}</span>
                  </div>
                  <div className="aspect-influence">{aspect.influence}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCompatibility = () => (
    <div className="tab-content">
      <div className="compatibility-form">
        <h2><FaVenusMars /> Sign Compatibility Checker</h2>
        <div className="sign-pair">
          <div className="form-group">
            <label>First Sign:</label>
            <select 
              value={compatibilitySign1} 
              onChange={(e) => setCompatibilitySign1(e.target.value)}
            >
              <option value="Aries">Aries ♈</option>
              <option value="Taurus">Taurus ♉</option>
              <option value="Gemini">Gemini ♊</option>
              <option value="Cancer">Cancer ♋</option>
              <option value="Leo">Leo ♌</option>
              <option value="Virgo">Virgo ♍</option>
              <option value="Libra">Libra ♎</option>
              <option value="Scorpio">Scorpio ♏</option>
              <option value="Sagittarius">Sagittarius ♐</option>
              <option value="Capricorn">Capricorn ♑</option>
              <option value="Aquarius">Aquarius ♒</option>
              <option value="Pisces">Pisces ♓</option>
            </select>
          </div>
          <div className="form-group">
            <label>Second Sign:</label>
            <select 
              value={compatibilitySign2} 
              onChange={(e) => setCompatibilitySign2(e.target.value)}
            >
              <option value="Aries">Aries ♈</option>
              <option value="Taurus">Taurus ♉</option>
              <option value="Gemini">Gemini ♊</option>
              <option value="Cancer">Cancer ♋</option>
              <option value="Leo">Leo ♌</option>
              <option value="Virgo">Virgo ♍</option>
              <option value="Libra">Libra ♎</option>
              <option value="Scorpio">Scorpio ♏</option>
              <option value="Sagittarius">Sagittarius ♐</option>
              <option value="Capricorn">Capricorn ♑</option>
              <option value="Aquarius">Aquarius ♒</option>
              <option value="Pisces">Pisces ♓</option>
            </select>
          </div>
        </div>
        <button onClick={calculateCompatibility} disabled={loading}>
          {loading ? 'Calculating...' : 'Check Compatibility'}
        </button>
      </div>

      {compatibility && !loading && (
        <div className="compatibility-results">
          <div className="compatibility-header">
            <h2>{compatibility.sign1} and {compatibility.sign2} Compatibility</h2>
            <div className="compatibility-score">
              <div className="score-circle">
                <span>{compatibility.score}%</span>
              </div>
              <div className="score-label">Compatibility Score</div>
            </div>
          </div>

          <div className="compatibility-details">
            <div className="strengths">
              <h3>Strengths</h3>
              <ul>
                {compatibility.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div className="challenges">
              <h3>Challenges</h3>
              <ul>
                {compatibility.challenges.map((challenge, index) => (
                  <li key={index}>{challenge}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="compatibility-advice">
            <h3>Relationship Advice</h3>
            <p>{compatibility.advice}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="header-content">
          <h1>✨ Celestial Insights ✨</h1>
          <p>Your personal astrology companion</p>
        </div>
      </header>

      <nav className="tabs">
        <button 
          className={activeTab === 'daily' ? 'active' : ''}
          onClick={() => setActiveTab('daily')}
        >
          Daily Horoscope
        </button>
        <button 
          className={activeTab === 'birth' ? 'active' : ''}
          onClick={() => setActiveTab('birth')}
        >
          Birth Chart
        </button>
        <button 
          className={activeTab === 'compatibility' ? 'active' : ''}
          onClick={() => setActiveTab('compatibility')}
        >
          Compatibility
        </button>
      </nav>

      <main className="app-content">
        {activeTab === 'daily' && renderDailyHoroscope()}
        {activeTab === 'birth' && renderBirthChart()}
        {activeTab === 'compatibility' && renderCompatibility()}
      </main>

      <footer className="app-footer">
        <p>© 2023 Celestial Insights</p>
        <p>Created with React.js and Node.js/Express</p>
      </footer>
    </div>
  );
}

export default App;