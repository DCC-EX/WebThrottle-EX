$(document).ready(function(){
    let deferredPrompt;
    const addBtn = document.querySelector('.add-button');
    const removeBtn = document.querySelector('.installed-label');
    addBtn.style.display = 'none';
    removeBtn.style.display = 'block';
    window.addEventListener('beforeinstallprompt', (e) => {
        removeBtn.style.display = 'none';
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        addBtn.style.display = 'block';
      
        addBtn.addEventListener('click', (e) => {
          // hide our user interface that shows our A2HS button
          //addBtn.style.display = 'none';
          // Show the prompt
          deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          deferredPrompt.userChoice.then((choiceResult) => {
              if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the prompt, app installed');
                addBtn.style.display = 'none';
                removeBtn.style.display = 'block';
              } else {
                console.log('User dismissed the prompt');
              }
              deferredPrompt = null;
            });
        });
    });
}); 