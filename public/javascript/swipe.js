document.addEventListener('DOMContentLoaded', () => {
    const startupBox = document.querySelector('.startup_box');
    const swipeLeftButton = document.getElementById('swipe_left');
    const swipeRightButton = document.getElementById('swipe_right');
    const swipeUpButton = document.getElementById('swipe_up');

    let startups = [];
    let currentIndex = 0;

    // Fetch startups from the server
    async function fetchStartups() {
        try {
            const response = await fetch('/api/startups');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            startups = JSON.parse(text);
            displayStartup();
        } catch (error) {
            console.error('Error fetching startups:', error);
        }
    }

    // Display the current startup
    function displayStartup() {
        if (currentIndex >= startups.length) {
            startupBox.innerHTML = '<p>No more startups to show</p>';
            return;
        }

        const startup = startups[currentIndex];
        startupBox.innerHTML = `
            <h2>${startup.name}</h2>
            <p><strong>Experience:</strong> ${startup.experience}</p>
            <p><strong>MRR:</strong> ${startup.mrr}</p>
            <p><strong>TAM:</strong> ${startup.tam}</p>
            <p><strong>Competitors:</strong> ${startup.competitors}</p>
        `;
    }

    // Swipe left action
    swipeLeftButton.addEventListener('click', () => {
        currentIndex++;
        displayStartup();
    });

    // Swipe right action
    swipeRightButton.addEventListener('click', async () => {
        try {
            const investorId = getCookie('investorId'); // Make sure you have a function to get cookies
            const startupId = startups[currentIndex].id;
            await fetch('/api/follow-startup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ investorId, startupId })
            });
            currentIndex++;
            displayStartup();
        } catch (error) {
            console.error('Error following startup:', error);
        }
    });

    // Swipe up action
    swipeUpButton.addEventListener('click', () => {
        const startupId = startups[currentIndex].id;
        window.location.href = `/${startupId}`;
    });

    // Fetch startups on page load
    fetchStartups();
});

// Utility function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
