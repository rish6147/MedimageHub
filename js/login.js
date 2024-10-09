const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

// Toggle the forms for Sign In/Sign Up
registerBtn.addEventListener("click", () => {
    container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
});

// Handle login functionality
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
            // Optionally, redirect to a dashboard or homepage after login
            window.location.href = '/dashboard.html';
        } else {
            alert(data.message); // Display error message if login fails
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong during login.');
    }
});

// Handle signup functionality
document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const uniqueId = e.target.uniqueId.value; // Unique ID field for signup

    try {
        const res = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, uniqueId }), // Include uniqueId in the body
        });

        const data = await res.json();
        if (res.ok) {
            console.log('Token:', data.token);
            // Redirect to success loader or any other post-registration page
            window.location.href = '../pages/loader.html';
        } else {
            alert(data.message); // Display error message if signup fails
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong during registration.');
    }
});
