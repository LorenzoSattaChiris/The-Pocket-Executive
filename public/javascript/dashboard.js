const survey_button = document.getElementById('survey_button');
const my_startups_button = document.getElementById('my_startups_button');
const new_startups_button = document.getElementById('new_startups_button');
const reports_button = document.getElementById('reports_button');

survey_button.addEventListener('click', () => {
    window.location.href = '/survey';
});

my_startups_button.addEventListener('click', () => {
    window.location.href = '/my-startups';
});

new_startups_button.addEventListener('click', () => {
    window.location.href = '/startups';
});

reports_button.addEventListener('click', () => {
    window.location.href = '/reports';
});


function logout() {
    fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin'
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '/investor_login';
            } else {
                alert('Logout failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
            alert('Logout failed. Please try again.');
        });
}