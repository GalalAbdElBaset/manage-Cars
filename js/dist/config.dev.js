"use strict";

function getLocalData(key) {
  var data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setLocalData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function initializeLocalStorage() {
  if (!localStorage.getItem('cars')) {
    setLocalData('cars', []);
  }

  if (!localStorage.getItem('clients')) {
    setLocalData('clients', []);
  }

  if (!localStorage.getItem('requests')) {
    setLocalData('requests', []);
  }
}

initializeLocalStorage();
//# sourceMappingURL=config.dev.js.map
