// Toggle between login and signup forms
// document.getElementById('showSignup').addEventListener('click', () => {
//     document.getElementById('loginForm').classList.add('hidden');
//     document.getElementById('signupForm').classList.remove('hidden');
// });

document.getElementById('showLogin').addEventListener('click', () => {
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
});

// Get user's location
// document.getElementById('getLocationBtn').addEventListener('click', () => {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 document.getElementById('signup-latitude').value = position.coords.latitude;
//                 document.getElementById('signup-longitude').value = position.coords.longitude;
//                 showToast('Location retrieved successfully!', 'success');
//             },
//             (error) => {
//                 showToast('Unable to retrieve location. Please enter manually.', 'error');
//             }
//         );
//     } else {
//         showToast('Geolocation is not supported by your browser.', 'error');
//     }
// });

// Sign up form submission
// document.getElementById('signup-form').addEventListener('submit', (e) => {
//     e.preventDefault();
    
//     const userData = {
//         name: document.getElementById('signup-name').value,
//         email: document.getElementById('signup-email').value,
//         phone: document.getElementById('signup-phone').value,
//         address: document.getElementById('signup-address').value,
//         city: document.getElementById('signup-city').value,
//         latitude: parseFloat(document.getElementById('signup-latitude').value) || 0,
//         longitude: parseFloat(document.getElementById('signup-longitude').value) || 0,
//         password: document.getElementById('signup-password').value,
//         createdAt: new Date().toISOString()
//     };
    
//     // Get existing users or initialize empty array
//     let users = JSON.parse(localStorage.getItem('users')) || [];
    
//     // Check if user already exists
//     if (users.find(u => u.email === userData.email)) {
//         showToast('User with this email already exists!', 'error');
//         return;
//     }
    
//     // Add new user
//     users.push(userData);
//     localStorage.setItem('users', JSON.stringify(users));
    
//     showToast('Account created successfully!', 'success');
    
//     // Auto login
//     localStorage.setItem('currentUser', JSON.stringify(userData));
    
//     setTimeout(() => {
//         window.location.href = 'notify.html';
//     }, 1500);
// });

const adminEmail = "admin1@gmail.com"
const adminPass = "admin1"

// Login form submission
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    
    if (!(email === adminEmail) || !(password === adminPass)) {
        showToast('Invalid email or password!', 'error');
    } else {
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500)
    }
});

// Toast notification function
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}