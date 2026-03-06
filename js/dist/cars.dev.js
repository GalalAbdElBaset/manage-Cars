"use strict";

// ================= CARS MODULE =================
function loadCars() {
  fetch("".concat(API_URL, "/cars")).then(function (r) {
    return r.json();
  }).then(showCars)["catch"](function () {
    return showToast('Error loading cars', 'error');
  });
}

function showCars(cars) {
  var container = document.querySelector('[data-screen="cars-list"] .content');
  if (!container) return;
  container.innerHTML = '';

  if (!cars.length) {
    container.innerHTML = "<p>No cars available</p>";
    return;
  }

  cars.forEach(function (car) {
    var div = document.createElement('div');
    div.className = 'car-item';
    div.innerHTML = "\n            <b>".concat(car.brand, "</b> ").concat(car.model, " - ").concat(car.price, " EGP\n            <button data-delete=\"").concat(car.id, "\">Delete</button>\n        ");
    container.appendChild(div);
  });
  setupCarEvents();
}

function setupCarEvents() {
  document.querySelectorAll('[data-delete]').forEach(function (btn) {
    btn.onclick = function () {
      return deleteCar(btn.dataset["delete"]);
    };
  });
}

function deleteCar(id) {
  fetch("".concat(API_URL, "/cars/").concat(id), {
    method: 'DELETE'
  }).then(function () {
    showToast('Car deleted', 'success');
    loadCars();
  });
}

function addCar() {
  var brand = document.getElementById('add-car-brand').value.trim();
  var model = document.getElementById('add-car-model').value.trim();
  var price = document.getElementById('add-car-price').value.trim();

  if (!brand || !model || !price) {
    showToast('Please fill all fields', 'error');
    return;
  }

  fetch("".concat(API_URL, "/cars"), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      brand: brand,
      model: model,
      price: price
    })
  }).then(function () {
    showToast('Car added successfully', 'success');
    loadCars();
    showScreen('cars-list');
  });
}

function initCarsModule() {
  var saveBtn = document.getElementById('save-car');
  if (saveBtn) saveBtn.onclick = addCar;
} // init when DOM ready


document.addEventListener('DOMContentLoaded', initCarsModule); // expose globally if needed

window.loadCars = loadCars;
//# sourceMappingURL=cars.dev.js.map
