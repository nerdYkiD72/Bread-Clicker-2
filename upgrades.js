var robotClicksPerSecond = 0;
var upgradesData;
var userUpgradesData;

var upgradeList = document.getElementById("upgrade-list");

const SAVE_KEY = "saved-upgrades";

loadUpgradeData();

// setInterval(() => {
//     console.log("High");
// }, 1000);

/**
 * Loads data we need of what upgrades exist and the users progress.
 */
async function loadUpgradeData() {
    // Wait for the fetch method to get the upgrades.json file.
    await fetch("assets/resources/upgrades.json")
        .then(function (u) {
            return u.json();
        })
        .then(function (json) {
            upgradesData = json;
        });

    // As well as the data defining upgrades, we need to
    // load save data showing what upgrades the user has and
    // what level they are.
    let savedData = localStorage.getItem(SAVE_KEY);

    if (savedData) {
        userUpgradesData = JSON.parse(savedData);
    } else {
        // No saved data in local storage so we will initialize empty data.
        userUpgradesData = {};
        upgradesData.forEach((element) => {
            userUpgradesData[element.name] = -1;
        });
    }

    console.log("Loaded upgrades.json:", upgradesData);
    console.log("Loaded stored upgrade data:", userUpgradesData);

    // Now we can continue loading UI.
    handleLoad();
}

/**
 * Called after we have loaded all upgrade data.
 */
function handleLoad() {
    // Display a box for every upgrade we have.
    for (let i = 0; i < upgradesData.length; i++) {
        appendUpgradeComponent(upgradesData[i]);
    }

    // Fill those boxes with the necessary content.
    loadContentToPage("all");
}

/**
 * Updates the UI with information found in the upgrades.json file.
 * @param {string} location Defines what information to send to the UI.
 * Either enter the name of an upgrade or simply "all" to refresh every upgrade.
 */
function loadContentToPage(location) {
    console.log(`Updating the upgrade content of: "${location}"`);
    let found = false;

    if (location === "all") {
        // Loop over the whole document to add data.
        upgradesData.forEach((upgradeType) => {
            // Check if the element is there to update in the DOM.
            if (document.getElementById(upgradeType.name) != null) {
                found = true;
                contentLoader(upgradeType);
            }
        });
    } else {
        // Use the name given to find the upgrade item we want to pull data from.
        upgradesData.forEach((upgradeType) => {
            // Check if we are at the correct location and that the location exists in the DOM.
            if (upgradeType.name === location && document.getElementById(upgradeType.name) != null) {
                found = true;
                contentLoader(upgradeType);
            }
        });
    }
    if (!found) console.warn(`Could not fine the upgrade of type: "${location}" while trying to load content.`);
}

/**
 * Part of loadContentToPage() that interacts with the DOM.
 * @param {object} upgradeType The object from upgrades.json to load content from.
 */
function contentLoader(upgradeType) {
    let location = upgradeType.name;
    // If the stored level of the upgrade is not -1
    // then we know the level data is valid and we will
    // use that, otherwise we want to show the information
    // of the first level or index 0.
    let upgradeLevel = 0;
    if (userUpgradesData[upgradeType.name] > -1) {
        upgradeLevel = userUpgradesData[upgradeType.name];
    }

    // Update the cost
    document.getElementById(`${location}-cost`).innerHTML = `$${upgradeType.levels[upgradeLevel].cost}`;

    // Update the description:
    document.getElementById(`${location}-description`).innerHTML = `${upgradeType.levels[upgradeLevel].description}`;

    // Update the title with format: "[UpgradeName] ([Level])"
    document.getElementById(`${location}-title`).innerHTML = `${upgradeType.title} (${upgradeLevel + 1})`;
}

/**
 * Adds an upgrade to the list in the UI.
 * @param {object} componentContent The object defining the upgrade component.
 */
function appendUpgradeComponent(componentContent) {
    // The name that we will use in the id of the generated items.
    let name = componentContent.name;

    // Create the li element to place all content in.
    let ugBox = document.createElement("li");
    ugBox.classList.add("upgrade-box");
    ugBox.setAttribute("id", `${name}`);

    // Create the title element, style it, add the id necessary to fill in data later.
    let ugTitle = document.createElement("h2");
    ugTitle.innerHTML = "Test";
    ugTitle.classList.add("upgrade-title");
    ugTitle.setAttribute("id", `${name}-title`);

    // Create the description element and add the id necessary to fill in data later.
    let ugDescription = document.createElement("p");
    ugDescription.innerHTML = " Lorem ipsum dolor sit amet consectetur adipisicing elit.";
    ugDescription.setAttribute("id", `${name}-description`);

    let ugButton = document.createElement("button");
    ugButton.classList.add("purchase-button");
    ugButton.innerHTML = "Purchase";

    let ugCost = document.createElement("p");
    ugCost.classList.add("upgrade-cost");
    ugCost.innerHTML = "$100";
    ugCost.setAttribute("id", `${name}-cost`);

    /**  Will make something like this:
     * <li class="upgrade-box">
        <h2 class="upgrade-title" id="auto-wheat-title">
            Auto Wheat
        </h2>
        <p id="auto-wheat-description">
            Will automatically buy 1 wheat every 2 seconds
        </p>
        <button class="purchase-button">Purchase</button>
        <p class="upgrade-cost" id="auto-wheat-cost">$100</p>
    </li>
    */
    ugBox.appendChild(ugTitle);
    ugBox.appendChild(ugDescription);
    ugBox.appendChild(ugButton);
    ugBox.appendChild(ugCost);
    upgradeList.appendChild(ugBox);

    console.log(`Appended element: "${name}"`);
}

function saveUserUpgradeData() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(userUpgradesData));
}
