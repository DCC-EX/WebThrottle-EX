# DCC++ EX Web Throttle

This is a prototype for a new DCC++ EX Throttle/Controller
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
and click on the "enable" button. (NOTE: Substitute the name
of your browser above if you don't use Chrome)

## What you’ll need to use and develop this application

* An Arduino Mega or Uno Microcontroller
* An Arduino Motor Control Shield
* Chrome version 80 or later
* Some knowledge of HTML and JavaScript
* Understanding of how to use the Chrome DevTools

To load the Chrome DevTools to look at logging and be able to manually enter
"write" commands for testing, click on the Menu (the 3 vertical dots in the 
upper right hand corner of the Chrome Window), then select "more tools" and 
then "Developer Tools". Or you can just hit "Ctrl-Shift-I".

## Getting started

To get started, connect your Command Station to a computer with a USB port
and a compatible browser installed. Use a USB serial cable from your computer
to the serial connector on the Arduino. Click on the index.hml file to load the 
webpage. 

If you are using Glitch, find the "throttle-test-new" project and then view the 
.html file and .js file that have all the code to run this page as a web 
controller/throttle.

To run the web page, click on the "show" dropdown at the top left and select
to run the page in a new window or with the code to the left. Once you make
your selection, a web page should load and you will see three buttons:

* Connect
* One
* Two

## Operation

To use the program, click on the "connect" button. If the program finds
a compatible device, it will popup a window showing you a selection. It
may show a line at the top such as "Arduino Mega 2560 (COM3)". Your com
port may vary. Click on your board and then click the "connect" button.

Your should then connect to the Command Station and should see the response
from the command station on the web page under the buttons. You can open
the DevTools window to see more logging.

Once you are connected, you can press button one to send the &lt;s&gt; status
command and see the status returned from the CS. You can press button Two
to send the &lt;c&gt; command to read the current on the main track.

Experiment with different commands and we what can be added to read the
responses and parse them properly.

## License

Copyright 2020 DCC-EX

Licensed under the GNU open source licese.

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.

[DCC-EX]: https://dcc-ex.com

