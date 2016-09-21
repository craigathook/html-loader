var assetLoader = require('./AssetLoader')


function HTMLModule(){
  this.target = null;
  this.id = new Date().getTime();
  this.body = null;
  this.head = null;
  this.assets = [];
  this.scripts = [];
  this.images = [];
  this.styleElements = [];
  this.scriptElements = [];
  this.linkElements = [];
}

function HTMLLoader(){
  //console.log('HTMLLoader');

  var self = this;

  this.load = function(url, target, callback){
    var xhr= new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onreadystatechange = function() {
      if (this.readyState!==4) return;
      if (this.status!==200) return;

      self.loadHTMLComplete(this.responseText, target, callback);
    }

    xhr.send();

  }.bind(this);

  this.loadHTMLComplete = function(response, target, callback) {
    //console.log('loadHTMLComplete', target, callback);
    var module = new HTMLModule();
    module.target = target;

    var res = response;

    // turn into module. innerHTML automatically removes body and head tags if they aren't renamed.
    res = res.replace('/body>', '/body'+module.id+'>').replace('<body', '<body'+module.id); 
    res = res.replace('/head>', '/head'+module.id+'>').replace('<head', '<head'+module.id);

    window.res = res;

    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = res;

    var scripts = toArray( tempDiv.querySelectorAll('script') );
    var images = toArray( tempDiv.querySelectorAll('img') );

    module.body = tempDiv.querySelectorAll('body'+module.id)[0];
    module.head = tempDiv.querySelectorAll('head'+module.id)[0];
    module.styleElements = toArray( tempDiv.querySelectorAll('style') );
    module.linkElements = toArray( tempDiv.querySelectorAll('link') );
    
    scripts.forEach(function(elem){// could be refactored into getSourceFromElements
      var scriptElement = elem;
      if(scriptElement['attributes']){
        if(scriptElement['attributes']['src']) {
          module.scripts.push(scriptElement.attributes.src.value);
        } else {
          module.scriptElements.push(scriptElement);
        }
      }
    }); 

    images.forEach(function(elem){// could be refactored into getSourceFromElements
      var imgElement = elem;

      if(imgElement['attributes']){
        if(imgElement['attributes']['src']) {
          module.images.push(imgElement.attributes.src.value);
        }
      }
    });

    //console.log(module.scripts, module.images);

    module.assets = module.assets.concat(module.scripts, module.images);

    this.loadModule(module);

  }

  this.loadModule = function(module, callback){
    for(var a in module.assets){
      assetLoader.load(module.assets[a], function(){ // fires when all assets are loaded

        module.target.innerHTML = module.body.innerHTML;

        module.styleElements.forEach(function(elem){
          var styleElement = elem;
          module.target.appendChild(styleElement);
        });

        module.scriptElements.forEach(function(elem){ // add all inline javascript
          //console.log(">",scriptElement);
          var scriptElement = elem;
          var newElement = document.createElement('script');
          newElement.text = scriptElement.innerHTML;
          module.target.appendChild(newElement);
        });

        module.linkElements.forEach(function(elem){
          var linkElement = elem;
          module.target.appendChild(linkElement);
        });

        callback ? callback() : false; // run callback if it exists

      });
    }
  }
}

function toArray(object){
  return [].slice.call(object);
}

module.exports = new HTMLLoader();