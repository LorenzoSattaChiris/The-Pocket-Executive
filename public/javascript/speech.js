const mic = document.getElementById("speak_button");

let active = false;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    let speechRecognition = new webkitSpeechRecognition();

    speechRecognition.continuous = true;
    speechRecognition.lang = "en-US";
    let customLanguage = localStorage.getItem('language');
    if (customLanguage != null && customLanguage.length == 5) {
        speechRecognition.lang = customLanguage;
    }
    let final_transcript = "";

    speechRecognition.onstart = () => {
        mic.classList.add('recording');
    };
    speechRecognition.onerror = function (event) {
        if (event.error == "not-allowed") {
            navigator.mediaDevices.getUserMedia({ audio: true });
            chrome.runtime.openOptionsPage();
        }
    };
    speechRecognition.onend = () => {
        mic.classList.remove('recording');
    };

    speechRecognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            }
        }
        descriptionTextarea.value += final_transcript.trim();
        final_transcript = "";
    };

    mic.addEventListener("click", function () {
        if (active) {
            active = false;
            speechRecognition.stop();
        } else {
            active = true;
            speechRecognition.start();
        }
    });

} else {
    mic.style.display = "none";
}