const searchInput = document.getElementById('search-input');
const modulesContainer = document.getElementById('modules-container');

// Fetch modules from the JSON file
fetch('javascript/modules.json')
    .then(response => response.json())
    .then(modules => {
        const firstModule = modules[0];
        const otherModules = modules.slice(1);

        renderModules(firstModule, otherModules);

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredModules = otherModules.filter(module =>
                module.name.toLowerCase().includes(searchTerm) ||
                module.description.toLowerCase().includes(searchTerm)
            );
            renderModules(firstModule, filteredModules);
        });
    });

function renderModules(firstModule, modules) {
    modulesContainer.innerHTML = '';

    // Render the first module differently and always include it
    const preferredModuleElement = document.createElement('div');
    preferredModuleElement.classList.add('module');
    preferredModuleElement.id = 'tag-preferred';
    preferredModuleElement.innerHTML = `
            <h2>${firstModule.name}</h2>
            <p>${firstModule.description}</p>
            <button>$4.99</button>
        `;
    preferredModuleElement.addEventListener('click', () => {
        const moduleName = firstModule.name.toLowerCase().replace(/ /g, '-');
        window.location.href = `/module/${moduleName}`;
    });
    modulesContainer.appendChild(preferredModuleElement);

    // Render the rest of the modules
    modules.forEach(module => {
        const moduleElement = document.createElement('div');
        moduleElement.classList.add('module');
        moduleElement.innerHTML = `
                <h2>${module.name}</h2>
                <p>${module.description}</p>
                <button>$0.99</button>
            `;

        moduleElement.addEventListener('click', () => {
            const moduleName = module.name.toLowerCase().replace(/ /g, '-');
            window.location.href = `/${moduleName}`;
        });

        modulesContainer.appendChild(moduleElement);
    });
}
