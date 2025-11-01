// Check authentication
const currentUser = checkAuth();

function getAndSaveCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
                    console.log('Location saved:', latitude, longitude);
                    resolve(position);
                },
                error => reject(error),
                { enableHighAccuracy: true }
            )
        } else {
            reject("Geolocation not supported.");
        }
    });
}

function updateLocation() {
        // const position = getAndSaveCurrentLocation();
        // return { latitude, longitude } = position.coords;
        const storedLocation = localStorage.getItem('userLocation');
        const parsedLocation = storedLocation ? JSON.parse(storedLocation) : null;

        return coords = {
            latitude: parsedLocation ? parsedLocation.latitude : null,
            longitude: parsedLocation ? parsedLocation.longitude : null
        };

}


document.addEventListener('DOMContentLoaded', () => {
    getAndSaveCurrentLocation();
    // if (currentUser) {
        // Display user information
    // document.getElementById('userName').textContent = currentUser.name;
    const coords = updateLocation();
    document.getElementById('userLocation').textContent = `Location: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
        // `Location: ${currentUser.city || 'Not specified'} (${currentUser.latitude.toFixed(4)}, ${currentUser.longitude.toFixed(4)})`;
    
    // Load disaster data
    loadActiveAlerts();
    loadPredictions();
    // loadWeatherForecast();
    
    // Setup filter buttons
    // setupFilters();
    // }
});

function loadActiveAlerts() {
    const disasters = getDisasterData();
    const alertsContainer = document.getElementById('activeAlerts');
    
    // Filter for high priority and upcoming disasters
    const activeAlerts = disasters.filter(d => 
        (d.severity === 'high' || d.severity === 'critical') && 
        new Date(d.date) > new Date()
    );
    
    if (activeAlerts.length === 0) {
        alertsContainer.innerHTML = '<p style="color: #4CAF50; font-weight: 600;">✓ No active alerts in your area</p>';
        return;
    }
    
    alertsContainer.innerHTML = activeAlerts.map(alert => `
        <div class="alert-card ${alert.severity}">
            <div class="alert-header">
                <div class="alert-title">${getDisasterIcon(alert.type)} ${capitalizeFirst(alert.type)} Warning</div>
                <span class="severity-badge ${alert.severity}">${alert.severity.toUpperCase()}</span>
            </div>
            <p><strong>Date:</strong> ${formatDate(alert.date)}</p>
            <p><strong>Probability:</strong> ${alert.probability}%</p>
            <p><strong>Description:</strong> ${alert.description}</p>
            <p><strong>Affected Areas:</strong> ${alert.affectedAreas.join(', ')}</p>
            <p><strong>Precautions:</strong> ${alert.precautions}</p>
        </div>
    `).join('');
}

function loadPredictions() {
    const disasters = getDisasterData();
    const predictionsContainer = document.getElementById('predictions');
    
    predictionsContainer.innerHTML = disasters.map(disaster => `
        <div class="prediction-card" data-type="${disaster.type}">
            <div class="prediction-icon">${getDisasterIcon(disaster.type)}</div>
            <div class="prediction-type">${capitalizeFirst(disaster.type)}</div>
            <div class="prediction-date">${formatDate(disaster.date)}</div>
            <div class="prediction-details">
                <p><strong>Severity:</strong> ${disaster.severity.toUpperCase()}</p>
                <p><strong>Probability:</strong> ${disaster.probability}%</p>
                <p>${disaster.description}</p>
            </div>
        </div>
    `).join('');
}

// function loadWeatherForecast() {
//     const weatherContainer = document.getElementById('weatherForecast');
//     const forecast = [];
    
//     // Generate 7-day forecast
//     for (let i = 0; i < 7; i++) {
//         const date = new Date();
//         date.setDate(date.getDate() + i);
        
//         const temp = Math.floor(Math.random() * 15) + 20; // 20-35°C
//         const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
//         const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
//         forecast.push({
//             date: date,
//             temp: temp,
//             condition: condition,
//             icon: getWeatherIcon(condition)
//         });
//     }
    
//     weatherContainer.innerHTML = forecast.map(day => `
//         <div class="weather-card">
//             <div class="weather-icon">${day.icon}</div>
//             <div class="weather-date">${formatDate(day.date)}</div>
//             <div class="weather-temp">${day.temp}°C</div>
//             <div class="weather-desc">${day.condition}</div>
//         </div>
//     `).join('');
// }

// function setupFilters() {
//     const filterButtons = document.querySelectorAll('.filter-btn');
    
//     filterButtons.forEach(btn => {
//         btn.addEventListener('click', () => {
//             // Update active button
//             filterButtons.forEach(b => b.classList.remove('active'));
//             btn.classList.add('active');
            
//             // Filter predictions
//             const filter = btn.dataset.filter;
//             const predictions = document.querySelectorAll('.prediction-card');
            
//             predictions.forEach(card => {
//                 if (filter === 'all' || card.dataset.type === filter) {
//                     card.style.display = 'block';
//                 } else {
//                     card.style.display = 'none';
//                 }
//             });
//         });
//     });
// }

function getDisasterIcon(type) {
    const icons = {
        flood: '🌊',
        earthquake: '🌍',
        storm: '⛈️',
        fire: '🔥',
        tsunami: '🌊',
        tornado: '🌪️'
    };
    return icons[type] || '⚠️';
}

function getWeatherIcon(condition) {
    const icons = {
        'Sunny': '☀️',
        'Cloudy': '☁️',
        'Rainy': '🌧️',
        'Partly Cloudy': '⛅'
    };
    return icons[condition] || '🌤️';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}