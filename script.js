function initializeApp() {
    // Memuat akun yang tersimpan dari localStorage saat inisialisasi
    loadAccounts();

    // Tampilkan input custom category jika "Lainnya" dipilih
    document.getElementById('account-category').addEventListener('change', function () {
        const customCategoryInput = document.getElementById('custom-category');
        if (this.value === 'Other') {
            customCategoryInput.classList.remove('d-none');
            customCategoryInput.required = true;
        } else {
            customCategoryInput.classList.add('d-none');
            customCategoryInput.required = false;
        }
    });
}

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "admin" && password === "ptr1") {
        document.getElementById('login-container').classList.add('d-none');
        document.getElementById('account-container').classList.remove('d-none');
        loadAccounts();
    } else {
        document.getElementById('login-error').classList.remove('d-none');
    }
});

document.getElementById('account-form').addEventListener('submit', function (e) {
    e.preventDefault();

    let category = document.getElementById('account-category').value;
    if (category === 'Other') {
        category = document.getElementById('custom-category').value || 'Lainnya';
    }

    const accountUsername = document.getElementById('account-username').value;
    const accountPassword = document.getElementById('account-password').value;

    const encryptedPassword = btoa(accountPassword); // Enkripsi sederhana dengan Base64

    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    accounts.push({ category, username: accountUsername, password: encryptedPassword });
    localStorage.setItem('accounts', JSON.stringify(accounts));

    document.getElementById('account-form').reset();
    loadAccounts();
});

document.querySelectorAll('.toggle-visibility').forEach(button => {
    button.addEventListener('click', function () {
        const inputField = this.previousElementSibling;
        const icon = this.querySelector('i');
        if (inputField.type === "password") {
            inputField.type = "text";
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            inputField.type = "password";
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

document.getElementById('dark-mode-toggle').addEventListener('change', function () {
    document.body.classList.toggle('dark-mode', this.checked);
});

document.getElementById('search-button').addEventListener('click', function () {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const accounts = document.querySelectorAll('#account-list .card');
    accounts.forEach(account => {
        const name = account.querySelector('.card-title').textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            account.style.display = 'block';
        } else {
            account.style.display = 'none';
        }
    });
});

function loadAccounts() {
    const accountList = document.getElementById('account-list');
    accountList.innerHTML = '';

    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    accounts.forEach((account, index) => {
        const accountCard = document.createElement('div');
        accountCard.className = 'card shadow-sm';
        accountCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${account.category}</h5>
                <p class="card-text">Username: <span class="text-value">${account.username}</span> <i class="fa fa-eye toggle-password" onclick="toggleTextVisibility(this)"></i></p>
                <p class="card-text">Password: <span class="text-value">${atob(account.password)}</span> <i class="fa fa-eye toggle-password" onclick="toggleTextVisibility(this)"></i></p>
                <span class="delete-account-btn" onclick="deleteAccount(${index})">&times;</span>
            </div>
        `;
        accountList.appendChild(accountCard);
    });
}

function toggleTextVisibility(iconElement) {
    const textValue = iconElement.previousElementSibling;
    if (textValue.tagName === "SPAN") {
        const originalText = textValue.textContent;
        if (textValue.classList.contains('password-hidden')) {
            textValue.textContent = textValue.getAttribute('data-original-text');
            textValue.classList.remove('password-hidden');
            iconElement.classList.remove('fa-eye-slash');
            iconElement.classList.add('fa-eye');
        } else {
            textValue.setAttribute('data-original-text', originalText);
            textValue.textContent = '*'.repeat(originalText.length);
            textValue.classList.add('password-hidden');
            iconElement.classList.remove('fa-eye');
            iconElement.classList.add('fa-eye-slash');
        }
    }
}

function deleteAccount(index) {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    accounts.splice(index, 1);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    loadAccounts();
}

// Inisialisasi aplikasi saat halaman dimuat
window.onload = initializeApp;
