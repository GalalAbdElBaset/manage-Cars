"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * Search Module - Handles all search functionality
 */
var SearchModule = function () {
  var currentSearchTerm = '';
  var currentFilters = {
    type: '',
    status: ''
  };
  var searchResults = [];
  var cachedData = {
    clients: [],
    requests: [],
    cars: []
  };
  var debouncedSearch = App.debounce(performSearch, 300); // ==================== INITIALIZATION ====================

  function init() {
    console.log('🔍 Search Module Initialized');
    bindEvents();
    loadAllData();
  }

  function bindEvents() {
    var searchInput = document.getElementById('search-input');

    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        var value = e.target.value;

        if (value === '') {
          performSearch('');
        } else {
          debouncedSearch(value);
        }
      });
    }

    var typeFilter = document.getElementById('search-type');

    if (typeFilter) {
      typeFilter.addEventListener('change', function (e) {
        currentFilters.type = e.target.value;
        performSearch(currentSearchTerm);
      });
    }

    var statusFilter = document.getElementById('search-status');

    if (statusFilter) {
      statusFilter.addEventListener('change', function (e) {
        currentFilters.status = e.target.value;
        performSearch(currentSearchTerm);
      });
    }

    var sortSelect = document.getElementById('search-sort');

    if (sortSelect) {
      sortSelect.addEventListener('change', function (e) {
        sortResults(e.target.value);
      });
    }

    var clearBtn = document.getElementById('clear-search-filters');

    if (clearBtn) {
      clearBtn.addEventListener('click', clearFilters);
    }

    var resultsContainer = document.getElementById('search-results');

    if (resultsContainer) {
      resultsContainer.addEventListener('click', handleResultClick);
    }
  } // ==================== DATA LOADING ====================


  function loadAllData() {
    var _ref, _ref2, clients, requests, cars;

    return regeneratorRuntime.async(function loadAllData$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            showLoading(true);
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(Promise.all([API.getClients()["catch"](function () {
              return [];
            }), API.getRequests()["catch"](function () {
              return [];
            }), API.getCars()["catch"](function () {
              return [];
            })]));

          case 4:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 3);
            clients = _ref2[0];
            requests = _ref2[1];
            cars = _ref2[2];
            cachedData = {
              clients: clients,
              requests: requests,
              cars: cars
            };
            _context.next = 12;
            return regeneratorRuntime.awrap(performSearch(''));

          case 12:
            _context.next = 18;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](1);
            console.error('Error loading data:', _context.t0);
            showEmptyState('Error loading data');

          case 18:
            _context.prev = 18;
            showLoading(false);
            return _context.finish(18);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 14, 18, 21]]);
  } // ==================== SEARCH FUNCTIONALITY ====================


  function performSearch(term) {
    var allItems, searchWords, sortSelect;
    return regeneratorRuntime.async(function performSearch$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            currentSearchTerm = term.trim();

            try {
              allItems = [].concat(_toConsumableArray(cachedData.clients.map(function (item) {
                return _objectSpread({}, item, {
                  _type: 'client'
                });
              })), _toConsumableArray(cachedData.requests.map(function (item) {
                return _objectSpread({}, item, {
                  _type: 'request'
                });
              })), _toConsumableArray(cachedData.cars.map(function (item) {
                return _objectSpread({}, item, {
                  _type: 'car'
                });
              })));

              if (currentSearchTerm) {
                searchWords = currentSearchTerm.toLowerCase().split(/\s+/);
                allItems = allItems.filter(function (item) {
                  var searchableText = getSearchableText(item).toLowerCase();
                  return searchWords.every(function (word) {
                    return searchableText.includes(word);
                  });
                });
              }

              if (currentFilters.type) {
                allItems = allItems.filter(function (item) {
                  return item._type === currentFilters.type;
                });
              }

              if (currentFilters.status) {
                allItems = allItems.filter(function (item) {
                  return item._type === 'request' && item.status === currentFilters.status;
                });
              }

              searchResults = allItems;
              updateResultsCount();
              sortSelect = document.getElementById('search-sort');

              if (sortSelect) {
                sortResults(sortSelect.value, false);
              } else {
                displayResults();
              }
            } catch (error) {
              console.error('Search error:', error);
              showEmptyState('An error occurred during search');
            }

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    });
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
  } // ==================== SORTING ====================


  function sortResults(sortBy) {
    var refreshDisplay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var getName = function getName(item) {
      switch (item._type) {
        case 'client':
          return item.name || '';

        case 'request':
          return item.title || '';

        case 'car':
          return "".concat(item.brand || '', " ").concat(item.model || '');

        default:
          return '';
      }
    };

    switch (sortBy) {
      case 'name_asc':
        searchResults.sort(function (a, b) {
          return getName(a).localeCompare(getName(b));
        });
        break;

      case 'name_desc':
        searchResults.sort(function (a, b) {
          return getName(b).localeCompare(getName(a));
        });
        break;

      default:
        break;
    }

    displayResults();
  } // ==================== DISPLAY RESULTS ====================


  function updateResultsCount() {
    var countElement = document.getElementById('search-results-count');

    if (countElement) {
      countElement.textContent = "Search Results (".concat(searchResults.length, ")");
    }
  }

  function displayResults() {
    var container = document.getElementById('search-results');
    if (!container) return;

    if (searchResults.length === 0) {
      showEmptyState(currentSearchTerm ? 'No results found' : 'Enter search keywords');
      return;
    }

    var grouped = {
      client: searchResults.filter(function (item) {
        return item._type === 'client';
      }),
      request: searchResults.filter(function (item) {
        return item._type === 'request';
      }),
      car: searchResults.filter(function (item) {
        return item._type === 'car';
      })
    };
    var html = '';

    if (grouped.client.length > 0) {
      html += '<div class="search-type-header"><h4><i class="fa-solid fa-users"></i> Clients (' + grouped.client.length + ')</h4></div>';
      grouped.client.forEach(function (item) {
        html += createClientResult(item);
      });
    }

    if (grouped.request.length > 0) {
      html += '<div class="search-type-header"><h4><i class="fa-solid fa-file-lines"></i> Requests (' + grouped.request.length + ')</h4></div>';
      grouped.request.forEach(function (item) {
        html += createRequestResult(item);
      });
    }

    if (grouped.car.length > 0) {
      html += '<div class="search-type-header"><h4><i class="fa-solid fa-car"></i> Cars (' + grouped.car.length + ')</h4></div>';
      grouped.car.forEach(function (item) {
        html += createCarResult(item);
      });
    }

    container.innerHTML = html;
  }

  function createClientResult(item) {
    return "\n            <div class=\"search-result-item\" data-type=\"client\" data-id=\"".concat(App.escapeHtml(item.id), "\">\n                <div class=\"search-result-icon\"><i class=\"fa-solid fa-user\"></i></div>\n                <div class=\"search-result-content\">\n                    <div class=\"search-result-title\">").concat(App.escapeHtml(item.name || 'Unnamed Client'), "</div>\n                    <div class=\"search-result-subtitle\">\n                        <i class=\"fa-solid fa-phone\"></i> ").concat(App.escapeHtml(item.phone || 'No phone number'), "\n                    </div>\n                </div>\n                <div class=\"search-result-action\">\n                    <i class=\"fa-solid fa-chevron-left\"></i>\n                </div>\n            </div>\n        ");
  }

  function createRequestResult(item) {
    var status = item.status || 'pending';
    var statusText = status === 'active' ? 'Active' : status === 'pending' ? 'Pending' : 'Completed';
    return "\n            <div class=\"search-result-item\" data-type=\"request\" data-id=\"".concat(App.escapeHtml(item.id), "\">\n                <div class=\"search-result-icon\"><i class=\"fa-solid fa-file-lines\"></i></div>\n                <div class=\"search-result-content\">\n                    <div class=\"search-result-title\">").concat(App.escapeHtml(item.title || 'Untitled Request'), "</div>\n                    <div class=\"search-result-subtitle\">\n                        <i class=\"fa-solid fa-user\"></i> ").concat(App.escapeHtml(item.clientName || 'Unknown'), "\n                    </div>\n                    <div class=\"search-result-status\">\n                        <span class=\"status status-").concat(status, "\">\n                            <i class=\"fa-solid ").concat(status === 'active' ? 'fa-play-circle' : status === 'pending' ? 'fa-clock' : 'fa-check-circle', "\"></i>\n                            ").concat(statusText, "\n                        </span>\n                    </div>\n                </div>\n                <div class=\"search-result-action\">\n                    <i class=\"fa-solid fa-chevron-left\"></i>\n                </div>\n            </div>\n        ");
  }

  function createCarResult(item) {
    return "\n            <div class=\"search-result-item\" data-type=\"car\" data-id=\"".concat(App.escapeHtml(item.id), "\">\n                <div class=\"search-result-icon\"><i class=\"fa-solid fa-car\"></i></div>\n                <div class=\"search-result-content\">\n                    <div class=\"search-result-title\">").concat(App.escapeHtml(item.brand || ''), " ").concat(App.escapeHtml(item.model || ''), " ").concat(App.escapeHtml(item.year || ''), "</div>\n                    <div class=\"search-result-subtitle\">\n                        <span><i class=\"fa-solid fa-tag\"></i> ").concat(App.escapeHtml(item.category || 'Not specified'), "</span>\n                        <span><i class=\"fa-solid fa-palette\"></i> ").concat(App.escapeHtml(item.paint || 'Not specified'), "</span>\n                    </div>\n                    <div class=\"search-result-notes\">\n                        <i class=\"fa-solid fa-dollar-sign\"></i> ").concat(item.price ? App.formatPrice(item.price) : 'Price on request', "\n                    </div>\n                </div>\n                <div class=\"search-result-action\">\n                    <i class=\"fa-solid fa-chevron-left\"></i>\n                </div>\n            </div>\n        ");
  } // ==================== CLICK HANDLER ====================


  function handleResultClick(e) {
    var resultItem = e.target.closest('.search-result-item');
    if (!resultItem) return;
    var type = resultItem.dataset.type;
    var id = resultItem.dataset.id;
    if (!type || !id) return;
    sessionStorage.setItem('viewItem', JSON.stringify({
      type: type,
      id: id
    }));
    App.showToast("Loading details...", 'info', 1000);
    var page = type === 'client' ? 'index.html' : type === 'request' ? 'requests.html' : 'cars.html';
    window.location.href = page;
  } // ==================== UI STATES ====================


  function showLoading(show) {
    var container = document.getElementById('search-results');
    var countElement = document.getElementById('search-results-count');
    if (!container) return;

    if (show) {
      if (countElement) countElement.textContent = 'Searching...';
      container.innerHTML = "\n                <div class=\"search-loading\">\n                    <div class=\"loading-spinner\">\n                        <div class=\"spinner\"></div>\n                        <p>Loading data...</p>\n                    </div>\n                </div>\n            ";
    }
  }

  function showEmptyState(message) {
    var container = document.getElementById('search-results');
    var countElement = document.getElementById('search-results-count');
    if (!container) return;
    if (countElement) countElement.textContent = 'Search Results (0)';
    container.innerHTML = "\n            <div class=\"empty-search-state\">\n                <i class=\"fa-solid fa-magnifying-glass\"></i>\n                <p>".concat(App.escapeHtml(message), "</p>\n            </div>\n        ");
  } // ==================== FILTERS ====================


  function clearFilters() {
    currentFilters = {
      type: '',
      status: ''
    };
    var typeFilter = document.getElementById('search-type');
    var statusFilter = document.getElementById('search-status');
    if (typeFilter) typeFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    performSearch(currentSearchTerm);
    App.showToast('Filters cleared', 'success', 1500);
  }

  function checkStoredItem() {
    var stored = sessionStorage.getItem('viewItem');

    if (stored) {
      try {
        var _JSON$parse = JSON.parse(stored),
            type = _JSON$parse.type,
            id = _JSON$parse.id;

        sessionStorage.removeItem('viewItem');
        setTimeout(function () {
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
    init: init,
    refreshData: loadAllData,
    clearFilters: clearFilters,
    performSearch: performSearch,
    checkStoredItem: checkStoredItem
  };
}();

window.SearchModule = SearchModule;
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('search-screen')) {
    SearchModule.init();
    SearchModule.checkStoredItem();
  }
});
//# sourceMappingURL=search.dev.js.map
