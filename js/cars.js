/**
 * Cars Module - Handles all car-related functionality
 */

const CarsModule = (function() {
    // ==================== INITIALIZATION ====================
    function init() {
        loadCars();
        bindEvents();
    }

    function bindEvents() {
        const addForm = document.getElementById('add-car-form');
        if (addForm) addForm.addEventListener('submit', addCar);

        const editForm = document.getElementById('edit-car-form');
        if (editForm) editForm.addEventListener('submit', updateCar);

        // Cancel buttons
        document.getElementById('cancel-add-car')?.addEventListener('click', () => App.showScreen('cars-list'));
        document.getElementById('cancel-edit-car')?.addEventListener('click', () => App.showScreen('cars-list'));

        // Back buttons
        document.getElementById('back-from-add-car')?.addEventListener('click', () => App.showScreen('cars-list'));
        document.getElementById('back-from-car-details')?.addEventListener('click', () => App.showScreen('cars-list'));
        document.getElementById('back-from-edit-car')?.addEventListener('click', () => App.showScreen('cars-list'));

        // FAB button
        document.getElementById('fab-add')?.addEventListener('click', () => App.showScreen('add-car'));
    }

    // ==================== LOAD CARS ====================
    async function loadCars() {
        const container = document.getElementById('cars-container');
        if (!container) return;

        try {
            container.innerHTML = '<div class="loading-overlay"><div class="loading-spinner"><div class="spinner"></div><p>Loading cars...</p></div></div>';
            
            const cars = await API.getCars();
            displayCars(cars);
        } catch (error) {
            console.error('Error loading cars:', error);
            container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><h3>Error loading cars</h3><p>Please try again</p></div>';
            App.showToast('Failed to load cars', 'error');
        }
    }

    // ==================== DISPLAY CARS ====================
    function displayCars(cars) {
        const container = document.getElementById('cars-container');
        if (!container) return;

        if (!cars || cars.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-car-side"></i>
                    <h3>No cars found</h3>
                    <p>Add your first car to get started</p>
                    <button type="button" class="btn btn-primary" onclick="App.showScreen('add-car')">
                        <i class="fa-solid fa-plus"></i> Add Car
                    </button>
                </div>
            `;
            return;
        }

        let html = '';
        cars.forEach(car => html += createCarCard(car));
        container.innerHTML = html;
    }

    function createCarCard(car) {
        return `
            <div class="car-card" onclick="CarsModule.viewCarDetails('${car.id}')">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div class="car-icon"><i class="fa-solid fa-car"></i></div>
                    <div class="car-info" style="flex: 1;">
                        <div class="car-name">${App.escapeHtml(car.brand || '')} ${App.escapeHtml(car.model || '')} ${App.escapeHtml(car.year || '')}</div>
                        <div class="car-details">
                            ${car.condition ? `<span><i class="fa-solid fa-clipboard-check"></i> ${App.escapeHtml(car.condition)}</span>` : ''}
                            ${car.paint ? `<span><i class="fa-solid fa-palette"></i> ${App.escapeHtml(car.paint)}</span>` : ''}
                            ${car.category ? `<span><i class="fa-solid fa-tag"></i> ${App.escapeHtml(car.category)}</span>` : ''}
                        </div>
                        <div class="car-price">${car.price ? App.formatPrice(car.price) : 'Price on request'}</div>
                    </div>
                    <div class="car-actions" onclick="event.stopPropagation()">
                        <button type="button" class="btn-icon btn-edit" onclick="CarsModule.editCar('${car.id}')" title="Edit">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button type="button" class="btn-icon btn-delete" onclick="CarsModule.deleteCar('${car.id}')" title="Delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== VIEW CAR DETAILS ====================
    async function viewCarDetails(carId) {
        try {
            const car = await API.getCar(carId);
            const container = document.getElementById('car-details-container');
            if (!container) return;

            container.innerHTML = `
                <div class="car-details-view">
                    <div class="detail-header">
                        <i class="fa-solid fa-car"></i>
                        <h3>${App.escapeHtml(car.brand || '')} ${App.escapeHtml(car.model || '')} ${App.escapeHtml(car.year || '')}</h3>
                    </div>
                    <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 16px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div><strong>Condition:</strong> ${App.escapeHtml(car.condition || 'Not specified')}</div>
                            <div><strong>Paint:</strong> ${App.escapeHtml(car.paint || 'Not specified')}</div>
                            <div><strong>Category:</strong> ${App.escapeHtml(car.category || 'Not specified')}</div>
                            <div><strong>Price:</strong> ${car.price ? App.formatPrice(car.price) : 'Price on request'}</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                        <button type="button" class="btn btn-warning" onclick="CarsModule.editCar('${car.id}')" style="flex: 1;">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                        <button type="button" class="btn btn-danger" onclick="CarsModule.deleteCar('${car.id}')" style="flex: 1;">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;

            App.showScreen('car-details');
        } catch (error) {
            console.error('Error viewing car:', error);
            App.showToast('Failed to load car details', 'error');
        }
    }

    // ==================== ADD CAR ====================
    async function addCar(e) {
        e.preventDefault();
        const carData = {
            brand: document.getElementById('add-car-brand').value.trim(),
            model: document.getElementById('add-car-model').value.trim(),
            year: document.getElementById('add-car-year').value.trim(),
            condition: document.getElementById('add-car-condition').value,
            paint: document.getElementById('add-car-paint').value.trim(),
            category: document.getElementById('add-car-category').value,
            price: document.getElementById('add-car-price').value.trim()
        };

        if (!carData.brand || !carData.model || !carData.year || !carData.condition || !carData.paint || !carData.category) {
            App.showToast('All fields are required', 'error');
            return;
        }

        try {
            await API.addCar(carData);
            App.showToast('Car added successfully', 'success');
            document.getElementById('add-car-form').reset();
            await loadCars();
            App.showScreen('cars-list');
        } catch (error) {
            console.error('Error adding car:', error);
            App.showToast('Failed to add car', 'error');
        }
    }

    // ==================== EDIT CAR ====================
    async function editCar(carId) {
        try {
            const car = await API.getCar(carId);

            document.getElementById('edit-car-brand').value = car.brand || '';
            document.getElementById('edit-car-model').value = car.model || '';
            document.getElementById('edit-car-year').value = car.year || '';
            document.getElementById('edit-car-condition').value = car.condition || '';
            document.getElementById('edit-car-paint').value = car.paint || '';
            document.getElementById('edit-car-category').value = car.category || '';
            document.getElementById('edit-car-price').value = car.price || '';

            document.getElementById('update-car').dataset.carId = carId;
            App.showScreen('edit-car');
        } catch (error) {
            console.error('Error editing car:', error);
            App.showToast('Failed to load car for edit', 'error');
        }
    }

    // ==================== UPDATE CAR ====================
    async function updateCar(e) {
        e.preventDefault();
        const carId = document.getElementById('update-car').dataset.carId;
        if (!carId) return;

        const carData = {
            brand: document.getElementById('edit-car-brand').value.trim(),
            model: document.getElementById('edit-car-model').value.trim(),
            year: document.getElementById('edit-car-year').value.trim(),
            condition: document.getElementById('edit-car-condition').value,
            paint: document.getElementById('edit-car-paint').value.trim(),
            category: document.getElementById('edit-car-category').value,
            price: document.getElementById('edit-car-price').value.trim()
        };

        if (!carData.brand || !carData.model || !carData.year || !carData.condition || !carData.paint || !carData.category) {
            App.showToast('All fields are required', 'error');
            return;
        }

        try {
            await API.updateCar(carId, carData);
            App.showToast('Car updated successfully', 'success');
            await loadCars();
            App.showScreen('cars-list');
        } catch (error) {
            console.error('Error updating car:', error);
            App.showToast('Failed to update car', 'error');
        }
    }

    // ==================== DELETE CAR ====================
    async function deleteCar(carId) {
        if (!confirm('Are you sure you want to delete this car?')) return;

        try {
            await API.deleteCar(carId);
            App.showToast('Car deleted successfully', 'success');
            await loadCars();
        } catch (error) {
            console.error('Error deleting car:', error);
            App.showToast('Failed to delete car', 'error');
        }
    }

    return { init, loadCars, viewCarDetails, editCar, deleteCar };
})();

window.CarsModule = CarsModule;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cars-container')) CarsModule.init();
});