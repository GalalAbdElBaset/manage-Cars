// ==================== REQUESTS MODULE ====================

// LOAD CLIENTS AND CARS FOR REQUEST FORM
function loadClientsAndCarsForRequest() {
    loadClientsForRequest();
    loadCarsForRequest();
}

// LOAD CLIENTS FOR REQUEST
function loadClientsForRequest() {
    let select = document.getElementById('request-client');
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>Select Client</option>';

    const clients = getLocalData('clients');
    
    if (!clients || clients.length === 0) {
        let option = document.createElement('option');
        option.value = '';
        option.disabled = true;
        option.textContent = 'No clients available. Please add clients first.';
        select.appendChild(option);
        return;
    }
    
    clients.forEach(client => {
        let option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        select.appendChild(option);
    });
}

// LOAD CARS FOR REQUEST
function loadCarsForRequest() {
    let select = document.getElementById('request-car');
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>Select Car</option>';

    const cars = getLocalData('cars');
    
    if (!cars || cars.length === 0) {
        let option = document.createElement('option');
        option.value = '';
        option.disabled = true;
        option.textContent = 'No cars available. Please add cars first.';
        select.appendChild(option);
        return;
    }
    
    cars.forEach(car => {
        let option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.brand || ''} ${car.model || ''} (${car.year || ''}) - ${car.price || '0'} EGP`;
        option.setAttribute('data-brand', car.brand || '');
        option.setAttribute('data-model', car.model || '');
        select.appendChild(option);
    });
}

// LOAD CLIENTS AND CARS FOR EDIT FORM
function loadClientsAndCarsForEdit(selectedClientId, selectedCarId) {
    loadClientsForEdit(selectedClientId);
    loadCarsForEdit(selectedCarId);
}

// LOAD CLIENTS FOR EDIT
function loadClientsForEdit(selectedClientId) {
    let select = document.getElementById('edit-request-client');
    if (!select) return;

    select.innerHTML = '<option value="" disabled>Select Client</option>';

    const clients = getLocalData('clients');
    
    if (!clients || clients.length === 0) {
        let option = document.createElement('option');
        option.value = '';
        option.disabled = true;
        option.textContent = 'No clients available. Please add clients first.';
        select.appendChild(option);
        return;
    }
    
    clients.forEach(client => {
        let option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        if (client.id === selectedClientId) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

// LOAD CARS FOR EDIT
function loadCarsForEdit(selectedCarId) {
    let select = document.getElementById('edit-request-car');
    if (!select) return;

    select.innerHTML = '<option value="" disabled>Select Car</option>';

    const cars = getLocalData('cars');
    
    if (!cars || cars.length === 0) {
        let option = document.createElement('option');
        option.value = '';
        option.disabled = true;
        option.textContent = 'No cars available. Please add cars first.';
        select.appendChild(option);
        return;
    }
    
    cars.forEach(car => {
        let option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.brand || ''} ${car.model || ''} (${car.year || ''}) - ${car.price || '0'} EGP`;
        if (car.id === selectedCarId) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    if (selectedCarId && !cars.some(car => car.id === selectedCarId)) {
        let deletedCarOption = document.createElement('option');
        deletedCarOption.value = selectedCarId;
        deletedCarOption.disabled = true;
        deletedCarOption.textContent = '⚠️ The car no longer exists (it has been deleted)';
        deletedCarOption.style.backgroundColor = '#fff3f3';
        deletedCarOption.style.color = '#d32f2f';
        select.appendChild(deletedCarOption);
        deletedCarOption.selected = true;
    }
}

// ADD REQUEST
function addRequest(clientId, carId, status) {
    if (!clientId || !carId) {
        showToast('Please select client and car', 'error');
        return;
    }

    const requests = getLocalData('requests');
    const clients = getLocalData('clients');
    const cars = getLocalData('cars');
    
    const client = clients.find(c => c.id === clientId);
    const car = cars.find(c => c.id === carId);
    
    if (!client) {
        showToast('Client not found', 'error');
        return;
    }
    
    if (!car) {
        showToast('Car not found', 'error');
        return;
    }
    
    // Create title from car details
    const title = `${car.brand} ${car.model} - Request`;
    
    const newRequest = {
        title: title,
        clientId: clientId,
        carId: carId,
        carDetails: {
            brand: car.brand,
            model: car.model,
            year: car.year,
            price: car.price,
            paint: car.paint,
            condition: car.condition,
            category: car.category
        },
        clientName: client.name,
        status: status || "active",
        createdAt: new Date().toISOString(),
        id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
    };
    
    requests.push(newRequest);
    setLocalData('requests', requests);
    
    showToast('Request added successfully', 'success');
    
    // Clear fields
    if (document.getElementById('request-client')) document.getElementById('request-client').value = '';
    if (document.getElementById('request-car')) document.getElementById('request-car').value = '';
    if (document.getElementById('request-status')) document.getElementById('request-status').value = 'active';
    
    loadRequests();
    showScreen('requests-list');
}

// LOAD REQUESTS
function loadRequests() {
    const requests = getLocalData('requests');
    const clients = getLocalData('clients');
    const cars = getLocalData('cars');
    renderRequests(requests, clients, cars);
}

// CHECK IF CAR EXISTS
function isCarExists(carId, cars) {
    return cars && cars.some(car => car.id === carId);
}

// RENDER REQUESTS
function renderRequests(requests, clients, cars) {
    let list = document.querySelector('[data-screen="requests-list"] .content');
    if (!list) return;

    list.innerHTML = '';

    if (!requests || !requests.length) {
        list.innerHTML = '<div class="empty-state"><i class="fa-solid fa-file-lines"></i><p>No requests yet</p></div>';
        return;
    }

    requests.forEach(req => {
        let client = clients.find(c => c.id === req.clientId);
        let car = cars.find(c => c.id === req.carId);
        let carExists = isCarExists(req.carId, cars);
        
        let statusClass = req.status === 'active' ? 'status-open' : 
                         req.status === 'completed' ? 'status-closed' : 'status-pending';

        let card = document.createElement('div');
        card.className = 'card request-card';

        if (!carExists) {
            card.style.borderLeft = '4px solid #d32f2f';
            card.style.backgroundColor = '#fff8f8';
        }

        let carDisplay = '';
        if (carExists && car) {
            carDisplay = `${car.brand || ''} ${car.model || ''} (${car.year || ''})`;
        } else if (req.carDetails) {
            carDisplay = `${req.carDetails.brand || ''} ${req.carDetails.model || ''} (${req.carDetails.year || ''})`;
        } else {
            carDisplay = '⚠️ The car is no longer available';
        }

        let priceDisplay = '';
        if (carExists && car) {
            priceDisplay = (car.price || '0') + ' EGP';
        } else if (req.carDetails && req.carDetails.price) {
            priceDisplay = req.carDetails.price + ' EGP (old)';
        } else {
            priceDisplay = 'unavailable';
        }

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:start;">
                <div>
                    <strong>${req.title}</strong>
                </div>
                <span class="status ${statusClass}">${req.status}</span>
            </div>
            
            <div style="margin-top:10px;">
                <p><i class="fa-solid fa-user"></i> Client: ${client ? client.name : 'Unknown'}</p>
                <p><i class="fa-solid fa-car"></i> Car: ${carDisplay}</p>
                <p><i class="fa-solid fa-tag"></i> Price: ${priceDisplay}</p>
                ${!carExists ? '<p style="color:#d32f2f; font-size:12px;"><i class="fa-solid fa-exclamation-triangle"></i>This car has been removed from the system.</p>' : ''}
            </div>

            <div style="display:flex; gap:10px; margin-top:15px;">
                <button type="button" class="btn btn-sm btn-secondary" data-view-request="${req.id}">
                    <i class="fa-solid fa-eye"></i> View
                </button>
                <button type="button" class="btn btn-sm btn-warning" data-edit-request="${req.id}">
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button type="button" class="btn btn-sm btn-danger" data-delete-request="${req.id}">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        `;

        list.appendChild(card);
    });
}

// REQUEST DETAILS
function loadRequestDetails(id) {
    const requests = getLocalData('requests');
    const clients = getLocalData('clients');
    const cars = getLocalData('cars');
    
    const request = requests.find(r => r.id === id);
    if (!request) {
        showToast('Request not found', 'error');
        return;
    }
    
    let client = clients.find(c => c.id === request.clientId);
    let car = cars.find(c => c.id === request.carId);
    let carExists = isCarExists(request.carId, cars);
    
    renderRequestDetails(request, client, car, carExists);
    showScreen('request-details');
}

function renderRequestDetails(request, client, car, carExists) {
    let box = document.querySelector('[data-screen="request-details"] .content');
    if (!box) return;

    let statusClass = request.status === 'active' ? 'status-open' : 
    request.status === 'completed' ? 'status-closed' : 'status-pending';

    const carData = carExists && car ? car : (request.carDetails || {});
    
    let carDisplay = '';
    if (carExists && car) {
        carDisplay = `${car.brand || ''} ${car.model || ''} (${car.year || ''})`;
    } else if (request.carDetails) {
        carDisplay = `${request.carDetails.brand || ''} ${request.carDetails.model || ''} (${request.carDetails.year || ''})`;
    } else {
        carDisplay = 'not available';
    }

    let warningMessage = '';
    if (!carExists) {
        warningMessage = `
            <div style="background-color: #ffebee; color: #d32f2f; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                <i class="fa-solid fa-exclamation-triangle"></i> 
                <strong>warning:</strong>
                    This vehicle has been removed from the system. The following data is stored at the time the request was created.
                    </div>`;
    }

    box.innerHTML = `
        <div class="card">
            <h3>${request.title}</h3>
            <hr>
            ${warningMessage}
            <p><strong><i class="fa-solid fa-user"></i> Client:</strong> ${client ? client.name : '-'}</p>
            <p><strong><i class="fa-solid fa-car"></i> Car:</strong> ${carDisplay}</p>
            <p><strong><i class="fa-solid fa-palette"></i> Paint:</strong> ${carData.paint || 'N/A'}</p>
            <p><strong><i class="fa-solid fa-clipboard-list"></i> Condition:</strong> ${carData.condition || 'N/A'}</p>
            <p><strong><i class="fa-solid fa-tag"></i> Category:</strong> ${carData.category || 'N/A'}</p>
            <p><strong><i class="fa-solid fa-tag"></i> Price:</strong> ${carData.price ? carData.price + ' EGP' : 'N/A'} ${!carExists && carData.price ? '(قديم)' : ''}</p>
            <p>
                <strong>Status:</strong>
                <span class="status ${statusClass}">
                    ${request.status}
                </span>
            </p>
            <p><strong>Created:</strong> ${new Date(request.createdAt).toLocaleDateString()}</p>
        </div>

        <div style="display:flex; gap:10px; margin-top:20px;">
            <button type="button" class="btn btn-secondary" data-go="requests-list">
                <i class="fa-solid fa-arrow-left"></i> Back
            </button>
            <button type="button" class="btn btn-warning" data-edit-request="${request.id}">
                <i class="fa-solid fa-pen"></i> Edit
            </button>
            <button type="button" class="btn btn-danger" data-delete-request="${request.id}">
                <i class="fa-solid fa-trash"></i> Delete
            </button>
        </div>
    `;
}

// EVENTS
document.addEventListener('click', function(e) {
    if (e.target.closest('button')) {
        e.preventDefault();
    }
    
    /* VIEW REQUEST */
    let view = e.target.closest('[data-view-request]');
    if (view) {
        loadRequestDetails(view.dataset.viewRequest);
        return;
    }

    /* DELETE REQUEST */
    let del = e.target.closest('[data-delete-request]');
    if (del) {
        if (!confirm('Are you sure you want to delete this request?')) return;

        const requests = getLocalData('requests');
        const updatedRequests = requests.filter(r => r.id !== del.dataset.deleteRequest);
        setLocalData('requests', updatedRequests);
        
        showToast('Request deleted successfully', 'success');
        loadRequests();
        showScreen('requests-list');
        return;
    }

    /* EDIT REQUEST - Show edit form */
    let edit = e.target.closest('[data-edit-request]');
    if (edit) {
        let id = edit.dataset.editRequest;

        const requests = getLocalData('requests');
        const request = requests.find(r => r.id === id);
        
        if (!request) {
            showToast('Request not found', 'error');
            return;
        }
        
        // Load clients and cars with selected values
        loadClientsAndCarsForEdit(request.clientId, request.carId);
        
        // Set status
        let statusSelect = document.getElementById('edit-request-status');
        if (statusSelect) {
            statusSelect.value = request.status || 'active';
        }

        // Store request ID for update
        document.getElementById('update-request').dataset.id = id;

        showScreen('edit-request');
        return;
    }

    /* ADD REQUEST */
    if (e.target.closest('[data-save-request]')) {
        let clientEl = document.getElementById('request-client');
        let carEl = document.getElementById('request-car');
        let statusEl = document.getElementById('request-status');

        if (!clientEl || !carEl) {
            showToast('Form not ready', 'error');
            return;
        }

        let clientId = clientEl.value;
        let carId = carEl.value;
        let status = statusEl ? statusEl.value : 'active';

        if (!clientId || !carId) {
            showToast('Please select both client and car', 'error');
            return;
        }

        addRequest(clientId, carId, status);
        return;
    }

    /* UPDATE REQUEST */
    let update = e.target.closest('#update-request');
    if (update) {
        let id = update.dataset.id;

        let clientId = document.getElementById('edit-request-client').value;
        let carId = document.getElementById('edit-request-car').value;
        let status = document.getElementById('edit-request-status').value;

        if (!clientId || !carId) {
            showToast('Please select both client and car', 'error');
            return;
        }

        const requests = getLocalData('requests');
        const cars = getLocalData('cars');
        const clients = getLocalData('clients');
        
        const requestIndex = requests.findIndex(r => r.id === id);
        const car = cars.find(c => c.id === carId);
        const client = clients.find(c => c.id === clientId);
        
        if (requestIndex !== -1) {
            if (!client) {
                showToast('Client not found', 'error');
                return;
            }
            
            const updatedRequest = {
                ...requests[requestIndex],
                clientId: clientId,
                carId: carId,
                clientName: client.name,
                status: status || "active"
            };
            
            if (car) {
                updatedRequest.carDetails = {
                    brand: car.brand,
                    model: car.model,
                    year: car.year,
                    price: car.price,
                    paint: car.paint,
                    condition: car.condition,
                    category: car.category
                };
                updatedRequest.title = `${car.brand} ${car.model} - Request`;
            } else {
                updatedRequest.title = requests[requestIndex].title || 'Request';
                showToast('Warning: Selected car no longer exists', 'warning');
            }
            
            requests[requestIndex] = updatedRequest;
            setLocalData('requests', requests);
        }

        showToast('Request updated successfully', 'success');
        loadRequests();
        showScreen('requests-list');
    }
});

// Load data when entering add request screen
document.addEventListener('click', function(e) {
    if (e.target.closest('[data-go="add-request"]')) {
        setTimeout(() => {
            loadClientsAndCarsForRequest();
        }, 100);
    }
});

// Initialize if on requests list screen
if (document.querySelector('[data-screen="requests-list"]')) {
    loadRequests();
}

// Initialize if on add request screen
if (document.querySelector('[data-screen="add-request"]')) {
    loadClientsAndCarsForRequest();
}