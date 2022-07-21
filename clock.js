let bool = false; //tracks whether the clock is paused or not
let button = document.getElementById("start_button");
let clock = document.getElementsByClassName("clock")[0];
let duration = document.getElementById("time").value;
duration = duration * 60;

function update_label () {

    minutes = parseInt(duration / 60, 10);
    seconds = parseInt(duration % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    clock.textContent = minutes + ":" + seconds;
    duration--;

    // if (!minutes) {
    //     duration = 15;
    //     clock.innerHTML = (minutes + ':' + seconds);
    // } else {
    //     clock.innerHTML = (minutes + ":" + seconds);
    //     seconds--;
    // }
}
function start_stop (){
    if(!bool) {
        interval = setInterval(update_label, 1000);
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
        settings_menu.style.display = "flex";
    }
    else{
        settings_menu.style.display = "none";
        main.style.display = "block";
    }
}
settings_button.onclick = display_menu;

