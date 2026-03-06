# Version 1.3.40
- Show the string needed for the CS ROSTER entry if added to a myConfiguration.h file, on the Functions Mapping page 

# Version 1.3.39
- Direction indication changes

# Version 1.3.38
- C_Carter's fix for the automations that require a loco

# Version 1.3.37
- allow 31 functions for locos acquired by DCC Address

# Version 1.3.36
- bug fix for only two turnouts/points

# Version 1.3.35
- bug fix for separate Stop button

# Version 1.3.34
- Added separate Stop button

# Version 1.3.33
- Removed the centre position for the direction toggle

# Version 1.3.32
- request an update for the loco as soon as it is acquired
- [Handoff] label for automation buttons

# Version 1.3.31
- responses for functions 29, 30, 31 were ignored

# Version 1.3.30
- bug fix if there are only two Routes

# Version 1.3.29
- bug fix if there are Turnouts/Points but no Routes
- fix for the knob still being active in 'Stop'

# Version 1.3.28
- send actual eStop

# Version 1.3.27
- support state and label changes for Routes <jB ....>
- overcurrent and/or short toast message

# Version 1.3.26
- support Turnouts/Points
- updated icons

# Version 1.3.25
- sort Routes/Automation
- only retrieve the full Roster at connection
- only retrieve the full Routes/Automation list at connection
- support for broadcast messages
- bug fixes

# Version 1.3.24
- support Routes/Automation

# Version 1.3.23
- navigation button improvements

# Version 1.3.22
- remove blank function buttons

# Version 1.3.21
- add navigation buttons

# Version 1.3.20
- fix send commands from the the CV Programmer page with the 'Enter' key

# Version 1.3.19
- send commands from the the CV Programmer page

# Version 1.3.18
- bug fix for editing Function Maps

# Version 1.3.17
- add toast messages

# Version 1.3.15 & 16
- Download Roster from the Command Station and allow selection

# Version 1.3.14
- Fix for Function Maps with spaces in the name

# Version 1.3.13
- attempt to reduce caching

# Version 1.3.12
- Display browser type warning if unsupported

# Version 1.3.11
- Display additional info for CV29

# Version 1.3.10
- Correct Functions load automatically when loco selected from the list
- Functions return to default when loco dropped
- DCC address labels changed from 'CV' to 'DCC Addr' or 'Addr'
- added setting to turn off the timestamp in the log
- improvement to when it thinks the CS is ready to accept commands

# Version 1.3.9
- Improvements for when a separate throttle is controlling the same loco
- move to 'newer' function command
- Bug fix for functions. Direction would toggle when a function button was pressed
- react to inbound function button changes
- Bell (f1) no longer momentary by default
- rudimentary fix for the emulator

# Version 1.3.8
- Addition of a CV Programmer page

# Version 1.3.7
- UI will respond to speed and direction changes on the current loco, broadcast by the CS
- disable loco input until the CS is loaded

# Version 1.3.6
- small UI improvements

# Version 1.3.5
- Updating some of the commands sent

# Version 1.3.4
- Fixes the splitting of the responses on multiple lines
- Rename of DCC++EX to DCC-EX
- small UI improvements

# Version 1.3.3
Fixes a bug that prevented communication with the CS

## Changes from 1.3.2
Various bugfixes and a few other changes.

__Fixes:__
- Help link fixed
- Various CSS Fixes

__Other changes:__
- Various internal changes to the emulator
- Function actions renamed from *press* and *toggle* to *momentary* and *latching*

## Changes from 1.3.1
This is a quick little bugfix to fix a problem where received packets weren't being displayed in the debug console.

## Changes from 1.3.0
In this release, we added a dedicated settings page, as well as changing the way locomotives and function maps are added. Also, we have switched to a new distribution method, PWAs! Oh, did we mention the new and improved wider UI? Overall, we would be better off listing the sections that have stayed the same!

__New Features:__
* Side menu - We have added a side menu to switch between 'pages'
* Locomotive page - This is where locomotives are now added
* Functions page - This is where function maps are now created
* Settings page - This page contains all the options to manage storage settings and to choose different themes and throttles
* Emergency stop button - There is now a button to provide the emergency stop feature
* Information and help button - These have been added to the top right of the screen and display the version, along with other information

__Fixes:__
* The button to minimise the top section is displayed correctly

__Changed behaviour:__
* Locomotives now need to be added in the locomotives menu before they are used
* The UI is now wider
* Other minor tweaks to the UI


If you want something added, let us know! First, check out the roadmap page in the wiki to check if it is planned, then open an issue letting us know what you want. Similarly, if you have found a bug, also let us know. Chances are we haven't spotted it so this will help us greatly!