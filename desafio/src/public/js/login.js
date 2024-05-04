const form = document.getElementById('loginForm');

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const obj = {};

    formData.forEach((value, key) => {
        obj[key] = value;
    });

    try {
        const response = await fetch('/api/sessions/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        });
    
        if (response.ok) {
            const data = await response.json();
            console.log(data);
    
            if (data.redirect) {
                window.location.replace(data.redirect);  
            }
        } else {
            console.log('Error en la solicitud:', response.status);
            alert('Inicio de sesión fallido. Verifica tus credenciales.');
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de red. Inténtalo de nuevo más tarde.');
    }
});
