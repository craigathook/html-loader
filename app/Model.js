"use strict";

var Model = function() {

    Enabler.setProfileId(1092869); //
    var devDynamicContent = {};

    devDynamicContent.HTMLLoader_Test_Sheet1= [{}];
    devDynamicContent.HTMLLoader_Test_Sheet1[0]._id = 0;
    devDynamicContent.HTMLLoader_Test_Sheet1[0].ID = 0;
    devDynamicContent.HTMLLoader_Test_Sheet1[0].Reporting_Label = "bg1";
    devDynamicContent.HTMLLoader_Test_Sheet1[0].Background = "bg1.html";
    devDynamicContent.Profile= [{}];
    devDynamicContent.Profile[0]._id = 0;
    devDynamicContent.Profile[0].BasePath = "https:\/\/s0.2mdn.net\/ads\/richmedia\/studio\/45581506\/";

    if(window.previewDynamicContent) { 
        devDynamicContent.TEMP_FEED_NAME[0] = window.previewDynamicContent;
        console.log("devDynamicContent preloaded.");
    }

    Enabler.setDevDynamicContent(devDynamicContent);

    this.background = dynamicContent.HTMLLoader_Test_Sheet1[0].Background;
    this.basepath = devDynamicContent.Profile[0].BasePath;

};

Model._instance = null;

Model.getInstance = function() {
    if (Model._instance == null) {
        Model._instance = new Model();
    }
    return Model._instance;
};

module.exports = Model;