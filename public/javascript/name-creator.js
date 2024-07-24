alert('Coming Soon!');
window.location.href = '/';

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const inputElement = document.getElementById('user-input');
    const message = inputElement.value.trim();
    if (message === '') return;

    addMessageToChat('user', message);
    inputElement.value = '';

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        addMessageToChat('ai', data.message);
    } catch (error) {
        console.error('Error sending message:', error);
        addMessageToChat('ai', 'An error occurred while generating the response.');
    }
}

function addMessageToChat(sender, message) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.innerText = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Dictionary API
const suggestionsButton = document.getElementById('suggestions-button');
const suggestionsContainer = document.getElementById('suggestions-container');

suggestionsButton.addEventListener('click', async () => {
    const word = 'hello';
    try {
        const response = await fetch(`/api/dictionary/${word}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { data } = await response.json();
        console.log(data)

        // Initialize variables with default values
        let phonetics = [];
        let synonyms = [];
        let antonyms = [];
        let meanings = [];

        // Parse phonetics
        if (Array.isArray(data.phonetics)) {
            phonetics = data.phonetics
                .map(phonetic => typeof phonetic.text === 'string' ? phonetic.text : '')
                .filter(text => text); // Filter out empty strings
        }

        // Parse meanings, synonyms, and antonyms
        if (Array.isArray(data.meanings)) {
            meanings = data.meanings.map(meaning => {
                if (typeof meaning.partOfSpeech === 'string' && Array.isArray(meaning.definitions)) {
                    return {
                        partOfSpeech: meaning.partOfSpeech,
                        definitions: meaning.definitions.map(def => typeof def.definition === 'string' ? def.definition : '').filter(def => def)
                    };
                }
                return null;
            }).filter(meaning => meaning); // Filter out null values

            synonyms = data.meanings.reduce((acc, meaning) => {
                if (Array.isArray(meaning.synonyms)) {
                    acc.push(...meaning.synonyms.filter(synonym => typeof synonym === 'string'));
                }
                return acc;
            }, []);

            antonyms = data.meanings.reduce((acc, meaning) => {
                if (Array.isArray(meaning.antonyms)) {
                    acc.push(...meaning.antonyms.filter(antonym => typeof antonym === 'string'));
                }
                return acc;
            }, []);
        }

        // Remove duplicates
        synonyms = Array.from(new Set(synonyms));
        antonyms = Array.from(new Set(antonyms));

        // Display the results
        const suggestionsContainer = document.getElementById('suggestions-container');
        suggestionsContainer.innerHTML = '';

        if (phonetics.length > 0) {
            const phoneticsList = document.createElement('ul');
            phoneticsList.innerHTML = `<strong>Phonetics:</strong>`;
            phonetics.forEach(phonetic => {
                const listItem = document.createElement('li');
                listItem.textContent = phonetic;
                phoneticsList.appendChild(listItem);
            });
            suggestionsContainer.appendChild(phoneticsList);
        }

        if (synonyms.length > 0) {
            const synonymsList = document.createElement('ul');
            synonymsList.innerHTML = `<strong>Synonyms:</strong>`;
            synonyms.forEach(synonym => {
                const listItem = document.createElement('li');
                listItem.textContent = synonym;
                synonymsList.appendChild(listItem);
            });
            suggestionsContainer.appendChild(synonymsList);
        }

        if (antonyms.length > 0) {
            const antonymsList = document.createElement('ul');
            antonymsList.innerHTML = `<strong>Antonyms:</strong>`;
            antonyms.forEach(antonym => {
                const listItem = document.createElement('li');
                listItem.textContent = antonym;
                antonymsList.appendChild(listItem);
            });
            suggestionsContainer.appendChild(antonymsList);
        }

        if (meanings.length > 0) {
            const meaningsList = document.createElement('ul');
            meaningsList.innerHTML = `<strong>Meanings:</strong>`;
            meanings.forEach(meaning => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${meaning.partOfSpeech}:</strong> ${meaning.definitions.join(', ')}`;
                meaningsList.appendChild(listItem);
            });
            suggestionsContainer.appendChild(meaningsList);
        }

    } catch (error) {
        console.error('Error fetching dictionary data:', error);
        const suggestionsContainer = document.getElementById('suggestions-container');
        suggestionsContainer.textContent = 'Failed to load suggestions. Please try again.';
    }
});
