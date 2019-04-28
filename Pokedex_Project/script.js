//ID Selectors
const generatedImage = document.getElementById('generatedImage');
const navSelect = document.getElementById('navSelect');
const pokemonCard = document.getElementById('pokemonCard');
const pokemonDescription = document.getElementById('pokemonDescription');
const pokemonName = document.getElementById('pokemonName');
const pokemonType = document.getElementById('pokemonType');
const searchBar = document.getElementById('searchBar');
const searchButton = document.getElementById('searchButton');
const selected = document.getElementById('selected');
const statNav = document.getElementById('statNav');

//Class Selectors
const ATK = document.getElementsByClassName('statProgress')[1];
const atkProgressBarChild = document.getElementsByClassName('progressBarChild')[1];
const DEF = document.getElementsByClassName('statProgress')[2];
const defProgressBarChild = document.getElementsByClassName('progressBarChild')[2];
const HP = document.getElementsByClassName('statProgress')[0];
const hpProgressBarChild = document.getElementsByClassName('progressBarChild')[0];
const SATK = document.getElementsByClassName('statProgress')[3];
const satkProgressBarChild = document.getElementsByClassName('progressBarChild')[3];
const SDEF = document.getElementsByClassName('statProgress')[4];
const sdefProgressBarChild = document.getElementsByClassName('progressBarChild')[4];
const SPD = document.getElementsByClassName('statProgress')[5];
const spdProgressBarChild = document.getElementsByClassName('progressBarChild')[5];
const statName = document.getElementsByClassName('statName');
const progressBarBackground = document.getElementsByClassName('progressBar');

//Event Listeners
searchButton.addEventListener('click', () => {
    fetchPokemon(searchBar.value);
});

searchBar.addEventListener('keyup', (event) => {
    if(event.keyCode === 13 && searchBar.value !== "") {
        event.preventDefault();
        fetchPokemon(searchBar.value);
    }
});
//charmander umbreon
searchBar.addEventListener('input', () => {
    if(searchBar.value !== "") {
        searchButton.disabled = false;
        searchButton.style.backgroundColor = "lightgreen";
    } else if(searchBar.value === "") {
        searchButton.disabled = true;
        searchButton.style.backgroundColor = "whitesmoke";
    }
});


//Functions
//Assigns application theme color based on Pokemon type
function assignApplicationThemeColor(type) {
    switch (type) {
        case "electric": 
           updateApplicationThemeColor("yellow");
           selected.style.color = "black";
           for(let i = 0; i < statName.length; i++) {
            statName[i].style.color = "black";   
        }
            break;
        case "water":
           updateApplicationThemeColor("#87ceeb");
            break;
        case "fire":
           updateApplicationThemeColor("orange");
            break;
        case "grass":
           updateApplicationThemeColor("lightgreen");
            break;
        case "normal":
           updateApplicationThemeColor("#FFFFF0");
           selected.style.color = "black";
           for(let i = 0; i < statName.length; i++) {
            statName[i].style.color = "black";   
        }
            break;
        case "fighting":
           updateApplicationThemeColor("#FF6347");
            break;
        case "ground":
           updateApplicationThemeColor("tan");
            break;
        case "psychic":
           updateApplicationThemeColor("pink");
            break;
        case "rock":
           updateApplicationThemeColor("#FF8C00");
            break;
        case "psychic":
           updateApplicationThemeColor("pink");
            break;
        case "dark":
           updateApplicationThemeColor("#505050");
           pokemonType.style.color = "white";
            break;
        case "steel":
           updateApplicationThemeColor("lightgray");
           for(let i = 0; i < progressBarBackground.length; i++) {
            progressBarBackground[i].style.backgroundColor = "darkgray";
           }
            break;
        case "ice":
           updateApplicationThemeColor("lightblue");
            break;
        case "poison":
           updateApplicationThemeColor("purple");
            break;
        case "flying":
           updateApplicationThemeColor("#DDA0DD");
            break;
        case "bug":
           updateApplicationThemeColor("#CCCC00");
            break;
        case "ghost":
           updateApplicationThemeColor("#4B0082");
            break;
        case "dragon":
           updateApplicationThemeColor("#8A2BE2");
            break;
        case "fairy":
           updateApplicationThemeColor("#DB7093");
            break;
        default:
           updateApplicationThemeColor("white");
    }
}

function calcMaxAndBaseHP(baseStat) {
    const maxHP = baseStat * 2 + 110;
    const baseHPPercentOfMax = (baseStat / maxHP) * 100 + "%";
    console.log("HP: ", baseHPPercentOfMax);
    return baseHPPercentOfMax;
}

function calcMaxAndBaseStats(baseStat) {
    const maxStat = (baseStat * 2 + 99) * 1.1;
    const basePercentOfMax = (baseStat / maxStat) * 100 + "%";
    console.log("Stat: ", basePercentOfMax);
    return basePercentOfMax;
}

function fetchPokemon(searchRequest) {
        resetSearch()
        if(verifyInput(searchRequest) === true) {
                const pokemon = "https://pokeapi.co/api/v2/pokemon/" + searchRequest.toLowerCase() + "/";
                //Fetch to retrieve Image and Description
                fetch(pokemon)
                .then(response => response.json())
                .then(data => generatePokemon(data.sprites.front_default, data.species.name, data.species.url))
                .catch((error) => {
                    generatedImage.innerHTML = "<img class='pokemonImage' src='https://s3.amazonaws.com/tinycards/image/c2fc8f976103d5605984f4fb5b5b3ac1'>";
                });
                //Fetch to retreive Type
                fetch(pokemon)
                .then(response => response.json())
                .then(data => getType(data.types[0].type.name));
                fetch(pokemon)
                .then(response => response.json());
                //Fetch to retrieve Stats
                fetch(pokemon)
                .then(response => response.json())
                .then(data => generateStats(data.stats))
        }
}

//Fetches description of Pokemon using fetched Pokemon's species # to access another API that contains the description
function fetchDescription(description) {
    const speciesNum = parseInt(description.split("https://pokeapi.co/api/v2/pokemon-species/")[1].split("/"));
    const speciesLink = "https://pokeapi.co/api/v2/pokemon-species/" + speciesNum + "/";
    fetch(speciesLink)
    .then(response => response.json())
    .then(data => generateDescription(data.flavor_text_entries))
}

//Searches description API for the English description
function findEnglishDescription(flavorTexts) {
    return flavorTexts.find(description => description.language.name === 'en')["flavor_text"];
}

//Displays description of fetched Pokemon
function generateDescription(entries) {
    const description = findEnglishDescription(entries);
    const descriptionHTML = "<p class='pokemonDescription'>" + description + "</p>";
    pokemonDescription.innerHTML = descriptionHTML;
}

//Displays image of fetched Pokemon
function generateImage(image, name) {
    console.log(name);
    const img = "<img class='pokemonImage' src='" + image + "' alt='" + name + "'>";
    const h2 = "<h2 class='pokemonName'>" + upperCaseFirstChar(name) + "</h2>"
    generatedImage.innerHTML = img;
    pokemonName.innerHTML = h2;
}

function generatePokemon(image, name, description) {
    generateImage(image, name);
    fetchDescription(description);
}

function setStatsDisplayToFlex() {
    navSelect.style.display = "flex";
    HP.style.display = "flex";
    ATK.style.display = "flex";
    DEF.style.display = "flex";
    SATK.style.display = "flex";
    SDEF.style.display = "flex";
    SPD.style.display = "flex";
}

function setStatsDisplayToNone() {
    navSelect.style.display = "none";
    HP.style.display = "none";
    ATK.style.display = "none";
    DEF.style.display = "none";
    SATK.style.display = "none";
    SDEF.style.display = "none";
    SPD.style.display = "none";
}

function generateStats(data) {
    const baseHPPercentage = calcMaxAndBaseHP(data[5].base_stat);
    const baseATKPercentage = calcMaxAndBaseStats(data[4].base_stat);
    const baseDEFPercentage = calcMaxAndBaseStats(data[3].base_stat);
    const baseSATKPercentage = calcMaxAndBaseStats(data[2].base_stat);
    const baseSDEFPercentage = calcMaxAndBaseStats(data[1].base_stat);
    const baseSPDPercentage = calcMaxAndBaseStats(data[0].base_stat);
    setStatsDisplayToFlex();
    hpProgressBarChild.style.width = baseHPPercentage;
    atkProgressBarChild.style.width = baseATKPercentage;
    defProgressBarChild.style.width = baseDEFPercentage;
    satkProgressBarChild.style.width = baseSATKPercentage;
    sdefProgressBarChild.style.width = baseSDEFPercentage;
    spdProgressBarChild.style.width = baseSPDPercentage;
}

//Takes data from fetch to get Pokemon type and print it below Pokemon name
function getType(type) {
    console.log(type);
    assignApplicationThemeColor(type);
    const typeHTML = "<h3 class='pokemonType'>" + upperCaseFirstChar(type) + "</h3>";
    pokemonType.innerHTML = typeHTML;
}

function resetSearch() {
    generatedImage.innerHTML = "";
    navSelect.style.display = "none";
    pokemonCard.style.backgroundColor = "lightgray";
    pokemonDescription.innerHTML = "";
    pokemonName.innerHTML = "";
    pokemonType.innerHTML = "";
    pokemonType.style.color = "black";
    HP.style.display = "none";
    setStatsDisplayToNone();
}

function updateApplicationThemeColor(color) {
    pokemonType.style.backgroundColor = color;
    pokemonType.style.borderRadius = "40px";
    pokemonCard.style.backgroundColor = color;
    selected.style.backgroundColor = color;
    selected.style.color = "white";
    selected.style.borderRadius = "40px";
    hpProgressBarChild.style.backgroundColor = color;
    atkProgressBarChild.style.backgroundColor = color;
    defProgressBarChild.style.backgroundColor = color;
    satkProgressBarChild.style.backgroundColor = color;
    sdefProgressBarChild.style.backgroundColor = color;
    spdProgressBarChild.style.backgroundColor = color;
    for(let i = 0; i < statName.length; i++) {
        statName[i].style.color = color;   
    }
}

function upperCaseFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function verifyInput(searchRequest) {
    const letters = /^[A-Za-z]+$/;
    if(searchRequest.match(letters)) {
        return true;
    } else if(searchRequest === "") {
        return false;
      } else {
        generatedImage.innerHTML = "<p class='noNumbersSpaces'>Do not enter numbers or spaces.</p>";
        return false;
    }
}
