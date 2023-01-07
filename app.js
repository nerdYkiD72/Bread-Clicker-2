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

// ##############
// ### EVENTS ###
// ##############

function activatedItemClicked() {
    let index = getIndexFromName(activatedItem);
    // Before we increment the score we need to check
    // to see if there is enough of the previous item
    // available to make the current item.

    if (index > 0) {
        // If wheat is not selected.
        if (scores[index - 1] >= itemCosts[index]) {
            console.log("You can buy this");
            scores[index - 1] -= itemCosts[index];

            scores[index] += 1;
        }
    } else if (index == 0) {
        scores[index] += 1;
    }

    // Display that score on the UI
    let i = 0;
    uiItemScores.forEach((element) => {
        element.textContent = scores[i];
        i++;
    });
    console.log(scores);
}

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
