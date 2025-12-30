const API_URL = "https://and.ruangotp.site";

const modal = document.getElementById('authModal');
const tabButtons = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.auth-form');

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
    else if(tabName === 'update') {
        document.querySelector('button[onclick="switchTab(\'update\')"]').classList.add('active');
        document.getElementById('form-update').classList.add('active-form');
    }
}

// --- BAGIAN LOGIN (TIDAK BERUBAH) ---
const loginForm = document.getElementById('form-login');

if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 

        const emailInput = loginForm.querySelector('input[type="email"]').value;
        const passwordInput = loginForm.querySelector('input[type="password"]').value;
        const btnSubmit = loginForm.querySelector('.btn-submit');
        const originalText = btnSubmit.innerText;

        btnSubmit.innerText = "MENGHUBUNGKAN...";
        btnSubmit.disabled = true;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput, password: passwordInput })
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert("Login Berhasil! Mengalihkan ke Dashboard...");
                window.location.href = result.redirectUrl;
            } else {
                alert("Gagal: " + result.message);
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

// --- BAGIAN REGISTER (DENGAN ANTI-SPAM RECAPTCHA) ---
const registerForm = document.getElementById('form-register');

if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 1. Ambil Data Input
        const inputs = registerForm.querySelectorAll('input');
        const nameInput = inputs[0].value;
        const emailInput = inputs[1].value;
        const passwordInput = inputs[2].value;
        
        // 2. AMBIL TOKEN CAPTCHA (BARU)
        // grecaptcha adalah fungsi bawaan Google
        const recaptchaResponse = grecaptcha.getResponse();

        // 3. Cek: Kalau belum dicentang, tolak!
        if (recaptchaResponse.length === 0) {
            alert("❌ Harap centang 'Saya bukan robot' terlebih dahulu!");
            return; // Berhenti di sini
        }

        const btnSubmit = registerForm.querySelector('.btn-submit');
        const originalText = btnSubmit.innerText;

        btnSubmit.innerText = "MENDAFTAR...";
        btnSubmit.disabled = true;

        try {
            // 4. Kirim Data + Token Captcha ke Server
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: nameInput, 
                    email: emailInput, 
                    password: passwordInput,
                    recaptchaToken: recaptchaResponse // Ini kuncinya
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert("✅ Pendaftaran Berhasil! Silakan Login.");
                switchTab('login');
                
                // Reset Captcha biar bersih
                grecaptcha.reset(); 
                
                if(loginForm.querySelector('input[type="email"]')) {
                    loginForm.querySelector('input[type="email"]').value = emailInput;
                }
            } else {
                alert("❌ Gagal Daftar: " + result.message);
                // Reset Captcha jika gagal, biar user bisa coba lagi tanpa refresh
                grecaptcha.reset();
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
