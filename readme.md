# Gmail Sender Domain Visibility

People are supposed to prevent phishing by ritualistically paying attention to tiny text (the email sender domain) mv that does not matter in the normal course of business. This use case is not well supported by email client design choices, leaving end users vulnerable to unscrupulous phishing awareness campaigns. Base Gmail seems to have a couple of insecure-by-design choices:

1. Sender email is lightly visible, rather than prominent
2. No capability for highlighting potentially insecure emails, e.g.:
  a. emails coming from outside an approved list
  b. emails with a vendor NAME but not a vendor DOMAIN
3. The email list view does not display the sender email, forcing a user to click into a suspicious link before we could even find out if it is suspicious. Despite the sender email being present in the HTML on the page!

IMO these design choices make the Gmail client the security threat. Outlook and Apple Mail appear to not be any better.

This is a simple script that tries to address a couple of these issues in basic Gmail by

1. Making the sender email domain prominent to the user
2. Highlighting sender emails that come from outside a list of known domains

Future extensions:
- make it look better
- add a column to email list to display the sender email
- add a better install method


# Usage
## Tampermonkey Install Instructions

1. **Install Tampermonkey Extension**

   - [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Or visit [tampermonkey.net](https://www.tampermonkey.net/) for other browsers.

2. **In Chrome, enable "Allow access to file URLs" for Tampermonkey (if needed)**

   - Open `chrome://extensions`
   - Find Tampermonkey in the list
   - Make sure the toggle for **"Allow access to file URLs"** is enabled (if your script needs it)
   - To ensure user scripts work as expected, also verify Tampermonkey is **enabled** and that "Allow in Incognito" is toggled on if you want the script to work in Incognito mode

3. **Enable "Allow user scripts" in Chrome Extensions settings** (Chrome 2024+):

   - Go to `chrome://extensions`
   - At the top left, click the menu button (☰) and select **User scripts**
   - Make sure "Allow user scripts" is turned **On**

4. **Click the Tampermonkey extension icon and select 'Create a new script...'**

5. **Replace the default contents with the script from this repository**

6. **Save the script (File > Save, or `Ctrl+S`)**

7. **Reload Gmail and verify that the script is running**

   You should see sender email domains made more prominent, and unknown domains highlighted.

8. **To update or remove the script:**
   - Open the Tampermonkey dashboard, find the script in the list, and edit or delete as necessary.

**Note:** Some Gmail interface updates may interfere with the script. If features break, check this repository for updates or submit an issue.



