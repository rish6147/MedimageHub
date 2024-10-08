const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
});

// Handle login
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        const res = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            alert('Login Successful!');
            console.log('Token:', data.token);
            window.location.href = '../dashboard/dashboard.html'; // Redirect to dashboard
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
    }
});

// Handle signup
document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = e.target.role.value;

    try {
        const res = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role }),
        });

        const data = await res.json();
        if (res.ok) {
            window.location.href = 'loader.html'; // Redirect to loader page
            console.log('Token:', data.token);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
    }
});
