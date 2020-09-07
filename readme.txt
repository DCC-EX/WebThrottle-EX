Instructions for how to use exWebThrottle; a controller for DCC++ EX Command Station (CommandStation-EX). This controller will also work with DCC++ Classic, though new features will obviously not be supported on the old DCC++ Base Station.

Requirements

Arduino Uno or Mega (clones are allright too)
Arduino or Deek-Robot Motor Shield (or another DCC++ EX supported motor controller)
A computer, laptop, or tablet with a USB Serial port
A Chromium based Browser (Chrome, Opera, Edge)

Installing exWebThrottle

There are current only 2 files needed to run exWebThrottle:

exwebthrottle.html
exwebthrottle.js

Make sure that experimental features are enabled in your chrome web browser by clicking in the address bar and typing:

chrome:/flags (or opera:/flags or edge:/flags for those browsers)

Find "Experimental Web Platform Features" and set it to "enabled"

Loading exWebThrottle

You can either host the throttle in the cloud on a web page that is secured by "https" or by simply copying the files to a folder on your computer and opening the "exwebthrottle.html" file in your chrome browser.

For the web, copy the the files mentioned above to a folder hosting your website. Make sure you have a secured site that uses "https://" in front of your domain name. Anyone going to "https://www.<your site nam>.com/<your throttle folder>/exwebthrottle.html will be able to run the throttle

To run locally on your machine, even without a connection to the internet, download the zip file and extract it to a folder where you would like it to reside. Then simply select the "exwebthrottle.html" file to launch your chrome browser (if it is the default web browser) or open chrome and in the address bar, type:

file:///C:/Users/<your name>/<your folder>/exwebthrottle.html

NOTE: substitude your path name to where you placed the exwebthrottle.html file

Operating exWebThrottle

1. Click on the "Connect DCC++ EX" button at the upper right

2. A window should pop up displaying any valid serial devices. Find the board that has your DCC++ EX Command Station and click on it. (example: Arduino Mega 2560 (COM3)). Then Click the "connect" button in that popup window.

3. After double checking yoru wiring and making sure of your voltage, click the power slider to turn on the power. You should see that power is now applied to the track.

4. Enter the Address for your locomotive in the "Locomotive ID" text box at the upper left and check the "Acquire" button. Your loco should now be connected to the throttle.

5. Use the throttle control, forward and reverse and stop buttons, and your"FX" Function control buttons.

6. Enjoy running your trains!

For help, visit us at https://www.dcc-ex.com or at the DCC++ EX Discord Server https://discord.gg/y2sB4Fp

