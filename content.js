// Function to make the "Pull request description" section editable by clicking on it
function makeDescriptionEditable() {
  const descriptionPanel = document.querySelector('#pull-request-description-panel div');
  if (descriptionPanel) {
    descriptionPanel.click();  // Trigger the click event to make the field editable
  } else {
    console.log("Description panel not found!");
  }
}

// Function to modify the description field once it becomes editable
function modifyDescriptionField() {
  const textField = document.querySelector("textarea");  // Assuming it turns into a textarea
  if (textField) {
    textField.value = "Triggering CI pipeline!";
  } else {
    console.error("Editable text field not found!");
  }
}

function insertTextAtSelection() {
    // Find the <p> element within the editor
    const editorArea = document.querySelector('.ProseMirror');
    const placeholder = editorArea.querySelector('p');

    if (placeholder) {
        const currentText = placeholder.textContent;
        let attemptCount = 1; // Default attempt count if it's the first time

        // Check if the current text contains an attempt number
        const attemptMatch = currentText.match(/Attempt number (\d+) to run CI1/);

        if (attemptMatch) {
            attemptCount = parseInt(attemptMatch[1]); // Extract current attempt count
            attemptCount++; // Increment the attempt count
            // Append or update the text with the new attempt count
            const newText = `Attempt number ${attemptCount} to run CI1`;
            placeholder.textContent = newText;
        } else {
            // If no match or unparsable text, replace all with new attempt text
            const newText = `Attempt number ${attemptCount} to run CI1`;
            placeholder.textContent = newText;
        }
    } else {
        console.error("Placeholder <p> not found!");
    }
}

function clickSaveButton() {
    // Find the save button using its data-testid attribute
    const saveButton = document.querySelector('[data-testid="comment-save-button"]');
    
    // Check if the save button exists and click it
    if (saveButton) {
        saveButton.click();
        console.log("Save button clicked!");
    } else {
        console.error("Save button not found!");
    }
}

function isStatusOpen() {
	const statusElement = Array.from(document.querySelectorAll('span')).find(span => span.textContent.trim() === 'Open');
	if (statusElement) {
		return true;
	}
	return false;
}

// Method to insert the button next to the existing buttons
function insertButtonNextToExistingButtons(ciButton) {
    const buttonContainer = document.querySelector('[data-qa="pr-header-actions-drop-down-menu-styles"]');
    if (buttonContainer) {
        // Insert the button next to the existing buttons
        buttonContainer.insertAdjacentElement('afterend', ciButton);
    } else {
        console.error("Button container not found!");
    }
}

// Method to create and style the CI button
function createCIButton() {
    const ciButton = document.createElement("button");
    ciButton.innerText = "Impossible button to Run CI";
	ciButton.id = "ciButton"; // Assign a unique ID to the button
    ciButton.style.bottom = "20px";
    ciButton.style.right = "20px";
    ciButton.style.padding = "10px 20px";
    ciButton.style.backgroundColor = "#28a745";
    ciButton.style.color = "white";
    ciButton.style.border = "none";
    ciButton.style.borderRadius = "5px";
    ciButton.style.cursor = "pointer";
    ciButton.style.zIndex = "1000";  // Make sure it stays on top
    
    return ciButton;
}

function checkAndCreateCIButton() {
	setTimeout(() => {
		if (isStatusOpen()) {
			if (document.querySelector('#ciButton')) {
				return;
			}
			// Create the CI button element
			const ciButton = createCIButton();

			// Insert the button next to the existing buttons
			insertButtonNextToExistingButtons(ciButton);
			
			// Add click event listener to the button
			ciButton.addEventListener("click", () => {
				clickOverviewTab(); // Click on the Overview tab
				setTimeout(() => {
					makeDescriptionEditable(); // First, click to make the description editable

					// Add a short delay to ensure the field becomes editable before modifying it
					setTimeout(() => {
						insertTextAtSelection();
						setTimeout(() => {
							clickSaveButton(); // Click the save button after modification
						}, 1000);
					}, 1000);
				}, 1000);
			});
		}
	}, 1000);
}

function clickOverviewTab() {
    // Find the Overview tab using its text content
    const overviewTab = Array.from(document.querySelectorAll('a[role="tab"]')).find(tab => tab.textContent.trim() === 'Overview');

    if (overviewTab) {
        overviewTab.click(); // Simulate a click on the Overview tab
        console.log('Clicked on the Overview tab');
    } else {
        console.error('Overview tab not found!');
    }
}

window.onload = function() {
	checkAndCreateCIButton();

    // MutationObserver to observe changes in the DOM
    const observer = new MutationObserver(() => {
        checkAndCreateCIButton(); // Re-initialize button whenever the DOM changes
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
};