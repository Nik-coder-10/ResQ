const storedLocation = localStorage.getItem('userLocation');
const parsedLocation = storedLocation ? JSON.parse(storedLocation) : null;

let currentUser = {
    name: 'Anonymous User',
    latitude: parsedLocation ? parsedLocation.latitude : null,
    longitude: parsedLocation ? parsedLocation.longitude : null
};


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

function initializeMap() {
    if (!currentUser.latitude || !currentUser.longitude) {
        alert("User location not found. Please enable location or refresh.");
        return;
    }

    const userLat = currentUser.latitude;
    const userLng = currentUser.longitude;
    const mapRadiusKm = 15;
    const EARTH_RADIUS = 6378.1; // in km

    // Calculate bounding box for 15 km radius
    const latDelta = (mapRadiusKm / EARTH_RADIUS) * (180 / Math.PI);
    const lngDelta = latDelta / Math.cos(userLat * Math.PI / 180);
    const bounds = L.latLngBounds(
        [userLat - latDelta, userLng - lngDelta],
        [userLat + latDelta, userLng + lngDelta]
    );

    // Initialize map
    const map = L.map('map', {
        zoomControl: true,
        minZoom: 12, // prevents zooming out too far
        maxZoom: 18
    }).setView([userLat, userLng], 13);

    // Add base map layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        minZoom: 12
    }).addTo(map);

    // Add user marker
    L.circleMarker([userLat, userLng], {
        radius: 8,
        fillColor: '#007bff',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
    }).addTo(map).bindPopup('You are here').openPopup();

    // Add visible 15 km radius circle
    L.circle([userLat, userLng], {
        radius: mapRadiusKm * 1000,
        color: '#007bff',
        fillColor: '#007bff',
        fillOpacity: 0.05
    }).addTo(map);

    // Set bounds and prevent panning outside
    map.setMaxBounds(bounds);
    map.on('drag', () => map.panInsideBounds(bounds, { animate: false }));

    // Enforce zoom lock
    map.on('zoomend', () => {
        const zoom = map.getZoom();
        if (zoom < 12) map.setZoom(12); // don’t allow too far out
    });

    // Optional: prevent scroll zoom from exceeding range
    map.on('zoom', () => {
        if (!map.getBounds().contains(bounds.getCenter())) {
            map.panInsideBounds(bounds, { animate: false });
        }
    });

    loadHeatmapData(map);
    loadSafeZones(map);

    return map;
}


async function loadHeatmapData(map) {
    try {
        const response = await fetch('./dangers.json'); // adjust path if needed
        const data = await response.json();

        // Convert dataset into heatmap points: [lat, lng, intensity]
        const heatPoints = data.map(point => [
            point.latitude,
            point.longitude,
            point.signalCount / 10 // adjust denominator for intensity scaling
        ]);

        // Create heatmap layer
        const heatLayer = L.heatLayer(heatPoints, {
            radius: 25,       // size of heat "blobs"
            blur: 25,         // smoothness
            maxZoom: 17,      // how long heat remains visible on zoom
            gradient: {
                0.2: 'blue',
                0.4: 'lime',
                0.6: 'yellow',
                0.8: 'orange',
                1.0: 'red'
            }
        }).addTo(map);

        data.forEach(point => {
            const marker = L.circleMarker([point.latitude, point.longitude], {
                radius: 6,
                color: 'transparent',
                fillColor: 'transparent',
                fillOpacity: 0
            }).addTo(map);

            marker.bindTooltip(
                `<b>Signal Count:</b> ${point.signalCount}`,
                { permanent: false, direction: 'top' }
            );
        });

        console.log('✅ Heatmap loaded with', heatPoints.length, 'points');
    } catch (err) {
        console.error('❌ Failed to load heatmap data:', err);
    }
}

// async function loadSafeZones(map) {
//     try {
//         const response = await fetch('./safezones.json');
//         const zones = await response.json();

//         zones.forEach(zone => {
//             L.circleMarker([zone.latitude, zone.longitude], {
//                 radius: 15,
//                 color: 'green',
//                 fillColor: '#00ff00',
//                 fillOpacity: 0.5,
//                 weight: 2
//             })
//             .addTo(map)
//             .bindTooltip('<b>Safe Zone</b><br>This area has been marked safe.');
//         });

//         console.log(`✅ Loaded ${zones.length} safe zones`);
//     } catch (err) {
//         console.error('❌ Failed to load safe zones:', err);
//     }
// }

async function loadSafeZones(map) {
    try {
        const response = await fetch('./safezones.json');
        const zones = await response.json();

        zones.forEach(zone => {
            const marker = L.circleMarker([zone.latitude, zone.longitude], {
                radius: 15,
                color: 'green',
                fillColor: 'green',
                fillOpacity: 0.6
            })
            .addTo(map)
            .bindTooltip('Safe Zone', { direction: 'top' });

            // ✅ Allow admin to remove on click
            marker.on('click', async () => {
                if (confirm('Remove this safe zone?')) {
                    try {
                        const res = await fetch('http://localhost:3000/remove-safezone', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                latitude: zone.latitude,
                                longitude: zone.longitude
                            })
                        });

                        if (res.ok) {
                            map.removeLayer(marker);
                            showToast("Safe zone removed", 'success');
                        } else {
                            throw new Error("Failed to remove safe zone");
                        }
                    } catch (err) {
                        console.error('❌ Failed to remove safe zone:', err);
                        showToast('Failed to remove', 'error');
                    }
                }
            });
        });

        console.log('✅ Loaded', zones.length, 'safe zones');
    } catch (err) {
        console.error('❌ Failed to load safe zones:', err);
    }
}


// Initialize the application when the DOM is fully loaded
function initApp() {

    getAndSaveCurrentLocation();

    // Initialize the map
    initializeMap();

    
    // Set up map controls
    setupMapControls();
}

// Check if the DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // If DOM is already loaded, run immediately
    initApp();
}

function setupMapControls() {
    // Get references to the buttons
    const alarmBtn = document.getElementById('alarmBtn');

    const getLocationBtn = document.getElementById('getLocationBtn');
    
    // // Check if buttons exist before adding event listeners
    // if (!alarmBtn) {
    //     console.error('One or more map control buttons not found');
    //     return;
    // }
    // Alarm button - Send distress signal
    alarmBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const position = await getAndSaveCurrentLocation();
            const { latitude, longitude } = position.coords;

            const res = await fetch('http://localhost:3000/add-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:  JSON.stringify({ latitude, longitude, signalCount: 1 })
            });

            showToast("Marked as danger.", 'success');
        } catch (error) {
            console.error('Error sending distress signal:', error);
            showToast('Failed', 'error');
        }



        // const locationData = getLocationData();
        
        // const distressSignal = {
        //     lat: currentUser.latitude,
        //     lon: currentUser.longitude,
        //     user: currentUser.name,
        //     message: 'Emergency assistance needed!',
        //     timestamp: new Date().toISOString()
        // };
        
        // locationData.distressSignals.push(distressSignal);
        // saveLocationData(locationData);
        
        // // Refresh markers
        // markersLayer.clearLayers();
        // userMarker = L.marker([currentUser.latitude, currentUser.longitude], {
        //     icon: L.divIcon({
        //         className: 'custom-marker',
        //         html: '<div style="background: #4CAF50; color: white; padding: 10px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 20px;">📍</div>',
        //         iconSize: [40, 40]
        //     })
        // }).addTo(markersLayer);
        // userMarker.bindPopup(`<b>Your Location</b><br>${currentUser.name}<br>${currentUser.address}`);
        
        // loadMapMarkers();
        
        // showToast('Distress signal sent! Help is on the way.', 'warning');
        // updateInfoPanel('Distress signal sent successfully. Emergency services have been notified.');

    });

    getLocationBtn.addEventListener('click', async () => {
        try {
            const position = await getAndSaveCurrentLocation();
            showToast("Location updated on map", 'success');
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            showToast("Failed to get location", 'error');
        }
    });
}

function updateInfoPanel(message) {
    document.getElementById('infoContent').textContent = message;
}

// Add pulse animation for distress signals
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);