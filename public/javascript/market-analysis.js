// Function to save competitors list
async function saveCompetitors() {
    const competitorsList = document.getElementById('competitors_list').value;

    if (!startupId) {
        alert('Startup ID not found.');
        return;
    }

    const data = {
        id: startupId,
        competitors: competitorsList
    };

    try {
        const response = await fetch('/api/saveCompetitors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Competitors list saved successfully!');
        } else {
            alert('Failed to save competitors list.');
        }
    } catch (error) {
        console.error('Error saving competitors list:', error);
        alert('An error occurred while saving the competitors list.');
    }
}

document.getElementById('submit').addEventListener('click', saveCompetitors);
