/**
 * API Module - Handles all HTTP requests to json-server
 * Base URL: http://localhost:3000
 */

const API = (function() {
    const BASE_URL = 'https://69bd8ccc2bc2a25b22aedde6.mockapi.io';

    // ==================== HELPER FUNCTIONS ====================
    async function handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    function getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // ==================== CLIENTS API ====================
    async function getClients() {
        try {
            const response = await fetch(`${BASE_URL}/clients`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    }

    async function getClient(id) {
        try {
            const response = await fetch(`${BASE_URL}/clients/${id}`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching client:', error);
            throw error;
        }
    }

    async function addClient(client) {
        try {
            const newClient = {
                ...client,
                id: Date.now().toString(),
                registeredAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            const response = await fetch(`${BASE_URL}/clients`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(newClient)
            });
            
            return await handleResponse(response);
        } catch (error) {
            console.error('Error adding client:', error);
            throw error;
        }
    }

    async function updateClient(id, client) {
        try {
            const response = await fetch(`${BASE_URL}/clients/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(client)
            });
            
            return await handleResponse(response);
        } catch (error) {
            console.error('Error updating client:', error);
            throw error;
        }
    }

    async function deleteClient(id) {
        try {
            const response = await fetch(`${BASE_URL}/clients/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            
            if (!response.ok) throw new Error('Delete failed');
            return true;
        } catch (error) {
            console.error('Error deleting client:', error);
            throw error;
        }
    }

    // ==================== REQUESTS API ====================
    async function getRequests() {
        try {
            const response = await fetch(`${BASE_URL}/requests`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching requests:', error);
            throw error;
        }
    }

    async function getRequest(id) {
        try {
            const response = await fetch(`${BASE_URL}/requests/${id}`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching request:', error);
            throw error;
        }
    }

    async function addRequest(request) {
        try {
            const newRequest = {
                ...request,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            
            const response = await fetch(`${BASE_URL}/requests`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(newRequest)
            });
            
            return await handleResponse(response);
        } catch (error) {
            console.error('Error adding request:', error);
            throw error;
        }
    }

    async function updateRequest(id, request) {
        try {
            const response = await fetch(`${BASE_URL}/requests/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(request)
            });
            
            return await handleResponse(response);
        } catch (error) {
            console.error('Error updating request:', error);
            throw error;
        }
    }

    async function deleteRequest(id) {
        try {
            const response = await fetch(`${BASE_URL}/requests/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            
            if (!response.ok) throw new Error('Delete failed');
            return true;
        } catch (error) {
            console.error('Error deleting request:', error);
            throw error;
        }
    }

    // ==================== CARS API ====================
    async function getCars() {
        try {
            const response = await fetch(`${BASE_URL}/cars`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching cars:', error);
            throw error;
        }
    }

    async function getCar(id) {
        try {
            const response = await fetch(`${BASE_URL}/cars/${id}`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching car:', error);
            throw error;
        }
    }

    async function addCar(car) {
        try {
            const newCar = {
                ...car,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            
            const response = await fetch(`${BASE_URL}/cars`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(newCar)
            });
            
            return await handleResponse(response);
        } catch (error) {
            console.error('Error adding car:', error);
            throw error;
        }
    }

    async function updateCar(id, car) {
        try {
            const response = await fetch(`${BASE_URL}/cars/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(car)
            });
            
            return await handleResponse(response);
        } catch (error) {
            console.error('Error updating car:', error);
            throw error;
        }
    }

    async function deleteCar(id) {
        try {
            const response = await fetch(`${BASE_URL}/cars/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            
            if (!response.ok) throw new Error('Delete failed');
            return true;
        } catch (error) {
            console.error('Error deleting car:', error);
            throw error;
        }
    }

    // Public API
    return {
        getClients,
        getClient,
        addClient,
        updateClient,
        deleteClient,
        getRequests,
        getRequest,
        addRequest,
        updateRequest,
        deleteRequest,
        getCars,
        getCar,
        addCar,
        updateCar,
        deleteCar
    };
})();

// Make API globally available
window.API = API;