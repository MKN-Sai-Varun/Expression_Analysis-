// // Dummy function to simulate login
// function login() {
//     // Hide the login page
//     document.getElementById('loginPage').classList.add('hidden');
    
//     // Show the play button page
//     document.getElementById('playPage').classList.remove('hidden');
    
//     // Remove the background image
//     document.querySelector('.background').classList.add('nobg');
// }

// // Function to start the game after clicking 'Play'
// function startGame() {
//     document.getElementById('playPage').classList.add('hidden');
//     document.getElementById('question1').classList.remove('hidden');
// }

// let selectedButton = null;
// let currentQuestionIndex = 1; // Start from Question 1

// // Function to handle option selection
// function selectOption(button, isCorrect) {
//     // Remove the selected class from the previously selected button
//     if (selectedButton) {
//         selectedButton.style.backgroundColor = "#f9f9f9"; // Reset background color
//     }
    
//     // Set the new selected button
//     selectedButton = button;

//     // Store whether the selected answer is correct or wrong
//     selectedButton.correct = isCorrect;
    
//     // Highlight the selected button
//     selectedButton.style.backgroundColor = "#d3d3d3"; // Light gray to indicate selection
// }

// // Function to handle submission
// function submitAnswer() {
//     if (selectedButton) {
//         // Check if the selected answer is correct
//         if (selectedButton.correct) {
//             selectedButton.style.backgroundColor = "#7ED957"; // Green for correct
//         } else {
//             selectedButton.style.backgroundColor = "#E60101"; // Red for wrong
//         }

//         // Disable all buttons after submission
//         let buttons = document.querySelectorAll(`#question${currentQuestionIndex} .choices button`);
//         buttons.forEach(button => {
//             button.disabled = true;
//         });

//         // Change the current question's submit button to "Next"
//         const submitButton = document.querySelector(`#question${currentQuestionIndex} .submit`);
//         submitButton.innerText = "Next";
//         submitButton.onclick = nextQuestion; // Set the function to navigate to the next question
//     } else {
//         alert("Please select an option before submitting.");
//     }
// }

// // Function to handle transitioning between questions
// // Function to handle transitioning between questions
// function nextQuestion() {
//     // Get the current question div
//     const currentQuestionDiv = document.getElementById(`question${currentQuestionIndex}`);
//     // Increment the question index
//     currentQuestionIndex++;

//     // Hide the current question
//     currentQuestionDiv.classList.add('hidden');

//     // Get the next question div
//     const nextQuestionDiv = document.getElementById(`question${currentQuestionIndex}`);

//     if (nextQuestionDiv) {
//         // Show the next question
//         nextQuestionDiv.classList.remove('hidden');
        
//         // Reset the selected button and submit button text for the new question
//         selectedButton = null;
//         const submitButton = document.querySelector(`#question${currentQuestionIndex} .submit`);
//         submitButton.innerText = "Submit";
//         submitButton.onclick = submitAnswer;
//     } else {
//         // If no more questions, show the end page
//         document.getElementById('endPage').classList.remove('hidden');
//         startConfetti(); // Start the confetti animation
//     }
// }

// // Function to toggle password visibility
// document.getElementById('togglePassword').addEventListener('click', function () {
//     const passwordInput = document.getElementById('password');
//     const toggleIcon = this.querySelector('i');

//     if (passwordInput.type === 'password') {
//         passwordInput.type = 'text'; // Change to text to show the password
//         toggleIcon.classList.remove('far', 'fa-eye'); // Change to eye-slash icon
//         toggleIcon.classList.add('fas', 'fa-eye-slash');
//     } else {
//         passwordInput.type = 'password'; // Change to password to hide it
//         toggleIcon.classList.remove('fas', 'fa-eye-slash'); // Change back to eye icon
//         toggleIcon.classList.add('far', 'fa-eye');
//     }
// });


// function startConfetti() {
//     let duration = 20 * 1000; // Confetti will run for 10 seconds
//     let end = Date.now() + duration;

//     (function frame() {
//         confetti({
//             particleCount: 3,
//             angle: 60,
//             spread: 55,
//             origin: { x: 0 },
//             colors: ["#bb0000", "#ffffff"]
//         });

//         confetti({
//             particleCount: 3,
//             angle: 120,
//             spread: 55,
//             origin: { x: 1 },
//             colors: ["#bb0000", "#ffffff"]
//         });

//         if (Date.now() < end) {
//             requestAnimationFrame(frame);
//         }
//     })();
// }






// Dummy function to simulate login
function login() {
    // Hide the login page
    document.getElementById('loginPage').classList.add('hidden');
    
    // Show the play button page
    document.getElementById('playPage').classList.remove('hidden');
    
    // Remove the background image
    document.querySelector('.background').classList.add('nobg');
}

// Function to start the game after clicking 'Play'
function startGame() {
    document.getElementById('playPage').classList.add('hidden');
    document.getElementById('question1').classList.remove('hidden');
}

let selectedButton = null;
let selectedImage = null; // Keep track of the selected image
let currentQuestionIndex = 1; // Start from Question 1

// Function to handle option selection
function selectOption(button, isCorrect) {
    // Remove the selected class from the previously selected button
    if (selectedButton) {
        selectedButton.style.backgroundColor = "#f9f9f9"; // Reset background color
    }
    
    // Set the new selected button
    selectedButton = button;

    // Store whether the selected answer is correct or wrong
    selectedButton.correct = isCorrect;
    
    // Highlight the selected button
    selectedButton.style.backgroundColor = "#d3d3d3"; // Light gray to indicate selection
}

// Function to handle image option selection
function selectImage(image, isCorrect) {
    // Remove scaling from the previously selected image
    if (selectedImage) {
        selectedImage.style.transform = "scale(1)"; // Reset scaling
    }
    
    // Set the new selected image
    selectedImage = image;

    // Store whether the selected answer is correct or wrong
    selectedImage.correct = isCorrect;

    // Scale up the selected image
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
    } else {
        alert("Please select an option before submitting.");
    }
}

// Function to handle submission for image questions
function submitImageAnswer() {
    if (selectedImage) {
        // Check if the selected answer is correct
        if (selectedImage.correct) {
            selectedImage.style.border = "5px solid #00BF63"; // Green for correct
        } else {
            selectedImage.style.border = "5px solid #E60101"; // Red for wrong
        }

        // Disable all image options after submission
        let images = document.querySelectorAll(`#question${currentQuestionIndex} .imgchoice`);
        images.forEach(image => {
            image.style.pointerEvents = "none"; // Disable clicking on images
        });

        // Change the current question's submit button to "Next"
        const submitButton = document.querySelector(`#question${currentQuestionIndex} .submit`);
        submitButton.innerText = "Next";
        submitButton.onclick = nextQuestion; // Set the function to navigate to the next question
    } else {
        alert("Please select an option before submitting.");
    }
}

// Function to handle transitioning between questions
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
    }
}

// Function to toggle password visibility
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const toggleIcon = this.querySelector('i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'; // Change to text to show the password
        toggleIcon.classList.remove('far', 'fa-eye'); // Change to eye-slash icon
        toggleIcon.classList.add('fas', 'fa-eye-slash');
    } else {
        passwordInput.type = 'password'; // Change to password to hide it
        toggleIcon.classList.remove('fas', 'fa-eye-slash'); // Change back to eye icon
        toggleIcon.classList.add('far', 'fa-eye');
    }
});

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
