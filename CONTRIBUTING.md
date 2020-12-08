# Contributing
Firstly, thank you for wanting to contribute to WebThrottle-EX! We really appreciate any contributions, however small (even typo corrections!). If you know what you want to change,
go ahead and read the section **Making your change**. If you want to contribute, but don't know where to start, have a look at some of the open issues and join the discussion.

## Making your change
1. The first step is to fork this repo then clone it locally to your PC. If you don't know how to do this, we recommend you check out the GitHub Docs
1. This is the exciting bit! Now is the time to make your changes. If you don't know where to find a file you need, check out the **What files are where** section below.
To edit the code, you will need some form of editor. You *can* use the text editor that comes with your OS, but we recommend a proper IDE like [Visual Studio Code](https://code.visualstudio.com/).
If you are using VSCode, then the extension [Live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) is a good one to have.
1. Once you have made your change, commit it then push it to your fork.
1. Finally, you are ready to make your pull request! We will try and review it as soon as possible and either merge it or notify you of any changes you need to make before we can merge them.

**Note:** If you add any new files, be it images, stylesheets or javascript, they must all be added to the `sw.js` folder otherwise they will not be cached, meaning any features that use them will
break if the user is offline!

## Contributions from DCC-EX members
If you are a member of DCC-EX, you can clone this repo locally to make changes. Please make your own branch for this, either using a name related to the feature you are implementing,
or better yet, in the format `user-feature`. This way it is easy to see who is using which branch and the feature they are implementing.
Once you have made these changes, you can either open a pull request to `master` or just merge it to `master` yourself, it is completly up to you.

**Note:** Never touch the `build` branch! This is the live, end-user version of WebThrottle-EX and is only pushed to when a release is made.

## What files are where?
`index.html` - this is where the main code for the webpage is. There is only one html page, it is manipulated by JavaScript.  
`js/` - this is where all JavaScript files are kept, both libraries such as JQuery and our files.  
`css/` - where all the stylesheets are kept.  
`images/` - where all image resources are kept.  
`manifest.json` - used for the PWA, provides app details.  
`sw.js` - used for the PWA, tells the browser what to cache.  
`changelog.md` - provides the changelog for the latest update.  
