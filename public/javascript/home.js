// const searchInput = document.getElementById('search-input');
const modulesContainer = document.getElementById('modules-container');

// Ensure the startup-data script element exists before parsing
const startupData = startup_data || {};

// Function to render modules
function renderModules(modules) {
    modulesContainer.innerHTML = '';

    modules.forEach(module => {
        const moduleElement = document.createElement('div');
        const moduleName = module.name.toLowerCase().replace(/ /g, '-');
        const isActive = startupData[moduleName] || (moduleName === 'market-analysis' && startupData.competitors);

        moduleElement.classList.add('module', isActive ? 'inactive' : 'active');
        if (isActive) {
            moduleElement.innerHTML = `
                <h2>${module.name}</h2>
                <p>${startupData["competitors"] || ''}</p>
                <button>Edit</button>
            `;
        } else {
            moduleElement.innerHTML = `
                <div class="plus">+</div>
                <p>${module.name}</p>
            `;
        }

        moduleElement.addEventListener('click', () => {
            window.location.href = `/${moduleName}`;
        });

        modulesContainer.appendChild(moduleElement);
    });
}

// Fetch modules when page loads
fetch('javascript/modules.json')
    .then(response => response.json())
    .then(modules => {
        renderModules(modules);
    })
    .catch(error => console.error('Error fetching modules:', error));

function invite() {
    // Ensure startup_data is available
    if (!startup_data || !startup_data.id) {
        console.error('Startup data is not available');
        return;
    }

    // Generate invite text with the ID
    const inviteText = `Join my startup on thepocketexecutive: https://startup.thepocketexecutive/\nUse the ID: "${startup_data.id}" (Secret ID)`;
    console.log(inviteText);
    // Copy invite text to clipboard
    navigator.clipboard.writeText(inviteText).then(function () {
        alert('Invite copied to clipboard!');
    }).catch(function (error) {
        console.error('Error copying text: ', error);
    });
}

function logout() {
    fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin'
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '/startup_login';
            } else {
                alert('Logout failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
            alert('Logout failed. Please try again.');
        });
}

// Modal functionality
const modal = document.getElementById('key-data-modal');
const openModalButton = document.getElementById('key_button');
const closeModalButton = document.getElementById('close-modal-button');
const submitKeyDataButton = document.getElementById('submit-key-data');

openModalButton.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

submitKeyDataButton.addEventListener('click', async () => {
    const field = document.getElementById('field').value;
    const experience = document.getElementById('experience').value;
    // const description = document.getElementById('description').value;
    // const mrr = document.getElementById('mrr').value;
    // const tam = document.getElementById('tam').value;

    const data = {};
    if (field) data.field = field;
    if (experience) data.experience = experience;
    // if (description) data.description = description;
    // if (mrr) data.mrr = mrr;
    // if (tam) data.tam = tam;

    if (Object.keys(data).length === 0) {
        alert('Please fill in at least one field.');
        return;
    }

    try {
        const response = await fetch('/api/saveKeyData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Key data saved successfully!');
            modal.style.display = 'none';
        } else {
            alert('Failed to save key data.');
        }
    } catch (error) {
        console.error('Error saving key data:', error);
        alert('An error occurred while saving the key data.');
    }
});