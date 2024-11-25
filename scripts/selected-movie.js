const username = document.getElementById('username');
username.innerHTML = localStorage.getItem('username');

const movieGrid = document.getElementById('movie-grid');

const movieData = localStorage.getItem('selected-movie');
const movie = JSON.parse(movieData);


function rateMovie(rating) {
  alert(`You rated this movie ${rating} star(s)!`);

  // Hide the rating stars after selection
  const ratingStars = document.querySelectorAll('.rating-stars');
  ratingStars.forEach(star => {
    star.style.display = 'none';
  });

  const apiUrl = `http://localhost:8000/api/user/post_ratings?email=${localStorage.getItem('email')}`;

  // Prepare the ratings data as an array
  const user_ratings_data = [
    movie.name,  // Replace with the correct variable for the movie name
    rating.toString()  // Convert the rating to a string
  ];

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user_ratings_data)  // Send as a JSON array
  })
    .then(response => response.json())
    .then(data => {
      console.log('Rating posted:', data);
    })
    .catch(error => {
      console.error('Error posting rating:', error);
    });
}



function getContentBasedRecommendMovies(movieName) {
  // URL encode the movie name to handle spaces and special characters
  const encodedMovieName = encodeURIComponent(movieName);

  // Construct the API URL
  const apiUrl = `http://127.0.0.1:8000/api/recommend_movie/content_based?movie_name=${encodedMovieName}`;

  // Make the GET request to the API
  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json', // Set accept header to JSON
    }
  })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
      console.log('Recommended Movies:', data);
      renderMovieCards(data);
      // Here you can process and display the recommended movies as needed
    })
    .catch(error => {
      console.error('Error fetching recommendations:', error);
    });
}



async function fetchMovieImage(movieId) {
  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=83b44cdf02bdd95a7c2fa4ab67514e6a&language=en-US`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch details for movie ID ${movieId}`);
    }
    const responseData = await response.json();
    return {
      posterPath: `https://image.tmdb.org/t/p/w500/${responseData.poster_path || ''}`,
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return {
      posterPath: 'https://via.placeholder.com/150x200', // Fallback image
    };
  }
}

// Function to display movie details from local storage
async function displayMovieDetails() {

  // Populate HTML elements with movie details
  document.getElementById('movie-title').textContent = movie.name;
  document.getElementById('movie-description').textContent = movie.overview;

  const movieImageElement = document.querySelector('.movie-video');

  // Fetch the movie image dynamically
  const imageData = await fetchMovieImage(movie.id);
  movieImageElement.src = imageData.posterPath;
  movieImageElement.alt = movie.name;
}

// Call the function to display movie details on page load
document.addEventListener('DOMContentLoaded', displayMovieDetails);

// Call the function to display details after page load
document.addEventListener('DOMContentLoaded', displayMovieDetails);


// Function to handle hover effect
function handleHover(event) {
  const stars = document.querySelectorAll('.star');
  const hoveredIndex = parseInt(event.target.getAttribute('data-index')); // Get the index of the hovered star

  stars.forEach((star, index) => {
    if (index < hoveredIndex) {
      star.classList.add('hovered'); // Add "hovered" class to all previous stars
    } else {
      star.classList.remove('hovered'); // Remove the class from stars after the hovered one
    }
  });
}

// Function to remove hover effect after mouse leaves the stars
function handleMouseOut() {
  const stars = document.querySelectorAll('.star');
  stars.forEach((star) => {
    star.classList.remove('hovered');
  });
}

// Add event listeners to stars for hover effect
const stars = document.querySelectorAll('.star');
stars.forEach((star) => {
  star.addEventListener('mouseover', handleHover); // Add hover effect
  star.addEventListener('mouseout', handleMouseOut); // Remove hover effect
});



// Call the render function to display movie cards
// renderMovieCards(movieData);


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


getContentBasedRecommendMovies(movie.name); // Get content-based recommendations for the selected movie
