// script.js
let selectedButton = null; // Variable to track the currently selected button

// Function to handle option selection
function selectOption(button, isCorrect) {
    // Reset the background color of the previously selected button
    if (selectedButton) {
        selectedButton.style.backgroundColor = "#f9f9f9"; // Reset background color to default
    }
    
    // Set the new selected button and store its correctness
    selectedButton = button;
    selectedButton.correct = isCorrect;
    
    // Highlight the selected button
    selectedButton.style.backgroundColor = "#d3d3d3"; // Light gray background to indicate selection
}

// Function to handle answer submission
function submitAnswer() {
    if (selectedButton) {
        // Change style based on whether the answer is correct
        if (selectedButton.correct) {
            selectedButton.style.backgroundColor = "#7ED957"; // Green for correct answer
             // Assuming `c` is defined elsewhere and used to count correct answers
        } else {
            selectedButton.style.backgroundColor = "#E60101"; // Red for incorrect answer
        }

        // Disable all option buttons after submission
        let buttons = document.querySelectorAll('.option');
        buttons.forEach(button => {
            button.disabled = true;
        });

        // Change the submit button to a "Next" button and set its click action
        const submitButton = document.getElementById('submitButton');
        submitButton.innerText = "Next";
        submitButton.onclick = goToNextPage; // Assign the function to navigate to the next page

    } else {
        alert("Please select an option before submitting.");
    }
}

// Function to navigate to the next page
function goToNextPage() {
    window.location.href = "./endPage.html"; // Replace with your actual next page file name
}
