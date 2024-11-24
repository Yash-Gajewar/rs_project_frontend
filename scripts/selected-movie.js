const username = document.getElementById('username');
username.innerHTML = localStorage.getItem('username');

const movieGrid = document.getElementById('movie-grid');

// JS for handling movie rating
function rateMovie(rating) {
  alert(`You rated this movie ${rating} star(s)!`);

  // Hide the rating stars after selection
  const ratingStars = document.querySelectorAll('.rating-stars');
  ratingStars.forEach(star => {
    star.style.display = 'none';
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
  // Retrieve movie details from local storage
  const movieData = localStorage.getItem('selected-movie');

  // Check if movie data is available
  if (movieData) {

    const movie = JSON.parse(movieData);

    getContentBasedRecommendMovies(movie.name); // Get content-based recommendations for the selected movie

    // Populate HTML elements with movie details
    document.getElementById('movie-title').textContent = movie.name;
    document.getElementById('movie-description').textContent = movie.overview;

    const movieImageElement = document.querySelector('.movie-video');

    // Fetch the movie image dynamically
    const imageData = await fetchMovieImage(movie.id);
    movieImageElement.src = imageData.posterPath;
    movieImageElement.alt = movie.name;
  } else {
    // If no movie data is found, redirect to the main page
    alert('No movie details found! Redirecting to the home page.');
    window.location.href = 'index.html';
  }
}

// Call the function to display movie details on page load
document.addEventListener('DOMContentLoaded', displayMovieDetails);

// Call the function to display details after page load
document.addEventListener('DOMContentLoaded', displayMovieDetails);


// Function to create and render movie cards
function renderMovieCards(data) {
  // Iterate through each genre
  Object.keys(data).forEach(genre => {
    // Iterate through movies in each genre
    data.forEach(movie => {
      // Create movie card container
      const movieTile = document.createElement('div');
      movieTile.classList.add('movie-tile');

      // Add movie image (placeholder for now)
      const movieImg = document.createElement('img');
      movieImg.src = 'https://via.placeholder.com/150x200'; // Placeholder image URL
      movieImg.alt = movie.title;

      // Add movie title
      const movieTitle = document.createElement('p');
      movieTitle.textContent = movie.title;

      // Append elements to movie card
      movieTile.appendChild(movieImg);
      movieTile.appendChild(movieTitle);

      // Add click event to store selected movie in local storage and redirect
      movieTile.addEventListener('click', () => {
        const selectedMovie = {
          id: movie.id,
          name: movie.title,
          overview: movie.overview
        };
        localStorage.setItem('selected-movie', JSON.stringify(selectedMovie)); // Store movie details in local storage
        console.log('Selected Movie Stored:', selectedMovie); // Log the selected movie

        // Redirect to the selected-movie.html page
        window.location.href = 'selected-movie.html';
      });

      // Append movie card to the grid
      movieGrid.appendChild(movieTile);
    });
  });
}


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
