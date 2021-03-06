var assetLoader = require('./AssetLoader');
//var pathProcessor = require('./RelativePathProcessor');


function HTMLModule() {
  this.target = null;
  this.id = new Date().getTime();
  this.body = null;
  this.head = null;
  this.assets = [];
  this.scripts = [];
  this.images = [];
  this.links = [];
  this.styleElements = [];
  this.scriptElements = [];
  this.linkElements = [];
}

function HTMLLoader() {
  //console.log('HTMLLoader');
  var basepath = '';
  var self = this;

  this.load = function(url, target, callback, rootPath) {
    basepath = rootPath || basepath;
    target.style.display = 'none';

    if(url.indexOf('//') > -1) { // if this is an absolute path, lets pull out the basepath of the file the url is referencing
      var protocol = url.split('//')[0];
      var domain = protocol+'//'+url.split('/')[2]+'/';
      var file = url.split('/')[url.split('/').length-1];
      basepath = url.split(file)[0];
      url = file;
    } else {
      basepath = location.href;
    }


    var xhr = new XMLHttpRequest();
    xhr.open('GET', basepath+url, true);

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

    window.module = module;

    //console.log(pathProcessor(res));

    // turn into module. innerHTML automatically removes body and head tags if they aren't renamed.
    res = res.replace('/body>', '/body'+module.id+'>').replace('<body', '<body'+module.id); 
    res = res.replace('/head>', '/head'+module.id+'>').replace('<head', '<head'+module.id);

    window.res = res;

    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = res;

    var scripts = toArray( tempDiv.querySelectorAll('script') );
    var images = toArray( tempDiv.querySelectorAll('img') );
    var links = toArray( tempDiv.querySelectorAll('link') );

    module.styleElements = toArray( tempDiv.querySelectorAll('style') );
    
    elementNames = ['div','span','li','ul','ol','br','button','h1','h2','h3','h4','h5','h6']; // limit list of elements to check for background images

    elementNames.forEach( function(tagName) {
      var tags = tempDiv.getElementsByTagName(tagName);
      var numTags = tags.length;
      for (var i = 0; i < numTags; i++) {
        tag = tags[i];
        if (tag.style.backgroundImage.match('url')) {
          var bg = tag.style.backgroundImage;
          var path = basepath + bg.substr(bg.indexOf('url') + 4, bg.lastIndexOf(')') - (bg.indexOf('url') + 4)).replace(/"/g,'').replace(/'/g,'');
          tag.style.backgroundImage = 'url('+path+')';
          module.assets.push({type:'img', path:path});
        }
      }
    });
    
    scripts.forEach(function(elem) {
      var path = self.getPathFromElement(elem);
      if(path) {
        module.scripts.push(path);
        module.assets.push({type:'js', path:path});
      } else { // these must be inline scripts. lets just grab the whole element then.
        module.scriptElements.push(elem);
      }
    }); 

    images.forEach(function(elem) {
      var path = self.getPathFromElement(elem);
      if(path) {
        module.images.push(path);
        module.assets.push({type:'img', path:path});
        elem.attributes.src.value = path; // before this gets added to the dom, lets make sure it's loading the img from the same root path as the html file.
      }
    });

    links.forEach(function(elem){// lets make sure the link elements have an href, and if they do, lets also make sure the href is an absolute path.
      var path = self.getPathFromElement(elem); // check for path, and convert to absolute path if it isn't.
      var type = '';
      if(path) {
        module.links.push(path);
        elem.attributes.href.value = path;

        if(elem.attributes.rel.value == 'import') {
          type = 'html'
        }
        if(elem.attributes.rel.value == 'stylesheet') {
          type = 'css'
        }

        module.assets.push({type:type, path:path});
        module.linkElements.push(elem);
      }

    });

    module.body = tempDiv.querySelectorAll('body'+module.id)[0];
    module.head = tempDiv.querySelectorAll('head'+module.id)[0];

    this.loadModule(module);

  };

  this.getPathFromElement = function(element) {
    var path = null;
    if(element['attributes']) {
      var pathAttribute = element['attributes']['src'] ? 'src' : 'href';
      if(element['attributes'][pathAttribute]) {
        
        path = element.attributes[pathAttribute].value;
        var isAbsolutePath = path.indexOf('//') != -1;
        
        if(isAbsolutePath == false) {
          path = basepath + path;
        }
      }
    }

    return path;
  };

  this.loadModule = function(module, callback) {
    for(var a in module.assets) {
      assetLoader.load(module.assets[a].path, module.assets[a].type, function(){ // fires when all assets are loaded

        module.target.innerHTML = module.body.innerHTML;

        module.styleElements.forEach(function(elem) {
          var styleElement = elem;
          module.target.appendChild(styleElement);
        });

        module.scriptElements.forEach(function(elem){ // add all inline javascript
          //console.log('>',scriptElement);
          var scriptElement = elem;
          var newElement = document.createElement('script');
          newElement.text = scriptElement.innerHTML;
          module.target.appendChild(newElement);
        });

        module.linkElements.forEach(function(elem) {
          var linkElement = elem;
          module.target.appendChild(linkElement);
        });

        module.target.style.display = 'block';
        callback ? callback() : false; // run callback if it exists

      });
    }
  };
}

function toArray(object) {
  return [].slice.call(object);
}

function getAbsolutePath(base, relative) { // major parts credit to http://stackoverflow.com/users/1048572/bergi
    var stack = base.split('/')
    var parts = relative.split('/');

    var protocol = base.split('//')[0];
    var domain = protocol+'//'+base.split('/')[2];

    if(relative.indexOf('/') == 0) {
      return domain + relative;
    }

    stack.pop(); // remove current file name (or empty string)
                 // (omit if 'base' is the current folder without trailing slash)
    for (var i=0; i<parts.length; i++) {
        if (parts[i] == '.')
            continue;
        if (parts[i] == '..')
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join('/');
}

module.exports = new HTMLLoader();