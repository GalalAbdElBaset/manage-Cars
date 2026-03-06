// ==================== MAIN APP ====================
// ====== grab all the screens and buttons ======
let screens = document.querySelectorAll('.screen');
let tabs = document.querySelectorAll('.bottom-nav button');
let fab = document.querySelector('.fab');
let toggleMood = document.querySelector('.Mood');

// ===== check theme =====
let currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.body.classList.add('dark');
    if (toggleMood) {
        toggleMood.innerHTML = '<i class="fa-solid fa-moon"></i>';
        toggleMood.style.background = '#a5a2a2';
        toggleMood.style.color = '#111';
    }
} else {
    if (toggleMood) {
        toggleMood.innerHTML = '<i class="fa-solid fa-sun"></i>';
        toggleMood.style.background = '#2563eb';
        toggleMood.style.color = '#fff';
    }
}

// ===== mood toggle click =====
if (toggleMood) {
    toggleMood.onclick = function() {
        if (document.body.classList.contains('dark')) {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            toggleMood.innerHTML = '<i class="fa-solid fa-sun"></i>';
            toggleMood.style.background = '#2563eb';
            toggleMood.style.color = '#fff';
        } else {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            toggleMood.innerHTML = '<i class="fa-solid fa-moon"></i>';
            toggleMood.style.background = '#a5a2a2';
            toggleMood.style.color = '#111';
        }
    };
}

// ===== toast system =====
function showToast(message, type, duration) {
    type = type || 'info';
    duration = duration || 5000;

    let toast = document.getElementById('toast');
    if (!toast) return;

    let icons = {
        success: 'fa-circle-check',
        error: 'fa-circle-xmark',
        info: 'fa-circle-info'
    };

    toast.className = ''; 
    toast.classList.add('show', type);

    toast.innerHTML = `
        <div class="toast-body">
            <i class="fa-solid ${icons[type]} toast-icon"></i>
            <span>${message}</span>
        </div>
        <div class="toast-progress">
            <div class="toast-progress-bar"></div>
        </div>
    `;

    let bar = toast.querySelector('.toast-progress-bar');
    if (bar) {
        bar.style.animationDuration = duration + 'ms';
    }

    setTimeout(function() {
        toast.classList.remove('show');
    }, duration);
}

//  screen handling 
function hideAllScreens() {
    screens.forEach(function(s) {
        s.classList.remove('active');
    });
}

function showScreen(screenName) {
    hideAllScreens();

    let screen = document.querySelector('[data-screen="' + screenName + '"]');
    if (screen) screen.classList.add('active');

    tabs.forEach(function(btn) {
        if (btn.dataset.go === screenName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (!fab) return;
    fab.style.display = 'none';

    if (screenName === 'clients-list') {
        fab.style.display = 'flex';
        fab.dataset.go = 'add-client';
        if (typeof loadClients === 'function') {
            loadClients(); 
        }
    } else if (screenName === 'requests-list') {
        fab.style.display = 'flex';
        fab.dataset.go = 'add-request';
        if (typeof loadRequests === 'function') {
            loadRequests(); 
        }
    } else if (screenName === 'add-request') {
        if (typeof loadClientsForRequest === 'function') {
            loadClientsForRequest();   
        }
    } else if (screenName === 'cars-list') {
        fab.style.display = 'flex';
        fab.dataset.go = 'add-car';
        if (typeof loadCars === 'function') {
            loadCars();
        }
    } else if (screenName === 'add-car') {
        if (typeof setupAddCarForm === 'function') {
            setTimeout(() => {
                setupAddCarForm();
            }, 100);
        }
    } else if (screenName === 'search') {
        if (typeof initSearchModule === 'function') {
            setTimeout(() => {
                window.SearchModule.init();
            }, 100);
        }
    }
}

//  global click listener 
document.addEventListener('click', function(e) {
    if (e.target.closest('button')) {
        e.preventDefault();
    }
    
    let navBtn = e.target.closest('[data-go]');
    if (navBtn) {
        let target = navBtn.dataset.go;
        showScreen(target);
        return;
    }

    if (e.target.closest('.fab')) {
        let target = e.target.closest('.fab').dataset.go;
        if (target) {
            showScreen(target);
        }
        return;
    }
});

document.addEventListener('submit', function(e) {
    e.preventDefault();
    return false;
});

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (e.target.tagName === 'INPUT' && e.target.closest('form')) {
            e.preventDefault();
        }
    }
});

//  first load 
showScreen('clients-list');

if (typeof loadClients === 'undefined') {
    window.loadClients = function() {
        console.log('loadClients function not defined');
    };
}

if (typeof loadRequests === 'undefined') {
    window.loadRequests = function() {
        console.log('loadRequests function not defined');
    };
}

if (typeof loadClientsForRequest === 'undefined') {
    window.loadClientsForRequest = function() {
        console.log('loadClientsForRequest function not defined');
    };
}