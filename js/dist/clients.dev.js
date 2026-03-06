"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var clientsCache = {
  containers: {},
  elements: {},
  initialized: false
};
/* ===== إضافة دالة تنظيف رقم الهاتف ===== */

function normalizePhone(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}
/* ===================================== */


function buildInternationalPhone(code, phone) {
  var cleaned = phone.replace(/^0+/, '').replace(/\D/g, '');
  return code + cleaned;
}

function splitPhone(fullPhone) {
  if (!fullPhone) return {
    code: "+20",
    phone: ""
  };
  if (fullPhone.startsWith("20")) return {
    code: "+20",
    phone: "0" + fullPhone.substring(2)
  };
  if (fullPhone.startsWith("966")) return {
    code: "+966",
    phone: fullPhone.substring(3)
  };
  if (fullPhone.startsWith("971")) return {
    code: "+971",
    phone: fullPhone.substring(3)
  };
  return {
    code: "+20",
    phone: fullPhone
  };
}

function initClientsModule() {
  cacheClientsElements();
  setupClientsEventListeners();
  clientsCache.initialized = true;

  if (document.querySelector('[data-screen="clients-list"]')) {
    loadClients();
  }
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
    addCode: document.getElementById('country-code'),
    editName: document.getElementById('edit-client-name'),
    editPhone: document.getElementById('edit-client-phone'),
    editNotes: document.getElementById('edit-client-notes'),
    saveBtn: document.getElementById('save-client'),
    updateBtn: document.getElementById('update-client'),
    callBtn: document.querySelector('[data-screen="client-details"] .btn-secondary:nth-child(2)'),
    whatsappBtn: document.querySelector('[data-screen="client-details"] .btn-secondary:nth-child(3)'),
    editClientBtn: document.querySelector('[data-screen="client-details"] [data-edit-client]')
  };
}

function setupClientsEventListeners() {
  if (clientsCache.elements.saveBtn) {
    clientsCache.elements.saveBtn.addEventListener('click', handleSaveClient);
  }

  if (clientsCache.elements.updateBtn) {
    clientsCache.elements.updateBtn.addEventListener('click', handleUpdateClient);
  }

  document.addEventListener('click', handleClientsClickEvents);
}

function handleClientsClickEvents(e) {
  var target = e.target;
  var viewBtn = target.closest('[data-view-client]');

  if (viewBtn) {
    viewClientDetails(viewBtn.dataset.viewClient);
    return;
  }

  var deleteBtn = target.closest('[data-delete-client]');

  if (deleteBtn) {
    handleDeleteClient(deleteBtn.dataset.deleteClient);
    return;
  }

  var editBtn = target.closest('[data-edit-client]');

  if (editBtn && editBtn.dataset.editClient) {
    openEditClientScreen(editBtn.dataset.editClient);
    return;
  }
}
/* ================= LOAD ================= */


function loadClients() {
  showLoading(true);
  fetch("".concat(API_URL, "/clients")).then(function (r) {
    return r.json();
  }).then(function (data) {
    renderClients(data);
    showLoading(false);
  })["catch"](function () {
    showLoading(false);
    renderEmptyState('clients');
  });
}

function renderClients(clients) {
  var container = clientsCache.containers.clientsList;
  if (!container) return;
  container.innerHTML = '';

  if (!clients || clients.length === 0) {
    renderEmptyState('clients');
    return;
  }

  clients.forEach(function (client) {
    container.appendChild(createClientCard(client));
  });
}

function createClientCard(client) {
  var card = document.createElement('div');
  card.className = 'client-item';
  var initials = getInitials(client.name);
  card.innerHTML = "\n        <div class=\"client-avatar\">".concat(initials, "</div>\n        <div class=\"client-info\">\n            <div class=\"client-name\">").concat(escapeHtml(client.name), "</div>\n            <div class=\"client-phone\">\n                <i class=\"fa-solid fa-phone\"></i> +").concat(escapeHtml(client.phone), "\n            </div>\n        </div>\n        <div class=\"client-actions\">\n            <button class=\"btn-icon\" data-view-client=\"").concat(client.id, "\">\n                <i class=\"fa-solid fa-eye\"></i>\n            </button>\n            <button class=\"btn-icon\" data-delete-client=\"").concat(client.id, "\">\n                <i class=\"fa-solid fa-trash\"></i>\n            </button>\n        </div>\n    ");
  return card;
}
/* ================= ADD ================= */


function addClient(clientData) {
  var phoneIntl, id, newClient;
  return regeneratorRuntime.async(function addClient$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          phoneIntl = buildInternationalPhone(clientData.code, clientData.phone);
          id = 'client_' + Date.now();
          newClient = {
            id: id,
            name: clientData.name.trim(),
            phone: normalizePhone(phoneIntl),
            nots: clientData.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          _context.next = 6;
          return regeneratorRuntime.awrap(fetch("".concat(API_URL, "/clients"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newClient)
          }));

        case 6:
          clearAddClientForm();
          loadClients();
          showScreen('clients-list');
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}

function handleSaveClient() {
  var clientData;
  return regeneratorRuntime.async(function handleSaveClient$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          clientData = {
            name: clientsCache.elements.addName.value,
            phone: clientsCache.elements.addPhone.value,
            notes: clientsCache.elements.addNotes.value,
            code: clientsCache.elements.addCode.value
          };
          _context2.next = 3;
          return regeneratorRuntime.awrap(addClient(clientData));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}
/* ================= DETAILS ================= */


function viewClientDetails(clientId) {
  var response, client;
  return regeneratorRuntime.async(function viewClientDetails$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(fetch("".concat(API_URL, "/clients/").concat(clientId)));

        case 2:
          response = _context3.sent;
          _context3.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          client = _context3.sent;
          renderClientDetails(client);
          showScreen('client-details');

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function renderClientDetails(client) {
  var container = clientsCache.containers.clientDetails;
  container.innerHTML = "\n        <h3>".concat(client.name, "</h3>\n        <p>+").concat(client.phone, "</p>\n        <button data-edit-client=\"").concat(client.id, "\">Edit</button>\n    ");
}
/* ================= EDIT ================= */


function openEditClientScreen(clientId) {
  var response, client, split;
  return regeneratorRuntime.async(function openEditClientScreen$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(fetch("".concat(API_URL, "/clients/").concat(clientId)));

        case 2:
          response = _context4.sent;
          _context4.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          client = _context4.sent;
          split = splitPhone(client.phone);
          clientsCache.elements.editName.value = client.name;
          clientsCache.elements.editPhone.value = split.phone;
          clientsCache.elements.updateBtn.dataset.clientId = clientId;
          showScreen('edit-client');

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function updateClient(clientId, clientData) {
  var response, current, updatedClient;
  return regeneratorRuntime.async(function updateClient$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(fetch("".concat(API_URL, "/clients/").concat(clientId)));

        case 2:
          response = _context5.sent;
          _context5.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          current = _context5.sent;
          updatedClient = _objectSpread({}, current, {
            name: clientData.name,
            phone: normalizePhone(clientData.phone),
            nots: clientData.notes,
            updatedAt: new Date().toISOString()
          });
          _context5.next = 9;
          return regeneratorRuntime.awrap(fetch("".concat(API_URL, "/clients/").concat(clientId), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedClient)
          }));

        case 9:
          loadClients();
          showScreen('clients-list');

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function handleUpdateClient() {
  var id, clientData;
  return regeneratorRuntime.async(function handleUpdateClient$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = clientsCache.elements.updateBtn.dataset.clientId;
          clientData = {
            name: clientsCache.elements.editName.value,
            phone: clientsCache.elements.editPhone.value,
            notes: clientsCache.elements.editNotes.value
          };
          _context6.next = 4;
          return regeneratorRuntime.awrap(updateClient(id, clientData));

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
}
/* ================= HELPERS ================= */


function clearAddClientForm() {
  clientsCache.elements.addName.value = '';
  clientsCache.elements.addPhone.value = '';
  clientsCache.elements.addNotes.value = '';
}

function getInitials(name) {
  return name ? name[0].toUpperCase() : '?';
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderEmptyState() {
  var container = clientsCache.containers.clientsList;
  container.innerHTML = "<p>No clients</p>";
}

function showLoading() {}

function showToast() {}

function showScreen() {}

document.addEventListener('DOMContentLoaded', initClientsModule);
window.ClientsModule = {
  init: initClientsModule,
  loadClients: loadClients,
  addClient: addClient,
  updateClient: updateClient
};
//# sourceMappingURL=clients.dev.js.map
