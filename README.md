# DCC++ EX Web Throttle

This is a new DCC++ EX Throttle/Controller
that can connect to the DCC++ EX Commmand Station directly 
through the USB port of a computer.

## What you need to setup the project

* Chromium-Based Browser version 80 or above
  (Chrome, Opera, Edge)
* You must enable the experimental Web Serial API

To enable the Web Serial API, in your browser URL bar type:

    chrome://flags
    
Then set the **#enable-experimental-web-platform-features** flag
by looking on the page for "Experimental Web Platform Features"
and click on the "enable" button.

**Note:** Substitute the name of your browser above if you don't use Chrome

## What you’ll need to use this application

* An Arduino Mega or Uno Microcontroller
* An Arduino Motor Control Shield
* Chrome version 80 or later

## Getting started

To get started, connect your Command Station to a computer with a USB port
and a compatible browser installed. Use a USB A to B cable from your computer
to the serial connector on the Arduino. Click on the index.html file to load the 
webpage. 

## Operation

To use the program, click on the "connect" button. Once you click this, a popup will 
show up offering the different devices available, you are looking for a line such as 
"Arduino Mega 2560 (COM3)". Your COM port may vary and if you are using Linux, it will be something like /dev/USB0. 
Click on your board and then click the "connect" button. If nothing is shown, check the Command Station is correctly connected to your PC.

This will then connect to the Command Station and should see the response
from the command station on the web page in the Debug Console (if enabled). You can open
the DevTools window to see more logging.

Once you are connected, enter the DCC address of the cab (decoder) you want to control, then press the aquire button. You can now use the slider,
direction buttons and cab function buttons to control your train! If at any point you want to change cab, just press the release button then type in
a new address.

You can experiment with different button mappings, as these saved, even when you close the window. These can also be downloaded and imported, along 
with the rest of the app data.

## Using the Emulator

If you don't have an Arduino, or it isn't currently plugged into your PC, you can use the emulator.
This replicates the Command Station, meaning you can try the software out. 
To use it, simply change the dropdown menu next to the "Connect DCC++ EX" button to`Emulator` then press the connect button. That's it, you are ready to
use the emulator!  

**Note:** The emulator doesn't fully replicate the Command station yet. This means that although the software works, not all the responses will be shown in
the debug console. We are currently working on this, so it is something that will be fixed.

## License

Copyright 2020 DCC-EX

Licensed under the GNU open source license.

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.

[DCC-EX](https://dcc-ex.com)

