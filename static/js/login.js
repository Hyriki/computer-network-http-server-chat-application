// // Login form handler
// (function() {
//     const loginForm = document.getElementById('loginForm');
//     const errorMessage = document.getElementById('error-message');
    
//     loginForm.addEventListener('submit', function(e) {
//         e.preventDefault();
        
//         const username = document.getElementById('username').value;
//         const password = document.getElementById('password').value;
        
//         // Clear previous error
//         errorMessage.textContent = '';
        
//         // Prepare form data
//         const formData = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
        
//         // Send login request
//         fetch('/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             credentials: 'same-origin',
//             body: formData
//         })
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 throw new Error('Login failed');
//             }
//         })
//         .then(data => {
//             if (data.status === 'ok') {
//                 // Store user info
//                 sessionStorage.setItem('username', username);
//                 sessionStorage.setItem('auth', 'true');
                
//                 // Register as peer
//                 registerPeer(username).then(() => {
//                     // Redirect to chat
//                     window.location.href = '/index.html';
//                 });
//             } else {
//                 errorMessage.textContent = 'Login failed. Please try again.';
//             }
//         })
//         .catch(error => {
//             console.error('Login error:', error);
//             errorMessage.textContent = 'Login failed. Please check your credentials.';
//         });
//     });
    
//     function registerPeer(username) {
//         const peerData = {
//             id: 'web_' + Date.now(),
//             ip: '127.0.0.1',
//             port: 0,  // Web client doesn't have a listening port
//             username: username
//         };
        
//         sessionStorage.setItem('peerId', peerData.id);
        
//         return fetch('/submit-info', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'same-origin',
//             body: JSON.stringify(peerData)
//         }).catch(error => {
//             console.error('Error registering peer:', error);
//         });
//     }
// })();






// // Login form handler
// (function() {
//     const loginForm = document.getElementById('loginForm');
//     const errorMessage = document.getElementById('errorMessage'); // ← Changed from 'error-message'
    
//     loginForm.addEventListener('submit', function(e) {
//         e.preventDefault();
        
//         const username = document.getElementById('username').value;
//         const password = document.getElementById('password').value;
//         const peerId = 'web_' + Date.now(); // ← Generate peerId
        
//         // Clear previous error
//         errorMessage.textContent = '';
        
//         // Prepare form data
//         const formData = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&peerId=${encodeURIComponent(peerId)}`;
        
//         // Send login request
//         fetch('/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             credentials: 'same-origin',
//             body: formData
//         })
//         .then(response => {
//             console.log('[Login] Response status:', response.status);
            
//             // ✅ Don't parse JSON - just check status
//             if (response.ok) {
//                 // Store user info
//                 sessionStorage.setItem('username', username);
//                 sessionStorage.setItem('auth', 'true');
                
//                 // Store userInfo object like current code
//                 sessionStorage.setItem('userInfo', JSON.stringify({
//                     username: username,
//                     peerId: peerId,
//                     loginTime: new Date().toISOString()
//                 }));
                
//                 // Set cookie manually (redundant but matches current code)
//                 document.cookie = 'auth=true; path=/';
                
//                 // Register as peer, then redirect
//                 return registerPeer(username, peerId);
//             } else if (response.status === 401) {
//                 throw new Error('Invalid username or password');
//             } else {
//                 throw new Error('Login failed');
//             }
//         })
//         .then(() => {
//             // After peer registration (or skip if it fails)
//             console.log('[Login] Redirecting to index.html');
//             window.location.href = '/index.html';
//         })
//         .catch(error => {
//             console.error('Login error:', error);
//             errorMessage.textContent = error.message || 'Login failed. Please check your credentials.';
//             errorMessage.style.display = 'block'; // ← Make error visible
//         });
//     });
    
//     function registerPeer(username, peerId) {
//         const peerData = {
//             id: peerId,
//             ip: window.location.hostname || '127.0.0.1',
//             port: 0,  // Web client doesn't have a listening port
//             username: username
//         };
        
//         sessionStorage.setItem('peerId', peerData.id);
        
//         // ✅ Wrap in try-catch to prevent blocking login
//         return fetch('/submit-info', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'same-origin',
//             body: JSON.stringify(peerData)
//         })
//         .then(response => {
//             console.log('[Peer] Registration response:', response.status);
//             // Don't parse JSON - just log success
//             return Promise.resolve();
//         })
//         .catch(error => {
//             console.error('Error registering peer:', error);
//             // ✅ Don't throw - just return resolved promise
//             return Promise.resolve();
//         });
//     }
// })();













const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value.trim();
    const peerId = document.getElementById('peerId')?.value.trim() || generatePeerId();
    
    if (!username) {
        showError('Please enter a username');
        return;
    }
    
    if (!password) {
        showError('Please enter a password');
        return;
    }

    try {
        // First do the login POST - note we're using form-urlencoded as specified in the original code
        const loginResponse = await fetch('login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&peerId=${encodeURIComponent(peerId)}`,
            credentials: 'same-origin'
        });

        if (loginResponse.ok) {
            // After successful login, try to register the peer
            try {
                const peerResponse = await fetch('submit-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: peerId,
                        ip: window.location.hostname || 'localhost',
                        port: 8000
                    })
                });

                if (!peerResponse.ok) {
                    console.error('Peer registration failed but continuing with login');
                }
            } catch (peerError) {
                console.error('Peer registration error:', peerError);
                // Continue anyway as login was successful
            }

            // Store user info regardless of peer registration
            sessionStorage.setItem('userInfo', JSON.stringify({
                username: username,
                peerId: peerId,
                loginTime: new Date().toISOString()
            }));

            //FIX
            sessionStorage.setItem('username', username);
            
            // Set auth cookie
            document.cookie = 'auth=true; path=/';
            
            // Log success and redirect
            console.log('Login successful, redirecting...');
            window.location.href = 'index.html';
        } else {
            // Handle specific error cases
            if (loginResponse.status === 401) {
                window.location.href = '401.html';
            } else {
                showError(`Login failed: ${loginResponse.status}`);
            }
            console.error('Login failed:', loginResponse.status);
        }
    } catch (error) {
        showError('Connection failed. Please try again.');
        console.error('Login error:', error);
    }
});

function generatePeerId() {
    return 'peer-' + Math.random().toString(36).substr(2, 9);
}

function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
    console.error(message); // Also log errors to console
}

// Check login status on page load
document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = window.location.pathname.includes('login.html') || window.location.pathname === '';
    const isAuthenticated = document.cookie.includes('auth=true');
    
    if (isAuthenticated && isLoginPage) {
        window.location.href = 'index.html';
    }
    
    // Add form submission logging
    loginForm?.addEventListener('submit', () => {
        console.log('Form submitted');
    });
});