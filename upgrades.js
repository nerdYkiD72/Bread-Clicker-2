var robotClicksPerSecond = 0;
var upgradesData;

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

    // Now we can continue on working with the upgrade data.
    console.log(upgradesData);

    console.log("Updating the UI from upgrades.json");
    loadContentToPage("auto-wheat");
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
        // Use the name given to find the upgrade item we want t pull data from.
        upgradesData.forEach((element) => {
            // Loop over the elements in our upgrades
            // file and select the one with the matching name.
            let upgradeLevel = 0;
            if (element.name === location) {
                console.log(`${location}-description`);
            }
        });
    }
}
