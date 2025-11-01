const defaultData = [
        {
            id: 1,
            type: 'Ambulance',
            number: '102'
        },
        {
            id: 2,
            type: 'Firebrigade',
            number: '101'
        },
        {
            id: 3,
            type: 'NDRF',
            number: '11111'
        }
    ];


function loadHelplines() {
    const helplinesContainer = document.getElementById('helplines');
    
    helplinesContainer.innerHTML = defaultData.map(helpline => `
        <div class="prediction-card">
            <div class="prediction-icon">${helpline.type}</div>
            <button class="filter-btn" onclick="window.location.href='tel:${helpline.number}'">Call</button>
            <button class="filter-btn">Distress Message</button>
        </div>
    `).join('');
}


document.addEventListener("DOMContentLoaded", loadHelplines);