async function addSafeZone() {
    try {
        const position = await getAndSaveCurrentLocation();
        const { latitude, longitude } = position.coords;

        // Send to backend
        const res = await fetch('http://localhost:3000/add-safezone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude })
        });

        if (!res.ok) throw new Error('Server error');

        showToast('✅ Safe zone marked successfully.', 'success');
    } catch (error) {
        console.error('❌ Failed to mark safe zone:', error);
        showToast('Failed to mark safe zone.', 'error');
    }
}

// Attach listener to safe button
document.addEventListener('DOMContentLoaded', () => {
    const safeBtn = document.getElementById('safeBtn');
    if (safeBtn) {
        safeBtn.addEventListener('click', e => {
            e.preventDefault();
            addSafeZone();
        });
    }
});