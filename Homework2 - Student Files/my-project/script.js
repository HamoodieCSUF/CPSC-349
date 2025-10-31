const API_KEY = '3ff29cc594e79e74dc510cf71dca0c95'
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let totalPages = 1;
let currentQuery = '';
let currentSort = 'popularity.desc';
let isSearchMode = false;
const moviesGrid = document.getElementById('moviesGrid');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
document.addEventListener('DOMContentLoaded', function() {
    loadMovies();
    setupEventListeners();
});

function setupEventListeners() {
    searchInput.addEventListener('input', function() {
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(handleSearch, 300);
    });
    sortSelect.addEventListener('change', function() {
        if (this.value === '') {
            currentSort = 'popularity.desc';
        } else {
            currentSort = this.value;
        }
        currentPage = 1;
        if (isSearchMode) {
            searchMovies(currentQuery);
        } else {
            loadMovies();
        }
    });
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            if (isSearchMode) {
                searchMovies(currentQuery);
            } else {
                loadMovies();
            }
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            if (isSearchMode) {
                searchMovies(currentQuery);
            } else {
                loadMovies();
            }
        }
    });
}
function handleSearch() {
    const query = searchInput.value.trim();
    if (query) {
        currentQuery = query;
        currentPage = 1;
        isSearchMode = true;
        searchMovies(query);
    } else {
        isSearchMode = false;
        currentPage = 1;
        loadMovies();
    }
}
async function loadMovies() {
    try {
        showLoading();
        hideError();
        
        const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${currentPage}&sort_by=${currentSort}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        totalPages = data.total_pages;
        
        displayMovies(data.results);
        updatePagination();
        
    } catch (error) {
        console.error('Error loading movies:', error);
        showError('Failed to load movies. Please check your internet connection and try again.');
    } finally {
        hideLoading();
    }
}
async function searchMovies(query) {
    try {
        showLoading();
        hideError();
        
        const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${currentPage}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        totalPages = data.total_pages;
        
        if (data.results.length === 0) {
            showError(`No movies found for "${query}"`);
            moviesGrid.innerHTML = '';
        } else {
            let sortedResults = sortMovies(data.results, currentSort);
            displayMovies(sortedResults);
        }
        
        updatePagination();
        
    } catch (error) {
        console.error('Error searching movies:', error);
        showError('Failed to search movies. Please try again.');
    } finally {
        hideLoading();
    }
}
function sortMovies(movies, sortBy) {
    const sortedMovies = [...movies];
    
    switch(sortBy) {
        case 'release_date.desc':
            return sortedMovies.sort((a, b) => new Date(b.release_date || '1900-01-01') - new Date(a.release_date || '1900-01-01'));
        case 'release_date.asc':
            return sortedMovies.sort((a, b) => new Date(a.release_date || '1900-01-01') - new Date(b.release_date || '1900-01-01'));
        case 'vote_average.desc':
            return sortedMovies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        case 'vote_average.asc':
            return sortedMovies.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
        default:
            return sortedMovies;
    }
}
function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesGrid.appendChild(movieCard);
    });
}
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const posterPath = movie.poster_path 
        ? `${IMG_BASE_URL}${movie.poster_path}` 
        : 'https://via.placeholder.com/500x750?text=No+Image';
    
    const releaseDate = movie.release_date 
        ? movie.release_date 
        : 'Unknown';
    
    const rating = movie.vote_average ? movie.vote_average.toFixed(2) : 'N/A';
    
    card.innerHTML = `
        <img src="${posterPath}" alt="${movie.title}" class="movie-poster" 
             onerror="this.src='https://via.placeholder.com/500x750?text=No+Image'">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-date">Release Date: ${releaseDate}</div>
            <div class="movie-rating">Rating: ${rating}</div>
        </div>
    `;
    
    return card;
}
function updatePagination() {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
}
function showLoading() {
    loading.style.display = 'block';
    moviesGrid.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
    moviesGrid.style.display = 'grid';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}