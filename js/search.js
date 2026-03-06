// ==================== SEARCH MODULE ====================

class SearchModule {
    constructor() {
        this.initializeSearch();
        this.bindEvents();
    }

    initializeSearch() {
        this.currentSearchTerm = '';
        this.currentFilters = {
            type: '',
            status: ''
        };
        this.searchResults = [];
    }

    bindEvents() {
        // Bind search input events
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            // Clear search when input is cleared
            searchInput.addEventListener('input', (e) => {
                if (e.target.value.trim() === '') {
                    this.performSearch('');
                } else {
                    this.debouncedSearch(e.target.value);
                }
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        }

        const searchType = document.getElementById('search-type');
        const searchStatus = document.getElementById('search-status');
        const searchSort = document.getElementById('search-sort');

        if (searchType) {
            searchType.addEventListener('change', () => {
                this.currentFilters.type = searchType.value;
                this.performSearch(this.currentSearchTerm);
            });
        }

        if (searchStatus) {
            searchStatus.addEventListener('change', () => {
                this.currentFilters.status = searchStatus.value;
                this.performSearch(this.currentSearchTerm);
            });
        }

        if (searchSort) {
            searchSort.addEventListener('change', () => {
                this.sortResults(searchSort.value);
            });
        }

        // Clear filters button
        const clearFiltersBtn = document.getElementById('clear-search-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearFilters();
                this.performSearch(this.currentSearchTerm);
            });
        }

        // Global click handler for search results
        document.addEventListener('click', (e) => {
            // منع السلوك الافتراضي
            if (e.target.closest('button')) {
                e.preventDefault();
            }
            this.handleResultClick(e);
        });

        // Bind click on search screen to load all data initially
        document.addEventListener('DOMContentLoaded', () => {
            const searchTab = document.querySelector('[data-go="search"]');
            if (searchTab) {
                searchTab.addEventListener('click', () => {
                    // Clear any existing search and show all items
                    setTimeout(() => {
                        this.performSearch('');
                    }, 100);
                });
            }
        });
    }

    debouncedSearch(term) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.performSearch(term);
        }, 300);
    }

    async performSearch(term) {
        term = term ? term.trim() : '';
        this.currentSearchTerm = term;

        // Show loading state
        this.showLoading(true);

        try {
            // Fetch all data in parallel
            const [clients, requests, cars] = await Promise.all([
                this.fetchClients(),
                this.fetchRequests(),
                this.fetchCars()
            ]);

            // Combine all data with type identifiers
            const allData = [
                ...clients.map(item => ({ ...item, _type: 'client' })),
                ...requests.map(item => ({ ...item, _type: 'request' })),
                ...cars.map(item => ({ ...item, _type: 'car' }))
            ];

            // Filter data
            let filteredData = allData;

            // Apply text search if term exists
            if (term.length > 0) {
                filteredData = this.filterByText(allData, term);
            }

            // Apply type filter
            if (this.currentFilters.type) {
                filteredData = filteredData.filter(
                    item => item._type === this.currentFilters.type
                );
            }

            // Apply status filter (for requests)
            if (this.currentFilters.status && this.currentFilters.status !== '') {
                filteredData = filteredData.filter(item => {
                    if (item._type === 'request') {
                        return item.status && item.status.toLowerCase() === this.currentFilters.status.toLowerCase();
                    }
                    return true;
                });
            }

            // Store results
            this.searchResults = filteredData;

            // Sort results
            this.sortResults(document.getElementById('search-sort')?.value || 'relevance');

            // Display results
            this.displayResults();

        } catch (error) {
            console.error('Search error:', error);
            this.showEmptyState('Error loading search results. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    filterByText(data, term) {
        const searchTerms = term.toLowerCase().split(' ').filter(t => t.length > 0);
        
        return data.filter(item => {
            const searchableText = this.getSearchableText(item).toLowerCase();
            
            // Check if ALL search terms are found in the searchable text
            return searchTerms.every(searchTerm => 
                searchableText.includes(searchTerm)
            );
        });
    }

    async fetchClients() {
        try {
            return getLocalData('clients');
        } catch (error) {
            console.error('Error fetching clients:', error);
            return [];
        }
    }

    async fetchRequests() {
        try {
            const requests = getLocalData('requests');
            
            // Fetch clients to get names for requests
            const clients = await this.fetchClients();
            
            return requests.map(request => {
                const client = clients.find(c => c.id === request.clientId);
                return {
                    ...request,
                    clientName: client ? client.name : 'Unknown Client',
                    // Ensure we have all fields needed for search
                    title: request.title || '',
                    notes: request.notes || '',
                    status: request.status || 'active'
                };
            });
        } catch (error) {
            console.error('Error fetching requests:', error);
            return [];
        }
    }

    async fetchCars() {
        try {
            return getLocalData('cars');
        } catch (error) {
            console.error('Error fetching cars:', error);
            return [];
        }
    }

    getSearchableText(item) {
        switch (item._type) {
            case 'client':
                return `${item.name || ''} ${item.phone || ''} ${item.nots || ''} ${item.notes || ''}`.toLowerCase();
            
            case 'request':
                return `${item.title || ''} ${item.notes || ''} ${item.clientName || ''} ${item.status || ''} ${item.brand || ''} ${item.model || ''}`.toLowerCase();
            
            case 'car':
                return `${item.brand || ''} ${item.model || ''} ${item.year || ''} ${item.condition || ''} ${item.paint || ''} ${item.category || ''} ${item.price || ''}`.toLowerCase();
            
            default:
                return '';
        }
    }

    sortResults(sortOption) {
        if (!this.searchResults.length) return;

        switch (sortOption) {
            case 'name_asc':
                this.searchResults.sort((a, b) => {
                    const nameA = this.getItemName(a).toLowerCase();
                    const nameB = this.getItemName(b).toLowerCase();
                    return nameA.localeCompare(nameB);
                });
                break;

            case 'name_desc':
                this.searchResults.sort((a, b) => {
                    const nameA = this.getItemName(a).toLowerCase();
                    const nameB = this.getItemName(b).toLowerCase();
                    return nameB.localeCompare(nameA);
                });
                break;

            case 'price_asc':
                this.searchResults.sort((a, b) => {
                    if (a._type === 'car' && b._type === 'car') {
                        return (a.price || 0) - (b.price || 0);
                    }
                    return 0;
                });
                break;

            case 'price_desc':
                this.searchResults.sort((a, b) => {
                    if (a._type === 'car' && b._type === 'car') {
                        return (b.price || 0) - (a.price || 0);
                    }
                    return 0;
                });
                break;

            case 'year_new':
                this.searchResults.sort((a, b) => {
                    if (a._type === 'car' && b._type === 'car') {
                        return (b.year || 0) - (a.year || 0);
                    }
                    return 0;
                });
                break;

            case 'year_old':
                this.searchResults.sort((a, b) => {
                    if (a._type === 'car' && b._type === 'car') {
                        return (a.year || 0) - (b.year || 0);
                    }
                    return 0;
                });
                break;

            case 'date_new':
                this.searchResults.sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.id || 0);
                    const dateB = new Date(b.createdAt || b.id || 0);
                    return dateB - dateA;
                });
                break;

            case 'date_old':
                this.searchResults.sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.id || 0);
                    const dateB = new Date(b.createdAt || b.id || 0);
                    return dateA - dateB;
                });
                break;

            case 'relevance':
            default:
                // Keep relevance-based order
                break;
        }

        this.displayResults();
    }

    getItemName(item) {
        switch (item._type) {
            case 'client':
                return item.name || 'Unnamed Client';
            case 'request':
                return item.title || 'Unnamed Request';
            case 'car':
                return `${item.brand || ''} ${item.model || ''} (${item.year || ''})`.trim() || 'Unnamed Car';
            default:
                return 'Unknown';
        }
    }

    displayResults() {
        const resultsContainer = document.getElementById('search-results');
        const resultsCount = document.getElementById('search-results-count');
        
        if (!resultsContainer || !resultsCount) return;

        if (this.searchResults.length === 0) {
            if (this.currentSearchTerm || this.currentFilters.type || this.currentFilters.status) {
                this.showEmptyState('No results found. Try different keywords or filters.');
            } else {
                this.showEmptyState('No data available. Add some clients, requests, or cars first.');
            }
            resultsCount.textContent = this.searchResults.length === 0 ? 'No Results' : 'Search Results';
            return;
        }

        resultsCount.textContent = `${this.searchResults.length} Result${this.searchResults.length !== 1 ? 's' : ''}`;

        resultsContainer.innerHTML = '';

        // Group results by type for better organization
        const groupedResults = this.groupResultsByType();
        
        Object.keys(groupedResults).forEach(type => {
            const typeResults = groupedResults[type];
            
            // Add type header
            const typeHeader = document.createElement('div');
            typeHeader.className = 'search-type-header';
            typeHeader.innerHTML = `
                <h4>${this.getTypeDisplayName(type)} (${typeResults.length})</h4>
            `;
            resultsContainer.appendChild(typeHeader);

            // Add results for this type
            typeResults.forEach(item => {
                const resultElement = this.createResultElement(item);
                resultsContainer.appendChild(resultElement);
            });
        });

        // Add animations
        setTimeout(() => {
            const resultItems = resultsContainer.querySelectorAll('.search-result-item');
            resultItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 50}ms`;
                item.classList.add('animate-in');
            });
        }, 100);
    }

    groupResultsByType() {
        const groups = {
            client: [],
            request: [],
            car: []
        };

        this.searchResults.forEach(item => {
            if (groups[item._type]) {
                groups[item._type].push(item);
            }
        });

        // Remove empty groups
        Object.keys(groups).forEach(type => {
            if (groups[type].length === 0) {
                delete groups[type];
            }
        });

        return groups;
    }

    getTypeDisplayName(type) {
        const typeNames = {
            client: 'Clients',
            request: 'Requests',
            car: 'Cars'
        };
        return typeNames[type] || type;
    }

    createResultElement(item) {
        const element = document.createElement('div');
        element.className = `search-result-item search-result-${item._type}`;
        element.setAttribute('data-type', item._type);
        element.setAttribute('data-id', item.id);

        let icon, title, subtitle, details, actionText;

        switch (item._type) {
            case 'client':
                icon = '<i class="fa-solid fa-user"></i>';
                title = item.name || 'Unnamed Client';
                subtitle = item.phone || 'No phone';
                details = item.nots || item.notes ? 
                    `<div class="search-result-notes">${item.nots || item.notes}</div>` : '';
                actionText = 'View Client';
                break;

            case 'request':
                const status = item.status || 'active';
                const statusClass = status === 'completed' ? 'status-closed' : 
                                 status === 'pending' ? 'status-pending' : 'status-open';
                icon = '<i class="fa-solid fa-file-lines"></i>';
                title = item.title || 'Unnamed Request';
                subtitle = `Client: ${item.clientName || 'Unknown'}`;
                details = `
                    <div class="search-result-status">
                        Status: <span class="status ${statusClass}">${status}</span>
                    </div>
                    ${item.notes ? `<div class="search-result-notes">${item.notes}</div>` : ''}
                `;
                actionText = 'View Request';
                break;

            case 'car':
                icon = '<i class="fa-solid fa-car"></i>';
                title = `${item.brand || ''} ${item.model || ''} (${item.year || ''})`.trim();
                subtitle = `${item.price || '0'} EGP`;
                details = `
                    <div class="search-result-details">
                        <span><i class="fa-solid fa-clipboard-list"></i> ${item.condition || 'N/A'}</span>
                        <span><i class="fa-solid fa-palette"></i> ${item.paint || 'N/A'}</span>
                        <span><i class="fa-solid fa-tag"></i> ${item.category || 'N/A'}</span>
                    </div>
                `;
                actionText = 'View Car';
                break;
        }

        element.innerHTML = `
            <div class="search-result-icon">${icon}</div>
            <div class="search-result-content">
                <div class="search-result-title">${title}</div>
                <div class="search-result-subtitle">${subtitle}</div>
                ${details}
            </div>
            <div class="search-result-action">
                <span>${actionText}</span>
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        `;

        return element;
    }

    handleResultClick(e) {
        const resultItem = e.target.closest('.search-result-item');
        if (!resultItem) return;

        const type = resultItem.getAttribute('data-type');
        const id = resultItem.getAttribute('data-id');

        switch (type) {
            case 'client':
                if (window.viewClientDetails) {
                    viewClientDetails(id);
                } else if (window.ClientsModule && window.ClientsModule.viewClientDetails) {
                    window.ClientsModule.viewClientDetails(id);
                } else {
                    showToast('Cannot view client details. Please try again.', 'error');
                }
                break;

            case 'request':
                if (window.loadRequestDetails) {
                    loadRequestDetails(id);
                } else {
                    showToast('Cannot view request details. Please try again.', 'error');
                }
                break;

            case 'car':
                if (window.showScreen) {
                    showScreen('cars-list');
                    
                    setTimeout(() => {
                        if (window.showCarDetails) {
                            showCarDetails(id);
                        } else {
                            const showCarDetailsFn = window.showCarDetails || 
                                                    (window.CarsModule && window.CarsModule.showCarDetails);
                            
                            if (showCarDetailsFn) {
                                showCarDetailsFn(id);
                            } else {
                                showToast('Cannot view car details. Function not found.', 'error');
                                console.error('showCarDetails function not found');
                            }
                        }
                    }, 300);
                } else {
                    showToast('Cannot navigate to cars screen', 'error');
                }
                break;
        }
    }

    clearFilters() {
        const searchInput = document.getElementById('search-input');
        const searchType = document.getElementById('search-type');
        const searchStatus = document.getElementById('search-status');
        const searchSort = document.getElementById('search-sort');

        if (searchInput) searchInput.value = '';
        if (searchType) searchType.value = '';
        if (searchStatus) searchStatus.value = '';
        if (searchSort) searchSort.value = 'relevance';

        this.currentSearchTerm = '';
        this.currentFilters = {
            type: '',
            status: ''
        };
    }

    showEmptyState(message) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <div class="empty-search-state">
                <i class="fa-solid fa-magnifying-glass"></i>
                <p>${message}</p>
            </div>
        `;
    }

    showLoading(show) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;

        if (show) {
            const loader = document.createElement('div');
            loader.className = 'search-loading';
            loader.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Loading...</p>
                </div>
            `;
            resultsContainer.innerHTML = '';
            resultsContainer.appendChild(loader);
        } else {
            const loader = resultsContainer.querySelector('.search-loading');
            if (loader) loader.remove();
        }
    }

    // Helper method to show all data
    showAllData() {
        this.currentSearchTerm = '';
        this.currentFilters = { type: '', status: '' };
        this.performSearch('');
    }
}

// Initialize search module when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.SearchModule = new SearchModule();
    
    // Also initialize when entering search screen
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-go="search"]')) {
            // Small delay to ensure screen is shown
            setTimeout(() => {
                if (window.SearchModule) {
                    window.SearchModule.showAllData();
                }
            }, 100);
        }
    });
});