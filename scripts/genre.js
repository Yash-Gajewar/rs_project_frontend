const username = document.getElementById('username');

username.innerHTML = localStorage.getItem('username');


// Data for genres
const genres = [
    { id: 1, name: "Action", image: "./assets/action.jpg" },
    { id: 2, name: "Adventure", image: "./assets/adventure.jpg" },
    { id: 3, name: "Animation", image: "./assets/animation.jpg" },
    { id: 4, name: "Children", image: "./assets/children.jpg" },
    { id: 5, name: "Comedy", image: "./assets/comedy.jpg" },
    { id: 6, name: "Crime", image: "./assets/crime.jpg" },
    { id: 7, name: "Documentary", image: "./assets/documentary.jpg" },
    { id: 8, name: "Drama", image: "./assets/drama.jpg" },
    { id: 9, name: "Fantasy", image: "./assets/fantasy.jpg" },
    { id: 11, name: "Horror", image: "./assets/horror.jpg" },
    { id: 12, name: "IMAX", image: "./assets/imax.jpg" },
    { id: 13, name: "Musical", image: "./assets/musical.jpg" },
    { id: 14, name: "Mystery", image: "./assets/mystery.jpg" },
    { id: 15, name: "Romance", image: "./assets/romance.jpg" },
    { id: 16, name: "Sci-Fi", image: "./assets/sci-fi.jpg" },
    { id: 17, name: "Thriller", image: "./assets/thriller.jpg" },
    { id: 18, name: "War", image: "./assets/war.jpeg" },
    { id: 19, name: "Western", image: "./assets/western.jpg" }
];

// Initialize selected genres
let selectedGenres = [];

// Render genres dynamically
const genreGrid = document.getElementById("genreGrid");
genres.forEach(genre => {
    const tile = document.createElement("div");
    tile.className = "genre-tile";
    tile.dataset.id = genre.id;

    tile.innerHTML = `
        <img src="${genre.image}" alt="${genre.name}">
        <p>${genre.name}</p>
    `;

    tile.addEventListener("click", () => toggleGenreSelection(tile, genre.name)); // Changed id to name
    genreGrid.appendChild(tile);
});

// Toggle genre selection
function toggleGenreSelection(tile, name) {
    if (selectedGenres.includes(name)) {
        selectedGenres = selectedGenres.filter(genreName => genreName !== name); // Filter by name
        tile.classList.remove("selected");
    } else if (selectedGenres.length < 5) {
        selectedGenres.push(name); // Store genre name instead of id
        tile.classList.add("selected");
    }

    // Enable or disable the start button
    const startButton = document.getElementById("startButton");
    startButton.disabled = selectedGenres.length < 5;
}

// Start button functionality
document.getElementById("startButton").addEventListener("click", () => {    
    // Add functionality to navigate or save preferences
    window.location.href = "home.html";
});


document.getElementById("startButton").addEventListener("click", () => {
    if (selectedGenres.length < 3) {
        alert("Please select at least 5 genres.");
        return;
    }
});


function handleSubmit() {

    localStorage.setItem('genre', selectedGenres)

    if (selectedGenres.length < 5) {
        alert("Please select at least 5 genres.");
        return;
    }

    const email = localStorage.getItem('email') // Replace with the actual user's email
    const inputData = {
        genre: selectedGenres, // Only genres go in the body
    };

    // Construct the URL with the email as a query parameter
    const url = `http://127.0.0.1:8000/api/user/genre?email=${encodeURIComponent(email)}`;

    // Make an AJAX request
    $.ajax({
        url: url, // Send email in query string
        type: "POST",
        data: JSON.stringify(inputData), // Send genres in the body
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            window.location.href = "home.html";
        },
        error: function (xhr, status, error) {
            const errorMessage = xhr.responseJSON?.detail || "Unknown error occurred.";
            alert("Error saving genres: " + errorMessage);
        },
    });
}
