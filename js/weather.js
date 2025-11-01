// Weather API Configuration
const WEATHER_API_KEY = '24f068508b584a36b64115406253110';
const WEATHER_API_URL = 'https://api.weatherapi.com/v1/forecast.json';
const ALERTS_API_URL = 'https://api.weatherapi.com/v1/forecast.json';

// DOM Elements
const weatherForecast = document.getElementById('weatherForecast');
const weatherContainer = document.getElementById('weatherContainer');

// Weather Icons Mapping
const weatherIcons = {
    '1000': '☀️',  // Sunny
    '1003': '⛅',  // Partly cloudy
    '1006': '☁️',  // Cloudy
    '1009': '☁️',  // Overcast
    '1030': '🌫️',  // Mist
    '1063': '🌧️',  // Patchy rain possible
    '1066': '🌨️',  // Patchy snow possible
    '1069': '🌨️',  // Patchy sleet possible
    '1072': '🌧️',  // Patchy freezing drizzle possible
    '1087': '⛈️',  // Thundery outbreaks possible
    '1114': '❄️',  // Blowing snow
    '1117': '❄️',  // Blizzard
    '1135': '🌫️',  // Fog
    '1147': '🌫️',  // Freezing fog
    '1150': '🌧️',  // Patchy light drizzle
    '1153': '🌧️',  // Light drizzle
    '1168': '🌧️',  // Freezing drizzle
    '1171': '🌧️',  // Heavy freezing drizzle
    '1180': '🌧️',  // Patchy light rain
    '1183': '🌧️',  // Light rain
    '1186': '🌧️',  // Moderate rain at times
    '1189': '🌧️',  // Moderate rain
    '1192': '🌧️',  // Heavy rain at times
    '1195': '🌧️',  // Heavy rain
    '1198': '🌧️',  // Light freezing rain
    '1201': '🌧️',  // Moderate or heavy freezing rain
    '1204': '🌨️',  // Light sleet
    '1207': '🌨️',  // Moderate or heavy sleet
    '1210': '🌨️',  // Patchy light snow
    '1213': '🌨️',  // Light snow
    '1216': '🌨️',  // Patchy moderate snow
    '1219': '🌨️',  // Moderate snow
    '1222': '🌨️',  // Patchy heavy snow
    '1225': '🌨️',  // Heavy snow
    '1237': '❄️',  // Ice pellets
    '1240': '🌧️',  // Light rain shower
    '1243': '🌧️',  // Moderate or heavy rain shower
    '1246': '🌧️',  // Torrential rain shower
    '1249': '🌨️',  // Light sleet showers
    '1252': '🌨️',  // Moderate or heavy sleet showers
    '1255': '🌨️',  // Light snow showers
    '1258': '🌨️',  // Moderate or heavy snow showers
    '1261': '❄️',  // Light showers of ice pellets
    '1264': '❄️',  // Moderate or heavy showers of ice pellets
    '1273': '⛈️',  // Patchy light rain with thunder
    '1276': '⛈️',  // Moderate or heavy rain with thunder
    '1279': '⛈️',  // Patchy light snow with thunder
    '1282': '⛈️'   // Moderate or heavy snow with thunder
};

// Initialize weather functionality
function initWeather() {
    // Show weather section
    weatherForecast.classList.remove('hidden');
    
    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                // Update user's location in local storage
                updateUserLocation(latitude, longitude);
                // Fetch weather and disaster data
                await Promise.all([
                    fetchWeatherData(latitude, longitude),
                    fetchDisasterPredictions(latitude, longitude)
                ]);
            },
            (error) => {
                console.error('Error getting location:', error);
                // Default to New York if location access is denied
                fetchWeatherData(40.7128, -74.0060);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        console.log('Geolocation is not supported by this browser.');
        // Default to New York if geolocation is not supported
        fetchWeatherData(40.7128, -74.0060);
    }
}

// Update user's location in local storage
function updateUserLocation(lat, lon) {
    try {
        const user = JSON.parse(localStorage.getItem('currentUser')) || {};
        user.latitude = lat;
        user.longitude = lon;
        localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
        console.error('Error updating user location:', error);
    }
}

// Fetch weather data from weatherapi.com
async function fetchWeatherData(lat, lon) {
    try {
        const days = 7; // Get 7-day forecast
        const aqi = 'yes'; // Include air quality data
        const alerts = 'yes'; // Include weather alerts
        
        const response = await fetch(
            `${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=${days}&aqi=${aqi}&alerts=${alerts}`
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Weather data not available');
        }
        
        const data = await response.json();
        
        // Display weather forecast
        displayWeatherForecast(data.forecast.forecastday);
        
        // Display any weather alerts
        if (data.alerts && data.alerts.alert && data.alerts.alert.length > 0) {
            displayWeatherAlerts(data.alerts.alert);
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayError(`Failed to load weather data: ${error.message}`);
        throw error; // Re-throw to handle in the calling function if needed
    }
}

// Fetch disaster predictions based on weather data
async function fetchDisasterPredictions(lat, lon) {
    try {
        // First get the current weather conditions
        const response = await fetch(
            `${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=1&aqi=no&alerts=yes`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data for disaster prediction');
        }
        
        const data = await response.json();
        
        // Analyze weather conditions for potential disasters
        const predictions = analyzeForDisasters(data);
        
        // Display disaster predictions
        displayDisasterPredictions(predictions);
        
        return predictions;
    } catch (error) {
        console.error('Error in disaster prediction:', error);
        displayError('Unable to generate disaster predictions');
        return [];
    }
}

// Analyze weather data for potential disasters
function analyzeForDisasters(weatherData) {
    const predictions = [];
    const current = weatherData.current;
    const forecast = weatherData.forecast?.forecastday[0]?.day;
    const alerts = weatherData.alerts?.alert || [];
    
    // Check for extreme weather conditions
    if (current.temp_c > 40) {
        predictions.push({
            type: 'Heat Wave',
            severity: 'High',
            description: 'Extreme heat conditions detected. Risk of heat-related illnesses.',
            precautions: [
                'Stay hydrated and avoid prolonged sun exposure',
                'Wear lightweight and light-colored clothing',
                'Avoid strenuous outdoor activities during peak heat hours',
                'Check on vulnerable individuals'
            ]
        });
    }
    
    if (current.precip_mm > 50 || (forecast?.totalprecip_mm > 50)) {
        predictions.push({
            type: 'Heavy Rainfall',
            severity: 'High',
            description: 'Heavy rainfall expected. Risk of flooding in low-lying areas.',
            precautions: [
                'Avoid crossing flooded roads or walking through moving water',
                'Be aware of flash flood risks',
                'Ensure proper drainage around your property',
                'Have an emergency kit ready'
            ]
        });
    }
    
    if (current.wind_kph > 50) {
        predictions.push({
            type: 'Strong Winds',
            severity: 'Medium',
            description: 'Strong wind conditions detected. Potential for property damage and travel disruptions.',
            precautions: [
                'Secure loose outdoor items',
                'Be cautious of falling branches or debris',
                'Avoid unnecessary travel',
                'Stay away from damaged buildings'
            ]
        });
    }
    
    // Add any official weather alerts
    alerts.forEach(alert => {
        predictions.push({
            type: alert.headline || 'Weather Alert',
            severity: alert.severity || 'High',
            description: alert.desc || 'Official weather alert in effect',
            precautions: [
                'Follow local authority instructions',
                'Stay informed about the situation',
                'Be prepared to evacuate if necessary',
                'Have an emergency kit ready'
            ]
        });
    });
    
    return predictions;
}

// Display weather forecast
function displayWeatherForecast(forecastDays) {
    // Clear loading message
    weatherContainer.innerHTML = '';
    
    // Create a card for each day
    forecastDays.forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const maxTemp = Math.round(day.day.maxtemp_c);
        const minTemp = Math.round(day.day.mintemp_c);
        const condition = day.day.condition.text;
        const iconCode = day.day.condition.code;
        const icon = weatherIcons[iconCode] || '❓';
        
        // Get weather condition class for styling
        const conditionClass = getWeatherCondition(day.day.condition.text);
        
        // Create weather card
        const card = document.createElement('div');
        card.className = `weather-card ${conditionClass}`;
        card.innerHTML = `
            <div class="weather-date">${dayName}<br>${dateStr}</div>
            <div class="weather-icon">${icon}</div>
            <div class="weather-temp">${maxTemp}° / ${minTemp}°C</div>
            <div class="weather-desc">${condition}</div>
            <div class="weather-details">
                <div class="weather-detail">
                    <i class="fas fa-tint"></i>
                    <span>${day.day.avghumidity}%</span>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-wind"></i>
                    <span>${Math.round(day.day.maxwind_kph)} km/h</span>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-cloud-rain"></i>
                    <span>${day.day.daily_chance_of_rain}%</span>
                </div>
            </div>
            <div class="weather-detail">
                <span>Feels like:</span>
                <span>${Math.round(day.day.feelslike_c)}°C</span>
            </div>
            <div class="weather-detail">
                <span>Humidity:</span>
                <span>${day.day.avghumidity}%</span>
            </div>
            <div class="weather-detail">
                <span>Wind:</span>
                <span>${Math.round(day.day.maxwind_kph)} km/h</span>
            </div>
        `;
        
        weatherContainer.appendChild(card);
    });
}

// Map weather conditions to CSS classes
function getWeatherCondition(conditionText) {
    const lowerCondition = conditionText.toLowerCase();
    
    if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
        return 'thunderstorm';
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
        return 'rain';
    } else if (lowerCondition.includes('snow') || lowerCondition.includes('sleet') || lowerCondition.includes('blizzard')) {
        return 'snow';
    } else if (lowerCondition.includes('fog') || lowerCondition.includes('mist') || lowerCondition.includes('haze')) {
        return 'mist';
    } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
        return 'clouds';
    } else if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
        return 'clear';
    } else if (lowerCondition.includes('wind') || lowerCondition.includes('breez')) {
        return 'windy';
    } else if (lowerCondition.includes('hot') || lowerCondition.includes('heat')) {
        return 'hot';
    } else if (lowerCondition.includes('cold') || lowerCondition.includes('freez')) {
        return 'cold';
    }
    
    return 'default';
}

// Display error message
function displayError(message) {
    weatherContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
}

// Display weather alerts
function displayWeatherAlerts(alerts) {
    const alertsContainer = document.createElement('div');
    alertsContainer.className = 'weather-alerts';
    
    alertsContainer.innerHTML = `
        <div class="alerts-header">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Weather Alerts</h3>
        </div>
        <div class="alerts-list">
            ${alerts.map(alert => `
                <div class="alert-item">
                    <div class="alert-severity ${alert.severity?.toLowerCase() || 'moderate'}">
                        ${alert.severity || 'Alert'}
                    </div>
                    <div class="alert-content">
                        <h4>${alert.headline || 'Weather Alert'}</h4>
                        <p>${alert.desc || 'No additional details available.'}</p>
                        <div class="alert-meta">
                            <span><i class="far fa-clock"></i> ${new Date(alert.effective || new Date()).toLocaleString()}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${alert.areas || 'Your area'}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    weatherContainer.prepend(alertsContainer);
}

// Display disaster predictions
function displayDisasterPredictions(predictions) {
    if (!predictions || predictions.length === 0) return;
    
    const predictionsContainer = document.createElement('div');
    predictionsContainer.className = 'disaster-predictions';
    
    predictionsContainer.innerHTML = `
        <div class="predictions-header">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Disaster Predictions</h3>
        </div>
        <div class="predictions-list">
            ${predictions.map(pred => `
                <div class="prediction-item">
                    <div class="prediction-severity ${pred.severity?.toLowerCase() || 'medium'}">
                        ${pred.severity || 'Prediction'}
                    </div>
                    <div class="prediction-content">
                        <h4>${pred.type}</h4>
                        <p>${pred.description}</p>
                        ${pred.precautions && pred.precautions.length > 0 ? `
                            <div class="precautions">
                                <h5>Precautions:</h5>
                                <ul>
                                    ${pred.precautions.map(p => `<li>${p}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    weatherContainer.prepend(predictionsContainer);
}

// Initialize weather when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a page that has the weather container
    if (document.getElementById('weatherForecast')) {
        initWeather();
    }
});

// Export functions for use in other modules
window.weatherModule = {
    fetchWeatherData,
    fetchDisasterPredictions,
    updateUserLocation
};