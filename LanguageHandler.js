sap.ui.define([
    "jquery.sap.global",
    "sap/ui/base/Object",
    "shared/lib/odata/F4Factory",
    "sap/ui/model/json/JSONModel"
], function(jQuery, BaseObject, F4Factory, JSONModel ) 
{
    "use strict";
     
    var LanguageHandler = BaseObject.extend("shared.lib.general.LanguageHandler", {
        
    	constructor: function( controller )
        {
    		var that 			= this;
    		this._cont 			= controller;
        	this._view 			= controller.getView();
        	this.cookieLang		= "erecLanguageCookie";
    		jQuery.sap.require( "shared.utils.js-cookie/js-cookie");
    		
        		that._initializeSupportedLanguages( );

    			$( "#" + this.getDDId() ).change(
    	        		function(oEvent)
    	        		{
    	        			that.languageSwitch();
    	        		}
            	);

        }
    });
    
    LanguageHandler.prototype.getDDId = function()
    {
    	if( isMobile() === true )
    	{
    		return "siteLanguagesMobile";
    	}
    	else
    	{
    		return "siteLanguages";
    	}
    }
    
    LanguageHandler.prototype._initializeSupportedLanguages = function( )
    {
    	var that = this;
    	
    	var successF4Init = function(data)
    	{
    		that._f4Initialized = true;
    		that._fillSupportedLanguages(data.results);
    	}
    	   
    	this._f4er = new F4Factory( this._cont );
    	this._f4er.getF4List( "SupportedLanguages", successF4Init, function(){console.log("Failed to load supported")} );
    }
    
    LanguageHandler.prototype.getCurrentLanguage = function()
    {
        sap.ui.getCore().getConfiguration().getLanguage();
    }
    
    LanguageHandler.prototype.getCurrentLanguage = function()
    {
        sap.ui.getCore().getConfiguration().getLanguage();
    }
    
    LanguageHandler.prototype.setCurrentLanguage = function( langu )
    {
    	
    	this.updateCurrentLanguage();
    }
    
    LanguageHandler.prototype.languageSwitch = function( )
    {
		var langu = $( "#" + this.getDDId() ).find(":selected").val();
    	this.setSelectedLanguage( langu );
    	this.setGetParameter( "sap-language", langu );
    }
  
    LanguageHandler.prototype.setGetParameter = function(paramName, paramValue)
    {
        var url = window.location.href;
        var hash = location.hash;
        url = url.replace(hash, '');
        if (url.indexOf(paramName + "=") >= 0)
        {
            var prefix = url.substring(0, url.indexOf(paramName));
            var suffix = url.substring(url.indexOf(paramName));
            suffix = suffix.substring(suffix.indexOf("=") + 1);
            suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
            url = prefix + paramName + "=" + paramValue + suffix;
        }
        else
        {
        if (url.indexOf("?") < 0)
            url += "?" + paramName + "=" + paramValue;
        else
            url += "&" + paramName + "=" + paramValue;
        }
        window.location.href = url + hash;
    }
    

    LanguageHandler.prototype.updateCurrentLanguage = function( data )
    {   
    	var lang = getCalculatedLanguage(data);
    	
    	if( lang && lang.length > 0 )
    	{
    		this.setSelectedLanguage( lang );
    	}

    	return lang;
    }
    
    LanguageHandler.prototype.setSelectedLanguage = function( langu )
    {
		$( "#" + this.getDDId() ).val(langu);
		$.cookie( cookieVar, langu, { path: '/' } );
    }
    
    LanguageHandler.prototype._fillSupportedLanguages = function( languList )
    {
    	var odataLanguages	= [];
    	/*var languSelect     = document.getElementById(this.getDDId());
    	
    	if( !languSelect || !languList )    	
    	{
    		return;
    	}*/
    	
		for( var j = 0; j < languList.length; j++ )
		{
			odataLanguages.push( languList[j] );
			
			/*var option  = document.createElement("option");
	    	option.text   = languList[j].Value;
	    	option.value  = languList[j].Key;
	    	languSelect.add(option);*/
		}
    	
    	this.storeJSON( odataLanguages, "SupportedLanguages" );
		this.updateCurrentLanguage(odataLanguages);
    }
    
    LanguageHandler.prototype.storeJSON = function(data, name )
    {
    	var json = new JSONModel();
    	json.setData( data );
    	this._view.setModel( json, name );
    	/*this._jsonmodel = data;*/
    }

    return LanguageHandler;
});

var cookieVar	= "erecLanguageCookie";  
    
function getCalculatedLanguage(data)
{
	var lang 		= sap.ui.getCore().getConfiguration().getSAPLogonLanguage();
	var cookieLangu = $.cookie( cookieVar );
	var urlLangu	= getUrlParam( "sap-language" );
	
	if( cookieLangu )
	{
		lang = cookieLangu;
	}
	
	if( urlLangu )
	{
		lang = urlLangu;
	}
	
	if( data)
	{
		var notSupportedLang = isNotSupportedLanguage(data, lang);
		
		if (notSupportedLang)  
		{
			lang = "EN";
			cookieLangu = "EN";
		}
		
	}
	
	return lang;
}


function isNotSupportedLanguage(odataLanguages, lang)
{   
	lang.toUpperCase();
	for( var i = 0; i < odataLanguages.length; i++)
	{   
		if(odataLanguages[i].Key === lang)
		{
			return false;
		}
	}
	return true;
}