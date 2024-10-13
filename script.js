const apiKey = '7e353bae3cc292eddefbc0be545dbcf7'; 
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

async function fetchPopularMovies() {
    try {
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}`);
        if (!response.ok) throw new Error('Error fetching popular movies');
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}


function displayMovies(movies) {
    movieList.innerHTML = ''; 
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); 
        movieList.appendChild(li);
    });
}

async function showMovieDetails(movieId) {
    selectedMovieId = movieId; 
    try {
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}`);
        if (!response.ok) throw new Error('Error fetching movie details');
        const movie = await response.json();
        detailsContainer.innerHTML = `
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <p>${movie.overview}</p>
            <p><strong>Fecha de lanzamiento:</strong> ${movie.release_date}</p>
            <p><strong>Rating:</strong> ${movie.vote_average}</p>
        `;
        movieDetails.classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Error searching movies');
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }
});

addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#details h3').textContent
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); 
            displayFavorites(); 
        }
    }
});


function displayFavorites() {
    favoritesList.innerHTML = ''; 
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}


fetchPopularMovies(); 
displayFavorites(); 
