// Loads libraries and then executes a handler function
function LoadScriptList(libraries, handler) {
    // Take first library from the list and load it
    var library = libraries[0];
 
    // Check if the library has not beed loaded yet
    if (typeof libraries_loaded == 'undefined')
        libraries_loaded = [];
 
    for (var i=0; i<libraries_loaded.length; i++)
        if (libraries_loaded[i] == library)
            return;
 
    // Load script
    var head = document.getElementsByTagName('head').item(0);
    var js = document.createElement('script');
 
    js.setAttribute('language', 'javascript');
    js.setAttribute('type', 'text/javascript');
 
    // Initiate loading remainding libraries after this one has been loaded
    js.onload = function () {
        // Remove current library from list as loaded one
        libraries.shift();
 
        // If all libraries loaded call our code handler
        if (libraries.length == 0) {
            handler.call();
        } else {
            // If more libraries need to be loaded, do it
            LoadScriptList.apply(this, [libraries, handler]);
        }
    };
 
    js.setAttribute('src', '' + library + '.js');
 
    // Add script element to DOM
    head.appendChild(js);
 
    // Add library to loaded libraries list
    libraries_loaded[libraries_loaded.length] = library;
}