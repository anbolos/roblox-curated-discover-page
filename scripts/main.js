/* CONSTANTS */

/* WEBSITE INFORMATION CONSTANTS */
const DATE_GAMES_ADDED = new Date(2021,6,31);
const DATE_OF_CREATION = new Date(2021,6,9);
const DATE = new Date();
const ROBLOX_MADE_ANNOUNCEMENT = false;

/* GAME AND TAG CONSTANTS */

// GAMES holds game objects
// Game anchor/buttons hold a game obects's information, including all tag names, but not the tag object

const GAMES = [];
const GAME_URL = "https://www.roblox.com/games/";

// TAGS hold tag objects
// TAG_NAMES hold strings 
// Tag buttons holds a tag objects's information

const TAGS = [];

/* HTML ELEMENT CLASS CONSTANTS */

const TAG_CLASS_NAMES = "btn tag";
const DISABLED_TAG = "disabled";
const HIDE_TAG = "hide";

/* VARIABLES */

let gamesFound = []; 
let tagsIncluded = [];
let keywords = [];
let numOfGames = 0;
let numOfRecentlyAddedGames = 0;

/* GAME CREATION FUNCTIONS */

function developerNotInGames(developer) {
  for (let i = 0; i < GAMES.length; i++) {
    if (GAMES[i].developer === developer) {
      return false;
    }
  }
  return true;
}

function verifyTags(tags) {
  if (tags.length === 0) { throw "Tags is an empty array"; }
  tags.forEach(function(tag){
    if (typeof(tag) !== "string") { throw "Tag '" + tag + "' is not a string"; }
    if (tag.length === 0) { throw "Tag is an empty string"; } 
    if (!TAG_DATA.includes(tag)) { throw "Tag '" + tag + "' is not defined in TAG_DATA"; } 
  });
}

function catchErrors(title,developer,gameId,tags,recentlyAdded) {
  try {
    if (typeof(title) !== "string") { throw "Title '" + title + "' should be defined as a string"; }
    if (typeof(developer) !== "string") { throw "Developer '" + developer + "' should be defined as a string"; }
    if (!developerNotInGames(developer)) { throw "Developer '" + developer + "' already has a game in GAME_DATA"; }
    if (typeof(gameId) !== "string" ) { throw "GameId '" + gameId + "' should be defined as a string"; }
    if (parseFloat(gameId).toString().length !== gameId.length) { throw "GameId '" + gameId + "' is invalid"; }
    if (typeof(tags) !== "object") { throw "Tags is not an array"; }
    if (typeof(recentlyAdded) !== "boolean" ) { throw "Recently Added should be defined as a boolean"; }
    verifyTags(tags);
  } 
  catch (err) {
    console.log("Error while creating game object " + (numOfGames + 1) + " with the title, " + title + " : " + err);
    return true;
  }
  return false;
}

function createGame(array) {
  let title = array[0];
  let developer = array[1];
  let gameId = array[2];
  let tags = array[3];
  let recentlyAdded = array[4];
  if (catchErrors(title,developer,gameId,tags,recentlyAdded)) { return; }
  if (recentlyAdded) { numOfRecentlyAddedGames++ };
  const game = {
    title: title,
    developer: developer,
    link: GAME_URL + gameId,
    tags: tags.sort(), // Stores tag names, not tag objects
    recentlyAdded: recentlyAdded,
  }
  numOfGames++;
  GAMES.push(game);
  tags.push("All Games");
}

// https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
function shuffleGames(games) {
  let i = games.length;
  while (i > 0) {
    let randomIndex = Math.floor(Math.random() * i);
    i -= 1;
    let temp = games[i];
    games[i] = games[randomIndex];
    games[randomIndex] = temp;
  }
  return games;
}

/* TAG CREATION FUNCTIONS */

function getGamesWithTag(tag) {
  let gamesWithTag = 0;
  GAMES.forEach(function(game){
    if (game.tags.includes(tag)) {
      gamesWithTag++;
    }
    if (game.recentlyAdded && tag === "Recently Added") {
      gamesWithTag++;
    }
  });
  return gamesWithTag;
}

function createTag(name,id) {
  const tag = {
    name: name,
    gamesWithTag: getGamesWithTag(name),
    id: id
  }
  TAGS.push(tag);
}

function getTag(tagId) {
  return TAGS[tagId];
}

/* GAME CREATION */

for (let i = 0; i < GAME_DATA.length; i++) {
  createGame(GAME_DATA[i]);
}

/* TAG CREATION */

// Note: Tags are created after games because they need the number of games with their tag

for (let i = 0; i < TAG_DATA.length; i++) {
  createTag(TAG_DATA[i],i);
}

/* WEBSITE INFORMATION FUNCTIONS */

function showNumOfGames() {
  let numOfGamesHeader = document.getElementById("game-counter");
  if (numOfGames === 1) {
    numOfGamesHeader.textContent = "There is currently only one game on the RCDP.";
  } else {
    numOfGamesHeader.textContent = "There are currently " + numOfGames + " games on the RCDP!";
  }
}

function showRecentlyAddedGames() {
  let month = DATE_GAMES_ADDED.getUTCMonth() + 1;
  let day = DATE_GAMES_ADDED.getUTCDate();
  let year = DATE_GAMES_ADDED.getUTCFullYear();
  let date =  month + "/" + day + "/" + year;
  document.getElementById("recently-added").textContent = "As of " + date + ", " + numOfRecentlyAddedGames + " games were added to the RCDP.";
}

function calculateDaysBetweenNowAndCreation() {
  let timeDifference = DATE.getTime() - DATE_OF_CREATION.getTime();
  let daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));  
  return daysDifference;
}

/* ONLOAD FUNCTIONS */

function onLoadIndex() {
  showNumOfGames();
  showRecentlyAddedGames();
}

function onLoadDiscover() {
  TAGS.forEach(createTagButton);
  showClearTagsButton(tagsIncluded.length);
}

function onLoadAbout() {
  let announcement = ROBLOX_MADE_ANNOUNCEMENT && "Roblox has made an announcement to improve game discovery! Yay!" || "Roblox has yet to make an announcement on  improving game discovery.";
  document.getElementById("days-since-creation").textContent = "It has been " + calculateDaysBetweenNowAndCreation() + " days since the website was created." + " " + announcement;
}

/* ONCLICK FUNCTIONS */

function onClickTag(tag) {
  if (tag.className === TAG_CLASS_NAMES) {
    tag.className = tag.className + " included";
    tag.style.backgroundColor = "#ffffff";
    tag.style.color = "#181818";
    tag.style.borderColor = "#181818";
    tag.style.fontWeight = "600";
  } else {
    tag.className = TAG_CLASS_NAMES;
    resetTagStyle(tag);
  }
  tagsIncluded = getTagsIncluded();
  findGames();
}

function onClickSearch() {
  findGames();
}

function onKeyPressSearch(event) {
  let input = event.which || event.keyCode;
  if (input == 13) {
    findGames();
  }
}

function getRandomGame() {
  let game;
  if (gamesFound.length <= 1) {
    game = GAMES[Math.floor(Math.random() * GAMES.length)];
  } else {
    game = gamesFound[Math.floor(Math.random() * gamesFound.length)];
  }
  document.getElementById("random-game-anchor").href =  game.link || game.href;
}

function clearTags() {
  getTagsIncluded().forEach(function(tag) {
    let tagBtn = document.getElementById(tag.id);
    tagBtn.className = TAG_CLASS_NAMES;
    resetTagStyle(tagBtn);
  });
  tagsIncluded = getTagsIncluded();
  showNumOfTagsIncluded(tagsIncluded.length);
  findGames();
}

function toggleTagsWithNoGames() {
  let tagsWithNoGames = Array.from(document.getElementsByClassName(DISABLED_TAG));
  let showTagsNoGamesButton = document.getElementById("show-tags-no-games-btn");
 tagsWithNoGames.forEach(function(tag) {
    if (tag.style.display === "none") {
      showTagsNoGamesButton.textContent = "Hide Tags With No Games";
      tag.style.display = "";
    } else {
      showTagsNoGamesButton.textContent = "Show Tags With No Games";
      tag.style.display = "none";
    }
  });
}

function toggleAllTags() {
  let tags = Array.from(document.getElementsByClassName("tag"));
  let showTagsButton = document.getElementById("show-tags-btn");
  tags.forEach(function(tag){
    if (tag.style.display === "") {        
      tag.style.display = "none";
    } else {
      tag.style.display = "";
    }
  });
}

/* TAG FUNCTONS */

function getTagsIncluded() {
  let tags = Array.from(document.getElementsByClassName("included"));
  let tagsIncluded = [];
  tags.forEach(function(tag){
    tagsIncluded.push(getTag(tag.id));
  });
  showClearTagsButton(tagsIncluded.length);
  showNumOfTagsIncluded(tagsIncluded.length);
  return tagsIncluded;
}

/* HTML BUTTON FUNCTIONS */

function resetTagStyle(tag) {
  tag.style.backgroundColor = "";
  tag.style.color = "";
  tag.style.borderColor = "";
  tag.style.fontWeight = "";
}

function createTagButton(tag) {
  let button = document.createElement("button");
  let span = document.createElement("span");
  span.className = "tag-span";
  if (tag.gamesWithTag !== 0) {
    span.textContent = " (" + tag.gamesWithTag + ")";
    button.textContent = tag.name;
    button.className = TAG_CLASS_NAMES;
  } else {
    button.textContent = tag.name;
    button.className = TAG_CLASS_NAMES + " " + DISABLED_TAG;
    button.style.display = "none";
  }
  button.id = tag.id;
  button.onclick = function(){onClickTag(button)};
  button.appendChild(span);
  document.getElementById("tags").appendChild(button);
}

function createGameButton(game) {
  let a = document.createElement("a");
  a.className = "game-anchor";
  a.id = game.title;
  a.href = game.link;
  a.target = "_blank";

  let button = document.createElement("button");
  button.className = "btn game-btn";

  let gameSpan = document.createElement("span");
  gameSpan.className = "game-span";

  let gameTitleSpan = document.createElement("span");
  gameTitleSpan.className = "game-title-span";

  let gameDeveloperSpan = document.createElement("span");
  gameDeveloperSpan.className = "game-developer-span";

  gameTitleSpan.textContent = game.title; 
  gameDeveloperSpan.textContent = "by " + game.developer;

  gameSpan.appendChild(gameTitleSpan);
  gameSpan.appendChild(gameDeveloperSpan);

  let gameTagSpan = document.createElement("span");
  gameTagSpan.className = "game-tag-container";
  for (let i = 0; i < game.tags.length; i++) {
    let span = document.createElement("span");
    if (game.tags[i] === "All Games") { continue; }
    span.className = "game-tag";
    span.textContent = game.tags[i];
    gameTagSpan.appendChild(span);
  }

  button.onmouseover = function(){
    let gameTags = Array.from(gameTagSpan.children);
    for (let i = 0; i < gameTags.length; i++) {
      gameTags[i].style.backgroundColor = "#181818";
      gameTags[i].style.color = "#ffffff";
      gameTags[i].style.borderColor = "#ffffff";
      gameTags[i].style.fontWeight = "200";
    }
  };
  button.onmouseout = function(){
    let gameTags = Array.from(gameTagSpan.children);
    for (let i = 0; i < gameTags.length; i++) {
      gameTags[i].style.backgroundColor = "#ffffff";
      gameTags[i].style.color = "#181818";
      gameTags[i].style.borderColor = "#ffffff";
      gameTags[i].style.fontWeight = "600";
    }
  };

  a.appendChild(button);
  button.appendChild(gameSpan)
  button.appendChild(gameTagSpan);
  document.getElementById("game-container").appendChild(a);
  return a;
}

/* HELPER FUNCTIONS FOR findGames() */

function getKeywords() {
  let searchBar = document.getElementById("search-bar");
  searchBar.value = searchBar.value.trim();
  if (searchBar.value === "") {
    keywords = [];
  } else {
    keywords = searchBar.value.split(" ");
  }
}

function clearGamesFound() {
  let gamesAnchors = Array.from(document.getElementById("game-container").getElementsByClassName("game-anchor"));
  gamesAnchors.forEach(function(gamesAnchor){
    gamesAnchor.remove();
  });
  gamesFound = [];
  document.getElementById("result").textContent = "";
}

function gameHasTagsIncluded(game) {
  let hasTag = true;
  tagsIncluded.forEach(function(tag){
    if (!game.tags.includes(tag.name)) {
      hasTag = false;
    }
    if (game.recentlyAdded && tag.name === "Recently Added") {
      hasTag = true;
    }
  });
  return hasTag;
}

function gameHasKeywords(game) {
  if (keywords.length === 0) { return true; } 
  let hasKeyword = false;
  game.title.toLowerCase().split(" ").forEach(function(word){
    keywords.forEach(function(keyword){
      if (word === keyword) {
        hasKeyword = true;
      }
    });
  });
  return hasKeyword;
}

function showNumOfGamesFound(num) {
  let gamesFoundHeader = document.getElementById("result");
  const suggestion = "Try searching for a different keyword or reduce the amount of tags included.";
  if (num === 0) {
    gamesFoundHeader.textContent = "There were no games found with matching results. " + suggestion;
  } else if (num === 1) {
    gamesFoundHeader.textContent = "There was only one game found with matching results. " + suggestion;
  } else {
    gamesFoundHeader.textContent = "There were " + num + " games found with matching results.";
  }
}

function showNumOfTagsIncluded(num) {
  let numOfTagsIncluded = document.getElementById("tags-included-counter");
  if (num === 0) {
    numOfTagsIncluded.textContent = "";
  } else if (num === 1) {
    numOfTagsIncluded.textContent = "(one tag included)";
  } else {
    numOfTagsIncluded.textContent = "(" + num + " tags included)";
  }
}

function showGamesFound() {
  gamesFound = shuffleGames(gamesFound);
  gamesFound.forEach(function(game){
    createGameButton(game);
  });
}

function showClearTagsButton(numTags) {
  let clearTagsButton = document.getElementById("clear-tags-btn");
  if (numTags > 1) { 
    clearTagsButton.style.display = "";
  } else {
    clearTagsButton.style.display = "none";
  }
}

function findGames() {
  getKeywords();
  clearGamesFound();

  if (GAMES.length === 0 || tagsIncluded.length === 0 && keywords.length === 0) { return; }

  let numOfGamesFound = 0;
  GAMES.forEach(function(game){
    if (gameHasTagsIncluded(game) && gameHasKeywords(game)) {
      numOfGamesFound++;
      gamesFound.push(game);
    }
  });

  showGamesFound();
  showNumOfGamesFound(numOfGamesFound);
}