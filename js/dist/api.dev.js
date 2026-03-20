"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * API Module - Handles all HTTP requests to json-server
 * Base URL: http://localhost:3000
 */
var API = function () {
  var BASE_URL = 'https://69bd8ccc2bc2a25b22aedde6.mockapi.io'; // ==================== HELPER FUNCTIONS ====================

  function handleResponse(response) {
    var error;
    return regeneratorRuntime.async(function handleResponse$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (response.ok) {
              _context.next = 5;
              break;
            }

            _context.next = 3;
            return regeneratorRuntime.awrap(response.json()["catch"](function () {
              return {};
            }));

          case 3:
            error = _context.sent;
            throw new Error(error.message || "HTTP error! status: ".concat(response.status));

          case 5:
            return _context.abrupt("return", response.json());

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  }

  function getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  } // ==================== CLIENTS API ====================


  function getClients() {
    var response;
    return regeneratorRuntime.async(function getClients$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/clients")));

          case 3:
            response = _context2.sent;
            _context2.next = 6;
            return regeneratorRuntime.awrap(handleResponse(response));

          case 6:
            return _context2.abrupt("return", _context2.sent);

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](0);
            console.error('Error fetching clients:', _context2.t0);
            throw _context2.t0;

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 9]]);
  }

  function getClient(id) {
    var response;
    return regeneratorRuntime.async(function getClient$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/clients/").concat(id)));

          case 3:
            response = _context3.sent;
            _context3.next = 6;
            return regeneratorRuntime.awrap(handleResponse(response));

          case 6:
            return _context3.abrupt("return", _context3.sent);

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            console.error('Error fetching client:', _context3.t0);
            throw _context3.t0;

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 9]]);
  }

  function addClient(client) {
    var newClient, response;
    return regeneratorRuntime.async(function addClient$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            newClient = _objectSpread({}, client, {
              id: Date.now().toString(),
              registeredAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            _context4.next = 4;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/clients"), {
              method: 'POST',
              headers: getHeaders(),
              body: JSON.stringify(newClient)
            }));

          case 4:
            response = _context4.sent;
            _context4.next = 7;
            return regeneratorRuntime.awrap(handleResponse(response));

          case 7:
            return _context4.abrupt("return", _context4.sent);

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            console.error('Error adding client:', _context4.t0);
            throw _context4.t0;

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 10]]);
  }

  function updateClient(id, client) {
    var response;
    return regeneratorRuntime.async(function updateClient$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/clients/").concat(id), {
              method: 'PUT',
              headers: getHeaders(),
              body: JSON.stringify(client)
            }));

          case 3:
            response = _context5.sent;
            _context5.next = 6;
            return regeneratorRuntime.awrap(handleResponse(response));

          case 6:
            return _context5.abrupt("return", _context5.sent);

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](0);
            console.error('Error updating client:', _context5.t0);
            throw _context5.t0;

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[0, 9]]);
  }

  function deleteClient(id) {
    var response;
    return regeneratorRuntime.async(function deleteClient$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/clients/").concat(id), {
              method: 'DELETE',
              headers: getHeaders()
            }));

          case 3:
            response = _context6.sent;

            if (response.ok) {
              _context6.next = 6;
              break;
            }

            throw new Error('Delete failed');

          case 6:
            return _context6.abrupt("return", true);

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](0);
            console.error('Error deleting client:', _context6.t0);
            throw _context6.t0;

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[0, 9]]);
  } // ==================== REQUESTS API ====================


  function getRequests() {
    var response;
    return regeneratorRuntime.async(function getRequests$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/requests")));

          case 3:
            response = _context7.sent;
            _context7.next = 6;
            return regeneratorRuntime.awrap(handleResponse(response));

          case 6:
            return _context7.abrupt("return", _context7.sent);

          case 9:
            _context7.prev = 9;
            _context7.t0 = _context7["catch"](0);
            console.error('Error fetching requests:', _context7.t0);
            throw _context7.t0;

          case 13:
          case "end":
            return _context7.stop();
        }
      }
    }, null, null, [[0, 9]]);
  }

  function getRequest(id) {
    var response;
    return regeneratorRuntime.async(function getRequest$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/requests/").concat(id)));

          case 3:
            response = _context8.sent;
            _context8.next = 6;
            return regeneratorRuntime.awrap(handleResponse(response));

          case 6:
            return _context8.abrupt("return", _context8.sent);

          case 9:
            _context8.prev = 9;
            _context8.t0 = _context8["catch"](0);
            console.error('Error fetching request:', _context8.t0);
            throw _context8.t0;

          case 13:
          case "end":
            return _context8.stop();
        }
      }
    }, null, null, [[0, 9]]);
  }

  function addRequest(request) {
    var newRequest, response;
    return regeneratorRuntime.async(function addRequest$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            newRequest = _objectSpread({}, request, {
              id: Date.now().toString(),
              createdAt: new Date().toISOString()
            });
            _context9.next = 4;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/requests"), {
              method: 'POST',
              headers: getHeaders(),
              body: JSON.stringify(newRequest)
            }));

          case 4:
            response = _context9.sent;
            _context9.next = 7;
            return regeneratorRuntime.awrap(handleResponse(response));

          case 7:
            return _context9.abrupt("return", _context9.sent);

          case 10:
            _context9.prev = 10;
            _context9.t0 = _context9["catch"](0);
            console.error('Error adding request:', _context9.t0);
            throw _context9.t0;

          case 14:
          case "end":
            return _context9.stop();
        }
      }
    }, null, null, [[0, 10]]);
  }

  function updateRequest(id, request) {
    var response;
    return regeneratorRuntime.async(function updateRequest$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _context10.next = 3;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/requests/").concat(id), {
              method: 'PUT',
              headers: getHeaders(),
              body: JSON.stringify(request)
            }));

          case 3:
            response = _context10.sent;
            _context10.next = 6;
            return regeneratorRuntime.awrap(handleResponse(response));

          case 6:
            return _context10.abrupt("return", _context10.sent);

          case 9:
            _context10.prev = 9;
            _context10.t0 = _context10["catch"](0);
            console.error('Error updating request:', _context10.t0);
            throw _context10.t0;

          case 13:
          case "end":
            return _context10.stop();
        }
      }
    }, null, null, [[0, 9]]);
  }

  function deleteRequest(id) {
    var response;
    return regeneratorRuntime.async(function deleteRequest$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/requests/").concat(id), {
              method: 'DELETE',
              headers: getHeaders()
            }));

          case 3:
            response = _context11.sent;

            if (response.ok) {
              _context11.next = 6;
              break;
            }

            throw new Error('Delete failed');

          case 6:
            return _context11.abrupt("return", true);

          case 9:
            _context11.prev = 9;
            _context11.t0 = _context11["catch"](0);
            console.error('Error deleting request:', _context11.t0);
            throw _context11.t0;

          case 13:
          case "end":
            return _context11.stop();
        }
      }
    }, null, null, [[0, 9]]);
  } // ==================== CARS API ====================


  function getCars() {
    var response;
    return regeneratorRuntime.async(function getCars$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            _context12.next = 3;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/cars")));

          case 3:
            response = _context12.sent;
            _context12.next = 6;
            return regeneratorRuntime.awrap(handleResponse(response));

          case 6:
            return _context12.abrupt("return", _context12.sent);

          case 9:
            _context12.prev = 9;
            _context12.t0 = _context12["catch"](0);
            console.error('Error fetching cars:', _context12.t0);
            throw _context12.t0;

          case 13:
          case "end":
            return _context12.stop();
        }
      }
    }, null, null, [[0, 9]]);
  }

  function getCar(id) {
    var response;
    return regeneratorRuntime.async(function getCar$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            _context13.next = 3;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/cars/").concat(id)));

          case 3:
            response = _context13.sent;
            _context13.next = 6;
            return regeneratorRuntime.awrap(handleResponse(response));

          case 6:
            return _context13.abrupt("return", _context13.sent);

          case 9:
            _context13.prev = 9;
            _context13.t0 = _context13["catch"](0);
            console.error('Error fetching car:', _context13.t0);
            throw _context13.t0;

          case 13:
          case "end":
            return _context13.stop();
        }
      }
    }, null, null, [[0, 9]]);
  }

  function addCar(car) {
    var newCar, response;
    return regeneratorRuntime.async(function addCar$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.prev = 0;
            newCar = _objectSpread({}, car, {
              id: Date.now().toString(),
              createdAt: new Date().toISOString()
            });
            _context14.next = 4;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/cars"), {
              method: 'POST',
              headers: getHeaders(),
              body: JSON.stringify(newCar)
            }));

          case 4:
            response = _context14.sent;
            _context14.next = 7;
            return regeneratorRuntime.awrap(handleResponse(response));

          case 7:
            return _context14.abrupt("return", _context14.sent);

          case 10:
            _context14.prev = 10;
            _context14.t0 = _context14["catch"](0);
            console.error('Error adding car:', _context14.t0);
            throw _context14.t0;

          case 14:
          case "end":
            return _context14.stop();
        }
      }
    }, null, null, [[0, 10]]);
  }

  function updateCar(id, car) {
    var response;
    return regeneratorRuntime.async(function updateCar$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.prev = 0;
            _context15.next = 3;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/cars/").concat(id), {
              method: 'PUT',
              headers: getHeaders(),
              body: JSON.stringify(car)
            }));

          case 3:
            response = _context15.sent;
            _context15.next = 6;
            return regeneratorRuntime.awrap(handleResponse(response));

          case 6:
            return _context15.abrupt("return", _context15.sent);

          case 9:
            _context15.prev = 9;
            _context15.t0 = _context15["catch"](0);
            console.error('Error updating car:', _context15.t0);
            throw _context15.t0;

          case 13:
          case "end":
            return _context15.stop();
        }
      }
    }, null, null, [[0, 9]]);
  }

  function deleteCar(id) {
    var response;
    return regeneratorRuntime.async(function deleteCar$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.prev = 0;
            _context16.next = 3;
            return regeneratorRuntime.awrap(fetch("".concat(BASE_URL, "/cars/").concat(id), {
              method: 'DELETE',
              headers: getHeaders()
            }));

          case 3:
            response = _context16.sent;

            if (response.ok) {
              _context16.next = 6;
              break;
            }

            throw new Error('Delete failed');

          case 6:
            return _context16.abrupt("return", true);

          case 9:
            _context16.prev = 9;
            _context16.t0 = _context16["catch"](0);
            console.error('Error deleting car:', _context16.t0);
            throw _context16.t0;

          case 13:
          case "end":
            return _context16.stop();
        }
      }
    }, null, null, [[0, 9]]);
  } // Public API


  return {
    getClients: getClients,
    getClient: getClient,
    addClient: addClient,
    updateClient: updateClient,
    deleteClient: deleteClient,
    getRequests: getRequests,
    getRequest: getRequest,
    addRequest: addRequest,
    updateRequest: updateRequest,
    deleteRequest: deleteRequest,
    getCars: getCars,
    getCar: getCar,
    addCar: addCar,
    updateCar: updateCar,
    deleteCar: deleteCar
  };
}(); // Make API globally available


window.API = API;
//# sourceMappingURL=api.dev.js.map
