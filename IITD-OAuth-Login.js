// ==UserScript==
// @name         IIT Delhi OAuth CAPTCHA Auto-Solver with Gemini
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically solve Securimage CAPTCHA using Gemini AI and login to OAuth
// @match        *://oauth.iitd.ac.in/login.php*
// @grant        GM_xmlhttpRequest
// @connect      generativelanguage.googleapis.com
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const USERNAME = 'YOUR_USERNAME_HERE'; // e.g., ce1279999
    const \PASSWORD = 'YOUR_PASSWORD_HERE';
    const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
    const GEMINI_MODEL = 'gemini-flash-latest';

    console.log('OAuth CAPTCHA Solver with Gemini AI loaded');

    // Wait for page to fully load
    window.addEventListener('load', function() {
        setTimeout(function() {
            solveCaptchaAndLogin();
        }, 1500); // Wait 1.5 seconds for images to load
    });

    async function solveCaptchaAndLogin() {
        try {
            // Fill in username and password first
            const usernameField = document.getElementById('username');
            const passwordField = document.getElementById('password');

            if (usernameField) {
                usernameField.value = USERNAME;
                console.log('✓ Username filled');
            }
            if (passwordField) {
                passwordField.value = PASSWORD;
                console.log('✓ Password filled');
            }

            // Get the CAPTCHA image element
            const captchaImg = document.getElementById('captcha_image');
            if (!captchaImg) {
                console.error('✗ CAPTCHA image not found');
                return;
            }

            // Wait for image to fully load
            if (!captchaImg.complete) {
                await new Promise(resolve => {
                    captchaImg.onload = resolve;
                });
            }

            console.log('📸 Capturing CAPTCHA image...');

            // Convert image to base64
            const base64Image = await imageToBase64(captchaImg);

            console.log('🤖 Sending to Gemini AI...');

            // Send to Gemini API
            const captchaText = await solveWithGemini(base64Image);

            if (!captchaText) {
                console.error('✗ Could not recognize CAPTCHA');
                return;
            }

            console.log('✓ Recognized CAPTCHA:', captchaText);

            // Fill in the CAPTCHA field
            const captchaField = document.getElementById('captcha_code');
            if (captchaField) {
                captchaField.value = captchaText;
                console.log('✓ CAPTCHA filled');

                // Submit the form after a short delay
                setTimeout(function() {
                    const submitButton = document.querySelector('button[type="submit"][name="submit"]');
                    if (submitButton) {
                        console.log('🚀 Submitting form...');
                        submitButton.click();
                    }
                }, 500);
            }

        } catch (error) {
            console.error('✗ Error solving CAPTCHA:', error);
        }
    }

    // Convert image to base64
    function imageToBase64(img) {
        return new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.naturalWidth || img.width;
                canvas.height = img.naturalHeight || img.height;

                ctx.drawImage(img, 0, 0);

                // Get base64 without the data:image/png;base64, prefix
                const base64 = canvas.toDataURL('image/png').split(',')[1];
                resolve(base64);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Solve CAPTCHA using Gemini API
    function solveWithGemini(base64Image) {
        return new Promise((resolve, reject) => {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

            const requestBody = {
                contents: [
                    {
                        parts: [
                            {
                                text: "This is a CAPTCHA image. What text is shown in this image? Return ONLY the text characters you see, nothing else. No explanation, no punctuation, just the exact text."
                            },
                            {
                                inline_data: {
                                    mime_type: "image/png",
                                    data: base64Image
                                }
                            }
                        ]
                    }
                ]
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: apiUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': GEMINI_API_KEY
                },
                data: JSON.stringify(requestBody),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);

                        if (result.candidates && result.candidates[0]) {
                            const text = result.candidates[0].content.parts[0].text;
                            // Clean up the text - remove spaces, newlines, special chars
                            const cleanText = text.trim().replace(/[^a-zA-Z0-9]/g, '');
                            resolve(cleanText);
                        } else {
                            console.error('Unexpected API response:', result);
                            reject('No text found in response');
                        }
                    } catch (error) {
                        console.error('Error parsing response:', error);
                        reject(error);
                    }
                },
                onerror: function(error) {
                    console.error('API request failed:', error);
                    reject(error);
                }
            });
        });
    }
})();