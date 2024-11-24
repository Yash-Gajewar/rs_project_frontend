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
    console.log('Movie Dataset Loaded:', movieDataset); // Log to verify data
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

// Sample movie dataset in JSON format
const movieData = {
  Action: [
    {
      id: 69848,
      title: "One Man's Hero",
      overview: "One Man's Hero tells the little-known story of the 'St. Patrick's Battalion'...",
      genres: ["Western", "Action", "Drama", "History"],
      vote_average: 9.3
    },
    {
      id: 155,
      title: "The Dark Knight",
      overview: "Batman raises the stakes in his war on crime...",
      genres: ["Drama", "Action", "Crime", "Thriller"],
      vote_average: 8.2
    }
    // Add more movies as needed
  ],
  Adventure: [
    {
      id: 43867,
      title: "The Prisoner of Zenda",
      overview: "An Englishman on a Ruritarian holiday must impersonate the king...",
      genres: ["Adventure", "Drama", "Romance"],
      vote_average: 7.5
    }
  ]
};

async function fetchMovieDetails(movieId) {
  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=83b44cdf02bdd95a7c2fa4ab67514e6a&language=en-US`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch details for movie ID ${movieId}`);
    }
    const responseData = await response.json();
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