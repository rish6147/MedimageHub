document.addEventListener("DOMContentLoaded", function() {
    // Simulate registration process
    setTimeout(showSuccessScreen, 1000); // Change this timeout to match your actual registration time
});

function showSuccessScreen() {
    document.getElementById("loader-container").classList.add("hidden");
    document.getElementById("success-container").classList.remove("hidden");
}

function proceed() {
    window.location.href = 'login.html'; 
}
