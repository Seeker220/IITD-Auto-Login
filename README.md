# IITD Auto Login Scripts

Automatic login scripts for various IIT Delhi portals. These Tampermonkey scripts automatically fill credentials and solve CAPTCHAs to streamline access to IITD services.

## Available Scripts

### 1. IITD-Sites-Login.js
Automatically handles login for multiple IITD portals:
- **Moodle** (old: moodle.iitd.ac.in) - Includes CAPTCHA solver
- **Moodle New** (moodlenew.iitd.ac.in) - Auto-fill credentials
- **Webmail** (webmail.iitd.ac.in/roundcube) - Auto-login
- **eCampus** (ecampus.iitd.ac.in) - Auto-login with modal handling
- **eAcademics** (eacademics.iitd.ac.in) - Auto-login with modal handling

**How it works:**
- Detects which IITD portal you're visiting based on the URL
- For Moodle (old), it solves simple math CAPTCHAs by parsing the challenge text
- For other sites, it auto-fills credentials and handles any modals/popups
- Automatically submits the login form

### 2. IITD-OAuth-Login.js
Uses Google's Gemini AI (flash model) to solve image-based Securimage CAPTCHAs on oauth.iitd.ac.in.

**How it works:**
- Waits for the OAuth login page to load completely
- Captures the CAPTCHA image from the page
- Converts the image to base64 format
- Sends it to Google's Gemini Flash API for text recognition
- Automatically fills in the recognized CAPTCHA text
- Submits the login form

**Note:** Requires a free Gemini API key (see instructions below).

### 3. autofill.js ⚠️ DEPRECATED
This is the old script that only works with the original Moodle site. Use **IITD-Sites-Login.js** instead, which supports all sites and is actively maintained.

## Installation

### Prerequisites
1. Install the **Tampermonkey** extension:
   - [Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

### Setup Instructions

#### For IITD-Sites-Login.js:
1. Open Tampermonkey from your browser's extension toolbar
2. Click on "**Create a new script**"
3. Clear everything and paste the contents of [IITD-Sites-Login.js](./IITD-Sites-Login.js)
4. **Configure your credentials** (lines 19-22):
   ```javascript
   const KERBEROS_USERNAME = 'YOUR_USERNAME_HERE'; // e.g., ce1279999
   const KERBEROS_PASSWORD = 'YOUR_PASSWORD_HERE';
   const ECAMPUS_USERNAME = 'YOUR_ENTRY_NUMBER_HERE'; // e.g., 2027CE19999
   const ECAMPUS_PASSWORD = 'YOUR_PASSWORD_HERE';
   ```
5. Press **Ctrl+S** (or Cmd+S on Mac) to save
6. Close the editor - the script is now active!

#### For IITD-OAuth-Login.js:
1. **First, obtain a Gemini API key** (see instructions below)
2. Open Tampermonkey and click "**Create a new script**"
3. Clear everything and paste the contents of [IITD-OAuth-Login.js](./IITD-OAuth-Login.js)
4. **Configure your credentials and API key** (lines 15-17):
   ```javascript
   const USERNAME = 'YOUR_USERNAME_HERE'; // e.g., ce1279999
   const PASSWORD = 'YOUR_PASSWORD_HERE';
   const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
   ```
5. Press **Ctrl+S** (or Cmd+S on Mac) to save
6. Close the editor - the script is now active!

## How to Get a Gemini API Key (Free)

The OAuth script uses Gemini Flash, which is **completely free** and doesn't require Gemini Pro:

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "**Get API Key**" or "**Create API Key**"
4. Click "**Create API key in new project**" (or select an existing project)
5. Copy the generated API key
6. Paste it into the `GEMINI_API_KEY` field in the script

**Note:** 
- Gemini Flash is free with generous rate limits
- No credit card or payment required
- Keep your API key private and don't share it

## Opting Out of Specific Sites

If you don't want the script to run on a particular site, simply remove that site's `@match` line from the script:

### For IITD-Sites-Login.js:
Find the `@match` directives at the top of the script (lines 6-10) and delete the ones you don't want:

```javascript
// @match        *://moodle.iitd.ac.in/login/index.php          // Remove this line to opt out of old Moodle
// @match        *://moodlenew.iitd.ac.in/login/index.php       // Remove this line to opt out of new Moodle
// @match        *://webmail.iitd.ac.in/roundcube/*             // Remove this line to opt out of Webmail
// @match        *://ecampus.iitd.ac.in/scorner/login           // Remove this line to opt out of eCampus
// @match        *://eacademics.iitd.ac.in/sportal/login        // Remove this line to opt out of eAcademics
```

### For IITD-OAuth-Login.js:
Remove line 6 if you don't want it to work on OAuth:
```javascript
// @match        *://oauth.iitd.ac.in/login.php*                // Remove this line to disable
```

After removing any `@match` lines, save the script (Ctrl+S / Cmd+S).

## Security Notes

⚠️ **Important Security Considerations:**

1. **Credentials Storage**: Your credentials are stored in plain text within the Tampermonkey script. Anyone with access to your browser's extensions can view them.

2. **Use at Your Own Risk**: These scripts are provided as-is. Always ensure you're using them on a secure, personal device.

3. **API Key Privacy**: Never share your Gemini API key publicly or commit it to version control.

4. **Verify URLs**: Make sure the `@match` directives only include legitimate IITD domains.

## Troubleshooting

### IITD-Sites-Login.js Issues:
- **Script not running**: Check that the URL matches one of the `@match` patterns
- **Wrong credentials**: Verify you've entered the correct username and password
- **CAPTCHA not solving**: The old Moodle CAPTCHA solver only works with simple math problems

### IITD-OAuth-Login.js Issues:
- **CAPTCHA not solving**: 
  - Verify your Gemini API key is correct
  - Check browser console (F12) for error messages
  - Ensure you have internet connectivity
- **API quota exceeded**: Gemini Flash has generous free limits, but if exceeded, wait 24 hours or create a new API key
- **Image capture fails**: Try refreshing the page and letting it fully load

### General Issues:
- **Script not running at all**: 
  - Ensure Tampermonkey is enabled
  - Check that the script is enabled in Tampermonkey dashboard
  - Verify you're on the correct URL
- **Page loads but nothing happens**: Check the browser console (F12) for error messages

## Contributing

Feel free to submit issues or pull requests to improve these scripts!

## Credits

Original concept by Prashant (IITD'28)  
Modified and maintained by the community

## License

These scripts are provided for educational purposes. Use responsibly and in accordance with IITD's acceptable use policies.