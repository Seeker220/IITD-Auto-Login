// ==UserScript==
// @name         Auto Solve CAPTCHA
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically solve CAPTCHA ( By Prashant )
// @match        *moodle.iitd.ac.in/login/index.php
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to fully load
    window.onload = function() {
let text = document.getElementById('login').innerText
let matches_sub = text.match(/Please subtract (\d+) - (\d+)/)
let matches_add1 = text.match(/Please add (\d+)/)
let matches_add2 = text.match(/(\d+) =/)
let matches_first_val = text.match(/first value (\d+) , (\d+)/)
let matches_second_val = text.match(/second value (\d+) , (\d+)/)
var val;
if (matches_add1){
    val = +matches_add1[1] + +matches_add2[1]
}
if (matches_sub){
    val = matches_sub[1] - matches_sub[2]
}
if (matches_first_val){
    val = matches_first_val[1]
}
if (matches_second_val){
    val = matches_second_val[2]
}
document.getElementById('valuepkg3').value = val
document.getElementById('username').value = 'xxxxxxxxx'  // fill your username here
document.getElementById('password').value = 'xxxxxxxx' // fill your password here
setTimeout(function() {
    document.getElementById('loginbtn').click();}, 30);

    };
})();
