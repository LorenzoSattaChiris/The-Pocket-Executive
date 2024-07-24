// Navigation
const submitButton = document.getElementById('submit');
const playerSubmit = document.getElementById('playerSubmit');
const logo_animated = document.getElementById('logo_animated');
const loading = document.getElementById('loading');

let page = 1;

submitButton.addEventListener('click', () => {
    document.getElementById('page1').style.display = 'none';
    document.getElementById('startups').style.display = 'block';
    page = 2;
});

// Cards (Suggestions)
descriptionTextarea = document.getElementById('description');
// Cards (Suggestions)
const actual_suggestions_container = document.getElementById('actual_suggestions_container');

const cardTemplate = `
    <div id="card-{id}" class="card suggestions" style="margin-bottom:10px">
        <span class="yes-no-buttons">
            <button class="yes-button">✅</button>
            <button class="no-button">❌</button>
        </span>
        <h3 class="suggestions_header">Suggestion</h3>
        <p>{content}</p>
    </div>
`;

function generateRandomCard() {
    const { cardId, content } = generateRandomCardContent();
    return cardTemplate.replace('{id}', cardId).replace('{content}', content);
}

function generateRandomCardContent() {
    const cardId = Math.floor(Math.random() * 1000);
      const contentList = [
        "I am interested in startups with a strong focus on renewable energy solutions.",
        "I invest in companies that have achieved a minimum of $1MM in ARR.",
        "I look for startups with a clear and impactful social mission.",
        "I prefer startups based in emerging markets with high growth potential.",
        "I invest in healthcare startups with FDA-approved products.",
        "I look for startups with founders who have previously exited a company successfully.",
        "I am interested in fintech startups disrupting traditional banking systems.",
        "I invest in startups that have completed a successful Series A round.",
        "I look for startups with patents on their core technology.",
        "I prefer startups with a B2B business model targeting Fortune 500 companies.",
        "I invest in AI startups with proven machine learning models.",
        "I look for startups with a female-led founding team.",
        "I am interested in startups focused on blockchain technology in supply chain management.",
        "I invest in companies with a high customer retention rate.",
        "I look for startups that have participated in top-tier accelerator programs.",
        "I prefer startups with a clear and scalable SaaS model.",
        "I am interested in agritech startups improving crop yields.",
        "I invest in startups with strong IP protection and trademarks.",
        "I look for startups with a clear path to profitability within three years.",
        "I am interested in edtech startups that enhance remote learning experiences.",
        "I invest in startups that have received grants from government or non-profit organizations.",
        "I look for startups with a strong presence in the Asia-Pacific market.",
        "I am interested in startups developing solutions for the gig economy.",
        "I invest in startups with a subscription-based revenue model.",
        "I look for startups with strong corporate partnerships.",
        "I am interested in startups that have a robust cybersecurity strategy.",
        "I invest in startups with a strong environmental, social, and governance (ESG) framework.",
        "I look for startups with a significant market share in their industry.",
        "I am interested in startups solving urban mobility challenges.",
        "I invest in startups with a diverse and inclusive team.",
        "I look for startups that have a clear competitive advantage.",
        "I am interested in startups focused on mental health solutions.",
        "I invest in startups that have a high Net Promoter Score (NPS).",
        "I look for startups with a proven product-market fit.",
        "I am interested in startups that are developing smart home technologies.",
        "I invest in startups with a strong customer acquisition strategy.",
        "I look for startups with a solid growth trajectory in annual revenue.",
        "I am interested in startups that leverage big data analytics.",
        "I invest in startups with a clear exit strategy within five years.",
        "I look for startups that have strong endorsements from industry leaders.",
        "I am interested in startups addressing climate change through innovative solutions.",
        "I invest in startups with a strong online presence and digital marketing strategy.",
        "I look for startups that have achieved significant user growth month over month.",
        "I am interested in startups that are innovating in the fintech space.",
        "I invest in startups with a compelling and defensible business model.",
        "I look for startups with a strong advisory board.",
        "I am interested in startups that use AI to solve real-world problems.",
        "I invest in startups with a strong focus on customer satisfaction.",
        "I look for startups with a clear and sustainable revenue stream.",
        "I am interested in startups that are developing next-gen cybersecurity solutions.",
        "I invest in startups with a scalable technology infrastructure.",
        "I look for startups with a strong brand identity.",
        "I am interested in startups that focus on improving supply chain efficiency.",
        "I invest in startups with a proven track record of innovation.",
        "I look for startups that have a strong value proposition for their customers.",
        "I am interested in startups that are addressing the aging population's needs.",
        "I invest in startups with a high level of founder commitment.",
        "I look for startups that have secured strategic partnerships.",
        "I am interested in startups that are developing sustainable packaging solutions.",
        "I invest in startups with a clear product differentiation.",
        "I look for startups with a strong focus on user experience (UX) design.",
        "I am interested in startups that are disrupting traditional retail models.",
        "I invest in startups with a data-driven approach to decision making.",
        "I look for startups that have a strong focus on community building.",
        "I am interested in startups that are developing innovative healthcare solutions.",
        "I invest in startups with a solid financial model.",
        "I look for startups that have a strong technical team.",
        "I am interested in startups that focus on the Internet of Things (IoT).",
        "I invest in startups with a high gross margin.",
        "I look for startups that have a robust risk management strategy.",
        "I am interested in startups that are addressing water scarcity issues.",
        "I invest in startups with a clear and compelling go-to-market strategy.",
        "I look for startups that are innovating in the biotech space.",
        "I am interested in startups with a strong focus on sustainability.",
        "I invest in startups that have a transparent and ethical business practice.",
        "I look for startups with a high level of market readiness.",
        "I am interested in startups that are solving transportation and logistics problems.",
        "I invest in startups with a unique and defensible IP.",
        "I look for startups that have demonstrated consistent revenue growth.",
        "I am interested in startups that focus on renewable energy storage solutions.",
        "I invest in startups with a strong focus on customer retention.",
        "I look for startups that are developing innovative financial services.",
        "I am interested in startups with a scalable business model.",
        "I invest in startups that have a clear and measurable impact on society.",
        "I look for startups with a strong focus on product development.",
        "I am interested in startups that are addressing digital transformation needs.",
        "I invest in startups with a well-defined market entry strategy.",
        "I look for startups that are developing next-gen communication technologies.",
        "I am interested in startups with a strong focus on user engagement.",
        "I invest in startups that have a clear and achievable growth plan.",
        "I look for startups that are innovating in the field of artificial intelligence.",
        "I am interested in startups with a proven business model.",
        "I invest in startups that have a strong focus on market expansion.",
        "I look for startups that are developing innovative education technologies."
    ];

    const randomIndex = Math.floor(Math.random() * contentList.length);
    const content = contentList.splice(randomIndex, 1)[0];
    return { cardId, content };
}

function yes_card(cardId, content) {
    const descriptionTextarea = document.getElementById('description');
    const card = document.getElementById(`card-${cardId}`);
    if (card) {
        if (descriptionTextarea.value.length > 1200) {
            alert('Character limit exceeded!');
            descriptionTextarea.value = descriptionTextarea.value.slice(0, 1000);
        } else {
            if (descriptionTextarea.value === '') {
                descriptionTextarea.value += card.querySelector('p').innerText;
            } else if (!descriptionTextarea.value.endsWith('\n')) {
                descriptionTextarea.value += '\n' + card.querySelector('p').innerText;
            } else {
                descriptionTextarea.value += card.querySelector('p').innerText;
            }
            removeCard(cardId);
        }
    }
}

function no_card(cardId) {
    removeCard(cardId);
}

function removeCard(cardId) {
    const card = document.getElementById(`card-${cardId}`);
    if (card) {
        card.style.opacity = 0;
        setTimeout(() => {
            card.remove();
            const newCard = generateRandomCard();
            actual_suggestions_container.innerHTML += newCard;
            attachEventListeners();
        }, 150);
    }
}

function attachEventListeners() {
    const suggestionCards = document.querySelectorAll('.suggestions');
    suggestionCards.forEach(card => {
        const cardId = card.id.split('-')[1];
        const content = card.querySelector('p')?.innerText;
        const yesButton = card.querySelector('.yes-button');
        const noButton = card.querySelector('.no-button');

        if (yesButton && noButton) {
            yesButton.addEventListener('click', () => yes_card(cardId, content));
            noButton.addEventListener('click', () => no_card(cardId));
        }
    });
}

// Initial card setup
const initialCard = generateRandomCard();
actual_suggestions_container.innerHTML = initialCard;

// if (!window.matchMedia("(max-width: 600px)").matches) {
//     const initialCard2 = generateRandomCard();
//     actual_suggestions_container.innerHTML += initialCard2;
// }

attachEventListeners();

descriptionTextarea.addEventListener('input', () => {
    if (descriptionTextarea.value.length > 1000) {
        alert('Character limit exceeded!');
        descriptionTextarea.value = descriptionTextarea.value.slice(0, 1000);
    }
});

submitButton.addEventListener('click', () => {
    let description = document.getElementById('description').value;
    if (description.length === 0) {
        alert("Your Description is empty!");
        return;
    }

    if (description.length < 10) {
        alert("Your Description is too short!");
        return;
    }

    submit(description);
});

async function submit(description) {
    console.log('Submitting: ', description);
    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(description),
        });

        const data = await response.json();

        if (data.aiResponse) {
            console.log(data.aiResponse);
            showAIResponse(data.aiResponse, description);
        } else {
            console.log('An error occurred while generating the response.');
            console.error('Error:', data.aiResponse);
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('An error occurred while generating the response.');
    }
}

function parseMarkdownText(text) {
    const parsedResult = {};
    const regex = /\*\*(.*?)\*\*:\s*([\s\S]*?)(?=\n\*\*|$)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/\n\s*/g, ' ');
        parsedResult[key] = value;
    }

    return parsedResult;
}

function formatText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/- /g, '<br>- ')
        .replace(/\*/g, '');
}


function showAIResponse(aiResponse, description) {
    
}