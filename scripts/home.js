// Fetch the JSON file from the assets folder
fetch('https://portfolio-project-images-yash.s3.ap-south-1.amazonaws.com/movies_json.json')
  .then(response => response.json()) // Parse the JSON response
  .then(movieDataset => {
    console.log(movieDataset); // Log the movie dataset to check the data

    // Function to filter movies based on user input
    function filterMovies(query) {
      return movieDataset.filter((movie) => movie.title.toLowerCase().startsWith(query.toLowerCase()));
    }

    // Autocomplete functionality for search bar
    const searchBar = document.getElementById("movie-search");
    const searchDropdown = document.getElementById("search-dropdown");

    searchBar.addEventListener("input", () => {
      const query = searchBar.value.trim();
      searchDropdown.innerHTML = ""; // Clear the dropdown
      if (query) {
        const filteredMovies = filterMovies(query);
        filteredMovies.forEach((movie) => {
          const movieOption = document.createElement("p");
          movieOption.textContent = movie.title;
          movieOption.addEventListener("click", () => {
            alert(`You selected: ${movie.title}`);
            searchBar.value = movie.title;
            searchDropdown.style.display = "none"; // Hide the dropdown after selection
          });
          searchDropdown.appendChild(movieOption);
        });
        searchDropdown.style.display = "block"; // Show the dropdown
      } else {
        searchDropdown.style.display = "none"; // Hide the dropdown if query is empty
      }
    });

    // Function to display movies in the grid based on selected genres
    const genres = ["Action", "Drama", "Animation", "Fantasy", "Romance"]; // Replace with the user's selected genres
    const movieGrid = document.getElementById("movie-grid");

    // Function to display recommended movies
    function displayRecommendedMovies() {
      const filteredMovies = movieDataset.filter((movie) => genres.includes(movie.genre));
      movieGrid.innerHTML = ""; // Clear previous content in the grid
      filteredMovies.forEach((movie) => {
        const movieTile = document.createElement("div");
        movieTile.classList.add("movie-tile");
        movieTile.innerHTML = `
          <img src="${movie.img}" alt="${movie.title}">
          <p>${movie.title}</p>
        `;
        movieGrid.appendChild(movieTile); // Add the movie tile to the grid
      });
    }

    // Initialize recommended movies when page loads
    displayRecommendedMovies();
  })
  .catch(error => console.error("Error fetching the file:", error));
