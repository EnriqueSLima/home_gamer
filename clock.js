let bool = false; //tracks whether the clock is paused or not
let button = document.getElementById("start_button");
let time = document.getElementById("time").value;
let clock = document.getElementsByClassName("clock")[0];
// time = Number(time);
clock.innerHTML = time;
function update_label () {
    if (!time) {
        time = 15;
        clock.innerHTML = time;
    } else {
        // let date = new Date();
        // let minutes = date.getMinutes();
        // let seconds = date.getSeconds();
        // document.getElementsByClassName("clock")[0].innerHTML = `${minutes}:${seconds}`;
        clock.innerHTML = time;
        time--;
    }
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
let settings_menu = document.getElementById("settings_menu");
let main = document.getElementById("main");

settings_menu.style.display = "none";
function display_menu() {
    if (settings_menu.style.display == "none") {
        main.style.display = "none";
        settings_menu.style.display = "block";
    }
    else{
        settings_menu.style.display = "none";
        main.style.display = "block";
    }
}
settings_button.onclick = display_menu;

