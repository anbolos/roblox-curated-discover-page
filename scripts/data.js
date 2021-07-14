// BAD PRACTICES AHEAD
// USES FUNCTIONS FROM main.js

/* GAMES */

createGame("Button Mashers","Anquilis","6180410179",["Comedy","Retro","Round-based","Recently Added"]);
createGame("Ice World Base","Anquilis","5382270896",["Space","Retro","Showcase","Recently Added"]);
createGame("Zombie Shooter","Anquilis","2659984536",["Zombie","Shooter","Recently Added"]);
createGame("Brick Battle Dawn","Anquilis","140695297",["Retro","Fighting","Gear","Recently Added"]);

/* TAGS */

// Note: Tags are created after games because they need the number of games with their tag

for (let i = 0; i < TAG_NAMES.length; i++) {
  createTag(TAG_NAMES[i],i);
}