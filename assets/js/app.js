const API_URL = "https://and.ruangotp.site";

const modal = document.getElementById('authModal');
const tabButtons = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.auth-form');

// --- THEME SWITCHER LOGIC (BARU) ---
const themeMenu = document.getElementById('theme-menu');
const themeIcon = document.getElementById('theme-icon-active');

function toggleThemeMenu() {
    themeMenu.classList.toggle('active');
}

// Tutup menu tema jika klik di luar
window.addEventListener('click', function(e) {
    if (!e.target.closest('.theme-dropdown')) {
        themeMenu.classList.remove('active');
    }
});

function setTheme(theme) {
    const html = document.documentElement;
    
    // Simpan pilihan ke memori browser
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeIcon.className = 'ph ph-moon'; // Ikon Bulan
    } else if (theme === 'light') {
        html.removeAttribute('data-theme');
        themeIcon.className = 'ph ph-sun'; // Ikon Matahari
    } else if (theme === 'system') {
        // Cek settingan komputer user
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            html.setAttribute('data-theme', 'dark');
            themeIcon.className = 'ph ph-desktop'; // Ikon Komputer
        } else {
            html.removeAttribute('data-theme');
            themeIcon.className = 'ph ph-desktop';
        }
    }
    
    // Tutup menu setelah memilih
    themeMenu.classList.remove('active');
}

// Cek tema saat pertama kali buka web
(function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
})();


// --- MODAL & FORM LOGIC (SAMA SEPERTI SEBELUMNYA) ---

function openModal() {
    modal.classList.add('show');
}

function closeModal() {
    modal.classList.remove('show');
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

function switchTab(tabName) {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    forms.forEach(form => form.classList.remove('active-form'));

    if(tabName === 'login') {
        document.querySelector('button[onclick="switchTab(\'login\')"]').classList.add('active');
        document.getElementById('form-login').classList.add('active-form');
    } 
    else if(tabName === 'register') {
        document.querySelector('button[onclick="switchTab(\'register\')"]').classList.add('active');
        document.getElementById('form-register').classList.add('active-form');
    }
}

// LOGIN LOGIC
const loginForm = document.getElementById('form-login');

if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 

        const emailInput = loginForm.querySelector('input[type="email"]').value;
        const passwordInput = loginForm.querySelector('input[type="password"]').value;
        
        // Captcha Index 0 (Login)
        const recaptchaResponse = grecaptcha.getResponse(0);

        if (recaptchaResponse.length === 0) {
            alert("⚠️ Harap centang 'Saya bukan robot' di form Login!");
            return;
        }

        const btnSubmit = loginForm.querySelector('.btn-submit');
        const originalText = btnSubmit.innerText;

        btnSubmit.innerText = "MENGHUBUNGKAN...";
        btnSubmit.disabled = true;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: emailInput, 
                    password: passwordInput,
                    recaptchaToken: recaptchaResponse 
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert("Login Berhasil! Mengalihkan ke Dashboard...");
                window.location.href = result.redirectUrl;
            } else {
                alert("Gagal: " + result.message);
                grecaptcha.reset(0);
            }
        } catch (error) {
            console.error(error);
            alert("Gagal terhubung ke server Backend.");
        } finally {
            btnSubmit.innerText = originalText;
            btnSubmit.disabled = false;
        }
    });
}

// REGISTER LOGIC
const registerForm = document.getElementById('form-register');

if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const inputs = registerForm.querySelectorAll('input');
        const nameInput = inputs[0].value;
        const emailInput = inputs[1].value;
        const passwordInput = inputs[2].value;
        
        // Captcha Index 1 (Register)
        const recaptchaResponse = grecaptcha.getResponse(1);

        if (recaptchaResponse.length === 0) {
            alert("⚠️ Harap centang 'Saya bukan robot' di form Register!");
            return;
        }

        const btnSubmit = registerForm.querySelector('.btn-submit');
        const originalText = btnSubmit.innerText;

        btnSubmit.innerText = "MENDAFTAR...";
        btnSubmit.disabled = true;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: nameInput, 
                    email: emailInput, 
                    password: passwordInput,
                    recaptchaToken: recaptchaResponse
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert("✅ Pendaftaran Berhasil! Silakan Login.");
                switchTab('login');
                grecaptcha.reset(1); 
                if(loginForm.querySelector('input[type="email"]')) {
                    loginForm.querySelector('input[type="email"]').value = emailInput;
                }
            } else {
                alert("❌ Gagal Daftar: " + result.message);
                grecaptcha.reset(1);
            }

        } catch (error) {
            console.error(error);
            alert("Gagal terhubung ke server Backend.");
        } finally {
            btnSubmit.innerText = originalText;
            btnSubmit.disabled = false;
        }
    });
}
