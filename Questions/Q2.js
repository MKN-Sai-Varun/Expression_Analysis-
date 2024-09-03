// script.js
let selectedButton = null; // Variable to keep track of the selected option

// Function to handle option selection
function selectOption(button, isCorrect) {
    // Remove the selected class from the previously selected button
    if (selectedButton) {
        selectedButton.style.backgroundColor = "#D5BDA9"; // Reset background color
        selectedButton.style.border = "3px solid black";  // Reset border
        selectedButton.style.transform = "scale(1)";      // Reset scale
    }

    // Set the new selected button and store whether it's correct
    selectedButton = button;
    selectedButton.correct = isCorrect;
    
    // Highlight the selected button
    selectedButton.style.transform = "scale(1.10)"; // Slightly expand to indicate selection
}

// Function to handle answer submission
function submitAnswer() {
    if (selectedButton) {
        // Change style based on whether the answer is correct
        if (selectedButton.correct) {
            selectedButton.style.backgroundColor = "#7ED957"; // Green for correct
            selectedButton.style.border = "5px solid green";   // Green border for correct
        } else {
            selectedButton.style.backgroundColor = "#da1e37";  // Red for incorrect
            selectedButton.style.border = "5px solid #c71f37"; // Dark red border for incorrect
        }

        // Disable all option buttons after submission
        let buttons = document.querySelectorAll('.option');
        buttons.forEach(button => {
            button.disabled = true;
        });

        // Change the submit button to a "Next Question" button
        const submitButton = document.getElementById('submitButton');
        submitButton.innerText = "Next";
        submitButton.onclick = goToNextPage; // Change to navigate to the next page
    } else {
        alert("Please select an option before submitting.");
    }
}

// Function to navigate to the next page
function goToNextPage() {
    window.location.href = "./Q3.html"; // Replace with the actual next page file name
}
