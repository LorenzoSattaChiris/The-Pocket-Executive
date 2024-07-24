// const searchInput = document.getElementById('search-input');
const modulesContainer = document.getElementById('modules-container');

// Ensure the startup-data script element exists before parsing
const startupDataElement = document.getElementById('startup-data');
const startupData = startupDataElement ? JSON.parse(startupDataElement.textContent) : {};

fetch('javascript/modules.json')
    .then(response => response.json())
    .then(modules => {
        const firstModule = modules[0];
        const otherModules = modules.slice(1);

        renderModules(firstModule, otherModules);

        // searchInput.addEventListener('input', () => {
        //     const searchTerm = searchInput.value.toLowerCase();
        //     const filteredModules = otherModules.filter(module =>
        //         module.name.toLowerCase().includes(searchTerm) ||
        //         module.description.toLowerCase().includes(searchTerm)
        //     );
        //     renderModules(firstModule, filteredModules);
        // });
    });

function renderModules(firstModule, modules) {
    modulesContainer.innerHTML = '';

    modules.forEach(module => {
        const moduleElement = document.createElement('div');
        const moduleName = module.name.toLowerCase().replace(/ /g, '-');
        const isActive = startupData[moduleName];

        moduleElement.classList.add('module', isActive ? 'inactive' : 'active');
        if (isActive) {
            moduleElement.innerHTML = `
                <h2>${module.name}</h2>
                <p>${startupData[moduleName]}</p>
                <button>Start</button>
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


function invite() {
    // Ensure startup_data is available
    if (!startup_data || !startup_data.id) {
        console.error('Startup data is not available');
        return;
    }

    // Generate invite text with the ID
    const inviteText = `Join my startup on thepocketexecutive: https://startup.thepocketexecutive/\nUse the ID: "${startup_data.id}" (Secret ID)`;
    console.log(inviteText)
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