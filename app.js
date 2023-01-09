// Wheat, flour, dough, bread
var scores = [0, 0, 0, 0];

// Wheat: 0, Flour: 5 wheat, Dough: 10 flour, Bread: 10 dough
var itemCosts = [0, 5, 10, 10];
var activatedItem = "wheat";

// DOM Elements
var itemButtons = [
    document.getElementById("wheat-button"),
    document.getElementById("flour-button"),
    document.getElementById("dough-button"),
    document.getElementById("bread-button"),
];

var uiItemScores = [
    document.getElementById("wheat-inv"),
    document.getElementById("flour-inv"),
    document.getElementById("dough-inv"),
    document.getElementById("bread-inv"),
];

var activatedItemImage = document.getElementById("activated-item");

var GAME_SAVE_KEY = "GAME_SAVE";

// ##############
// ### EVENTS ###
// ##############

function activatedItemClicked() {
    // Before we increment the score we need to check
    let item = getIndexFromName(activatedItem);
    // to see if there is enough of the previous item
    // available to make the current item.

    if (canAfford(item)) {
        scores[item - 1] -= itemCosts[item]; // Subtract the cost.

        scores[item] += 1; // Add to the item just bought.
    } else {
        // If a user had an item activated but can now no longer
        // afford it select the previous item.
        console.log(`Switching to ${getNameFromIndex(item)}`);
        handleItemSwitch(getNameFromIndex(item - 1));
    }

    // Display that score on the UI
    let i = 0;
    uiItemScores.forEach((element) => {
        element.textContent = scores[i];
        i++;
    });
    console.log(scores);

    // Each click we want to update the item buttons
    // to show if the user can afford it.
    let j = 0;
    itemButtons.forEach((element) => {
        element.disabled = !canAfford(j);
        if (!canAfford(j)) element.classList.remove("item-button-selected");

        j++;
    });

    // Testing local storage:
    saveToLocalStorage();
}

/**
 * A function that will update the activated item and reflect it to the UI.
 * @param {string} changeTo the name of the new activated item.
 */
function handleItemSwitch(changeTo) {
    activatedItem = changeTo;
    switchUIActivatedItem(getIndexFromName(changeTo));

    // Change the source of the image to reflect the activated item.
    activatedItemImage.src = `assets/images/${changeTo}.jpg`;
}

// ################
// #### HELPERS ###
// ################

/**
 * Will check to see if the user has enough of the required item
 * to by the given item.
 * @param {int} itemIndex
 */
function canAfford(itemIndex) {
    if (itemIndex > 0) {
        // If wheat is not selected.
        if (scores[itemIndex - 1] >= itemCosts[itemIndex]) {
            return true;
        }
    } else if (itemIndex == 0) {
        return true;
    }
}

/**
 * Will change the UI to represent whichever item is
 * activated in the code.
 */
function switchUIActivatedItem(newActivatedItemIndex) {
    let i = 0;

    // Loop over our list of DOM elements
    itemButtons.forEach((element) => {
        // Remove all classes then add the correct ones to show if
        // the item is selected or not.

        if (i === newActivatedItemIndex) {
            element.classList.remove("item-button-deselected");

            if (!element.classList.contains("item-button-selected")) {
                element.classList.add("item-button-selected");
            }
        } else {
            element.classList.remove("item-button-selected");

            if (!element.classList.contains("item-button-deselected")) {
                element.classList.add("item-button-deselected");
            }
        }

        i++;
    });
}

/**
 * Save the game to the local storage in the browser.
 */
function saveToLocalStorage() {
    localStorage.setItem(GAME_SAVE_KEY, scores);

    console.log(localStorage.getItem(GAME_SAVE_KEY));
}

/**
 * Returns the index of the DOM element from a name.
 * @param name The name of the element to look for.
 */
function getIndexFromName(name) {
    switch (name) {
        case "wheat":
            return 0;
        case "flour":
            return 1;
        case "dough":
            return 2;
        case "bread":
            return 3;

        default:
            return -1;
    }
}

/**
 * Returns the name of the DOM element from a index.
 * @param {int} index The index you want to convert to a name.
 */
function getNameFromIndex(index) {
    switch (index) {
        case 0:
            return "wheat";
        case 1:
            return "flour";
        case 2:
            return "dough";
        case 3:
            return "bread";

        default:
            return "none";
    }
}
