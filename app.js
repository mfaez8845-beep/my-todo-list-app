const jokeButton = document.getElementById('joke-button');
const jokeDisplay = document.getElementById('joke-display');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('error-message');

const JOKE_API_URL = 'https://official-joke-api.appspot.com/random_joke';

// Event listener for the button
jokeButton.addEventListener('click', fetchJoke);

/**
 * Fetch a random joke from the external API
 */
async function fetchJoke() {
    // Hide previous error and show loading state
    errorDiv.style.display = 'none';
    loadingDiv.style.display = 'block';
    jokeDisplay.style.display = 'none';
    jokeButton.disabled = true;

    try {
        const response = await fetch(JOKE_API_URL);

        // Handle network or HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Validate response structure
        if (!data.setup || !data.punchline) {
            throw new Error('Invalid response format from API');
        }

        // Display the joke
        displayJoke(data.setup, data.punchline);
        errorDiv.style.display = 'none';
    } catch (error) {
        // Handle any errors that occurred during fetch or processing
        console.error('Error fetching joke:', error);
        showError(error.message || 'Failed to fetch joke. Please try again.');
    } finally {
        // Always hide loading state and re-enable button
        loadingDiv.style.display = 'none';
        jokeButton.disabled = false;
    }
}

/**
 * Display the joke on the page
 * @param {string} setup - The setup/question of the joke
 * @param {string} punchline - The punchline/answer of the joke
 */
function displayJoke(setup, punchline) {
    jokeDisplay.innerHTML = `
        <div>
            <p><strong>${escapeHtml(setup)}</strong></p>
            <p style="margin-top: 15px; font-style: italic;">${escapeHtml(punchline)}</p>
        </div>
    `;
    jokeDisplay.style.display = 'flex';
}

/**
 * Display error message to the user
 * @param {string} message - The error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    errorDiv.style.display = 'block';
    jokeDisplay.style.display = 'none';
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - The text to escape
 * @returns {string} Escaped HTML-safe text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}