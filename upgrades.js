var robotClicksPerSecond = 0;
var upgradesData;
var userUpgradesData;

var upgradeList = document.getElementById("upgrade-list");

const SAVE_KEY = "saved-upgrades";

loadUpgradeData();

// setInterval(() => {
//     console.log("High");
// }, 1000);

async function loadUpgradeData() {
    // Wait for the fetch method to get the upgrades file.
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

    // Now we can continue on working with the upgrade data.
    console.log(upgradesData);
    console.log(userUpgradesData);

    loadContentToPage("auto-wheat");
}

function saveUserUpgradeData() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(userUpgradesData));
}

/**
 * Updates the UI with information found in the upgrades.json file.
 * @param {string} location Defines what information to send to the UI.
 * Either enter the name of an upgrade or simply "all" to refresh every upgrade.
 */
function loadContentToPage(location) {
    console.log(`Updating the content of ${location}`);

    if (location === "all") {
        // Loop over the whole document to add data.
    } else {
        // Use the name given to find the upgrade item we want to pull data from.
        upgradesData.forEach((element) => {
            // Loop over the elements in our upgrades
            // file and select the one with the matching name.
            let upgradeLevel = 0;
            if (element.name === location) {
                console.log(`${location}-description`);

                appendUpgradeComponent(element);

                // Update the cost
                document.getElementById(`${location}-cost`).innerHTML = `$${
                    element.levels[userUpgradesData[element.name]].cost
                }`;

                // Update the description:
                document.getElementById(
                    `${location}-description`
                ).innerHTML = `${
                    element.levels[userUpgradesData[element.name]].description
                }`;

                // Update the title with format: "[UpgradeName] ([Level])"
                document.getElementById(`${location}-title`).innerHTML = `${
                    element.title
                } (${userUpgradesData[element.name]})`;
            }
        });
    }
}

/**
 * Adds an upgrade to the list in the UI.
 * @param {object} componentContent The object defining the upgrade component.
 */
function appendUpgradeComponent(componentContent) {
    console.log("Component Content:", componentContent);
    // The name that we will use in the id of the generated items.
    let name = componentContent.name;

    // Create the li element to place all content in.
    let ugBox = document.createElement("li");
    ugBox.classList.add("upgrade-box");

    // Create the title element, style it, add the id necessary to fill in data later.
    let ugTitle = document.createElement("h2");
    ugTitle.innerHTML = "Test";
    ugTitle.classList.add("upgrade-title");
    ugTitle.setAttribute("id", `${name}-title`);

    // Create the description element and add the id necessary to fill in data later.
    let ugDescription = document.createElement("p");
    ugDescription.innerHTML =
        " Lorem ipsum dolor sit amet consectetur adipisicing elit.";
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

    console.log(`Appended element: ${name}`);
}
