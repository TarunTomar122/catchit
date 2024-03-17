var audio = new Audio('./scripts/muse.mp3');

// if the width of the window is less than 600px
if(window.innerWidth < 800){

    let instructions = document.getElementById("instructions");
    instructions.innerHTML = `<p>Sorry, this game is not supported on mobile devices.</p>`;
    instructions.innerHTML += `<p>Please play on a desktop or laptop.</p>`;
    instructions.style.display = "block";
    document.getElementById("playarea").style.display = "none";
    document.getElementById("scorearea").style.display = "none";
    document.getElementById("endgamearea").style.display = "none";
    document.getElementById("contentarea").style.display = "none";
    document.getElementById("leaderboard").style.display = "none";

}

const levelInfo = {
    "1":{
        'transition': 2,
        'timer': 5,
    },
    "2":{
        'transition': 1.5,
        'timer': 4,
    },
    "3":{
        'transition': 1,
        'timer': 8,
    },
    "4":{
        'transition': 0.5,
        'timer': 15,
    },
    "5":{
        'transition': 0.3,
        'timer': 25,
    },
    "6":{
        'transition': 0.2,
        'timer': 25,
    },
    "7":{
        'transition': 0.1,
        'timer': 25,
    },
    "8":{
        'transition': 0.05,
        'timer': 30,
    },
    "9":{
        'transition': 0.01,
        'timer': 30,
    },
    "10":{
        'transition': 0.005,
        'timer': 30,
    },
    "11":{
        'transition': 0.001,
        'timer': 20,
    },
    "12":{
        'transition': 0.0005,
        'timer': 20,
    },
    "13":{
        'transition': 0.0001,
        'timer': 10,
    }
}

function fillSlider(seconds) {
    const fill = document.getElementById('fill');
    const slider = document.getElementById('time-slider');

    // Display the slider
    slider.style.display = 'block';

    // Reset the fill width immediately without transition
    fill.style.transition = 'none';
    fill.style.width = '0';

    // Force a reflow to make sure the above changes are applied before adding the transition
    void fill.offsetWidth;

    // Add the transition and start filling
    fill.style.transition = `width ${seconds}s linear`;
    fill.style.width = '100%';

    // Create the event listener function
    const onTransitionEnd = () => {
        // Once the transition ends, reset the fill width and hide the slider
        fill.style.width = '0';
        slider.style.display = 'none';

        // Remove the event listener
        fill.removeEventListener('transitionend', onTransitionEnd);
    };

    // Add the event listener for the transitionend event
    fill.addEventListener('transitionend', onTransitionEnd);
}

function showInstructions1(level){
    document.getElementById("instructions").style.display = "block";
    document.getElementById("instructions").innerText = `Congrats! You have reached level ${level}`;
    setTimeout(() => {
        document.getElementById("instructions").style.display = "none";
    }, 2000);
}

let level = 1;

let timeout = null;

const startGame = () => {

    document.getElementById("contentarea").style.display = "none";
	document.getElementById("leaderboard").style.display = "none";
    document.getElementById("instructions").style.display = "none";
	document.getElementById("playarea").style.display = "block";
	document.getElementById("scorearea").style.display = "block";
	document.getElementById("endgamearea").style.display = "none";

    if(localStorage.getItem("catchitLevel") !== null){
        level = localStorage.getItem("catchitLevel");
    }else{
        localStorage.setItem("catchitLevel", level);
    }

    document.getElementById("scorearea").innerText = "Level: " + level;

    const buttonborder = document.getElementById("buttonborder");

    const runAwayButton = document.getElementById("runawayButton");

    const transition = levelInfo[level].transition;

    // Set the CSS transition property
    buttonborder.style.transition = `top ${transition}s, left ${transition}s`;

    // if the mouse pointer is near the button, move the button to a new location animated
    buttonborder.addEventListener("mouseover", () => {
        let x = Math.random() * (window.innerWidth - buttonborder.clientWidth);
        let y = Math.random() * (window.innerHeight - buttonborder.clientHeight);
        buttonborder.style.left = x + "px";
        buttonborder.style.top = y + "px";
    });

    runAwayButton.addEventListener("pointerdown", () => {

        fillSlider(0);
        clearTimeout(timeout);

        level++;

        document.getElementById("scorearea").innerText = "Level: " + level;
        document.getElementById("playarea").style.display = "none";
        document.getElementById("instructions").style.display = "block";
        document.getElementById("instructions").innerText = `Moving on to level: ${level}`;

        setTimeout(() => {
            setupLevel(level);
        }, 2000);
    });

    setupLevel(level);

}

function setupLevel(level){

    document.getElementById("instructions").style.display = "none";
	document.getElementById("playarea").style.display = "block";
	document.getElementById("scorearea").style.display = "block";


    const transition = levelInfo[level].transition;

    const buttonborder = document.getElementById("buttonborder");
    // Set the CSS transition property
    buttonborder.style.transition = `top ${transition}s, left ${transition}s`;

    fillSlider(levelInfo[level].timer);

    timeout = setTimeout(() => {
        console.log("stopping the game...");
        document.getElementById("playarea").style.display = "none";
        
        let instructions = document.getElementById("instructions");

        instructions.style.display = "flex";
        instructions.innerHTML = `<p>Nice try! You messed up on level ${level}!</>`;

        if(localStorage.getItem('username') === null){

            instructions.style.top = "25vh";
            instructions.innerHTML += `<p>Submit your score on the <a href="/catchit">leaderboard</a>.</P>`;
            // add a input field for user to enter their name
            instructions.innerHTML += `<input type="text" id="name" placeholder="username">`;
            // add a button to submit the score
            instructions.innerHTML += `<button onclick="submitScore()">Submit</button></br>`;	

            instructions.innerHTML += `<p>or just play again maybe?</p>`;
        }
        else{
            const name = localStorage.getItem("username");
            
            instructions.style.top = "25vh";
            instructions.innerHTML += `<p>Submitting rank...</p>`;

            window.saveScore(name, level).then(() => {
                instructions.innerHTML = `<p>Nice try! You messed up on level ${level}!</>`;
                instructions.innerHTML += `<p>You are ranked <span style="color: #ffc400">${window.rank}</span> on the <a href="/catchit">leaderboard</a>!</p>`;
                instructions.innerHTML += `<button onclick="startGame()">Play Again</button>`;
    
            });
        }

        if(localStorage.getItem("catchitLevel") == undefined ||  level > parseInt(localStorage.getItem("catchitLevel"))){	
            localStorage.setItem("catchitLevel", level);
        }

        // add a button to play again
        instructions.innerHTML += `<button onclick="startGame()">Play Again</button>`;

    }, levelInfo[level].timer*1000);

}

const submitScore = () => {
	var name = document.getElementById("name").value;
	localStorage.setItem("username", name);

    let instructions = document.getElementById("instructions");
    instructions.style.top = "25vh";
	// show a loading message
	instructions.innerHTML = `<p>Submitting...</p>`;

	window.saveScore(name, localStorage.getItem('catchitLevel')).then(() => {
		
		instructions.innerHTML += `<p>You are ranked <span style="color: #ffc400">${window.rank}</span> on the <a href="/catchit">leaderboard</a>!</p>`;
		instructions.innerHTML += `<button onclick="startGame()">Play Again</button>`;

	});
}