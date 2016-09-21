var assetsLoading = 0;

function AssetLoader(){
  //console.log('AssetLoader');
  this.load = function(file, callback) {

    var loadingContainer = document.querySelector('#AssetLoaderContainer') || document.createElement('div');
    loadingContainer.id = 'AssetLoaderContainer';
    loadingContainer.style.display = 'none';

    document.body.appendChild(loadingContainer);

    var element = null;
    var elementType = null;

    var isImage = (file.indexOf('.png') + file.indexOf('.gif') + file.indexOf('.jpg') + file.indexOf('.jpeg') + file.indexOf('.svg')) > -1;
    var isJavaScript = file.indexOf('.js') > -1;

    if(isJavaScript) {

      element = document.createElement('script');
      element.type = 'application/javascript';
      
    }

    if(isImage) {

      element = document.createElement('img');
      
    }

    element.src = file;
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