/* global _ */
/* exported NewsModule */

var NewsModule = (function (_) {
    "use strict";

    var defaults = {
        tmplNewsUpdate: 'tmpl-news-update',
        maxUpdates: 4,
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

    var updateTmpl = null,
        targetEl = null;

    function addUpdates(updates) {
        var updateInHtml = updateTmpl({ updates: updates});        
        targetEl.innerHTML = updateInHtml;
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
            text: title,
            uri: update.Uri
        };
    }

	return {
        init: function (updates, targetSelector) {
            var target = document.querySelectorAll(targetSelector);
            if(target.length === 0) {
                return;
            }

            targetEl = target[0];

            var tmpl = document.getElementById(defaults.tmplNewsUpdate);
            if(!tmpl) {
                throw new Error("Could not find template for rendering social media updates.");
            }

            updateTmpl = _.template(tmpl.innerHTML);
            
            var limitedList = _.first(updates, defaults.maxUpdates);
            var parsedUpdates = _.map(limitedList, parseUpdate);
            addUpdates(parsedUpdates);
    	}
    };
})(_);