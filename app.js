// Wheat, flour, dough, bread, money
var scores = [0, 0, 0, 0, 0];

// Wheat: 0, Flour: 5 wheat, Dough: 10 flour, Bread: 10 dough
var itemCosts = [0, 5, 10, 10];

// Wheat: $0, Flour: $1, Dough: $5, Bread: $20
var itemValues = [0, 1, 5, 20];
var activatedItem = "wheat";
var GAME_SAVE_KEY = "GAME_SAVE";

// DOM Elements
const itemButtons = document.getElementsByClassName("activated-item-button");
const uiItemScores = document.getElementsByClassName("inv-item");

const imgList = document.querySelectorAll("img");
var activatedItemImage = document.getElementById("activated-item");
// Create our number formatter.
// Sauce: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

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

    // Add the corresponding amount of money necessary
    // when the item is clicked.
    scores[4] += itemValues[item];

    // Display that score on the UI
    updateUI();

    // Save the game every time the user clicks so they
    // don't lose progress if they close the page.
    saveToLocalStorage(scores);
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

window.onload = () => {
    scores = getLocalStorageData();
    updateUI();
    console.log("Loaded scores:", getLocalStorageData());
};

for (let i = 0; i < imgList.length; i++) {
    const element = imgList[i];
    element.ondragstart = () => {
        return false;
    };
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
    for (let i = 0; i < itemButtons.length; i++) {
        // Remove all classes then add the correct ones to show if
        // the item is selected or not.
        const element = itemButtons[i];

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
    }
}

/**
 * Save the game to the local storage in the browser.
 */
function saveToLocalStorage(data) {
    localStorage.setItem(GAME_SAVE_KEY, data);
}

/**
 * Load a save from the local storage in the browser.
 */
function getLocalStorageData() {
    let rawData = localStorage.getItem(GAME_SAVE_KEY);
    let data = [];

    if (rawData) {
        rawData.split(",").forEach((element) => {
            data.push(parseInt(element));
        });
    } else {
        data = [0, 0, 0, 0, 0];
    }

    return data;
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

function resetScores() {
    scores = [0, 0, 0, 0];
}

function setScore(index, score) {
    scores[index] = parseInt(score);
    updateUI();
    saveToLocalStorage(scores);
}

/**
 * Updates the UI of the app to reflect the value of
 * the 'scores' list and also changes the item buttons
 * accordingly to show the user what they can afford.
 */
function updateUI() {
    for (let i = 0; i < uiItemScores.length; i++) {
        const element = uiItemScores[i];
        element.textContent = scores[i];
    }
    // Manually change the money to add the dollar sign.
    uiItemScores.item(4).textContent = formatter.format(scores[4]);

    // We want to update the item buttons
    // to show if the user can afford it.
    for (let i = 0; i < itemButtons.length; i++) {
        const element = itemButtons[i];
        element.disabled = !canAfford(i);
        if (!canAfford(i)) element.classList.remove("item-button-selected");
    }
}
