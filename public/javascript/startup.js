const searchInput = document.getElementById('search-input');
const startupList = document.getElementById('startup_list');
const advancedSearchButton = document.getElementById('advanced-search-button');
const swipeSwitchButton = document.getElementById('swipe_switch');
let startups = [];

// Function to open startup details
function openStartup(id) {
    window.location.href = `/${id}`;
}

// Function to render startups using EJS
const renderStartups = (filteredStartups) => {
    fetch('/partials/startup_list.ejs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startups: filteredStartups }),
    })
        .then(response => response.text())
        .then(html => {
            startupList.innerHTML = html;
        })
        .catch(error => console.error('Error rendering startups:', error));
};

// Function to fetch startups
const fetchStartups = async () => {
    try {
        const response = await fetch('/api/startups');
        startups = await response.json();
        renderStartups(startups.slice(0, 10)); // Render first 10 startups initially
    } catch (error) {
        console.error('Error fetching startups:', error);
    }
};

// Event listener for search input
searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const filteredStartups = startups.filter(startup =>
        startup.name.toLowerCase().includes(searchTerm)
    );
    renderStartups(filteredStartups);
});

advancedSearchButton.addEventListener('click', function () {
    alert('Coming Soon');
});

swipeSwitchButton.addEventListener('click', function () {
    window.location.href = '/swipe';
});

// Fetch startups when page loads
fetchStartups();
