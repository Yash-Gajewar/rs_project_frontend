// Data for genres
const genres = [
    { id: 1, name: "Action", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/action.jpg" },
    { id: 2, name: "Adventure", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/adventure.jpg" },
    { id: 3, name: "Animation", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/animation.jpg" },
    { id: 4, name: "Children", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/children.jpg" },
    { id: 5, name: "Comedy", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/comedy.jpg" },
    { id: 6, name: "Crime", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/crime.jpg" },
    { id: 7, name: "Documentary", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/documentary.jpg" },
    { id: 8, name: "Drama", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/drama.jpg" },
    { id: 9, name: "Fantasy", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/fantasy.jpg" },
    { id: 11, name: "Horror", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/horror.jpg" },
    { id: 12, name: "IMAX", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/imax.jpg" },
    { id: 13, name: "Musical", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/musical.jpg" },
    { id: 14, name: "Mystery", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/mystery.jpg" },
    { id: 15, name: "Romance", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/romance.jpg" },
    { id: 16, name: "Sci-Fi", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/sci-fi.jpg" },
    { id: 17, name: "Thriller", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/thriller.jpg" },
    { id: 18, name: "War", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/war.jpeg" },
    { id: 19, name: "Western", image: "D:/MLTG/Sem 7/RS/Movie Recommendation System/rs_project_frontend/assets/western.jpg" }
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

    tile.addEventListener("click", () => toggleGenreSelection(tile, genre.id));
    genreGrid.appendChild(tile);
});

// Toggle genre selection
function toggleGenreSelection(tile, id) {
    if (selectedGenres.includes(id)) {
        selectedGenres = selectedGenres.filter(genreId => genreId !== id);
        tile.classList.remove("selected");
    } else if (selectedGenres.length < 5) {
        selectedGenres.push(id);
        tile.classList.add("selected");
    }

    // Enable or disable the start button
    const startButton = document.getElementById("startButton");
    startButton.disabled = selectedGenres.length < 5;
}

// Start button functionality
document.getElementById("startButton").addEventListener("click", () => {
    alert(`Genres selected: ${selectedGenres.join(", ")}`);
    
    // Add functionality to navigate or save preferences
    window.location.href = "home.html";
});
