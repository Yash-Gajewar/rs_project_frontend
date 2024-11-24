// Add your API endpoint here
// var API_ENDPOINT = "https://kglp45qha6.execute-api.ap-south-1.amazonaws.com/post-rs-users";

// AJAX POST request for registrati``on
function handleRegister(event) {

    
    event.preventDefault(); // Prevent the default form submission
    
    localStorage.setItem("email", $('#email').val());
    localStorage.setItem("username", $('#username').val());
    
    // Gather the form input data
    var inputData = {
        "email": $('#email').val(),
        "username": $('#username').val(),
        "password": $('#password').val()
    };

    // Make AJAX request
    $.ajax({
        url: 'http://127.0.0.1:8000/api/user/createuser',
        type: 'POST',
        data: JSON.stringify(inputData),
        contentType: 'application/json; charset=utf-8',
        success: function(response) {
            var responseData = JSON.parse(response.body); // Parse the response body

            // If registration is successful, redirect to home.html
            if (response.statusCode === 200) {
                alert("Registration successful!"); 
                window.location.href = "genre.html"; 
            } else {
                // If registration fails, show an alert with the reason
                alert("Registration failed: " + responseData.reason);
            }
        },
        error: function() {
            alert("Error during registration.");
        }
    });

    return false; // Prevent the default form submission
}
