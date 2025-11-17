// // Chat application JavaScript
// (function() {
//     let currentUser = null;
//     let currentChannel = 'general';
//     let lastMessageCount = 0;
//     let channels = [];
//     let refreshInterval = null;
    
//     // Helper function
//     function $(id) {
//         return document.getElementById(id);
//     }
    
//     // Initialize
//     function init() {
//         // Check authentication
//         currentUser = sessionStorage.getItem('username');
//         if (!currentUser) {
//             window.location.href = '/login.html';
//             return;
//         }
        
//         // Display username
//         $('currentUsername').textContent = currentUser;
        
//         // Set up event listeners
//         $('sendBtn').addEventListener('click', sendMessage);
//         $('messageInput').addEventListener('keypress', function(e) {
//             if (e.key === 'Enter') {
//                 sendMessage();
//             }
//         });
//         $('logoutBtn').addEventListener('click', logout);
//         $('createChannelBtn').addEventListener('click', createChannel);
        
//         // Load initial data
//         loadChannels();
//         loadMessages();
        
//         // Start polling for updates
//         refreshInterval = setInterval(function() {
//             loadChannels();
//             loadMessages();
//         }, 5000);
//     }
    
//     // Load channels and users
//     function loadChannels() {
//         Promise.all([
//             fetch('/channels', { credentials: 'same-origin' }).then(r => r.json()),
//             fetch('/get-list', { credentials: 'same-origin' }).then(r => r.json())
//         ])
//         .then(([channelsData, usersData]) => {
//             channels = channelsData.channels || [];
//             renderChannels(channels);
//             renderUsers(usersData.peers || []);
//         })
//         .catch(error => {
//             console.error('Error loading channels:', error);
//         });
//     }
    
//     // Render channels list
//     function renderChannels(chatChannels) {
//         const channelsList = $('channelsList');
//         channelsList.innerHTML = '';
        
//         chatChannels.forEach(function(channel) {
//             const div = document.createElement('div');
//             div.className = 'channel-item' + (channel === currentChannel ? ' active' : '');
//             div.textContent = '# ' + channel;
//             div.onclick = function() {
//                 selectChannel(channel);
//             };
//             channelsList.appendChild(div);
//         });
//     }
    
//     // Render users list
//     function renderUsers(users) {
//         const usersList = $('usersList');
//         usersList.innerHTML = '';
        
//         // Filter out current user
//         const otherUsers = users.filter(function(user) {
//             return user.username !== currentUser;
//         });
        
//         otherUsers.forEach(function(user) {
//             const div = document.createElement('div');
//             div.className = 'user-item';
//             div.textContent = '• ' + user.username;
//             usersList.appendChild(div);
//         });
        
//         if (otherUsers.length === 0) {
//             const div = document.createElement('div');
//             div.style.color = '#95a5a6';
//             div.style.fontSize = '12px';
//             div.style.padding = '10px';
//             div.textContent = 'No other users online';
//             usersList.appendChild(div);
//         }
//     }
    
//     // Select channel
//     function selectChannel(channel) {
//         currentChannel = channel;
//         lastMessageCount = 0;
//         $('messagesHeader').textContent = '#' + channel;
        
//         // Clear messages immediately when switching channels
//         const container = $('messagesContainer');
//         container.innerHTML = '<div style="text-align:center;color:#95a5a6;padding:20px;">Loading...</div>';
        
//         // Update active state
//         const items = document.querySelectorAll('.channel-item');
//         items.forEach(function(item) {
//             item.classList.remove('active');
//             if (item.textContent === '# ' + channel) {
//                 item.classList.add('active');
//             }
//         });
        
//         loadMessages();
//     }
    
//     // Load messages for current channel
//     function loadMessages() {
//         fetch('/messages?channel=' + encodeURIComponent(currentChannel), {
//             credentials: 'same-origin'
//         })
//         .then(response => response.json())
//         .then(data => {
//             const messages = data.messages || [];
            
//             // Always render messages to ensure correct channel content is shown
//             // (fixes issue where switching channels might show cached messages)
//             lastMessageCount = messages.length;
//             renderMessages(messages);
//         })
//         .catch(error => {
//             console.error('Error loading messages:', error);
//         });
//     }
    
//     // Render messages
//     function renderMessages(messages) {
//         const container = $('messagesContainer');
//         container.innerHTML = '';
        
//         if (messages.length === 0) {
//             const div = document.createElement('div');
//             div.style.textAlign = 'center';
//             div.style.color = '#95a5a6';
//             div.style.padding = '20px';
//             div.textContent = 'No messages yet. Start the conversation!';
//             container.appendChild(div);
//             return;
//         }
        
//         messages.forEach(function(msg) {
//             const div = document.createElement('div');
//             div.className = 'message';
            
//             const sender = document.createElement('div');
//             sender.className = 'message-sender';
//             sender.textContent = msg.sender;
            
//             const text = document.createElement('div');
//             text.className = 'message-text';
//             text.textContent = msg.text;
            
//             const time = document.createElement('div');
//             time.className = 'message-time';
//             const date = new Date(msg.timestamp * 1000);
//             time.textContent = date.toLocaleTimeString();
            
//             div.appendChild(sender);
//             div.appendChild(text);
//             div.appendChild(time);
//             container.appendChild(div);
//         });
        
//         // Scroll to bottom
//         container.scrollTop = container.scrollHeight;
//     }
    
//     // Send message
//     function sendMessage() {
//         const input = $('messageInput');
//         const text = input.value.trim();
        
//         if (!text) return;
        
//         const message = {
//             channel: currentChannel,
//             sender: currentUser,
//             text: text,
//             timestamp: Date.now() / 1000
//         };
        
//         fetch('/send', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'same-origin',
//             body: JSON.stringify(message)
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.status === 'sent') {
//                 input.value = '';
//                 loadMessages();
//             }
//         })
//         .catch(error => {
//             console.error('Error sending message:', error);
//         });
//     }
    
//     // Create new channel
//     function createChannel() {
//         const channelName = prompt('Enter new channel name:');
//         if (!channelName) return;
        
//         fetch('/create-channel', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'same-origin',
//             body: JSON.stringify({ channel: channelName })
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.status === 'created') {
//                 loadChannels();
//                 selectChannel(channelName);
//             } else {
//                 alert('Error: ' + (data.error || 'Could not create channel'));
//             }
//         })
//         .catch(error => {
//             console.error('Error creating channel:', error);
//         });
//     }
    
//     // Logout
//     function logout() {
//         if (refreshInterval) {
//             clearInterval(refreshInterval);
//         }
//         sessionStorage.clear();
//         document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//         window.location.href = '/login.html';
//     }
    
//     // Start the app
//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', init);
//     } else {
//         init();
//     }
// })();





// Chat application JavaScript
(function() {
    let currentUser = null;
    let currentChannel = 'general';
    let lastMessageCount = 0;
    let channels = [];
    let refreshInterval = null;
    
    // Helper function
    function $(id) {
        return document.getElementById(id);
    }
    
    // Initialize
    function init() {
        console.log('[INIT] Starting chat application...');
        
        // Check authentication - support both methods
        if (!document.cookie.includes('auth=true')) {
            console.log('[INIT] No auth cookie, redirecting to login');
            window.location.href = '/login.html';
            return;
        }

        // Get user info - try userInfo object first, fallback to username
        let userInfo = sessionStorage.getItem('userInfo');
        if (userInfo) {
            // Parse stored user object
            currentUser = JSON.parse(userInfo);
            console.log('[INIT] Loaded user from userInfo:', currentUser.username);
        } else {
            // Fallback: check for plain username
            const username = sessionStorage.getItem('username');
            if (username) {
                currentUser = { username: username };
                console.log('[INIT] Loaded user from username:', username);
            } else {
                // No user info at all - create default
                console.log('[INIT] No user info, creating default');
                currentUser = { username: 'admin' };
            }
        }
        
        // Display username
        const displayName = currentUser.username || currentUser;
        $('currentUsername').textContent = displayName;
        
        // Set up event listeners
        $('sendBtn').addEventListener('click', sendMessage);
        $('messageInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
        $('logoutBtn').addEventListener('click', logout);
        $('createChannelBtn').addEventListener('click', createChannel);
        
        // Register as peer if we have peer info
        if (currentUser.peerId) {
            registerPeer();
        }
        
        // Load initial data
        loadChannels();
        loadMessages();
        
        // Start polling for updates
        refreshInterval = setInterval(function() {
            loadChannels();
            loadMessages();
        }, 5000);
        
        console.log('[INIT] Initialization complete');
    }
    
    // Register as peer (optional, only if peerId exists)
    function registerPeer() {
        fetch('/submit-info', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin',
            body: JSON.stringify({
                id: currentUser.peerId,
                peerId: currentUser.peerId,
                username: currentUser.username,
                ip: window.location.hostname,
                port: 8000
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('[PEER] Registered as peer:', currentUser.username);
        })
        .catch(error => {
            console.error('[PEER] Register failed:', error);
        });
    }
    
    // Load channels and users
    function loadChannels() {
        Promise.all([
            fetch('/channels', { credentials: 'same-origin' }).then(r => r.json()),
            fetch('/get-list', { credentials: 'same-origin' }).then(r => r.json())
        ])
        .then(([channelsData, usersData]) => {
            // Handle both formats: array of strings OR array of objects
            let channelList = channelsData.channels || [];
            
            // Normalize to simple array of channel names
            channels = channelList.map(ch => {
                if (typeof ch === 'string') return ch;
                if (ch.id) return ch.id;
                if (ch.name) return ch.name;
                return 'unknown';
            });
            
            console.log('[CHANNELS] Loaded:', channels.length, 'channels,', (usersData.peers || []).length, 'users');
            
            renderChannels(channels);
            renderUsers(usersData.peers || []);
        })
        .catch(error => {
            console.error('Error loading channels:', error);
        });
    }
    
    // Render channels list
    function renderChannels(chatChannels) {
        const channelsList = $('channelsList');
        channelsList.innerHTML = '';
        
        chatChannels.forEach(function(channel) {
            const div = document.createElement('div');
            div.className = 'channel-item' + (channel === currentChannel ? ' active' : '');
            div.textContent = '# ' + channel;
            div.onclick = function() {
                selectChannel(channel);
            };
            channelsList.appendChild(div);
        });
    }
    
    // Render users list
    function renderUsers(users) {
        const usersList = $('usersList');
        usersList.innerHTML = '';
        
        // Get current username (support both formats)
        const currentUsername = currentUser.username || currentUser;
        
        // Filter out current user
        const otherUsers = users.filter(function(user) {
            return user.username !== currentUsername && user.id !== currentUser.peerId;
        });
        
        if (otherUsers.length === 0) {
            const div = document.createElement('div');
            div.style.color = '#95a5a6';
            div.style.fontSize = '12px';
            div.style.padding = '10px';
            div.textContent = 'No other users online';
            usersList.appendChild(div);
        } else {
            otherUsers.forEach(function(user) {
                const div = document.createElement('div');
                div.className = 'user-item';
                div.textContent = '• ' + (user.username || 'Anonymous');
                usersList.appendChild(div);
            });
        }
    }
    
    // Select channel
    function selectChannel(channel) {
        console.log('[CHANNEL] Switching to channel:', channel);
        currentChannel = channel;
        lastMessageCount = 0;
        $('messagesHeader').textContent = '#' + channel;
        
        // Clear messages immediately when switching channels
        const container = $('messagesContainer');
        container.innerHTML = '<div style="text-align:center;color:#95a5a6;padding:20px;">Loading...</div>';
        
        // Update active state
        const items = document.querySelectorAll('.channel-item');
        items.forEach(function(item) {
            item.classList.remove('active');
            if (item.textContent === '# ' + channel) {
                item.classList.add('active');
            }
        });
        
        loadMessages();
    }
    
    // Load messages for current channel
    function loadMessages() {
        console.log('[MESSAGES] Loading messages for channel:', currentChannel);
        
        fetch('/messages?channel=' + encodeURIComponent(currentChannel), {
            credentials: 'same-origin'
        })
        .then(response => {
            console.log('[MESSAGES] Response status:', response.status);
            return response.json();
        })
        .then(data => {
            // Handle both formats: {messages: [...]} OR [...]
            let messages;
            if (Array.isArray(data)) {
                messages = data;
            } else {
                messages = data.messages || [];
            }
            
            console.log('[MESSAGES] Received', messages.length, 'messages');
            
            // Always render messages to ensure correct channel content is shown
            lastMessageCount = messages.length;
            renderMessages(messages);
        })
        .catch(error => {
            console.error('Error loading messages:', error);
        });
    }
    
    // Render messages
    function renderMessages(messages) {
        console.log('[RENDER] Rendering', messages.length, 'messages');
        const container = $('messagesContainer');
        container.innerHTML = '';
        
        if (messages.length === 0) {
            const div = document.createElement('div');
            div.style.textAlign = 'center';
            div.style.color = '#95a5a6';
            div.style.padding = '20px';
            div.textContent = 'No messages yet. Start the conversation!';
            container.appendChild(div);
            return;
        }
        
        messages.forEach(function(msg) {
            const div = document.createElement('div');
            div.className = 'message';
            
            const sender = document.createElement('div');
            sender.className = 'message-sender';
            sender.textContent = msg.sender;
            
            const text = document.createElement('div');
            text.className = 'message-text';
            text.textContent = msg.text;
            
            const time = document.createElement('div');
            time.className = 'message-time';
            const date = new Date(msg.timestamp * 1000);
            time.textContent = date.toLocaleTimeString();
            
            div.appendChild(sender);
            div.appendChild(text);
            div.appendChild(time);
            container.appendChild(div);
        });
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
        console.log('[RENDER] Messages rendered successfully');
    }
    
    // Send message
    function sendMessage() {
        const input = $('messageInput');
        const text = input.value.trim();
        
        if (!text) {
            console.log('[SEND] Empty message, ignoring');
            return;
        }
        
        // Get username (support both formats)
        const senderName = currentUser.username || currentUser;
        
        const message = {
            channel: currentChannel,
            sender: senderName,
            text: text,
            timestamp: Date.now() / 1000
        };
        
        console.log('[SEND] Sending message to channel:', currentChannel);
        
        fetch('/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(message)
        })
        .then(response => {
            console.log('[SEND] Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('[SEND] Response:', data);
            if (data.status === 'sent') {
                input.value = '';
                console.log('[SEND] Message sent successfully, reloading messages...');
                loadMessages();
            }
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });
    }
    
    // Create new channel
    function createChannel() {
        const channelName = prompt('Enter new channel name:');
        if (!channelName) return;
        
        console.log('[CHANNEL] Creating new channel:', channelName);
        
        fetch('/create-channel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({ channel: channelName })
        })
        .then(response => response.json())
        .then(data => {
            console.log('[CHANNEL] Create response:', data);
            if (data.status === 'created') {
                loadChannels();
                selectChannel(channelName);
            } else {
                alert('Error: ' + (data.error || 'Could not create channel'));
            }
        })
        .catch(error => {
            console.error('Error creating channel:', error);
        });
    }
    
    // Logout
    function logout() {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
        sessionStorage.clear();
        document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/login.html';
    }
    
    // Start the app
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();





































































// // Simple P2P Chat Client - Multi-channel support (DEBUG VERSION)
// (function() {
//     const $ = id => document.getElementById(id);
    
//     let currentUser = null;
//     let currentChannel = 'general';
//     let lastMessageCount = 0;
//     let channels = [];

//     // Initialize
//     function init() {
//         console.log('[INIT] Starting chat application...');
        
//         // Check if logged in
//         if (!document.cookie.includes('auth=true')) {
//             console.log('[INIT] No auth cookie, redirecting to login');
//             window.location.href = '/login.html';
//             return;
//         }

//         // Get user info from sessionStorage, or create default if not found
//         let userInfo = sessionStorage.getItem('userInfo');
//         if (!userInfo) {
//             console.log('[INIT] No sessionStorage, creating default user');
//             const defaultPeerId = 'peer-' + Math.random().toString(36).substr(2, 9);
//             const defaultUser = {
//                 username: 'admin',
//                 peerId: defaultPeerId,
//                 loginTime: new Date().toISOString()
//             };
//             sessionStorage.setItem('userInfo', JSON.stringify(defaultUser));
//             userInfo = JSON.stringify(defaultUser);
//         }

//         currentUser = JSON.parse(userInfo);
//         console.log('[INIT] Current user:', currentUser);
//         $('currentUsername').textContent = currentUser.username;
        
//         // Register this user as a peer
//         registerPeer();
        
//         // Load initial data
//         loadChannels();
//         loadMessages();
        
//         // Start auto-refresh
//         setInterval(() => {
//             loadChannels();
//             loadMessages();
//         }, 5000);
        
//         console.log('[INIT] Initialization complete');
//     }

//     // Register as peer
//     async function registerPeer() {
//         try {
//             await fetch('/submit-info', {
//                 method: 'POST',
//                 headers: {'Content-Type': 'application/json'},
//                 credentials: 'same-origin',
//                 body: JSON.stringify({
//                     id: currentUser.peerId,
//                     peerId: currentUser.peerId,
//                     username: currentUser.username,
//                     ip: window.location.hostname,
//                     port: 8000
//                 })
//             });
//             console.log('[PEER] Registered as peer:', currentUser.username);
//         } catch (e) {
//             console.error('[PEER] Register failed:', e);
//         }
//     }

//     // Load channels and online users
//     async function loadChannels() {
//         try {
//             // Fetch both in parallel for speed
//             const [channelRes, userRes] = await Promise.all([
//                 fetch('/channels', { credentials: 'same-origin' }),
//                 fetch('/get-list', { credentials: 'same-origin' })
//             ]);
            
//             const channelData = await channelRes.json();
//             const userData = await userRes.json();
            
//             const chatChannels = channelData.channels || [];
//             const onlineUsers = userData.peers || [];
            
//             console.log('[CHANNELS] Loaded:', chatChannels.length, 'channels,', onlineUsers.length, 'users');
            
//             renderSidebar(chatChannels, onlineUsers);
//         } catch (e) {
//             console.error('[CHANNELS] Load failed:', e);
//         }
//     }

//     // Render sidebar with channels and users separately
//     function renderSidebar(chatChannels, onlineUsers) {
//         const list = $('usersList');
//         let html = '';

//         // Render CHANNELS section
//         if (chatChannels.length > 0) {
//             html += '<div style="padding: 10px 20px; font-size: 12px; color: #999; font-weight: 600;">CHANNELS</div>';
//             chatChannels.forEach(channel => {
//                 const isActive = currentChannel === channel.id;
//                 html += `
//                     <div class="user-item ${isActive ? 'active' : ''}" onclick="selectChannel('${channel.id}', '${channel.name}')">
//                         <div class="user-avatar">#</div>
//                         <div class="user-details">
//                             <div class="user-name">${escapeHtml(channel.name)}</div>
//                             <div class="user-status">● ${channel.status}</div>
//                         </div>
//                     </div>
//                 `;
//             });
//         }

//         // Render ONLINE USERS section
//         html += '<div style="padding: 10px 20px; font-size: 12px; color: #999; font-weight: 600; margin-top: 10px;">ONLINE USERS</div>';
        
//         if (onlineUsers.length === 0) {
//             html += '<div style="padding: 20px; text-align: center; color: #999; font-size: 14px;">No other users online</div>';
//         } else {
//             const otherUsers = onlineUsers.filter(user => user.id !== currentUser.peerId);
            
//             if (otherUsers.length === 0) {
//                 html += '<div style="padding: 20px; text-align: center; color: #999; font-size: 14px;">No other users online</div>';
//             } else {
//                 otherUsers.forEach(user => {
//                     const username = user.username || 'Anonymous';
//                     html += `
//                         <div class="user-item">
//                             <div class="user-avatar">${username.charAt(0).toUpperCase()}</div>
//                             <div class="user-details">
//                                 <div class="user-name">${escapeHtml(username)}</div>
//                                 <div class="user-status">● online</div>
//                             </div>
//                         </div>
//                     `;
//                 });
//             }
//         }

//         list.innerHTML = html;
//     }

//     // Select a channel
//     window.selectChannel = function(channelId, channelName) {
//         console.log('[CHANNEL] Switching to channel:', channelId);
//         currentChannel = channelId;
//         lastMessageCount = -1; // Force reload by setting to -1
//         $('messagesHeader').textContent = channelName;
//         loadChannels();
        
//         // Load messages immediately and show loading state
//         const container = $('messagesContainer');
//         container.innerHTML = '<div style="padding: 40px; text-align: center; color: #999;">Loading messages...</div>';
//         loadMessages();
//     }

//     // Load messages for current channel
//     async function loadMessages() {
//         try {
//             console.log('[MESSAGES] Loading messages for channel:', currentChannel);
//             const url = `/messages?channel=${currentChannel}`;
//             console.log('[MESSAGES] Fetching:', url);
            
//             const res = await fetch(url, {
//                 credentials: 'same-origin'
//             });
            
//             console.log('[MESSAGES] Response status:', res.status);
            
//             if (!res.ok) {
//                 console.error('[MESSAGES] Response not OK:', res.status, res.statusText);
//                 return;
//             }
            
//             const messages = await res.json();
//             console.log('[MESSAGES] Received', messages.length, 'messages:', messages);
            
//             // Always update if message count changed
//             if (messages.length !== lastMessageCount) {
//                 console.log('[MESSAGES] Message count changed from', lastMessageCount, 'to', messages.length);
//                 lastMessageCount = messages.length;
//                 renderMessages(messages);
//             } else {
//                 console.log('[MESSAGES] No change in message count');
//             }
//         } catch (e) {
//             console.error('[MESSAGES] Load failed:', e);
//         }
//     }

//     // Render messages
//     function renderMessages(messages) {
//         console.log('[RENDER] Rendering', messages.length, 'messages');
//         const container = $('messagesContainer');
        
//         if (!messages || messages.length === 0) {
//             console.log('[RENDER] No messages, showing empty state');
//             container.innerHTML = `
//                 <div class="empty-state">
//                     <div class="empty-state-icon">💬</div>
//                     <p>No messages yet. Say hello!</p>
//                 </div>
//             `;
//             return;
//         }

//         const wasScrolledToBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;

//         container.innerHTML = messages.map(msg => {
//             const isSent = msg.sender === currentUser.username;
//             const time = new Date(msg.timestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
            
//             return `
//                 <div class="message ${isSent ? 'sent' : 'received'}">
//                     <div class="message-header">
//                         <span class="message-sender">${escapeHtml(msg.sender)}</span>
//                         <span class="message-time">${time}</span>
//                     </div>
//                     <div class="message-bubble">${escapeHtml(msg.text)}</div>
//                 </div>
//             `;
//         }).join('');

//         console.log('[RENDER] Messages rendered successfully');

//         if (wasScrolledToBottom) {
//             container.scrollTop = container.scrollHeight;
//         }
//     }

//     // Send message
//     async function sendMessage() {
//         const input = $('messageInput');
//         const text = input.value.trim();
        
//         if (!text) {
//             console.log('[SEND] Empty message, ignoring');
//             return;
//         }

//         const payload = {
//             sender: currentUser.username,
//             text: text,
//             timestamp: Date.now() / 1000,
//             channel: currentChannel
//         };

//         console.log('[SEND] Sending message to channel:', currentChannel);
//         console.log('[SEND] Payload:', payload);

//         try {
//             const res = await fetch('/send', {
//                 method: 'POST',
//                 headers: {'Content-Type': 'application/json'},
//                 credentials: 'same-origin',
//                 body: JSON.stringify(payload)
//             });

//             console.log('[SEND] Response status:', res.status);
            
//             if (res.ok) {
//                 const result = await res.json();
//                 console.log('[SEND] Response:', result);
                
//                 input.value = '';
//                 console.log('[SEND] Message sent successfully, reloading messages...');
                
//                 // Force reload messages
//                 lastMessageCount = 0;
//                 await loadMessages();
//             } else {
//                 console.error('[SEND] Failed with status:', res.status);
//                 alert('Failed to send message');
//             }
//         } catch (e) {
//             console.error('[SEND] Error:', e);
//             alert('Failed to send message: ' + e.message);
//         }
//     }

//     // Logout
//     function logout() {
//         sessionStorage.removeItem('userInfo');
//         document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//         window.location.href = '/login.html';
//     }

//     // Escape HTML
//     function escapeHtml(text) {
//         const div = document.createElement('div');
//         div.textContent = text;
//         return div.innerHTML;
//     }

//     // Event handlers
//     window.addEventListener('load', () => {
//         init();
        
//         $('sendBtn').addEventListener('click', () => {
//             console.log('[UI] Send button clicked');
//             sendMessage();
//         });
        
//         $('messageInput').addEventListener('keypress', (e) => {
//             if (e.key === 'Enter') {
//                 console.log('[UI] Enter key pressed');
//                 e.preventDefault();
//                 sendMessage();
//             }
//         });
        
//         $('logoutBtn').addEventListener('click', logout);
        
//         $('mobileMenuBtn').addEventListener('click', () => {
//             $('sidebar').classList.toggle('mobile-open');
//         });
//     });
// })();