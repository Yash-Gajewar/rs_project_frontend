// Get references to the DOM elements
const searchBar = document.getElementById('searchBar');
const suggestionsBox = document.getElementById('suggestionsBox');
const movieGrid = document.getElementById('movie-grid');


const username = document.getElementById('username');
username.innerHTML = localStorage.getItem('username');

// Initialize an empty array for the movie dataset
let movieDataset = [];

// Fetch the JSON file from the assets folder
fetch('./movies_json.json') // Adjust the path to the actual location of your JSON file
  .then(response => response.json()) // Parse the JSON response
  .then(data => {
    movieDataset = data; // Store the fetched movie data
    // console.log('Movie Dataset Loaded:', movieDataset); // Log to verify data
  })
  .catch(error => console.error('Error fetching movie data:', error)); // Handle errors

// Event listener for search bar input
searchBar.addEventListener('input', () => {
  const query = searchBar.value.toLowerCase(); // Convert input to lowercase for case-insensitive matching

  // Filter movies based on the input query
  const suggestions = movieDataset.filter(movie => {
    return (
      typeof movie.original_title === 'string' &&
      movie.original_title.toLowerCase().includes(query) // Match movies by title
    );
  });

  // Clear the suggestions box
  suggestionsBox.innerHTML = '';

  // Populate suggestions if matches are found
  if (query && suggestions.length) {
    suggestions.forEach(movie => {
      const suggestionItem = document.createElement('div');
      suggestionItem.classList.add('suggestion-item');
      suggestionItem.textContent = movie.original_title;

      // Add click event to select suggestion
      suggestionItem.addEventListener('click', () => {
        searchBar.value = movie.original_title; // Set the selected movie name in the search bar
        console.log('Selected Movie:', movie.original_title); // Log the selected movie

        const selectedMovieDetails = fetch(`http://localhost:8000/api/recommend_movie/get_movie_details?movie_name=${movie.original_title}`)
        
        console.log("Selected Movie Details:", selectedMovieDetails);

        localStorage.setItem('selected-movie', selectedMovieDetails); // Store the selected movie in local storage

        window.location.href = 'selected-movie.html'; // Redirect to the selected movie page

        suggestionsBox.innerHTML = ''; // Clear the suggestions box
      });

      suggestionsBox.appendChild(suggestionItem); // Add suggestion to the box
    });
  }
});

// Hide suggestions box when clicking outside
document.addEventListener('click', e => {
  if (!searchBar.contains(e.target) && !suggestionsBox.contains(e.target)) {
    suggestionsBox.innerHTML = ''; // Clear suggestions when clicking outside
  }
});



async function fetchUserRatings() {
  try {
      const username = localStorage.getItem('username') || document.getElementById('username').textContent.trim();
      const url = `http://localhost:8000/api/user/get_ratings?username=${username}`;
      const response = await fetch(url);

      if (!response.ok) {
          throw new Error(`Failed to fetch ratings for user ${username}`);
      }

      const responseData = await response.json();
      console.log("User Ratings:", responseData);

      // Calculate the number of key-value pairs
      const numberOfPairs = Object.keys(responseData).length;
      console.log(`Number of key-value pairs in responseData: ${numberOfPairs}`);

      return numberOfPairs;
  } catch (error) {
      console.error('Error fetching user ratings:', error);
      return null;
  }
}


async function fetchMovieDetails(movieId) {

  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=83b44cdf02bdd95a7c2fa4ab67514e6a&language=en-US`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch details for movie ID ${movieId}`);
    }
    var responseData = await response.json();

    return {
      posterPath: `https://image.tmdb.org/t/p/w500/${responseData.poster_path || ''}`,
      title: responseData.original_title || 'No title available',
      overview: responseData.overview || 'No overview available',
      tagline: responseData.tagline || '',
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}



async function renderMovieCards(data) {

  console.log("Top 5 highly rated movies:", data)

  const numberOfRatings = await fetchUserRatings();

  if (numberOfRatings >= 5) {
    try {
        // Fetch collaborative recommendation
        const response = await fetch(`http://localhost:8000/api/recommend_movie/collaborative_based?username=${localStorage.getItem('username')}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const collaborative_recommendation = await response.json();

        console.log("Collaborative Recommendation:", collaborative_recommendation);

        data = data.concat(collaborative_recommendation);
        
    } catch (error) {
        console.error("Error fetching collaborative recommendations:", error);
    }
}

  movieGrid.innerHTML = ''; // Clear previous movie cards
  const addedMovies = new Set(); // Track added movies by their IDs

  for (const genre of Object.keys(data)) {
    for (const movie of data) {
      // Skip duplicates
      if (addedMovies.has(movie.id)) {
        continue;
      }

      // Mark movie as added
      addedMovies.add(movie.id);

      // Fetch movie details
      const movieDetails = await fetchMovieDetails(movie.id);

      if (!movieDetails) {
        continue; // Skip if movie details couldn't be fetched
      }

      // Create movie card
      const movieTile = document.createElement('div');
      movieTile.classList.add('movie-tile');

      // Add movie image
      const movieImg = document.createElement('img');
      movieImg.src = movieDetails.posterPath || 'https://via.placeholder.com/150x200';
      movieImg.alt = movieDetails.title;

      // Add movie title
      const movieTitle = document.createElement('p');
      movieTitle.textContent = movieDetails.title;

      // Append elements
      movieTile.appendChild(movieImg);
      movieTile.appendChild(movieTitle);

      // Add click event
      movieTile.addEventListener('click', () => {
        const selectedMovie = {
          id: movie.id,
          name: movieDetails.title,
          overview: movieDetails.overview,
        };
        localStorage.setItem('selected-movie', JSON.stringify(selectedMovie));
        console.log('Selected Movie Stored:', selectedMovie);
        window.location.href = 'selected-movie.html';
      });

      movieGrid.appendChild(movieTile);
    }
  }
}





function fetchRecommendedMovies(selectedGenres) {

  // Make a POST request to the API
  fetch(`http://127.0.0.1:8000/api/recommend_movie/top_5?genre=${selectedGenres}`, {
    method: "POST"
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse JSON response
    })
    .then((data) => {
      console.log("Recommended Movies:", data); // Log the movie data
      renderMovieCards(data); // Pass data to the render function
    })
    .catch((error) => {
      console.log(error)
    });
}


fetchRecommendedMovies(localStorage.getItem('genre'))
