/**
 * Search Module - Handles all search functionality
 */

const SearchModule = (function() {
    let currentSearchTerm = '';
    let currentFilters = { type: '', status: '' };
    let searchResults = [];
    let cachedData = { clients: [], requests: [], cars: [] };
    
    const debouncedSearch = App.debounce(performSearch, 300);

    // ==================== INITIALIZATION ====================
    function init() {
        console.log('🔍 Search Module Initialized');
        bindEvents();
        loadAllData();
    }

    function bindEvents() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const value = e.target.value;
                if (value === '') {
                    performSearch('');
                } else {
                    debouncedSearch(value);
                }
            });
        }

        const typeFilter = document.getElementById('search-type');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                currentFilters.type = e.target.value;
                performSearch(currentSearchTerm);
            });
        }

        const statusFilter = document.getElementById('search-status');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                currentFilters.status = e.target.value;
                performSearch(currentSearchTerm);
            });
        }

        const sortSelect = document.getElementById('search-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                sortResults(e.target.value);
            });
        }

        const clearBtn = document.getElementById('clear-search-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearFilters);
        }

        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.addEventListener('click', handleResultClick);
        }
    }

    // ==================== DATA LOADING ====================
    async function loadAllData() {
        showLoading(true);
        
        try {
            const [clients, requests, cars] = await Promise.all([
                API.getClients().catch(() => []),
                API.getRequests().catch(() => []),
                API.getCars().catch(() => [])
            ]);
            
            cachedData = { clients, requests, cars };
            
            await performSearch('');
        } catch (error) {
            console.error('Error loading data:', error);
            showEmptyState('Error loading data');
        } finally {
            showLoading(false);
        }
    }

    // ==================== SEARCH FUNCTIONALITY ====================
    async function performSearch(term) {
        currentSearchTerm = term.trim();
        
        try {
            let allItems = [
                ...cachedData.clients.map(item => ({ ...item, _type: 'client' })),
                ...cachedData.requests.map(item => ({ ...item, _type: 'request' })),
                ...cachedData.cars.map(item => ({ ...item, _type: 'car' }))
            ];
            
            if (currentSearchTerm) {
                const searchWords = currentSearchTerm.toLowerCase().split(/\s+/);
                allItems = allItems.filter(item => {
                    const searchableText = getSearchableText(item).toLowerCase();
                    return searchWords.every(word => searchableText.includes(word));
                });
            }
            
            if (currentFilters.type) {
                allItems = allItems.filter(item => item._type === currentFilters.type);
            }
            
            if (currentFilters.status) {
                allItems = allItems.filter(item => 
                    item._type === 'request' && item.status === currentFilters.status
                );
            }
            
            searchResults = allItems;
            updateResultsCount();
            
            const sortSelect = document.getElementById('search-sort');
            if (sortSelect) {
                sortResults(sortSelect.value, false);
            } else {
                displayResults();
            }
        } catch (error) {
            console.error('Search error:', error);
            showEmptyState('An error occurred during search');
        }
    }

    function getSearchableText(item) {
        switch (item._type) {
            case 'client':
                return [item.name, item.phone, item.email, item.notes].filter(Boolean).join(' ');
            case 'request':
                return [item.title, item.notes, item.clientName, item.status].filter(Boolean).join(' ');
            case 'car':
                return [item.brand, item.model, item.year, item.condition, item.paint, item.category].filter(Boolean).join(' ');
            default:
                return '';
        }
    }

    // ==================== SORTING ====================
    function sortResults(sortBy, refreshDisplay = true) {
        const getName = (item) => {
            switch (item._type) {
                case 'client': return item.name || '';
                case 'request': return item.title || '';
                case 'car': return `${item.brand || ''} ${item.model || ''}`;
                default: return '';
            }
        };

        switch (sortBy) {
            case 'name_asc':
                searchResults.sort((a, b) => getName(a).localeCompare(getName(b)));
                break;
            case 'name_desc':
                searchResults.sort((a, b) => getName(b).localeCompare(getName(a)));
                break;
            default:
                break;
        }

        displayResults();
    }

    // ==================== DISPLAY RESULTS ====================
    function updateResultsCount() {
        const countElement = document.getElementById('search-results-count');
        if (countElement) {
            countElement.textContent = `Search Results (${searchResults.length})`;
        }
    }

    function displayResults() {
        const container = document.getElementById('search-results');
        if (!container) return;

        if (searchResults.length === 0) {
            showEmptyState(currentSearchTerm ? 'No results found' : 'Enter search keywords');
            return;
        }

        const grouped = {
            client: searchResults.filter(item => item._type === 'client'),
            request: searchResults.filter(item => item._type === 'request'),
            car: searchResults.filter(item => item._type === 'car')
        };

        let html = '';

        if (grouped.client.length > 0) {
            html += '<div class="search-type-header"><h4><i class="fa-solid fa-users"></i> Clients (' + grouped.client.length + ')</h4></div>';
            grouped.client.forEach(item => {
                html += createClientResult(item);
            });
        }

        if (grouped.request.length > 0) {
            html += '<div class="search-type-header"><h4><i class="fa-solid fa-file-lines"></i> Requests (' + grouped.request.length + ')</h4></div>';
            grouped.request.forEach(item => {
                html += createRequestResult(item);
            });
        }

        if (grouped.car.length > 0) {
            html += '<div class="search-type-header"><h4><i class="fa-solid fa-car"></i> Cars (' + grouped.car.length + ')</h4></div>';
            grouped.car.forEach(item => {
                html += createCarResult(item);
            });
        }

        container.innerHTML = html;
    }

    function createClientResult(item) {
        return `
            <div class="search-result-item" data-type="client" data-id="${App.escapeHtml(item.id)}">
                <div class="search-result-icon"><i class="fa-solid fa-user"></i></div>
                <div class="search-result-content">
                    <div class="search-result-title">${App.escapeHtml(item.name || 'Unnamed Client')}</div>
                    <div class="search-result-subtitle">
                        <i class="fa-solid fa-phone"></i> ${App.escapeHtml(item.phone || 'No phone number')}
                    </div>
                </div>
                <div class="search-result-action">
                    <i class="fa-solid fa-chevron-left"></i>
                </div>
            </div>
        `;
    }

    function createRequestResult(item) {
        const status = item.status || 'pending';
        const statusText = status === 'active' ? 'Active' : status === 'pending' ? 'Pending' : 'Completed';
        
        return `
            <div class="search-result-item" data-type="request" data-id="${App.escapeHtml(item.id)}">
                <div class="search-result-icon"><i class="fa-solid fa-file-lines"></i></div>
                <div class="search-result-content">
                    <div class="search-result-title">${App.escapeHtml(item.title || 'Untitled Request')}</div>
                    <div class="search-result-subtitle">
                        <i class="fa-solid fa-user"></i> ${App.escapeHtml(item.clientName || 'Unknown')}
                    </div>
                    <div class="search-result-status">
                        <span class="status status-${status}">
                            <i class="fa-solid ${status === 'active' ? 'fa-play-circle' : status === 'pending' ? 'fa-clock' : 'fa-check-circle'}"></i>
                            ${statusText}
                        </span>
                    </div>
                </div>
                <div class="search-result-action">
                    <i class="fa-solid fa-chevron-left"></i>
                </div>
            </div>
        `;
    }

    function createCarResult(item) {
        return `
            <div class="search-result-item" data-type="car" data-id="${App.escapeHtml(item.id)}">
                <div class="search-result-icon"><i class="fa-solid fa-car"></i></div>
                <div class="search-result-content">
                    <div class="search-result-title">${App.escapeHtml(item.brand || '')} ${App.escapeHtml(item.model || '')} ${App.escapeHtml(item.year || '')}</div>
                    <div class="search-result-subtitle">
                        <span><i class="fa-solid fa-tag"></i> ${App.escapeHtml(item.category || 'Not specified')}</span>
                        <span><i class="fa-solid fa-palette"></i> ${App.escapeHtml(item.paint || 'Not specified')}</span>
                    </div>
                    <div class="search-result-notes">
                        <i class="fa-solid fa-dollar-sign"></i> ${item.price ? App.formatPrice(item.price) : 'Price on request'}
                    </div>
                </div>
                <div class="search-result-action">
                    <i class="fa-solid fa-chevron-left"></i>
                </div>
            </div>
        `;
    }

    // ==================== CLICK HANDLER ====================
    function handleResultClick(e) {
        const resultItem = e.target.closest('.search-result-item');
        if (!resultItem) return;

        const type = resultItem.dataset.type;
        const id = resultItem.dataset.id;

        if (!type || !id) return;

        sessionStorage.setItem('viewItem', JSON.stringify({ type, id }));
        
        App.showToast(`Loading details...`, 'info', 1000);
        
        const page = type === 'client' ? 'index.html' : type === 'request' ? 'requests.html' : 'cars.html';
        window.location.href = page;
    }

    // ==================== UI STATES ====================
    function showLoading(show) {
        const container = document.getElementById('search-results');
        const countElement = document.getElementById('search-results-count');
        
        if (!container) return;

        if (show) {
            if (countElement) countElement.textContent = 'Searching...';
            container.innerHTML = `
                <div class="search-loading">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>Loading data...</p>
                    </div>
                </div>
            `;
        }
    }

    function showEmptyState(message) {
        const container = document.getElementById('search-results');
        const countElement = document.getElementById('search-results-count');
        
        if (!container) return;
        
        if (countElement) countElement.textContent = 'Search Results (0)';

        container.innerHTML = `
            <div class="empty-search-state">
                <i class="fa-solid fa-magnifying-glass"></i>
                <p>${App.escapeHtml(message)}</p>
            </div>
        `;
    }

    // ==================== FILTERS ====================
    function clearFilters() {
        currentFilters = { type: '', status: '' };
        
        const typeFilter = document.getElementById('search-type');
        const statusFilter = document.getElementById('search-status');
        
        if (typeFilter) typeFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        
        performSearch(currentSearchTerm);
        App.showToast('Filters cleared', 'success', 1500);
    }

    function checkStoredItem() {
        const stored = sessionStorage.getItem('viewItem');
        if (stored) {
            try {
                const { type, id } = JSON.parse(stored);
                sessionStorage.removeItem('viewItem');
                
                setTimeout(() => {
                    if (type === 'client' && window.ClientsModule) {
                        ClientsModule.viewClientDetails(id);
                    } else if (type === 'request' && window.RequestsModule) {
                        RequestsModule.loadRequestDetails(id);
                    } else if (type === 'car' && window.CarsModule) {
                        CarsModule.viewCarDetails(id);
                    }
                }, 300);
            } catch (e) {
                console.error('Error parsing stored item:', e);
            }
        }
    }

    return {
        init,
        refreshData: loadAllData,
        clearFilters,
        performSearch,
        checkStoredItem
    };
})();

window.SearchModule = SearchModule;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('search-screen')) {
        SearchModule.init();
        SearchModule.checkStoredItem();
    }
});