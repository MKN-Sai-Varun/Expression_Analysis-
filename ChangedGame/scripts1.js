// Dummy function to simulate login

function login() {
    // Logic for login verification goes here

    // Hide the login page
    document.getElementById('background').style.display = 'none';
    //document.getElementById('loginPage').style.display = 'none';

    // Show the play page
    document.getElementById('playPage').style.display = 'flex'; // Or use flex or block depending on your design
}


// Function to start the game after clicking 'Play'
function startGame() {
    // Hide the play page
    document.getElementById('playPage').style.display = 'none';
    
    // Show the question section

    // Show the first question
    document.getElementById('question1').classList.remove('hidden')
    // Start the timer
    startTimer(); // Ensure this function is defined
}


let selectedButton = null;
let selectedImage = null; // Keep track of the selected image
let currentQuestionIndex = 1; // Start from Question 1

// Function to handle option selection
function selectOption(button, isCorrect) {
    if (selectedButton) {
        selectedButton.style.backgroundColor = "#f9f9f9"; // Reset background color
    }
    
    selectedButton = button;
    selectedButton.correct = isCorrect;
    selectedButton.style.backgroundColor = "#d3d3d3"; // Light gray to indicate selection
}

// Function to handle image option selection
function selectImage(image, isCorrect) {
    if (selectedImage) {
        selectedImage.style.transform = "scale(1)"; // Reset scaling
    }

    selectedImage = image;
    selectedImage.correct = isCorrect;
    selectedImage.style.transform = "scale(1.07)"; // Scale the selected image
}


// Function to handle submission for regular questions
function submitAnswer() {
    if (selectedButton) {
        // Check if the selected answer is correct
        if (selectedButton.correct) {
            selectedButton.style.backgroundColor = "#7ED957"; // Green for correct
        } else {
            selectedButton.style.backgroundColor = "#E60101"; // Red for wrong
        }

        // Disable all buttons after submission
        let buttons = document.querySelectorAll(`#question${currentQuestionIndex} .choices button`);
        buttons.forEach(button => {
            button.disabled = true;
        });

        // Change the current question's submit button to "Next"
        const submitButton = document.querySelector(`#question${currentQuestionIndex} .submit`);
        submitButton.innerText = "Next";
        submitButton.onclick = nextQuestion; // Set the function to navigate to the next question

        // Stop the timer and hide it if this is the last question
        if (currentQuestionIndex === 5) {
            clearInterval(countdown); // Stop the timer
            document.getElementById('timer').style.display = 'none'; // Hide the timer division
        }
    } else {
        alert("Please select an option before submitting.");
    }
}


// Function to handle submission for image questions
function submitImageAnswer() {
    if (selectedImage) {
        if (selectedImage.correct) {
            selectedImage.style.border = "5px solid #00BF63"; // Green for correct
        } else {
            selectedImage.style.border = "5px solid #E60101"; // Red for wrong
        }

        let images = document.querySelectorAll(`#question${currentQuestionIndex} .imgchoice`);
        images.forEach(image => {
            image.style.pointerEvents = "none"; // Disable clicking on images
        });

        const submitButton = document.querySelector(`#question${currentQuestionIndex} .submit`);
        submitButton.innerText = "Next";
        submitButton.onclick = nextQuestion; // Set the function to navigate to the next question
    } else {
        alert("Please select an option before submitting.");
    }
}


function nextQuestion() {
    // Get the current question div
    const currentQuestionDiv = document.getElementById(`question${currentQuestionIndex}`);
    // Increment the question index
    currentQuestionIndex++;

    // Hide the current question
    currentQuestionDiv.classList.add('hidden');

    // Get the next question div
    const nextQuestionDiv = document.getElementById(`question${currentQuestionIndex}`);

    if (nextQuestionDiv) {
        // Show the next question
        nextQuestionDiv.classList.remove('hidden');

        // Reset the selected button and submit button text for the new question
        selectedButton = null;
        selectedImage = null; // Reset the selected image for the new question
        const submitButton = document.querySelector(`#question${currentQuestionIndex} .submit`);

        // Determine if the next question is an image question
        if (nextQuestionDiv.querySelector('.imgchoice')) {
            submitButton.innerText = "Submit";
            submitButton.onclick = submitImageAnswer; // Set the function for image questions
        } else {
            submitButton.innerText = "Submit";
            submitButton.onclick = submitAnswer; // Set the function for regular questions
        }
    } else {
        // If no more questions, show the end page
        document.getElementById('endPage').classList.remove('hidden');
        startConfetti(); // Start the confetti animation

        // Clear any existing image capturing interval
        clearInterval(timer); // Make sure to clear any active image capture

        // Stop the video stream
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null; // Clear the video source
        }
        
        // Stop the timer and hide the timer display
        clearInterval(countdown);
        document.getElementById('timer').classList.add('hidden'); // Hide the timer
    }
}



// Function to toggle password visibility
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const toggleIcon = this.querySelector('i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('far', 'fa-eye');
        toggleIcon.classList.add('fas', 'fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fas', 'fa-eye-slash');
        toggleIcon.classList.add('far', 'fa-eye');
    }
});

// Confetti animation function
function startConfetti() {
    let duration = 20 * 1000; // Confetti will run for 10 seconds
    let end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#bb0000", "#ffffff"]
        });

        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#bb0000", "#ffffff"]
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}



const startButton = document.getElementById('playButton');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const timerElement = document.getElementById('timer');
let totalTime = 179; // 3 minutes in seconds
let countdown; // Declare the countdown variable globally

// Function to start the timer
function startTimer() {
    // Clear any existing interval before starting a new one
    if (countdown) {
        clearInterval(countdown);
    }

    countdown = setInterval(() => {
        // Calculate minutes and seconds
        let minutes = Math.floor(totalTime / 60);
        let seconds = totalTime % 60;

        // Display the time
        timerElement.innerHTML = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Decrease the total time by 1 second
        totalTime--;

        // Check if time is over
        if (totalTime < 0) {
            clearInterval(countdown);
            showEndPage(); // Show the end page
            stopVideoStream(); // Stop the video stream
        }

        // Save the remaining time in localStorage
        localStorage.setItem("timeLeft", totalTime);

    }, 1000); // Run the function every second
}

// Start the timer when the game starts
startButton.addEventListener('click', async () => {
    // Initialize timer display
    timerElement.style.display = 'block';
    timerElement.textContent = `Time Remaining: 3:00`;
    startTimer();

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    setInterval(takeScreenshot, 3000);
});

function showEndPage() {
    // Hide all question divs
    const questions = document.querySelectorAll('#question1, #question2, #question3, #question4, #question5');
    questions.forEach(question => question.classList.add('hidden'));
    
    // Show the end page
    document.getElementById('endPage').classList.remove('hidden');
    startConfetti();
}

// Function to take a screenshot
function takeScreenshot() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(uploadScreenshot, 'image/png');
}

// Function to upload the screenshot
function uploadScreenshot(blob) {
    const formData = new FormData();
    formData.append('image', blob, `screenshot_${Date.now()}.png`);

    fetch('/upload', {
        method: 'POST',
        body: formData
    });
}

// Function to stop the video stream
function stopVideoStream() {
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null; // Clear the video source
    }
}

// Other functions related to question navigation remain unchanged

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function iniModel(){
    
}