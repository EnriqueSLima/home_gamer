let bool = false; //tracks whether the clock is paused or not
let button = document.getElementById("start_button");
let clock = document.getElementsByClassName("clock")[0];
let small = document.getElementsByClassName("small_blind");
let big = document.getElementsByClassName("big_blind");
let blinds = document.getElementsByClassName("levels")[0];
let duration = document.getElementsByClassName("time");
let rounds_counter = 0;
duration[rounds_counter].value *= 60;
blinds.innerHTML = small[rounds_counter].value + "/" + big[rounds_counter].value

function update_blinds() {
    rounds_counter++;
    blinds.innerHTML = small[rounds_counter].value + "/" + big[rounds_counter].value;
}

function update_timer () {
    if (duration[rounds_counter].value == 0) { 
        update_blinds();
        duration[rounds_counter].value *= 60;
    }

    let minutes = parseInt(duration[rounds_counter].value / 60, 10);
    let seconds = parseInt(duration[rounds_counter].value % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    clock.innerHTML = minutes + ":" + seconds;
    duration[rounds_counter].value--;

}
function start_stop (){
    if(!bool) {
        interval = setInterval(update_timer, 1000);
        button.innerHTML = "Stop";
        bool = true;
    }
    else {
        clearInterval(interval);
        button.innerHTML = "Start";
        bool = false;
    }
}
button.onclick = start_stop;

// Settings menu
let settings_button = document.getElementById("settings_button");
let settings_menu = document.getElementsByClassName("settings_menu")[0];
let main = document.getElementById("main");
let field = document.getElementById("field_size");
let buyin = document.getElementById("buyin_amount");

settings_menu.style.display = "none";
function display_menu() {
    if (settings_menu.style.display == "none") {
        main.style.display = "none";
        settings_menu.style.display = "grid";
    }
    else{
        settings_menu.style.display = "none";
        main.style.display = "block";
    }
}
settings_button.onclick = display_menu;

