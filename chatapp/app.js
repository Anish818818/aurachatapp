/**
 * AuraChat - Full Functional Simulation
 */

// --- Data ---
const defaultChats = [
    {
        id: '1', name: 'Steve Rodriguez', avatar: 'https://i.pravatar.cc/150?u=steve',
        lastMsg: 'There is lot to talk', time: '4:16 PM', unread: 0, status: 'online',
        messages: [
            { id: 'm1', text: 'so what?', sender: 'them', time: '10:39 AM' },
            { id: 'm2', text: 'We may undergo a risk', sender: 'them', time: '10:39 AM' },
            { id: 'm3', text: 'Not sure of the success', sender: 'them', time: '10:39 AM' },
            { id: 'm4', text: 'we may succeed', sender: 'me', time: '10:39 AM' },
        ]
    },
    {
        id: '2', name: 'Miles Thompson', avatar: 'https://i.pravatar.cc/150?u=miles',
        lastMsg: 'I got you bro 💪 😎', time: '6:10 PM', unread: 1, status: 'online',
        messages: []
    }
];

const callHistory = [
    { id: 'c1', name: 'Matilda', type: 'outgoing', time: 'Yesterday', missed: false, avatar: 'https://i.pravatar.cc/150?u=matilda' },
    { id: 'c2', name: 'Bensheen Clarke', type: 'incoming', time: 'Yesterday', missed: true, avatar: 'https://i.pravatar.cc/150?u=bensheen' },
    { id: 'c3', name: 'Hugh Hector', type: 'incoming', time: 'Yesterday', missed: false, avatar: 'https://i.pravatar.cc/150?u=hugh' }
];

const statusUpdates = [
    { id: 's1', name: 'Steve Rodriguez', time: '1h ago', avatar: 'https://i.pravatar.cc/150?u=steve', image: 'https://picsum.photos/400/800?random=1' },
    { id: 's2', name: 'Reed Joseph', time: '23h ago', avatar: 'https://i.pravatar.cc/150?u=reed', image: 'https://picsum.photos/400/800?random=2' },
    { id: 's3', name: 'Robin Clarke', time: '23h ago', avatar: 'https://i.pravatar.cc/150?u=robin', image: 'https://picsum.photos/400/800?random=3' }
];

const defaultProfile = { name: 'Ramnan', bio: 'Do not fail to...', avatar: 'https://i.pravatar.cc/150?u=ramnan' };

const emojiList = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😋", "😛", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮"];

// --- App State ---
let chats = JSON.parse(localStorage.getItem('chats')) || defaultChats;
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || defaultProfile;
let currentTab = 'chats';
let activeChatId = null;

// --- DOM References ---
const screenContainer = document.getElementById('screen-container');
const mainNav = document.getElementById('main-nav');
const callOverlay = document.getElementById('call-overlay');
const statusOverlay = document.getElementById('status-overlay');
const emojiPicker = document.getElementById('emoji-picker');
const emojiGrid = document.getElementById('emoji-grid');

const templates = {
    chats: document.getElementById('chat-list-template'),
    chatView: document.getElementById('chat-view-template'),
    calls: document.getElementById('calls-template'),
    status: document.getElementById('status-template'),
    communities: document.getElementById('communities-template'),
    settings: document.getElementById('settings-template'),
    profile: document.getElementById('profile-editor-template'),
    callScreen: document.getElementById('call-screen-template'),
    statusViewer: document.getElementById('status-viewer-template')
};

// --- Initialization ---
function init() {
    renderTab('chats');
    setupNav();
    renderEmojiGrid();
}

function setupNav() {
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.onclick = () => renderTab(btn.dataset.screen);
    });
}

function renderTab(tab) {
    currentTab = tab;
    activeChatId = null;
    mainNav.classList.remove('hidden');
    screenContainer.innerHTML = '';

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.screen === tab);
    });

    switch (tab) {
        case 'chats': renderChatList(); break;
        case 'calls': renderCalls(); break;
        case 'status': renderStatus(); break;
        case 'camera': renderCommunities(); break;
        case 'settings': renderSettings(); break;
    }
}

// --- Chats & Messaging ---
function renderChatList() {
    const content = templates.chats.content.cloneNode(true);
    const list = content.getElementById('chat-list');

    chats.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'chat-item';
        item.innerHTML = `
            <div class="avatar medium"><img src="${chat.avatar}"></div>
            <div class="chat-info">
                <div class="chat-top"><h3>${chat.name}</h3><span class="chat-time">${chat.time}</span></div>
                <div class="chat-bottom">
                    <p class="last-msg">${chat.lastMsg}</p>
                    ${chat.unread ? `<span class="unread-count badge-ios" style="background:var(--ios-blue);">${chat.unread}</span>` : ''}
                </div>
            </div>
        `;
        item.onclick = () => openChat(chat.id);
        list.appendChild(item);
    });

    screenContainer.appendChild(content);
}

function openChat(id) {
    activeChatId = id;
    const chat = chats.find(c => c.id === id);
    const content = templates.chatView.content.cloneNode(true);
    mainNav.classList.add('hidden');

    content.getElementById('active-chat-name').textContent = chat.name;
    const avatar = content.getElementById('active-chat-avatar');
    avatar.className = "avatar small";
    avatar.innerHTML = `<img src="${chat.avatar}">`;

    const msgList = content.getElementById('messages-list');
    renderMessages(chat.messages, msgList);

    content.querySelector('.back-btn').onclick = () => renderTab('chats');
    content.getElementById('chat-voice-btn').onclick = () => triggerCall(chat);
    content.getElementById('chat-video-btn').onclick = () => triggerCall(chat);

    const input = content.getElementById('message-input');
    const sendBtn = content.getElementById('send-btn');
    const micBtn = content.getElementById('mic-btn');

    input.oninput = () => {
        const hasText = input.value.trim().length > 0;
        sendBtn.style.display = hasText ? 'flex' : 'none';
        micBtn.style.display = hasText ? 'none' : 'flex';
    };

    sendBtn.onclick = () => {
        if (input.value.trim()) {
            sendMessage(chat.id, input.value, msgList);
            input.value = '';
            sendBtn.style.display = 'none';
            micBtn.style.display = 'flex';
        }
    };

    content.getElementById('emoji-btn-toggle').onclick = () => {
        emojiPicker.classList.toggle('hidden');
    };

    screenContainer.innerHTML = '';
    screenContainer.appendChild(content);
}

function renderMessages(messages, container) {
    container.innerHTML = '';
    messages.forEach(m => {
        const div = document.createElement('div');
        div.className = `message ${m.sender}`;
        div.innerHTML = `
            ${m.text}
            <span class="m-time">${m.time} ${m.sender === 'me' ? '<i class="fa-solid fa-check-double" style="color:#34B7F1; font-size:10px;"></i>' : ''}</span>
        `;
        container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
}

function sendMessage(chatId, text, container) {
    const chat = chats.find(c => c.id === chatId);
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = { id: Date.now().toString(), text, sender: 'me', time };

    chat.messages.push(msg);
    chat.lastMsg = text;
    chat.time = time;

    saveChats();
    renderMessages(chat.messages, container);
}

// --- Calling ---
function triggerCall(contact) {
    const content = templates.callScreen.content.cloneNode(true);
    content.getElementById('call-name').textContent = contact.name;
    content.getElementById('call-avatar').innerHTML = `<img src="${contact.avatar}">`;

    const endBtn = content.getElementById('end-call-btn');
    endBtn.onclick = () => {
        callOverlay.classList.add('hidden');
        callOverlay.innerHTML = '';
    };

    callOverlay.innerHTML = '';
    callOverlay.appendChild(content);
    callOverlay.classList.remove('hidden');

    // Simulate connection
    setTimeout(() => {
        const status = document.getElementById('call-status');
        if (status) status.textContent = "00:01";
        const timer = setInterval(() => {
            if (!status || callOverlay.classList.contains('hidden')) {
                clearInterval(timer);
                return;
            }
            // Simple timer logic
        }, 1000);
    }, 2000);
}

// --- Status ---
function renderStatus() {
    const content = templates.status.content.cloneNode(true);
    content.getElementById('status-my-avatar').src = userProfile.avatar;

    const list = content.getElementById('status-recent');
    statusUpdates.forEach(s => {
        const item = document.createElement('div');
        item.className = 'status-item';
        item.innerHTML = `
            <div class="status-ring"><div class="avatar medium"><img src="${s.avatar}"></div></div>
            <div class="status-info">
                <h3>${s.name}</h3>
                <p>${s.time}</p>
            </div>
        `;
        item.onclick = () => openStatusViewer(s);
        list.appendChild(item);
    });

    screenContainer.appendChild(content);
}

function openStatusViewer(status) {
    const content = templates.statusViewer.content.cloneNode(true);
    content.getElementById('status-viewer-name').textContent = status.name;
    content.getElementById('status-viewer-time').textContent = status.time;
    content.getElementById('status-viewer-avatar').innerHTML = `<img src="${status.avatar}">`;
    content.getElementById('status-viewer-img').src = status.image;

    const closeBtn = content.getElementById('status-close-btn');
    closeBtn.onclick = () => {
        statusOverlay.classList.add('hidden');
        statusOverlay.innerHTML = '';
    };

    statusOverlay.innerHTML = '';
    statusOverlay.appendChild(content);
    statusOverlay.classList.remove('hidden');

    // Progress bar animation
    const seg = document.createElement('div');
    seg.className = 'progress-segment';
    seg.innerHTML = '<div class="progress-fill"></div>';
    document.getElementById('status-progress-container').appendChild(seg);

    const fill = seg.querySelector('.progress-fill');
    setTimeout(() => {
        fill.style.transition = 'width 5s linear';
        fill.style.width = '100%';
    }, 50);

    setTimeout(() => {
        if (!statusOverlay.classList.contains('hidden')) {
            statusOverlay.classList.add('hidden');
        }
    }, 5000);
}

// --- Calls History ---
function renderCalls() {
    const content = templates.calls.content.cloneNode(true);
    const list = content.getElementById('calls-list');

    callHistory.forEach(c => {
        const item = document.createElement('div');
        item.className = 'chat-item';
        item.innerHTML = `
            <div class="avatar medium"><img src="${c.avatar}"></div>
            <div class="chat-info">
                <div class="chat-top"><h3 style="${c.missed ? 'color:#FF3B30' : ''}">${c.name}</h3><span class="chat-time">${c.time}</span></div>
                <div class="chat-bottom"><p class="last-msg"><i class="fa-solid fa-phone" style="font-size:10px; margin-right:5px;"></i>${c.type}</p></div>
            </div>
            <i class="fa-solid fa-circle-info" style="color:var(--ios-blue); font-size:20px;"></i>
        `;
        list.appendChild(item);
    });

    screenContainer.appendChild(content);
}

// --- Communities, Settings, etc ---
function renderCommunities() {
    const content = templates.communities.content.cloneNode(true);
    screenContainer.appendChild(content);
}

function renderSettings() {
    const content = templates.settings.content.cloneNode(true);
    content.getElementById('my-avatar-img').src = userProfile.avatar;
    content.getElementById('my-name-display').textContent = userProfile.name;
    content.getElementById('my-bio-display').textContent = userProfile.bio;
    content.getElementById('profile-edit-trigger').onclick = () => renderProfileEditor();
    screenContainer.appendChild(content);
}

function renderProfileEditor() {
    const content = templates.profile.content.cloneNode(true);
    mainNav.classList.add('hidden');

    const avatarImg = content.getElementById('edit-avatar-preview');
    avatarImg.src = userProfile.avatar;
    content.getElementById('edit-profile-name').value = userProfile.name;
    content.getElementById('edit-profile-bio').value = userProfile.bio;

    content.getElementById('profile-back-btn').onclick = () => renderTab('settings');
    content.getElementById('profile-save-btn').onclick = () => {
        userProfile.name = content.getElementById('edit-profile-name').value;
        userProfile.bio = content.getElementById('edit-profile-bio').value;
        const urlInput = content.getElementById('avatar-url-input');
        if (urlInput.value) userProfile.avatar = urlInput.value;

        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        renderTab('settings');
    };

    content.getElementById('change-photo-btn').onclick = () => {
        const input = content.getElementById('avatar-url-input');
        input.classList.toggle('hidden');
    };

    screenContainer.innerHTML = '';
    screenContainer.appendChild(content);
}

// --- Utilities ---
function saveChats() { localStorage.setItem('chats', JSON.stringify(chats)); }

function renderEmojiGrid() {
    emojiList.forEach(emoji => {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.style.cursor = 'pointer';
        span.onclick = () => {
            const input = document.getElementById('message-input');
            if (input) {
                input.value += emoji;
                input.dispatchEvent(new Event('input'));
            }
        };
        emojiGrid.appendChild(span);
    });
}

// --- Boot ---
init();
