/**
 * Input Page - Character Management
 * Handles character input, editing, and management for KujiKuji lottery system
 */

// Global state
let editingCharacterId = null;

/**
 * Initialize i18n and app
 */
window.addEventListener('DOMContentLoaded', () => {
    window.i18n.init().then(() => {
        // Load existing data
        loadCharacters();
        updateStatistics();
        setupLanguageSelector();
    });
});

/**
 * Setup language selector
 */
function setupLanguageSelector() {
    const selector = document.getElementById('languageSelector');
    if (selector) {
        // Set current language
        selector.value = window.i18n.getCurrentLanguage();
        
        // Handle language change
        selector.addEventListener('change', (e) => {
            window.i18n.setLanguage(e.target.value);
        });
    }
}

// ===== Tab Switching =====
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        
        // Update buttons
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`tab-${tabName}`).classList.add('active');
    });
});

// ===== Number Input Mode =====
document.getElementById('generateBtn').addEventListener('click', () => {
    const count = parseInt(document.getElementById('characterCount').value);
    if (count > 0 && count <= 50) {
        StorageManager.generateCharacters(count);
        loadCharacters();
        updateStatistics();
        showNotification(`✅ ${count}${window.i18n.t('input.notifications.generated')}`);
    } else {
        showNotification(window.i18n.t('input.notifications.enterNumber'), 'warning');
    }
});

// ===== Text Input Mode =====
document.getElementById('parseTextBtn').addEventListener('click', () => {
    const text = document.getElementById('characterText').value;
    const names = text.split('\n').filter(name => name.trim());
    
    if (names.length > 0) {
        StorageManager.addCharacters(names);
        document.getElementById('characterText').value = '';
        loadCharacters();
        updateStatistics();
        showNotification(`✅ ${names.length}${window.i18n.t('input.notifications.added')}`);
    } else {
        showNotification(window.i18n.t('input.notifications.enterName'), 'warning');
    }
});

// ===== Manual Add Mode =====
const manualNameInput = document.getElementById('manualName');
document.getElementById('addManualBtn').addEventListener('click', addManualCharacter);

manualNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addManualCharacter();
    }
});

function addManualCharacter() {
    const name = manualNameInput.value.trim();
    if (name) {
        StorageManager.addCharacter(name);
        manualNameInput.value = '';
        loadCharacters();
        updateStatistics();
        showNotification(`✅ "${name}" ${window.i18n.t('input.notifications.addedSingle')}`);
    } else {
        showNotification(window.i18n.t('input.notifications.enterSingleName'), 'warning');
    }
}

// ===== Character List =====
function loadCharacters() {
    const characters = StorageManager.getAllCharacters();
    const listContainer = document.getElementById('characterList');
    
    if (characters.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                <p data-i18n="input.emptyState.line1">${window.i18n.t('input.emptyState.line1')}</p>
                <p data-i18n="input.emptyState.line2">${window.i18n.t('input.emptyState.line2')}</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = characters.map(char => `
        <div class="character-item" data-id="${char.id}">
            <img class="character-avatar" 
                 src="${StorageManager.getAvatarUrl(char.avatarSeed)}" 
                 alt="${char.name}" />
            <div class="character-name">
                <span class="name-display">${char.name}</span>
                <input type="text" class="name-edit" value="${char.name}" style="display:none;" />
            </div>
            ${char.selected ? `<span style="color: #28a745;" data-i18n="input.selected">${window.i18n.t('input.selected')}</span>` : ''}
            <div class="character-actions">
                <button class="edit-btn" onclick="editCharacter('${char.id}')" data-i18n="input.edit">${window.i18n.t('input.edit')}</button>
                <button class="delete-btn" onclick="deleteCharacter('${char.id}')" data-i18n="input.delete">${window.i18n.t('input.delete')}</button>
            </div>
        </div>
    `).join('');
}

function editCharacter(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    const display = item.querySelector('.name-display');
    const input = item.querySelector('.name-edit');
    const editBtn = item.querySelector('.edit-btn');

    if (editingCharacterId === id) {
        // Save
        const newName = input.value.trim();
        if (newName) {
            StorageManager.updateCharacter(id, { name: newName });
            display.textContent = newName;
            display.style.display = 'inline';
            input.style.display = 'none';
            editBtn.textContent = window.i18n.t('input.edit');
            editBtn.classList.remove('save-btn');
            editBtn.classList.add('edit-btn');
            editingCharacterId = null;
            showNotification(`✅ ${window.i18n.t('input.notifications.updated')}`);
        }
    } else {
        // Edit mode
        display.style.display = 'none';
        input.style.display = 'block';
        input.focus();
        input.select();
        editBtn.textContent = window.i18n.t('input.save');
        editBtn.classList.remove('edit-btn');
        editBtn.classList.add('save-btn');
        editingCharacterId = id;
    }
}

function deleteCharacter(id) {
    if (confirm(window.i18n.t('input.notifications.deleteConfirm'))) {
        StorageManager.deleteCharacter(id);
        loadCharacters();
        updateStatistics();
        showNotification(`✅ ${window.i18n.t('input.notifications.deleted')}`);
    }
}

// ===== Statistics =====
function updateStatistics() {
    const stats = StorageManager.getStatistics();
    document.getElementById('totalCount').textContent = stats.total;
    document.getElementById('selectedCount').textContent = stats.selected;
    document.getElementById('remainingCount').textContent = stats.remaining;
    
    // Enable/disable start button
    const startBtn = document.getElementById('startBtn');
    if (stats.total > 0) {
        startBtn.disabled = false;
    } else {
        startBtn.disabled = true;
    }
}

// ===== Bottom Actions =====
document.getElementById('startBtn').addEventListener('click', () => {
    const stats = StorageManager.getStatistics();
    if (stats.total > 0) {
        window.location.href = 'select.html';
    }
});

document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm(window.i18n.t('input.notifications.resetConfirm'))) {
        StorageManager.clearAll();
        loadCharacters();
        updateStatistics();
        showNotification(`✅ ${window.i18n.t('input.notifications.resetComplete')}`);
    }
});

document.getElementById('exportBtn').addEventListener('click', () => {
    const data = StorageManager.exportData();
    const filename = `kujikuji-backup-${new Date().toISOString().split('T')[0]}.json`;
    Utils.downloadFile(data, filename);
    showNotification(`✅ ${window.i18n.t('input.notifications.exported')}`);
});

// ===== Notification =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#28a745' : '#ffc107'};
        color: ${type === 'success' ? '#fff' : '#000'};
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Make functions globally accessible
window.editCharacter = editCharacter;
window.deleteCharacter = deleteCharacter;
