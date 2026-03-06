// ==================== CARS MODULE ====================

// Cache for storing original content
let carsOriginalContent = null;

// LOAD CARS
function loadCars() {
    const cars = getLocalData('cars');
    showCars(cars);
}

// SHOW CARS
function showCars(cars) {
    const container = document.querySelector('[data-screen="cars-list"] .content');
    if (!container) return;

    container.innerHTML = '';

    if (!cars || cars.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-car"></i>
                <h3>No Cars Available</h3>
                <p>Add your first car to get started</p>
            </div>
        `;
        return;
    }

    cars.forEach(car => {
        const card = document.createElement('div');
        card.className = 'car-item';
        card.innerHTML = `
            <div class="car-icon">
                <i class="fa-solid fa-car"></i>
            </div>
            <div class="car-info">
                <div class="car-name">${car.brand || ''} ${car.model || ''} (${car.year || ''})</div>
                <div class="car-details">
                    <span>${car.condition || ''}</span> | 
                    <span>${car.paint || ''}</span> | 
                    <span>${car.category || ''}</span>
                </div>
                <div class="car-price">${car.price || '0'} EGP</div>
            </div>
            <div class="car-actions">
                <button type="button" class="btn-icon" data-view-car="${car.id}" title="View">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button type="button" class="btn-icon btn-edit" data-edit-car="${car.id}" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button type="button" class="btn-icon btn-delete" data-delete-car="${car.id}" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    setupCarEvents();
}

// SETUP EVENTS
function setupCarEvents() {
    // View events
    document.querySelectorAll('[data-view-car]').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            showCarDetails(btn.dataset.viewCar);
        };
    });

    // Edit events
    document.querySelectorAll('[data-edit-car]').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            editCar(btn.dataset.editCar);
        };
    });

    // Delete events
    document.querySelectorAll('[data-delete-car]').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            deleteCar(btn.dataset.deleteCar);
        };
    });
}

// SHOW CAR DETAILS
function showCarDetails(carId) {
    const cars = getLocalData('cars');
    const car = cars.find(c => c.id === carId);
    
    if (!car) {
        showToast('Car not found', 'error');
        return;
    }
    
    const container = document.querySelector('[data-screen="cars-list"] .content');
    carsOriginalContent = container.innerHTML;

    container.innerHTML = `
        <div class="car-details-view">
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="fa-solid fa-car" style="font-size: 48px; color: #2196f3;"></i>
            </div>
            <h3 style="text-align: center; margin-bottom: 20px;">${car.brand} ${car.model}</h3>
            
            <div class="details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div class="detail-item">
                    <strong>Year:</strong>
                    <span>${car.year}</span>
                </div>
                <div class="detail-item">
                    <strong>Condition:</strong>
                    <span>${car.condition}</span>
                </div>
                <div class="detail-item">
                    <strong>Paint:</strong>
                    <span>${car.paint}</span>
                </div>
                <div class="detail-item">
                    <strong>Category:</strong>
                    <span>${car.category}</span>
                </div>
                <div class="detail-item" style="grid-column: span 2;">
                    <strong>Price:</strong>
                    <span style="color: #4caf50; font-size: 1.2em;">${car.price} EGP</span>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button type="button" class="btn btn-secondary" onclick="goBackToCarsList()">
                    <i class="fa-solid fa-arrow-left"></i> Back
                </button>
                <button type="button" class="btn btn-warning" data-edit-car="${car.id}">
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button type="button" class="btn btn-danger" data-delete-car="${car.id}">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    // Re-attach event listeners for the buttons inside details view
    const editBtn = container.querySelector(`[data-edit-car="${car.id}"]`);
    if (editBtn) {
        editBtn.onclick = (e) => {
            e.preventDefault();
            editCar(car.id);
        };
    }
    
    const deleteBtn = container.querySelector(`[data-delete-car="${car.id}"]`);
    if (deleteBtn) {
        deleteBtn.onclick = (e) => {
            e.preventDefault();
            deleteCar(car.id);
        };
    }
}

// EDIT CAR - Load car data into edit form
function editCar(carId) {
    const cars = getLocalData('cars');
    const car = cars.find(c => c.id === carId);
    
    if (!car) {
        showToast('Car not found', 'error');
        return;
    }
    
    // Fill the edit form with car data
    document.getElementById('edit-car-brand').value = car.brand || '';
    document.getElementById('edit-car-model').value = car.model || '';
    document.getElementById('edit-car-year').value = car.year || '';
    document.getElementById('edit-car-condition').value = car.condition || '';
    document.getElementById('edit-car-paint').value = car.paint || '';
    document.getElementById('edit-car-category').value = car.category || '';
    document.getElementById('edit-car-price').value = car.price || '';
    
    // Store the car ID for update
    document.getElementById('update-car').dataset.id = carId;
    
    // Show edit screen
    showScreen('edit-car');
}

// UPDATE CAR
function updateCar() {
    const carId = document.getElementById('update-car').dataset.id;
    
    if (!carId) {
        showToast('Error: Car ID not found', 'error');
        return;
    }
    
    const brand = document.getElementById('edit-car-brand')?.value.trim();
    const model = document.getElementById('edit-car-model')?.value.trim();
    const year = document.getElementById('edit-car-year')?.value.trim();
    const condition = document.getElementById('edit-car-condition')?.value;
    const paint = document.getElementById('edit-car-paint')?.value.trim();
    const category = document.getElementById('edit-car-category')?.value;
    const price = document.getElementById('edit-car-price')?.value.trim();
    
    // Validate all fields
    if (!brand || !model || !year || !condition || !paint || !category || !price) {
        showToast('Please fill all fields', 'error');
        return;
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
        showToast(`Please enter a valid year (1900-${currentYear + 1})`, 'error');
        return;
    }

    // Validate price
    if (isNaN(price) || price <= 0) {
        showToast('Please enter a valid price', 'error');
        return;
    }

    // Get cars and update
    const cars = getLocalData('cars');
    const carIndex = cars.findIndex(car => car.id === carId);
    
    if (carIndex === -1) {
        showToast('Car not found', 'error');
        return;
    }
    
    // Check for duplicates (excluding current car)
    const exists = cars.some((car, index) => 
        index !== carIndex &&
        car.brand.toLowerCase() === brand.toLowerCase() &&
        car.model.toLowerCase() === model.toLowerCase() &&
        car.year === year
    );

    if (exists) {
        showToast('Another car with same brand, model and year already exists', 'error');
        return;
    }

    // Update car
    const updatedCar = {
        ...cars[carIndex],
        brand,
        model,
        year,
        condition,
        paint,
        category,
        price: Number(price)
    };

    cars[carIndex] = updatedCar;
    setLocalData('cars', cars);

    showToast('Car updated successfully', 'success');
    
    // Clear edit form data attribute
    document.getElementById('update-car').dataset.id = '';
    
    // Reload cars and go back to list
    loadCars();
    showScreen('cars-list');
}

// CANCEL EDIT
function cancelEditCar() {
    // Clear edit form
    document.getElementById('edit-car-brand').value = '';
    document.getElementById('edit-car-model').value = '';
    document.getElementById('edit-car-year').value = '';
    document.getElementById('edit-car-condition').value = '';
    document.getElementById('edit-car-paint').value = '';
    document.getElementById('edit-car-category').value = '';
    document.getElementById('edit-car-price').value = '';
    document.getElementById('update-car').dataset.id = '';
    
    // Go back to cars list
    showScreen('cars-list');
}

// RETURN TO CARS LIST
function goBackToCarsList() {
    const container = document.querySelector('[data-screen="cars-list"] .content');

    if (carsOriginalContent) {
        container.innerHTML = carsOriginalContent;
        setupCarEvents();
    } else {
        loadCars();
    }
}

// DELETE CAR
function deleteCar(carId) {
    if (!confirm('Are you sure you want to delete this car?')) return;

    const cars = getLocalData('cars');
    
    // Check if car is used in any requests
    const requests = getLocalData('requests');
    const isCarInRequests = requests.some(request => request.carId === carId);
    
    if (isCarInRequests) {
        const confirmDelete = confirm('This car is linked to existing requests. Deleting it will mark those requests as "Car Deleted". Continue?');
        if (!confirmDelete) return;
        
        // Update requests to mark car as deleted
        const updatedRequests = requests.map(request => {
            if (request.carId === carId) {
                return {
                    ...request,
                    carDeleted: true,
                    carDetails: request.carDetails || {
                        brand: car.brand,
                        model: car.model,
                        year: car.year,
                        price: car.price
                    }
                };
            }
            return request;
        });
        setLocalData('requests', updatedRequests);
    }
    
    const updatedCars = cars.filter(car => car.id !== carId);
    setLocalData('cars', updatedCars);
    
    showToast('Car deleted successfully', 'success');
    loadCars();
}

// ADD CAR
function addCar() {
    const brand = document.getElementById('add-car-brand')?.value.trim();
    const model = document.getElementById('add-car-model')?.value.trim();
    const year = document.getElementById('add-car-year')?.value.trim();
    const condition = document.getElementById('add-car-condition')?.value;
    const paint = document.getElementById('add-car-paint')?.value.trim();
    const category = document.getElementById('add-car-category')?.value;
    const price = document.getElementById('add-car-price')?.value.trim();
    
    // Validate all fields
    if (!brand || !model || !year || !condition || !paint || !category || !price) {
        showToast('Please fill all fields', 'error');
        return;
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
        showToast(`Please enter a valid year (1900-${currentYear + 1})`, 'error');
        return;
    }

    // Validate price
    if (isNaN(price) || price <= 0) {
        showToast('Please enter a valid price', 'error');
        return;
    }

    // Check duplicates
    const cars = getLocalData('cars');
    
    const exists = cars.some(car =>
        car.brand.toLowerCase() === brand.toLowerCase() &&
        car.model.toLowerCase() === model.toLowerCase() &&
        car.year === year
    );

    if (exists) {
        showToast('This car already exists', 'error');
        return;
    }

    const newCar = {
        brand,
        model,
        year,
        condition,
        paint,
        category,
        price: Number(price),
        id: 'car_' + Date.now()
    };

    cars.push(newCar);
    setLocalData('cars', cars);

    showToast('Car added successfully', 'success');
    
    // Clear input fields
    document.getElementById('add-car-brand').value = '';
    document.getElementById('add-car-model').value = '';
    document.getElementById('add-car-year').value = '';
    document.getElementById('add-car-condition').value = '';
    document.getElementById('add-car-paint').value = '';
    document.getElementById('add-car-category').value = '';
    document.getElementById('add-car-price').value = '';
    
    loadCars();
    showScreen('cars-list');
}

// SETUP ADD CAR FORM
let addCarFormInitialized = false;

function setupAddCarForm() {
    if (addCarFormInitialized) return;
    addCarFormInitialized = true;

    const saveBtn = document.getElementById('save-car');

    if (saveBtn) {
        saveBtn.addEventListener('click', function (e) {
            e.preventDefault();
            addCar();
        });
    }
}

// SETUP EDIT CAR FORM
let editCarFormInitialized = false;

function setupEditCarForm() {
    if (editCarFormInitialized) return;
    editCarFormInitialized = true;

    const updateBtn = document.getElementById('update-car');

    if (updateBtn) {
        updateBtn.addEventListener('click', function (e) {
            e.preventDefault();
            updateCar();
        });
    }
}

// GLOBAL EVENT LISTENER for dynamic buttons
document.addEventListener('click', function(e) {
    // Handle edit buttons that might be dynamically added
    const editBtn = e.target.closest('[data-edit-car]');
    if (editBtn) {
        e.preventDefault();
        editCar(editBtn.dataset.editCar);
        return;
    }
    
    // Handle delete buttons that might be dynamically added
    const deleteBtn = e.target.closest('[data-delete-car]');
    if (deleteBtn) {
        e.preventDefault();
        deleteCar(deleteBtn.dataset.deleteCar);
        return;
    }
    
    // Handle view buttons that might be dynamically added
    const viewBtn = e.target.closest('[data-view-car]');
    if (viewBtn) {
        e.preventDefault();
        showCarDetails(viewBtn.dataset.viewCar);
        return;
    }
});

// INIT
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('[data-screen="cars-list"]')) loadCars();
    if (document.querySelector('[data-screen="add-car"]')) setupAddCarForm();
    if (document.querySelector('[data-screen="edit-car"]')) setupEditCarForm();
});

// GLOBAL ACCESS
window.loadCars = loadCars;
window.goBackToCarsList = goBackToCarsList;
window.editCar = editCar;
window.cancelEditCar = cancelEditCar;
window.updateCar = updateCar;
window.showCarDetails = showCarDetails;
window.deleteCar = deleteCar;