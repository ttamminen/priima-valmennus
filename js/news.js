/* global _ */
/* exported NewsModule */

var NewsModule = (function (_) {
    "use strict";

    var defaults = {
        target: document.getElementsByClassName('social-media-updates')[0],
        tmplNewsUpdate: 'tmpl-news-update',
        maxUpdates: 3,
        textLength: 80,        
        monthNames: [ "Tammikuuta", 
                      "Helmikuuta", 
                      "Maaliskuuta", 
                      "Huhtikuuta", 
                      "Toukokuuta", 
                      "Kesäkuuta", 
                      "Heinäkuuta", 
                      "Elokuuta", 
                      "Syyskuuta", 
                      "Lokakuuta", 
                      "Marraskuuta", 
                      "Joulukuuta" ],

    };    

    var updateTmpl = null;

    function addUpdates(updates) {
        var updateInHtml = updateTmpl({ updates: updates});        
        defaults.target.innerHTML = updateInHtml;
    }

    function parseUpdate(update) {
        var creationTime = new Date(update.CreationTimeEpoch * 1000);
        var title = update.Title;
        title = title.split(/[\\?\\.\n]+/)[0];
        title = title.toLowerCase();
        title = title.charAt(0).toUpperCase() + title.slice(1);
        if(title.length > defaults.textLength)
        {
            title = title.substring(0, defaults.textLength);
            title = title + "...";
        }

        return {
            date: creationTime.getDate() + '. ' + defaults.monthNames[creationTime.getMonth()],
            text: title
        };
    }

	return {
        init: function (updates) {
            var tmpl = document.getElementById(defaults.tmplNewsUpdate);
            if(!tmpl) {
                return;
            }
            
            updateTmpl = _.template(tmpl.innerHTML);

            if(!defaults.target || defaults.target.length === 0) {
                throw new Error("Could not find element to add social media updates.");
            }
            
            var limitedList = _.first(updates, defaults.maxUpdates);
            var parsedUpdates = _.map(limitedList, parseUpdate);
            addUpdates(parsedUpdates);
    	}
    };
})(_);