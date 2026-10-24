document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inputEmail = document.getElementById('input-email');
    const inputPassword = document.getElementById('input-password');
    const errorEmail = document.getElementById('error-email');
    const errorPassword = document.getElementById('error-password');
    
    inputEmail.classList.remove('input-error');
    inputPassword.classList.remove('input-error');
    errorEmail.style.display = 'none';
    errorPassword.style.display = 'none';
    
    let esValido = true;
    
    const emailValor = inputEmail.value.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailValor === '' || !emailRegex.test(emailValor)) {
        inputEmail.classList.add('input-error');
        errorEmail.style.display = 'block';
        errorEmail.innerText = 'Debes ingresar un correo electrónico válido.';
        esValido = false;
    }
    const passwordValor = inputPassword.value.trim();

    if (passwordValor.length < 8 || passwordValor.length > 16) {
        inputPassword.classList.add('input-error');
        errorPassword.style.display = 'block';
        errorPassword.innerText = 'La contraseña debe tener entre 8 y 16 caracteres.';
        esValido = false;
    }
    
    if (esValido) {
        sessionStorage.setItem('usuarioLogueado', 'true');
        window.location.href = 'index.html'; 
    }
});