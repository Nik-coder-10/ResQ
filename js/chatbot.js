// Chatbot functionality
const chatbotResponses = {
    // General Panic & Survival
    'trapped': "🆘 Stay calm. Look for any exits or ways to signal for help. If you're in a building, try banging on walls or pipes to make noise. If you have a phone, call emergency services immediately. Conserve your energy and try to stay warm.",
    'no signal': "📶 If you have no signal, try moving to higher ground. Send text messages instead of calling as they require less signal strength. Use emergency SOS features if available on your phone. Look for landmarks to help rescuers locate you.",
    'lost': "🧭 Stop moving and stay where you are. Use the STOP method: Stop, Think, Observe, Plan. If you have a whistle, use it in groups of three. Stay visible and make yourself easy to find. Look for shelter and stay put if it's getting dark.",
    'panic attack': "🧘 Help the person sit in a quiet place. Encourage slow, deep breaths. Use grounding techniques: name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    'emergency services': "📞 Call your local emergency number (112/911/999/000). Speak clearly: state your location, nature of emergency, and number of people involved. Don't hang up until told to do so.",
    'bleeding': "🩸 Apply direct pressure to the wound with a clean cloth. Elevate the injured area if possible. If bleeding soaks through, add more layers—don't remove the first one. Keep pressure until help arrives.",
    'stay safe': "🛡️ Find a safe location away from danger. Stay hydrated and warm. Signal for help using mirrors, bright colors, or ground markers. If you hear rescuers, make noise to guide them to you.",
    'breathe': "💨 Try to stay calm. Sit down and lean forward slightly. Breathe in slowly through your nose for 4 seconds, hold for 4 seconds, exhale through pursed lips for 6 seconds. Repeat until breathing normalizes.",
    'help panicking': "🤝 Speak calmly and firmly. Maintain eye contact. Guide them to focus on their breathing. Remove them from the stressful situation if possible. Reassure them that help is available.",
    'no food water': "💧 Find a water source first. Look for running water or collect morning dew. Avoid eating unknown plants. Stay in the shade during the day. Signal for help using reflective surfaces or smoke signals.",
    
    // Medical Emergencies
    'heavy bleeding': "🩹 Apply direct pressure with a clean cloth. If available, use a tourniquet 2-3 inches above the wound for limb injuries. Never remove impaled objects. Keep the person warm and still.",
    'faint': "🛌 Lay the person on their back and elevate their legs. Loosen tight clothing. Check breathing and pulse. If they don't regain consciousness within a minute, call emergency services.",
    'deep cut': "🔪 Rinse with clean water if available. Apply direct pressure with a clean cloth. Don't remove large objects. Cover with a sterile dressing. Seek medical help immediately.",
    'cpr': "💓 Call for help first. Place hands on the center of the chest. Push hard and fast (100-120 compressions per minute). If trained, give 2 breaths after every 30 compressions. Continue until help arrives.",
    'seizure': "🛡️ Clear the area of hard objects. Don't restrain the person. Place them on their side. Time the seizure. Call emergency services if it lasts more than 5 minutes or if another seizure follows.",
    'choking': "🤜 Stand behind the person. Make a fist above their navel. Grasp it with your other hand. Give quick, upward thrusts. Continue until the object is expelled or the person becomes unconscious.",
    'broken arm': "🩹 Immobilize the arm with a splint or sling. Use ice wrapped in cloth to reduce swelling. Keep the arm elevated. Seek medical attention immediately.",
    'heart attack': "❤️ Call emergency services immediately. Have the person sit and rest. Give aspirin if available and not allergic. Loosen tight clothing. Be prepared to perform CPR if they become unresponsive.",
    'nosebleed': "👃 Sit up straight and lean forward slightly. Pinch the soft part of the nose for 10-15 minutes. Breathe through your mouth. Apply ice to the bridge of the nose if available.",
    'clean wound': "🚰 Rinse with clean, running water. Remove debris with clean tweezers if necessary. Apply antibiotic ointment if available. Cover with a sterile bandage. Watch for signs of infection.",
    
    // Fire or Explosion
    'smoke escape': "🚪 Stay low where the air is clearer. Feel doors with the back of your hand before opening. Use stairs, not elevators. If trapped, seal doors with wet towels and signal from a window.",
    'clothes fire': "🛑 Stop where you are. Drop to the ground. Cover your face with your hands. Roll over and back to smother the flames. Remove smoldering clothing once cool.",
    'smoke inhalation': "🌬️ Move to fresh air immediately. Loosen tight clothing. If breathing is difficult, seek medical help right away. Don't ignore symptoms that may appear later.",
    'electrical fire': "⚠️ Never use water! Unplug the device if safe. Use a Class C fire extinguisher. If the fire spreads, evacuate immediately and call emergency services.",
    'burning building': "🏢 Stay calm. Use stairs, not elevators. If door is hot, stay inside. Seal gaps with wet towels. Signal for help from a window. Wait for firefighters.",
    'kids fire safety': "👶 Teach stop, drop, and roll. Have an escape plan with a meeting place. Practice fire drills. Keep matches out of reach. Install smoke detectors in sleeping areas.",
    'fire alarm': "🔊 Yell 'Fire!' to alert others. Use a fire extinguisher only if safe. Have an alternative escape route. Test alarms monthly and change batteries yearly.",
    'window escape': "🪟 Use as a last resort. Check for safety. Lower yourself to minimize the drop. Throw down cushions or bedding to break your fall. Turn to face the building when dropping.",
    'treat burns': "❄️ Cool with running water for 10-15 minutes. Don't use ice. Cover with a clean, dry cloth. Don't pop blisters. Seek medical help for severe burns.",
    'fire doors': "🚪 Close doors behind you to slow the fire's spread. Never prop open fire doors. If a door is hot, don't open it. Find another exit.",
    
    // Flood or Water Disaster
    'rising water': "⬆️ Move to higher ground immediately. Avoid walking through moving water. Don't drive through flooded areas. Stay informed with weather updates.",
    'sinking car': "🚗 Unbuckle seatbelt. Open or break windows as soon as possible. Exit through windows. If needed, wait for the car to fill with water before opening doors. Swim to safety.",
    'drowning': "🏊 Reach or throw, don't go. Use a long object to reach. If you must enter, take a flotation device. Call for help immediately. Begin CPR if the person isn't breathing.",
    'flood water': "⚠️ Avoid walking through floodwaters. Just 6 inches can knock you down. Water may be contaminated or hide hazards. Don't drive through flooded roads.",
    'high ground': "⛰️ Head to the highest point possible. Avoid crossing moving water. Stay away from power lines. Signal for help with bright colors or mirrors.",
    'floating': "🌊 Float on your back. Keep your head above water. Move your arms in a circular motion to stay afloat. Conserve energy. Remove heavy clothing if necessary.",
    'house flooding': "🏠 Turn off electricity at the main breaker. Move to higher floors. Don't touch electrical equipment if wet. Have an emergency kit ready. Follow evacuation orders.",
    'protect electronics': "📱 Move to higher ground. Unplug devices. Store in waterproof containers. Use silica gel packets to reduce moisture. Back up important data.",
    'drink rainwater': "💧 Boil water before drinking. Use purification tablets if available. Collect rain away from contaminants. Filter through clean cloth. Avoid floodwater.",
    'water rescue': "🆘 Use bright colors or mirrors to signal. Make noise in groups of three. Stay visible. Follow instructions from rescuers. Don't swim toward rescuers unless instructed.",
    
    // Earthquake or Building Collapse
    'earthquake': "🛡️ Drop, cover, and hold on. Stay indoors. Stay away from windows. If outside, move to an open area. Be prepared for aftershocks.",
    'protect head': "🪖 Use your arms to protect your head and neck. Take cover under sturdy furniture. Stay away from glass and heavy objects. Cover your head with a pillow if in bed.",
    'rubble': "🔊 Make noise in intervals to help rescuers. Cover your mouth with clothing. Tap on pipes or walls. Don't light matches. Stay calm and conserve energy.",
    'help trapped': "🆘 Call for help immediately. Don't move the person unless necessary. Provide first aid if trained. Keep them warm and calm. Wait for professional rescuers.",
    'after earthquake': "🔍 Check for injuries. Be prepared for aftershocks. Check for gas leaks and damage. Listen to emergency broadcasts. Avoid using phones except for emergencies.",
    'ceiling collapse': "🛌 Stay under sturdy furniture. Create an air pocket. Cover your mouth with clothing. Tap on pipes or walls. Don't light flames.",
    'building safety': "🏢 Look for cracks in walls or foundation. Check for gas leaks. Don't enter damaged buildings. Have a structural engineer inspect if unsure. Follow local authorities' guidance.",
    'falling objects': "🛡️ Move away from windows and heavy objects. Take cover under sturdy furniture. Protect your head and neck. Stay indoors until shaking stops. Be aware of falling debris.",
    'earthquake position': "🪑 Drop to your hands and knees. Cover your head and neck. Hold onto sturdy furniture. If no cover, stay against an interior wall. Stay in place until shaking stops.",
    'find exits': "🚪 Locate all possible exits when entering a building. Check for emergency lighting. Feel doors for heat before opening. Use stairs, not elevators. Have a meeting point outside.",
    
    'default': "I'm here to help! Could you provide more details about your emergency? If this is a life-threatening situation, please call your local emergency number immediately."
};

document.addEventListener('DOMContentLoaded', function(){
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    // Add event listeners
    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleUserInput();
    });
    
    // Initial welcome message
    setTimeout(() => {
        addMessage('Hello! I\'m ResQ, your emergency assistance chatbot. I can help with first aid, emergency procedures, and safety information. How can I assist you today?');
        addQuickResponses();
    }, 500);
    
    // Add emergency contact button
    const emergencyBtn = document.createElement('button');
    emergencyBtn.className = 'emergency-btn';
    emergencyBtn.innerHTML = '🆘 EMERGENCY';
    emergencyBtn.onclick = () => {
        window.location.href = 'tel:112';
    };
    document.querySelector('.chat-header').appendChild(emergencyBtn);
});

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = message;
    document.getElementById('chatMessages').appendChild(messageDiv);
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

function handleUserInput() {
    const userMessage = document.getElementById('userInput').value.trim();
    if (userMessage === '') return;
    
    // Add user message to chat
    addMessage(userMessage, true);
    document.getElementById('userInput').value = '';
    
    // Get and display bot response
    setTimeout(() => {
        const botResponse = getBotResponse(userMessage);
        addMessage(botResponse);
        
        // Add quick responses after bot message
        if (Math.random() > 0.5) { // 50% chance to show quick responses
            addQuickResponses();
        }
    }, 1000);
}

function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check for emergency keywords
    const emergencyKeywords = [
        { key: 'trapped', response: 'trapped' },
        { key: 'no signal', response: 'no signal' },
        { key: 'lost', response: 'lost' },
        { key: 'panic attack', response: 'panic attack' },
        { key: 'emergency services', response: 'emergency services' },
        { key: 'bleeding', response: 'bleeding' },
        { key: 'stay safe', response: 'stay safe' },
        { key: 'can\'t breathe', response: 'breathe' },
        { key: 'help panicking', response: 'help panicking' },
        { key: 'no food', response: 'no food water' },
        { key: 'heavy bleeding', response: 'heavy bleeding' },
        { key: 'faint', response: 'faint' },
        { key: 'deep cut', response: 'deep cut' },
        { key: 'cpr', response: 'cpr' },
        { key: 'seizure', response: 'seizure' },
        { key: 'choking', response: 'choking' },
        { key: 'broken arm', response: 'broken arm' },
        { key: 'heart attack', response: 'heart attack' },
        { key: 'nosebleed', response: 'nosebleed' },
        { key: 'clean wound', response: 'clean wound' },
        { key: 'smoke', response: 'smoke escape' },
        { key: 'clothes fire', response: 'clothes fire' },
        { key: 'electrical fire', response: 'electrical fire' },
        { key: 'burning building', response: 'burning building' },
        { key: 'fire alarm', response: 'fire alarm' },
        { key: 'window escape', response: 'window escape' },
        { key: 'treat burns', response: 'treat burns' },
        { key: 'rising water', response: 'rising water' },
        { key: 'sinking car', response: 'sinking car' },
        { key: 'drowning', response: 'drowning' },
        { key: 'flood water', response: 'flood water' },
        { key: 'high ground', response: 'high ground' },
        { key: 'house flooding', response: 'house flooding' },
        { key: 'earthquake', response: 'earthquake' },
        { key: 'rubble', response: 'rubble' },
        { key: 'ceiling collapse', response: 'ceiling collapse' }
    ];
    
    for (const {key, response} of emergencyKeywords) {
        if (message.includes(key)) {
            return chatbotResponses[response] || chatbotResponses.default;
        }
    }
    
    return chatbotResponses.default;
}

function addQuickResponses() {
    // Remove any existing quick responses
    const existingResponses = document.querySelector('.quick-responses');
    if (existingResponses) existingResponses.remove();
    
    const quickResponses = [
        "How do I perform CPR?",
        "Help! Someone is choking!",
        "How to stop heavy bleeding?",
        "What to do in an earthquake?",
        "How to escape a fire?",
        "First aid for burns"
    ];
    
    const quickResponseContainer = document.createElement('div');
    quickResponseContainer.className = 'quick-responses';
    
    quickResponses.forEach(text => {
        const btn = document.createElement('button');
        btn.className = 'quick-response-btn';
        btn.textContent = text;
        btn.onclick = () => {
            document.getElementById('userInput').value = text;
            handleUserInput();
        };
        quickResponseContainer.appendChild(btn);
    });
    
    document.querySelector('.chat-messages').appendChild(quickResponseContainer);
    quickResponseContainer.scrollIntoView({ behavior: 'smooth' });
}