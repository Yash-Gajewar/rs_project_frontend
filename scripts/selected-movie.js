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


// Function to display movie details from local storage
function displayMovieDetails() {
  // Retrieve movie details from local storage
  const movieData = localStorage.getItem('selected-movie');

  // Check if movie data is available
  if (movieData) {
    // Parse the JSON string into an object
    const movie = JSON.parse(movieData);

    // Populate HTML elements with movie details
    document.getElementById('movie-title').textContent = movie.name;
    const movieImageElement = document.querySelector('.movie-video');

    // Assuming the image URL is part of the movie data or a placeholder if not available
    movieImageElement.src = movie.image ? movie.image : 'https://via.placeholder.com/800x400';
    movieImageElement.alt = movie.name;
    document.getElementById('movie-description').textContent = movie.overview;
  } else {
    // If no movie data is found, redirect to the main page
    alert('No movie details found! Redirecting to the home page.');
    window.location.href = 'index.html';
  }
}

// Call the function to display details after page load
document.addEventListener('DOMContentLoaded', displayMovieDetails);


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
    },
    {
      id: 43867,
      title: "The Prisoner of Zenda",
      overview: "An Englishman on a Ruritarian holiday must impersonate the king...",
      genres: ["Adventure", "Drama", "Romance"],
      vote_average: 7.5
    },
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
    },
    {
      id: 43867,
      title: "The Prisoner of Zenda",
      overview: "An Englishman on a Ruritarian holiday must impersonate the king...",
      genres: ["Adventure", "Drama", "Romance"],
      vote_average: 7.5
    }
  ]
};

// Function to create and render movie cards
function renderMovieCards(data) {
  // Iterate through each genre
  Object.keys(data).forEach(genre => {
    // Iterate through movies in each genre
    data[genre].forEach(movie => {
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

// Call the render function to display movie cards
renderMovieCards(movieData);
