const searchBar = document.getElementById('searchBar');
const suggestionsBox = document.getElementById('suggestionsBox');

// Initialize an empty array for the movie dataset
let movieDataset = [];

// Fetch the JSON file from the assets folder
fetch('./movies_json.json')  // Adjust the path if needed
  .then(response => response.json()) // Parse the JSON response
  .then(data => {
    movieDataset = data; // Store the fetched movie data
    console.log('Movie Dataset Loaded:', movieDataset); // Log to verify data
  })
  .catch(error => console.error('Error fetching movie data:', error)); // Handle errors

// Event listener for search bar input
searchBar.addEventListener('input', () => {
  const query = searchBar.value.toLowerCase();

  // Filter movies based on the input query
  const suggestions = movieDataset.filter(movie => {
    // Ensure that original_title is a string before calling toLowerCase
    return typeof movie.original_title === 'string' &&
      movie.original_title.toLowerCase().includes(query);
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
        searchBar.value = movie.original_title; // Set the selected movie name
        suggestionsBox.innerHTML = ''; // Clear suggestions
      });

      suggestionsBox.appendChild(suggestionItem); // Add to the suggestions box
    });
  }
});

// Hide suggestions box when clicking outside
document.addEventListener('click', (e) => {
  if (!searchBar.contains(e.target) && !suggestionsBox.contains(e.target)) {
    suggestionsBox.innerHTML = ''; // Clear suggestions
  }
});
