# DCC++ EX Web Throttle

This is a prototype for a new DCC++ EX Throttle/Controllercthat can connect to the DCC++ EX Commmand Station directly through the USB port of a computer.

## What you need to setup the project

* Chromium-Based Browser version 80 or above
  (Chrome, Opera, Edge)
* You must enable the experimental Web Serial API

To enable the Web Serial API, in your browser URL bar type:

    chrome://flags
    
Then set the **#enable-experimental-web-platform-features** flag by looking on the page for "Experimental Web Platform Features" and click on the "enable" button. (NOTE: Substitute the name of your browser above if you don't use Chrome)

## What you’ll need to use this application

You don't need anything to test it out and to run in emulator mode, to run trains you will need:

* An Arduino Mega or Uno Microcontroller
* An Arduino Motor Control Shield
* Chromium based browser version 80 or later


## Getting started

NOTE: If you don't have your hardware yet or just want to play with the throttle
      and see commands being sent to the log window, you can skip to the operation
      section.

To get started, connect your Command Station to a computer that has a USB port and have a compatible browser installed. Use a USB serial cable from your computer to the serial connector on the Arduino. Click on the "index.html" or "exwebthrotle.html" file to load the webpage.


## Operation

To use the program, you can either click on the "serial" dropodown button and select "emulator" to run in emulator mode or after making sure your hardware is properly connected, make sure "serial" is selected and click on the "Connect DCC++ EX" button. 

If the program finds a compatible device, it will popup a window showing you a selection. It may show a line at the top such as "Arduino Mega 2560 (COM3)". Your com port may vary. Click on your board to select it and then click the "connect" button.

You should then be connected to the Command Station (CS) and should see the response from the CS on the web page under the buttons. Make sure your debug console is open. If it isn't, use the slider button in the lower left to open it. You can also open the DevTools window in your browser to see more developer logging.

Once you are connected, you can enter the ``<s>`` command in the "direct command" textbox to get status information from your Command Station, just enter "s" (without the quotes) and press the SEND button. You can send any DCC++ API command in this way. You should see <iDCC++...> returned in the log window with your version, type of arduino, type of motor shield, and some other information.

Now you are ready to run trains! Place your loco on the track and click the power slider button to turn on power to your track. You should see lights on an Arduino Motor Board light and an indication that your loco has power.

Next go to the "locomotive ID" textbox and enter the address of your loco and press the ACQUIRE button. You should now have full control over your loco.

All the function buttons should be working, so you can play with the headlight, horn and bell and any other function assigned to a function button. The commands being sent to the CS and its responses will display in the log window if it is open

In the throttle control area to the left of the function buttons are vertical controls to control direction. The up arrow selects forward, the square button is stop and the down arrow is reverse.

The circular control or vertical slider (chosen by the throttle select slider) can be moved by clicking and holding down the mouse button and dragging, clicking at a spot where you want the throttle to move, or clicking the + and - buttons.

The options button lets you save labels to go on your function buttons for each of your locos. We will be updating this document soon to give you more information on this and other new features.

**Note:** The emulator doesn't fully replicate the Command station yet. This means that althought the software works, not all the responses will be shown in
the debug console. We are currently working on this, so it is something that will be fixed.

## Going Further / Developing

If you want to really delve into how this works and help us improve it with your comments or your development skills, please contact us.

To load the Chrome DevTools to look at logging and be able to manually enter "write" commands for testing, click on the Menu (the 3 vertical dots in the upper right hand corner of the Chrome Window), then select "more tools" and then "Developer Tools". Or you can just hit "Ctrl-Shift-I".


## License

Copyright 2020 DCC-EX

Licensed under the GNU open source licese.

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.

[DCC-EX](https://dcc-ex.com)


