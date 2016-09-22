var assetsLoading = 0;

function AssetLoader(){
  //console.log('AssetLoader');
  this.load = function(file, type, callback) {

    var loadingContainer = document.querySelector('#AssetLoaderContainer') || document.createElement('div');
    loadingContainer.id = 'AssetLoaderContainer';
    loadingContainer.style.display = 'none';

    document.body.appendChild(loadingContainer);

    var element = null;
    var elementType = null;

    var isImage = (file.indexOf('.png') + file.indexOf('.gif') + file.indexOf('.jpg') + file.indexOf('.jpeg') + file.indexOf('.svg')) > -1;
    var isJavaScript = file.indexOf('.js') > -1;
    var isCSS = type == 'css';
    var isHTML = type == 'html';

    if(isJavaScript) {

      element = document.createElement('script');
      element.type = 'application/javascript';
      element.src = file;
      
    }
  
    if(isImage) {

      element = document.createElement('img');
      element.src = file;
    }

    if(isCSS) {

      element = document.createElement('link')
      element.setAttribute('rel', 'stylesheet')
      element.setAttribute('type', 'text/css')
      element.setAttribute('href', file);

    }

    if(isHTML) {

      element = document.createElement('link')
      element.setAttribute('rel', 'import')
      element.setAttribute('href', file);

    }

    
    loadingContainer.appendChild(element);
    assetsLoading++;

    element.onload = function(){

      assetsLoading--;
      if(assetsLoading == 0) {

        //console.log('All Assets Loaded.');
        callback ? callback() : false;

        loadingContainer.parentElement.removeChild(loadingContainer);

      }
    }
  }
}

module.exports = new AssetLoader();
  // finally insert the element to the body element in order to load the script