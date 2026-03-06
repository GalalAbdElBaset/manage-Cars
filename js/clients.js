// ==================== CLIENTS MODULE ====================

const clientsCache = {
    containers: {},
    elements: {},
    initialized: false
};

function normalizePhone(phone) {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');

    if (cleaned.startsWith('20')) {
        cleaned = '0' + cleaned.substring(2);
    }

    return cleaned;
}

function splitPhoneNumber(intlPhone) {
    if (!intlPhone) return { code: '+20', number: '' };
    
    const phoneStr = String(intlPhone);
    let code = '+20'; 
    let number = phoneStr;
    const knownCodes = ['+20', '+966', '+971'];
    for (const knownCode of knownCodes) {
        if (phoneStr.startsWith(knownCode)) {
            code = knownCode;
            number = phoneStr.substring(knownCode.length);
            break;
        }
    }
    if (code === '+20' && number.startsWith('0')) {
        number = number.substring(1);
    }
    
    return { code, number };
}

function initClientsModule() {
    cacheClientsElements();
    setupClientsEventListeners();
    clientsCache.initialized = true;
    
    if (document.querySelector('[data-screen="clients-list"]')) {
        loadClients();
    }
}

function buildInternationalPhone(code, phone) {
    const cleaned = phone.replace(/^0+/, '').replace(/\D/g, '');
    return code + cleaned;
}

function cacheClientsElements() {
    clientsCache.containers = {
        clientsList: document.querySelector('[data-screen="clients-list"] .content'),
        clientDetails: document.querySelector('[data-screen="client-details"] .card'),
        addClientScreen: document.querySelector('[data-screen="add-client"]'),
        editClientScreen: document.querySelector('[data-screen="edit-client"]')
    };

    clientsCache.elements = {
        addName: document.getElementById('add-client-name'),
        addPhone: document.getElementById('add-client-phone'),
        addNotes: document.getElementById('add-client-notes'),
        addCountryCode: document.getElementById('country-code'), 
        editName: document.getElementById('edit-client-name'),
        editPhone: document.getElementById('edit-client-phone'),
        editNotes: document.getElementById('edit-client-notes'),
        editCountryCode: document.getElementById('edit-country-code'), 
        saveBtn: document.getElementById('save-client'),
        updateBtn: document.getElementById('update-client'),
        callBtn: document.querySelector('[data-screen="client-details"] .btn-secondary:nth-child(2)'),
        whatsappBtn: document.querySelector('[data-screen="client-details"] .btn-secondary:nth-child(3)'),
        editClientBtn: document.querySelector('[data-screen="client-details"] [data-edit-client]')
    };
}

function setupClientsEventListeners() {
    // Save new client
    if (clientsCache.elements.saveBtn) {
        clientsCache.elements.saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSaveClient();
        });
    }
    // Update client
    if (clientsCache.elements.updateBtn) {
        clientsCache.elements.updateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleUpdateClient();
        });
    }
    if (clientsCache.elements.addName) {
        clientsCache.elements.addName.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') clientsCache.elements.addPhone.focus();
        });
    }
    if (clientsCache.elements.addPhone) {
        clientsCache.elements.addPhone.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') clientsCache.elements.addNotes.focus();
        });
    }
    if (clientsCache.elements.addNotes) {
        clientsCache.elements.addNotes.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleSaveClient();
        });
    }
    if (clientsCache.elements.editName) {
        clientsCache.elements.editName.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleUpdateClient();
        });
    }
    document.addEventListener('click', handleClientsClickEvents);
}

function handleClientsClickEvents(e) {
    // منع السلوك الافتراضي
    if (e.target.closest('button')) {
        e.preventDefault();
    }
    
    const target = e.target;
    const viewBtn = target.closest('[data-view-client]');
    if (viewBtn) {
        const clientId = viewBtn.dataset.viewClient;
        viewClientDetails(clientId);
        return;
    }
    const deleteBtn = target.closest('[data-delete-client]');
    if (deleteBtn) {
        const clientId = deleteBtn.dataset.deleteClient;
        handleDeleteClient(clientId);
        return;
    }
    const editBtn = target.closest('[data-edit-client]');
    if (editBtn && editBtn.dataset.editClient) {
        const clientId = editBtn.dataset.editClient;
        openEditClientScreen(clientId);
        return;
    }
}

// Load all clients
function loadClients() {
    showLoading(true);
    
    const clients = getLocalData('clients');
    renderClients(clients);
    showLoading(false);
}

// Render clients list with improved UI
function renderClients(clients) {
    const container = clientsCache.containers.clientsList;
    if (!container) return;

    container.innerHTML = '';

    if (!clients || clients.length === 0) {
        renderEmptyState('clients');
        return;
    }
    
    // Sort clients alphabetically
    clients.sort((a, b) => a.name.localeCompare(b.name));

    clients.forEach(client => {
        const card = createClientCard(client);
        container.appendChild(card);
    });
    
    // Add smooth animation for list items
    setTimeout(() => {
        const cards = container.querySelectorAll('.client-item');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 50}ms`;
            card.classList.add('animate-in');
        });
    }, 100);
}

// Create client card element
function createClientCard(client) {
    const card = document.createElement('div');
    card.className = 'client-item';
    card.setAttribute('data-client-id', client.id);
    
    // Generate initials for avatar
    const initials = getInitials(client.name);
    
    const getCountryFlag = (phone) => {
        if (phone.startsWith('+20')) return '🇪🇬';
        if (phone.startsWith('+966')) return '🇸🇦';
        if (phone.startsWith('+971')) return '🇦🇪';
        return '<i class="fa-solid fa-phone">';
    };
    
    const flag = getCountryFlag(client.phone);
    
    card.innerHTML = `
        <div class="client-avatar">${initials}</div>
        <div class="client-info">
            <div class="client-name">${escapeHtml(client.name)}</div>
            <div class="client-phone">
                <i class="fa-solid fa-phone"></i> ${flag} ${escapeHtml(client.phone)}
            </div>
            ${client.nots ? `<div class="client-notes">${escapeHtml(client.nots)}</div>` : ''}
        </div>
        <div class="client-actions">
            <button type="button" class="btn-icon btn-view" data-view-client="${client.id}" 
                    title="View Details">
                <i class="fa-solid fa-eye"></i>
            </button>
            <button type="button" class="btn-icon btn-delete" data-delete-client="${client.id}" 
                    title="Delete Client">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    
    return card;
}

// Add new client
async function addClient(clientData) {
    try {
        const cleanName = clientData.name.trim();
        const cleanPhoneNumber = normalizePhone(clientData.phone);
        const countryCode = clientData.countryCode || '+20';   
        const internationalPhone = buildInternationalPhone(countryCode, cleanPhoneNumber);
        
        const existingClients = getLocalData('clients');
        
        const exists = existingClients.some(
            c => c.phone === internationalPhone
        );
        
        if (exists) {
            showToast('Client with this phone number already exists', 'warning');
            return false;
        }
        
        const id = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
        const newClient = {
            id: id,
            name: cleanName,
            phone: internationalPhone,
            nots: clientData.notes?.trim() || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        existingClients.push(newClient);
        setLocalData('clients', existingClients);

        showToast('Client added successfully!', 'success');
        clearAddClientForm();
        loadClients();
        showScreen('clients-list');
        
        return true;
    } catch (error) {
        console.error('Error adding client:', error);
        showToast('Failed to add client. Please try again.', 'error');
        return false;
    }
}

async function viewClientDetails(clientId) {
    try {
        showLoading(true);
        
        const clients = getLocalData('clients');
        const client = clients.find(c => c.id === clientId);
        
        if (!client) throw new Error('Client not found');
        
        renderClientDetails(client);
        
        showScreen('client-details');
        showLoading(false);
    } catch (error) {
        console.error('Error loading client details:', error);
        showToast('Failed to load client details', 'error');
        showLoading(false);
    }
}

// Render client details
function renderClientDetails(client) {
    const container = clientsCache.containers.clientDetails;
    if (!container) return;

    const initials = getInitials(client.name);
    const createdDate = new Date(client.createdAt || Date.now()).toLocaleDateString();
    
    const getCountryFlag = (phone) => {
        if (phone.startsWith('+20')) return '🇪🇬 Egypt';
        if (phone.startsWith('+966')) return '🇸🇦 Saudi Arabia';
        if (phone.startsWith('+971')) return '🇦🇪 UAE';
        return '<i class="fa-solid fa-phone"></i>' + phone;
    };
    
    const countryInfo = getCountryFlag(client.phone);
    
    container.innerHTML = `
        <div class="client-detail-header">
            <div class="client-detail-avatar">${initials}</div>
            <div class="client-detail-info">
                <h3>${escapeHtml(client.name)}</h3>
                <p class="text-muted">Added on ${createdDate}</p>
            </div>
        </div>
        
        <div class="client-detail-content">
            <div class="detail-item">
                <i class="fa-solid fa-phone"></i>
                <div>
                    <span class="detail-label">Phone Number</span>
                    <span class="detail-value">${countryInfo} ${escapeHtml(client.phone)}</span>
                </div>
            </div>
            
            ${client.nots ? `
            <div class="detail-item">
                <i class="fa-solid fa-note-sticky"></i>
                <div>
                    <span class="detail-label">Notes</span>
                    <span class="detail-value">${escapeHtml(client.nots)}</span>
                </div>
            </div>
            ` : ''}
        </div>
    `;

    if (clientsCache.elements.editClientBtn) {
        clientsCache.elements.editClientBtn.dataset.editClient = client.id;
    }

    if (clientsCache.elements.callBtn) {
        clientsCache.elements.callBtn.onclick = (e) => {
            e.preventDefault();
            window.location.href = `tel:${client.phone}`;
        };
    }
    if (clientsCache.elements.whatsappBtn) {
        clientsCache.elements.whatsappBtn.onclick = (e) => {
            e.preventDefault();
            const message = encodeURIComponent(`Hello ${client.name}!`);
            window.open(`https://wa.me/${client.phone.replace('+', '')}?text=${message}`, '_blank');
        };
    }
}

// Open edit client screen
async function openEditClientScreen(clientId) {
    try {
        showLoading(true);
        const clients = getLocalData('clients');
        const client = clients.find(c => c.id === clientId);
        
        if (!client) throw new Error('Client not found');
        
        const { code, number } = splitPhoneNumber(client.phone);
        
        if (clientsCache.elements.editName) {
            clientsCache.elements.editName.value = client.name || '';
        }
        
        if (clientsCache.elements.editPhone) {
            clientsCache.elements.editPhone.value = number || '';
        }
        
        if (clientsCache.elements.editCountryCode) {
            clientsCache.elements.editCountryCode.value = code || '+20';
        }
        
        if (clientsCache.elements.editNotes) {
            clientsCache.elements.editNotes.value = client.nots || '';
        }
        
        if (clientsCache.elements.updateBtn) {
            clientsCache.elements.updateBtn.dataset.clientId = clientId;
        }
        
        showScreen('edit-client');
        showLoading(false);
    } catch (error) {
        console.error('Error loading client for edit:', error);
        showToast('Failed to load client data', 'error');
        showLoading(false);
    }
}

async function updateClient(clientId, clientData) {
    try {
        const cleanName = clientData.name.trim();
        const cleanPhoneNumber = normalizePhone(clientData.phone);
        const countryCode = clientData.countryCode || '+20'; 
        const internationalPhone = buildInternationalPhone(countryCode, cleanPhoneNumber);

        const allClients = getLocalData('clients');

        const exists = allClients.some(
            c => c.id !== clientId && c.phone === internationalPhone
        );

        if (exists) {
            showToast('Another client already uses this phone number', 'warning');
            return false;
        }

        const clientIndex = allClients.findIndex(c => c.id === clientId);
        if (clientIndex === -1) throw new Error('Client not found');
        
        const currentClient = allClients[clientIndex];
        
        const updatedClient = {
            ...currentClient,
            name: cleanName,
            phone: internationalPhone, 
            nots: clientData.notes?.trim() || '',
            updatedAt: new Date().toISOString()
        };

        allClients[clientIndex] = updatedClient;
        setLocalData('clients', allClients);

        showToast('Client updated successfully!', 'success');
        loadClients();
        showScreen('clients-list');
        
        return true;
    } catch (error) {
        console.error('Error updating client:', error);
        showToast('Failed to update client. Please try again.', 'error');
        return false;
    }
}

async function handleDeleteClient(clientId) {
    const confirmed = await showConfirmationDialog(
        'Delete Client',
        'Are you sure you want to delete this client? This action cannot be undone.',
        'Delete',
        'Cancel'
    );
    
    if (!confirmed) return;

    try {
        showLoading(true);
        
        const allClients = getLocalData('clients');
        const updatedClients = allClients.filter(c => c.id !== clientId);
        setLocalData('clients', updatedClients);

        showToast('Client deleted successfully', 'success');
        loadClients();
        
        if (document.querySelector('[data-screen="client-details"].active')) {
            showScreen('clients-list');
        }
    } catch (error) {
        console.error('Error deleting client:', error);
        showToast('Failed to delete client. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleSaveClient() {
    if (!validateClientForm('add')) return;
    
    const clientData = {
        name: clientsCache.elements.addName?.value || '',
        phone: clientsCache.elements.addPhone?.value || '',
        notes: clientsCache.elements.addNotes?.value || '',
        countryCode: clientsCache.elements.addCountryCode?.value || '+20'
    };
    
    await addClient(clientData);
}

async function handleUpdateClient() {
    const clientId = clientsCache.elements.updateBtn?.dataset.clientId;
    if (!clientId || !validateClientForm('edit')) return;
    
    const clientData = {
        name: clientsCache.elements.editName?.value || '',
        phone: clientsCache.elements.editPhone?.value || '',
        notes: clientsCache.elements.editNotes?.value || '',
        countryCode: clientsCache.elements.editCountryCode?.value || '+20'
    };
    
    await updateClient(clientId, clientData);
}

function validateClientForm(formType) {
    let name, phone, countryCode;
    
    if (formType === 'add') {
        name = clientsCache.elements.addName?.value.trim();
        phone = clientsCache.elements.addPhone?.value.trim();
        countryCode = clientsCache.elements.addCountryCode?.value || '+20';
    } else {
        name = clientsCache.elements.editName?.value.trim();
        phone = clientsCache.elements.editPhone?.value.trim();
        countryCode = clientsCache.elements.editCountryCode?.value || '+20';
    }
    
    const errors = [];
    
    if (!name) errors.push('Name is required');
    if (!phone) errors.push('Phone number is required');
    
    if (phone) {
        const internationalPhone = buildInternationalPhone(countryCode, phone);
        if (!isValidPhoneNumber(internationalPhone)) {
            errors.push('Please enter a valid phone number');
        }
    }
    
    if (errors.length > 0) {
        showToast(errors.join('. '), 'error');
        return false;
    }
    
    return true;
}

function clearAddClientForm() {
    if (clientsCache.elements.addName) clientsCache.elements.addName.value = '';
    if (clientsCache.elements.addPhone) clientsCache.elements.addPhone.value = '';
    if (clientsCache.elements.addNotes) clientsCache.elements.addNotes.value = '';
    if (clientsCache.elements.addCountryCode) clientsCache.elements.addCountryCode.value = '+20';
}

function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function isValidPhoneNumber(phone) {
    const phoneRegex = /^[\+][1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderEmptyState(type) {
    const container = clientsCache.containers.clientsList;
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-users"></i>
            <h3>No Clients Found</h3>
            <p>${type === 'clients' ? 'Get started by adding your first client!' : 'No data available'}</p>
            ${type === 'clients' ? `
                <button class="btn btn-primary mt-4 add-clients" data-go="add-client">
                    <i class="fa-solid fa-plus icon-plus"></i> Add First Client
                </button>
            ` : ''}
        </div>
    `;
}

// Show loading state
function showLoading(show) {
    const container = clientsCache.containers.clientsList;
    if (!container) return;
    
    if (show) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading clients...</p>
            </div>
        `;
        container.appendChild(loadingDiv);
    } else {
        const loadingOverlay = container.querySelector('.loading-overlay');
        if (loadingOverlay) loadingOverlay.remove();
    }
}

async function showConfirmationDialog(title, message, confirmText, cancelText) {
    return new Promise((resolve) => {
        const confirmed = window.confirm(`${title}\n\n${message}`);
        resolve(confirmed);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initClientsModule();
});

window.ClientsModule = {
    init: initClientsModule,
    loadClients: loadClients,
    addClient: addClient,
    updateClient: updateClient,
    deleteClient: handleDeleteClient
};