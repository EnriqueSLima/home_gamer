let bool = false; //tracks whether the clock is paused or not
let button = document.getElementById("start_button");
let time = document.getElementById("time").value;
let clock = document.getElementsByClassName("clock")[0];
let number = 12;

clock.innerHTML = time + ':' + "0" + number;
function update_label () {
    if (!time) {
        time = 15;
        clock.innerHTML = (time + ':' + "0" + number).slice(-2);
    } else {
        clock.innerHTML = (time + ":" + "0" + number).slice(-2);
        number--;
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

