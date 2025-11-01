// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(currentUser);
}

function getAndSaveCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
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

// Toast notification function
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Format date
function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Get disaster data
function getDisasterData() {
    const defaultData = [
        {
            id: 1,
            type: 'flood',
            severity: 'high',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            probability: 75,
            description: 'Heavy rainfall expected, potential flooding in low-lying areas',
            affectedAreas: ['Downtown', 'Riverside'],
            precautions: 'Move to higher ground, secure belongings'
        },
        {
            id: 2,
            type: 'storm',
            severity: 'medium',
            date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            probability: 60,
            description: 'Tropical storm approaching, strong winds expected',
            affectedAreas: ['Coastal areas'],
            precautions: 'Secure outdoor items, stay indoors'
        },
        {
            id: 3,
            type: 'earthquake',
            severity: 'low',
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            probability: 30,
            description: 'Minor seismic activity detected',
            affectedAreas: ['Northern region'],
            precautions: 'Drop, cover, and hold on if shaking occurs'
        }
    ];
    
    return JSON.parse(localStorage.getItem('disasters')) || defaultData;
}

// Save location data
function saveLocationData(data) {
    localStorage.setItem('locations', JSON.stringify(data));
}