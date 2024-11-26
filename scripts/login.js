// AJAX POST request for login
document.getElementById("loginForm").onsubmit = function(event) {
    event.preventDefault(); // Prevent the default form submission

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    // Make AJAX request
    $.ajax({
        url: `http://localhost:8000/api/user/userexists?username=${username}&password=${password}`,
        type: 'GET',
        contentType: 'application/json',
        success: function(response) {
            console.log(response)
            
            // If login is successful, redirect to home.html
            if (response) {
                window.location.href = "home.html";
            } else {
                // If login fails, show an alert with the reason
                alert("Invalid username or password.");
            }
        },
        error: function() {
            alert("Error during login.");
        }
    });

    return false;
};
