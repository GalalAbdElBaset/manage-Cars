"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// ==================== REQUESTS MODULE ====================
// LOAD CLIENTS AND CARS FOR REQUEST FORM
function loadClientsAndCarsForRequest() {
  loadClientsForRequest();
  loadCarsForRequest();
} // LOAD CLIENTS FOR REQUEST


function loadClientsForRequest() {
  var select = document.getElementById('request-client');
  if (!select) return;
  select.innerHTML = '<option value="" disabled selected>Select Client</option>';
  var clients = getLocalData('clients');

  if (!clients || clients.length === 0) {
    var option = document.createElement('option');
    option.value = '';
    option.disabled = true;
    option.textContent = 'No clients available. Please add clients first.';
    select.appendChild(option);
    return;
  }

  clients.forEach(function (client) {
    var option = document.createElement('option');
    option.value = client.id;
    option.textContent = client.name;
    select.appendChild(option);
  });
} // LOAD CARS FOR REQUEST


function loadCarsForRequest() {
  var select = document.getElementById('request-car');
  if (!select) return;
  select.innerHTML = '<option value="" disabled selected>Select Car</option>';
  var cars = getLocalData('cars');

  if (!cars || cars.length === 0) {
    var option = document.createElement('option');
    option.value = '';
    option.disabled = true;
    option.textContent = 'No cars available. Please add cars first.';
    select.appendChild(option);
    return;
  }

  cars.forEach(function (car) {
    var option = document.createElement('option');
    option.value = car.id;
    option.textContent = "".concat(car.brand || '', " ").concat(car.model || '', " (").concat(car.year || '', ") - ").concat(car.price || '0', " EGP");
    option.setAttribute('data-brand', car.brand || '');
    option.setAttribute('data-model', car.model || '');
    select.appendChild(option);
  });
} // LOAD CLIENTS AND CARS FOR EDIT FORM


function loadClientsAndCarsForEdit(selectedClientId, selectedCarId) {
  loadClientsForEdit(selectedClientId);
  loadCarsForEdit(selectedCarId);
} // LOAD CLIENTS FOR EDIT


function loadClientsForEdit(selectedClientId) {
  var select = document.getElementById('edit-request-client');
  if (!select) return;
  select.innerHTML = '<option value="" disabled>Select Client</option>';
  var clients = getLocalData('clients');

  if (!clients || clients.length === 0) {
    var option = document.createElement('option');
    option.value = '';
    option.disabled = true;
    option.textContent = 'No clients available. Please add clients first.';
    select.appendChild(option);
    return;
  }

  clients.forEach(function (client) {
    var option = document.createElement('option');
    option.value = client.id;
    option.textContent = client.name;

    if (client.id === selectedClientId) {
      option.selected = true;
    }

    select.appendChild(option);
  });
} // LOAD CARS FOR EDIT


function loadCarsForEdit(selectedCarId) {
  var select = document.getElementById('edit-request-car');
  if (!select) return;
  select.innerHTML = '<option value="" disabled>Select Car</option>';
  var cars = getLocalData('cars');

  if (!cars || cars.length === 0) {
    var option = document.createElement('option');
    option.value = '';
    option.disabled = true;
    option.textContent = 'No cars available. Please add cars first.';
    select.appendChild(option);
    return;
  }

  cars.forEach(function (car) {
    var option = document.createElement('option');
    option.value = car.id;
    option.textContent = "".concat(car.brand || '', " ").concat(car.model || '', " (").concat(car.year || '', ") - ").concat(car.price || '0', " EGP");

    if (car.id === selectedCarId) {
      option.selected = true;
    }

    select.appendChild(option);
  });

  if (selectedCarId && !cars.some(function (car) {
    return car.id === selectedCarId;
  })) {
    var deletedCarOption = document.createElement('option');
    deletedCarOption.value = selectedCarId;
    deletedCarOption.disabled = true;
    deletedCarOption.textContent = '⚠️ The car no longer exists (it has been deleted)';
    deletedCarOption.style.backgroundColor = '#fff3f3';
    deletedCarOption.style.color = '#d32f2f';
    select.appendChild(deletedCarOption);
    deletedCarOption.selected = true;
  }
} // ADD REQUEST


function addRequest(clientId, carId, status) {
  if (!clientId || !carId) {
    showToast('Please select client and car', 'error');
    return;
  }

  var requests = getLocalData('requests');
  var clients = getLocalData('clients');
  var cars = getLocalData('cars');
  var client = clients.find(function (c) {
    return c.id === clientId;
  });
  var car = cars.find(function (c) {
    return c.id === carId;
  });

  if (!client) {
    showToast('Client not found', 'error');
    return;
  }

  if (!car) {
    showToast('Car not found', 'error');
    return;
  } // Create title from car details


  var title = "".concat(car.brand, " ").concat(car.model, " - Request");
  var newRequest = {
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
  showToast('Request added successfully', 'success'); // Clear fields

  if (document.getElementById('request-client')) document.getElementById('request-client').value = '';
  if (document.getElementById('request-car')) document.getElementById('request-car').value = '';
  if (document.getElementById('request-status')) document.getElementById('request-status').value = 'active';
  loadRequests();
  showScreen('requests-list');
} // LOAD REQUESTS


function loadRequests() {
  var requests = getLocalData('requests');
  var clients = getLocalData('clients');
  var cars = getLocalData('cars');
  renderRequests(requests, clients, cars);
} // CHECK IF CAR EXISTS


function isCarExists(carId, cars) {
  return cars && cars.some(function (car) {
    return car.id === carId;
  });
} // RENDER REQUESTS


function renderRequests(requests, clients, cars) {
  var list = document.querySelector('[data-screen="requests-list"] .content');
  if (!list) return;
  list.innerHTML = '';

  if (!requests || !requests.length) {
    list.innerHTML = '<div class="empty-state"><i class="fa-solid fa-file-lines"></i><p>No requests yet</p></div>';
    return;
  }

  requests.forEach(function (req) {
    var client = clients.find(function (c) {
      return c.id === req.clientId;
    });
    var car = cars.find(function (c) {
      return c.id === req.carId;
    });
    var carExists = isCarExists(req.carId, cars);
    var statusClass = req.status === 'active' ? 'status-open' : req.status === 'completed' ? 'status-closed' : 'status-pending';
    var card = document.createElement('div');
    card.className = 'card request-card';

    if (!carExists) {
      card.style.borderLeft = '4px solid #d32f2f';
      card.style.backgroundColor = '#fff8f8';
    }

    var carDisplay = '';

    if (carExists && car) {
      carDisplay = "".concat(car.brand || '', " ").concat(car.model || '', " (").concat(car.year || '', ")");
    } else if (req.carDetails) {
      carDisplay = "".concat(req.carDetails.brand || '', " ").concat(req.carDetails.model || '', " (").concat(req.carDetails.year || '', ")");
    } else {
      carDisplay = '⚠️ The car is no longer available';
    }

    var priceDisplay = '';

    if (carExists && car) {
      priceDisplay = (car.price || '0') + ' EGP';
    } else if (req.carDetails && req.carDetails.price) {
      priceDisplay = req.carDetails.price + ' EGP (old)';
    } else {
      priceDisplay = 'unavailable';
    }

    card.innerHTML = "\n            <div style=\"display:flex; justify-content:space-between; align-items:start;\">\n                <div>\n                    <strong>".concat(req.title, "</strong>\n                </div>\n                <span class=\"status ").concat(statusClass, "\">").concat(req.status, "</span>\n            </div>\n            \n            <div style=\"margin-top:10px;\">\n                <p><i class=\"fa-solid fa-user\"></i> Client: ").concat(client ? client.name : 'Unknown', "</p>\n                <p><i class=\"fa-solid fa-car\"></i> Car: ").concat(carDisplay, "</p>\n                <p><i class=\"fa-solid fa-tag\"></i> Price: ").concat(priceDisplay, "</p>\n                ").concat(!carExists ? '<p style="color:#d32f2f; font-size:12px;"><i class="fa-solid fa-exclamation-triangle"></i>This car has been removed from the system.</p>' : '', "\n            </div>\n\n            <div style=\"display:flex; gap:10px; margin-top:15px;\">\n                <button type=\"button\" class=\"btn btn-sm btn-secondary\" data-view-request=\"").concat(req.id, "\">\n                    <i class=\"fa-solid fa-eye\"></i> View\n                </button>\n                <button type=\"button\" class=\"btn btn-sm btn-warning\" data-edit-request=\"").concat(req.id, "\">\n                    <i class=\"fa-solid fa-pen\"></i> Edit\n                </button>\n                <button type=\"button\" class=\"btn btn-sm btn-danger\" data-delete-request=\"").concat(req.id, "\">\n                    <i class=\"fa-solid fa-trash\"></i> Delete\n                </button>\n            </div>\n        ");
    list.appendChild(card);
  });
} // REQUEST DETAILS


function loadRequestDetails(id) {
  var requests = getLocalData('requests');
  var clients = getLocalData('clients');
  var cars = getLocalData('cars');
  var request = requests.find(function (r) {
    return r.id === id;
  });

  if (!request) {
    showToast('Request not found', 'error');
    return;
  }

  var client = clients.find(function (c) {
    return c.id === request.clientId;
  });
  var car = cars.find(function (c) {
    return c.id === request.carId;
  });
  var carExists = isCarExists(request.carId, cars);
  renderRequestDetails(request, client, car, carExists);
  showScreen('request-details');
}

function renderRequestDetails(request, client, car, carExists) {
  var box = document.querySelector('[data-screen="request-details"] .content');
  if (!box) return;
  var statusClass = request.status === 'active' ? 'status-open' : request.status === 'completed' ? 'status-closed' : 'status-pending';
  var carData = carExists && car ? car : request.carDetails || {};
  var carDisplay = '';

  if (carExists && car) {
    carDisplay = "".concat(car.brand || '', " ").concat(car.model || '', " (").concat(car.year || '', ")");
  } else if (request.carDetails) {
    carDisplay = "".concat(request.carDetails.brand || '', " ").concat(request.carDetails.model || '', " (").concat(request.carDetails.year || '', ")");
  } else {
    carDisplay = 'not available';
  }

  var warningMessage = '';

  if (!carExists) {
    warningMessage = "\n            <div style=\"background-color: #ffebee; color: #d32f2f; padding: 10px; border-radius: 5px; margin-bottom: 15px;\">\n                <i class=\"fa-solid fa-exclamation-triangle\"></i> \n                <strong>warning:</strong>\n                    This vehicle has been removed from the system. The following data is stored at the time the request was created.\n                    </div>";
  }

  box.innerHTML = "\n        <div class=\"card\">\n            <h3>".concat(request.title, "</h3>\n            <hr>\n            ").concat(warningMessage, "\n            <p><strong><i class=\"fa-solid fa-user\"></i> Client:</strong> ").concat(client ? client.name : '-', "</p>\n            <p><strong><i class=\"fa-solid fa-car\"></i> Car:</strong> ").concat(carDisplay, "</p>\n            <p><strong><i class=\"fa-solid fa-palette\"></i> Paint:</strong> ").concat(carData.paint || 'N/A', "</p>\n            <p><strong><i class=\"fa-solid fa-clipboard-list\"></i> Condition:</strong> ").concat(carData.condition || 'N/A', "</p>\n            <p><strong><i class=\"fa-solid fa-tag\"></i> Category:</strong> ").concat(carData.category || 'N/A', "</p>\n            <p><strong><i class=\"fa-solid fa-tag\"></i> Price:</strong> ").concat(carData.price ? carData.price + ' EGP' : 'N/A', " ").concat(!carExists && carData.price ? '(قديم)' : '', "</p>\n            <p>\n                <strong>Status:</strong>\n                <span class=\"status ").concat(statusClass, "\">\n                    ").concat(request.status, "\n                </span>\n            </p>\n            <p><strong>Created:</strong> ").concat(new Date(request.createdAt).toLocaleDateString(), "</p>\n        </div>\n\n        <div style=\"display:flex; gap:10px; margin-top:20px;\">\n            <button type=\"button\" class=\"btn btn-secondary\" data-go=\"requests-list\">\n                <i class=\"fa-solid fa-arrow-left\"></i> Back\n            </button>\n            <button type=\"button\" class=\"btn btn-warning\" data-edit-request=\"").concat(request.id, "\">\n                <i class=\"fa-solid fa-pen\"></i> Edit\n            </button>\n            <button type=\"button\" class=\"btn btn-danger\" data-delete-request=\"").concat(request.id, "\">\n                <i class=\"fa-solid fa-trash\"></i> Delete\n            </button>\n        </div>\n    ");
} // EVENTS


document.addEventListener('click', function (e) {
  if (e.target.closest('button')) {
    e.preventDefault();
  }
  /* VIEW REQUEST */


  var view = e.target.closest('[data-view-request]');

  if (view) {
    loadRequestDetails(view.dataset.viewRequest);
    return;
  }
  /* DELETE REQUEST */


  var del = e.target.closest('[data-delete-request]');

  if (del) {
    if (!confirm('Are you sure you want to delete this request?')) return;
    var requests = getLocalData('requests');
    var updatedRequests = requests.filter(function (r) {
      return r.id !== del.dataset.deleteRequest;
    });
    setLocalData('requests', updatedRequests);
    showToast('Request deleted successfully', 'success');
    loadRequests();
    showScreen('requests-list');
    return;
  }
  /* EDIT REQUEST - Show edit form */


  var edit = e.target.closest('[data-edit-request]');

  if (edit) {
    var id = edit.dataset.editRequest;

    var _requests = getLocalData('requests');

    var request = _requests.find(function (r) {
      return r.id === id;
    });

    if (!request) {
      showToast('Request not found', 'error');
      return;
    } // Load clients and cars with selected values


    loadClientsAndCarsForEdit(request.clientId, request.carId); // Set status

    var statusSelect = document.getElementById('edit-request-status');

    if (statusSelect) {
      statusSelect.value = request.status || 'active';
    } // Store request ID for update


    document.getElementById('update-request').dataset.id = id;
    showScreen('edit-request');
    return;
  }
  /* ADD REQUEST */


  if (e.target.closest('[data-save-request]')) {
    var clientEl = document.getElementById('request-client');
    var carEl = document.getElementById('request-car');
    var statusEl = document.getElementById('request-status');

    if (!clientEl || !carEl) {
      showToast('Form not ready', 'error');
      return;
    }

    var clientId = clientEl.value;
    var carId = carEl.value;
    var status = statusEl ? statusEl.value : 'active';

    if (!clientId || !carId) {
      showToast('Please select both client and car', 'error');
      return;
    }

    addRequest(clientId, carId, status);
    return;
  }
  /* UPDATE REQUEST */


  var update = e.target.closest('#update-request');

  if (update) {
    var _id = update.dataset.id;
    var _clientId = document.getElementById('edit-request-client').value;
    var _carId = document.getElementById('edit-request-car').value;
    var _status = document.getElementById('edit-request-status').value;

    if (!_clientId || !_carId) {
      showToast('Please select both client and car', 'error');
      return;
    }

    var _requests2 = getLocalData('requests');

    var cars = getLocalData('cars');
    var clients = getLocalData('clients');

    var requestIndex = _requests2.findIndex(function (r) {
      return r.id === _id;
    });

    var car = cars.find(function (c) {
      return c.id === _carId;
    });
    var client = clients.find(function (c) {
      return c.id === _clientId;
    });

    if (requestIndex !== -1) {
      if (!client) {
        showToast('Client not found', 'error');
        return;
      }

      var updatedRequest = _objectSpread({}, _requests2[requestIndex], {
        clientId: _clientId,
        carId: _carId,
        clientName: client.name,
        status: _status || "active"
      });

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
        updatedRequest.title = "".concat(car.brand, " ").concat(car.model, " - Request");
      } else {
        updatedRequest.title = _requests2[requestIndex].title || 'Request';
        showToast('Warning: Selected car no longer exists', 'warning');
      }

      _requests2[requestIndex] = updatedRequest;
      setLocalData('requests', _requests2);
    }

    showToast('Request updated successfully', 'success');
    loadRequests();
    showScreen('requests-list');
  }
}); // Load data when entering add request screen

document.addEventListener('click', function (e) {
  if (e.target.closest('[data-go="add-request"]')) {
    setTimeout(function () {
      loadClientsAndCarsForRequest();
    }, 100);
  }
}); // Initialize if on requests list screen

if (document.querySelector('[data-screen="requests-list"]')) {
  loadRequests();
} // Initialize if on add request screen


if (document.querySelector('[data-screen="add-request"]')) {
  loadClientsAndCarsForRequest();
}
//# sourceMappingURL=requests.dev.js.map
