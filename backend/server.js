// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock database
const horoscopes = {
  Aries: "Today brings new opportunities. Your bold approach will be rewarded.",
  Taurus: "Focus on stability and comfort. Good things come to those who wait.",
  Gemini: "Communication is key today. Connect with others and share ideas.",
  Cancer: "Trust your intuition. Your emotional intelligence is heightened.",
  Leo: "Your natural charisma shines. Take center stage and inspire others.",
  Virgo: "Attention to detail pays off. Organize and refine your projects.",
  Libra: "Seek balance in relationships. Compromise leads to harmony.",
  Scorpio: "Dive deep into mysteries. Your intensity can uncover truths.",
  Sagittarius: "Adventure calls! Explore new horizons and philosophies.",
  Capricorn: "Discipline brings rewards. Focus on long-term goals.",
  Aquarius: "Innovate and collaborate. Your unique ideas can inspire change.",
  Pisces: "Creativity flows. Trust your dreams and artistic impulses."
};

// API endpoints
app.get('/api/horoscope/:sign', (req, res) => {
  const sign = req.params.sign;
  if (horoscopes[sign]) {
    res.json({
      sign,
      date: new Date().toLocaleDateString(),
      horoscope: horoscopes[sign],
      luckyNumber: Math.floor(Math.random() * 10) + 1,
      compatibility: getCompatibility(sign),
      mood: ['Energetic', 'Reflective', 'Social', 'Creative'][Math.floor(Math.random() * 4)],
      color: ['Red', 'Green', 'Blue', 'Gold'][Math.floor(Math.random() * 4)]
    });
  } else {
    res.status(404).json({ error: 'Sign not found' });
  }
});

app.post('/api/birth-chart', (req, res) => {
  const { date, time, location } = req.body;
  
  // In a real app, we'd use an astrology library to calculate positions
  // Here we'll return mock data based on date
  const birthDate = new Date(date);
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  const sunSign = getSunSign(month, day);
  const moonSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                     'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const risingSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  
  res.json({
    sunSign,
    moonSign: moonSigns[Math.floor(Math.random() * 12)],
    risingSign: risingSigns[Math.floor(Math.random() * 12)],
    mercurySign: sunSign, // Simplification
    venusSign: sunSign, // Simplification
    dominantPlanet: ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter'][Math.floor(Math.random() * 6)],
    houses: generateHouses(),
    aspects: generateAspects()
  });
});

app.get('/api/compatibility/:sign1/:sign2', (req, res) => {
  const sign1 = req.params.sign1;
  const sign2 = req.params.sign2;
  
  const score = Math.floor(Math.random() * 40) + 60; // 60-100
  
  res.json({
    sign1,
    sign2,
    score,
    strengths: [
      'Strong emotional connection',
      'Shared values and goals',
      'Complementary personalities'
    ],
    challenges: [
      'Different communication styles',
      'Occasional power struggles',
      'Differing approaches to life'
    ],
    advice: 'Focus on open communication and appreciate your differences. Your complementary qualities can create a powerful dynamic.'
  });
});

// Helper functions
function getCompatibility(sign) {
  const compatibleSigns = {
    Aries: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
    Taurus: ['Virgo', 'Capricorn', 'Cancer', 'Pisces'],
    Gemini: ['Libra', 'Aquarius', 'Aries', 'Leo'],
    Cancer: ['Scorpio', 'Pisces', 'Taurus', 'Virgo'],
    Leo: ['Aries', 'Sagittarius', 'Gemini', 'Libra'],
    Virgo: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'],
    Libra: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'],
    Scorpio: ['Cancer', 'Pisces', 'Virgo', 'Capricorn'],
    Sagittarius: ['Aries', 'Leo', 'Libra', 'Aquarius'],
    Capricorn: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
    Aquarius: ['Gemini', 'Libra', 'Aries', 'Sagittarius'],
    Pisces: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn']
  };
  return compatibleSigns[sign] || [];
}

function getSunSign(month, day) {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
}

function generateHouses() {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const houses = [];
  for (let i = 1; i <= 12; i++) {
    houses.push({
      house: i,
      sign: signs[Math.floor(Math.random() * 12)],
      planets: i % 4 === 0 ? ['Sun'] : i % 3 === 0 ? ['Moon'] : []
    });
  }
  return houses;
}

function generateAspects() {
  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  const aspects = ['Conjunction', 'Sextile', 'Square', 'Trine', 'Opposition'];
  const result = [];
  
  for (let i = 0; i < 5; i++) {
    const planet1 = planets[Math.floor(Math.random() * planets.length)];
    let planet2;
    do {
      planet2 = planets[Math.floor(Math.random() * planets.length)];
    } while (planet2 === planet1);
    
    result.push({
      planets: [planet1, planet2],
      aspect: aspects[Math.floor(Math.random() * aspects.length)],
      influence: `${planet1} and ${planet2} form a ${aspects[Math.floor(Math.random() * aspects.length)]}, creating dynamic energy`
    });
  }
  
  return result;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});