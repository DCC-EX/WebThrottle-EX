# Contributing
Firstly, thank you for wanting to contribute to WebThrottle-EX! We really appreciate any contributions, however small (even typo corrections!). If you know what you want to change, go ahead and read the section **Making your change**. If you want to contribute, but don't know where to start, have a look at some of the open issues and join the discussion.

## Making your change
1. The first step is to fork this repo then clone it locally to your PC. If you don't know how to do this, we recommend you check out the GitHub Docs
1. Now you need to set up the development tools. These are listed below in **Tools needed**.
1. This is the exciting bit! Now is the time to make your changes. If you don't know where to find a file you need, check out the **What files are where** section below.
To edit the code, you will need some form of editor. You *can* use the text editor that comes with your OS, but we recommend a proper IDE like [Visual Studio Code](https://code.visualstudio.com/).
1. Once you have made your change, check it by running `npm run serve`. Then, commit it and push it to your fork.
1. Finally, you are ready to make your pull request! We will try and review it as soon as possible and either merge it or notify you of any changes you need to make before we can merge them.

## Tools needed
**Links needed**
- Node.js
- vue cli

You will need to run `npm install` after cloning this repo locally to install all dependancies.

## Contributions from DCC-EX members
If you are a member of DCC-EX, you can clone this repo locally to make changes. Please make your own branch for this, either using a name related to the feature you are implementing,
or better yet, in the format `feature/`*`featurename`* and `feature/`*`featurename`*`-`*`username`*. This way it is easy to see who is using which branch and the feature they are implementing.
Once you have made these changes, first merge them to `feature/`*`featurename`*. Once the feature is fully implemented you can either open a pull request to `master` or just merge it to `master` yourself, it is up to you, though a pull request is preferable for new or changed functionality

**Note:** Never touch the `build` branch! This is the live, end-user version of WebThrottle-EX and is only pushed to when a release is made.

## What files are where?
**Note:** The following section is now outdated and will be updated shortly

`index.html` - this is where the main code for the webpage is. There is only one html page, it is manipulated by JavaScript.  
`js/` - this is where all JavaScript files are kept, both libraries such as JQuery and our files.  
`css/` - where all the stylesheets are kept.  
`images/` - where all image resources are kept.  
`manifest.json` - used for the PWA, provides app details.  
`sw.js` - used for the PWA, tells the browser what to cache.  
`changelog.md` - provides the changelog for the latest update.  
