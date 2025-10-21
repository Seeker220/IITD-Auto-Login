// ==UserScript==
// @name         Auto Solve CAPTCHA & Login
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Automatically solve CAPTCHA and login (By Prashant) - Modified for new Moodle, Webmail, eCampus, eAcademics
// @match        *://moodle.iitd.ac.in/login/index.php
// @match        *://moodlenew.iitd.ac.in/login/index.php
// @match        *://webmail.iitd.ac.in/roundcube/*
// @match        *://ecampus.iitd.ac.in/scorner/login
// @match        *://eacademics.iitd.ac.in/sportal/login
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    // !! IMPORTANT: Replace with your actual credentials !!
    const KERBEROS_USERNAME = 'YOUR_USERNAME_HERE'; // e.g., ce1279999
    const KERBEROS_PASSWORD = 'YOUR_PASSWORD_HERE';
    const ECAMPUS_USERNAME = 'YOUR_ENTRY_NUMBER_HERE'; // e.g., 2027CE19999
    const ECAMPUS_PASSWORD = 'YOUR_PASSWORD_HERE';
    // ---------------------

    window.onload = function() {

        // --- eAcademics Login ---
        if (window.location.hostname.includes('eacademics.iitd.ac.in')) {
            console.log('eAcademics script loaded. Waiting 2s for modal...');
            setTimeout(function() {
                // 1. Check for and close the modal
                const closeButton = document.querySelector('.modal-footer .btn.btn-success[data-dismiss="modal"]');
                if (closeButton) {
                    console.log('Modal found, closing...');
                    closeButton.click();
                } else {
                    console.log('No modal found, proceeding.');
                }

                // 2. Find and click the "Click here to login" button
                const loginButton = document.querySelector('a.login100-form-btn');
                if (loginButton) {
                    console.log('Login button found, clicking...');
                    loginButton.click();
                } else {
                    console.error('eAcademics login button not found!');
                }
            }, 2000); // Wait 2 seconds for modal to appear

            return; // Exit early for eAcademics
        }

        // --- eCampus Login ---
        if (window.location.hostname.includes('ecampus.iitd.ac.in')) {
            console.log('eCampus script loaded. Waiting 2s for modal...');
            // Wait for modal to appear, then close it if present
            setTimeout(function() {
                const closeButton = document.querySelector('.modal-footer .btn.btn-success[data-dismiss="modal"]');
                if (closeButton) {
                    console.log('eCampus modal found, closing...');
                    closeButton.click();
                }

                // Fill in credentials regardless of whether modal was found
                setTimeout(function() {
                    const usernameField = document.querySelector('input[name="username"][placeholder="Entry Number"]');
                    const passwordField = document.querySelector('input[name="password"]');
                    const submitButton = document.querySelector('input[type="submit"][value="Sign In"]');

                    if (usernameField) {
                        usernameField.value = ECAMPUS_USERNAME;
                        console.log('eCampus username filled.');
                    }
                    if (passwordField) {
                        passwordField.value = ECAMPUS_PASSWORD;
                        console.log('eCampus password filled.');
                    }

                    // Submit after filling
                    setTimeout(function() {
                        if (submitButton) {
                            console.log('Submitting eCampus login...');
                            submitButton.click();
                        }
                    }, 200);
                }, 500);
            }, 2000);

            return; // Exit early for eCampus
        }

        // --- Roundcube Webmail Login ---
        if (window.location.hostname.includes('webmail.iitd.ac.in')) {
            console.log('Webmail script loaded.');
            const usernameField = document.getElementById('rcmloginuser');
            const passwordField = document.getElementById('rcmloginpwd');
            const loginButton = document.getElementById('rcmloginsubmit');

            if (usernameField) {
                usernameField.value = KERBEROS_USERNAME;
                console.log('Webmail username filled.');
            }
            if (passwordField) {
                passwordField.value = KERBEROS_PASSWORD;
                console.log('Webmail password filled.');
            }

            // Submit the form after a short delay
            setTimeout(function() {
                if (loginButton) {
                    console.log('Submitting Webmail login...');
                    loginButton.click();
                }
            }, 100);

            return; // Exit early for webmail
        }

        // --- Moodle Login (Old and New) ---
        console.log('Moodle script loaded.');
        // Common Login Fields
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');
        const loginButton = document.getElementById('loginbtn');

        if (usernameField) {
            usernameField.value = KERBEROS_USERNAME;
            console.log('Moodle username filled.');
        }
        if (passwordField) {
            passwordField.value = KERBEROS_PASSWORD;
            console.log('Moodle password filled.');
        }

        // --- Site-Specific CAPTCHA Logic ---
        // Only run the CAPTCHA solver on the old Moodle site
        if (window.location.hostname.includes('moodle.iitd.ac.in')) {
            console.log('Old Moodle site detected, solving CAPTCHA...');
            let loginElement = document.getElementById('login');
            if (loginElement) {
                let text = loginElement.innerText;
                let matches_sub = text.match(/Please subtract (\d+) - (\d+)/);
                let matches_add1 = text.match(/Please add (\d+)/);
                let matches_add2 = text.match(/(\d+) =/);
                let matches_first_val = text.match(/first value (\d+) , (\d+)/);
                let matches_second_val = text.match(/second value (\d+) , (\d+)/);

                var val;
                if (matches_add1 && matches_add2) {
                    val = +matches_add1[1] + +matches_add2[1];
                } else if (matches_sub) {
                    val = matches_sub[1] - matches_sub[2];
                } else if (matches_first_val) {
                    val = matches_first_val[1];
                } else if (matches_second_val) {
                    val = matches_second_val[2];
                }

                const captchaField = document.getElementById('valuepkg3');
                if (captchaField) {
                    captchaField.value = val;
                    console.log('Moodle CAPTCHA solved with value:', val);
                }
            }
        }

        // --- Common Submit ---
        // Click the login button after a short delay
        setTimeout(function() {
            if (loginButton) {
                console.log('Submitting Moodle login...');
                loginButton.click();
            }
        }, 100);
    };
})();