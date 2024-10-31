var recordSelect = true;
var bMSIE, bMSIE3, bMSIE4, bMSIE5, bMSIE4_beta, bMSIE4_01;
var bNetscape, bNetscape_2, bNetscape_3, bNetscape_4;

// Before finishing the load, let us see if we need to build
// the frame.

if (window.parent == self)
{
	// Need to build the frame
	// So where are we?
	var hrefTarget = document.location.pathname;

	if (hrefTarget.lastIndexOf("/") != 0)
	{
		hrefTarget = hrefTarget.substring(hrefTarget.lastIndexOf("/")+1);
	}
	browser();
	if (bMSIE3)
	{
		open("default.htm?startat="+hrefTarget+document.location.search, "_top");
	}
	else
	{
		document.location.replace("default.htm?startat="+hrefTarget+document.location.search);
	}
}

// Must not be rebuilding.

function browser()
{
	// borrowed from Microsoft
    var ua = navigator.userAgent;
    var an = navigator.appName;

    // Is it IE?
    bMSIE = (ua.indexOf("MSIE")>=1);
    if (bMSIE)
    {
        // IE3
        bMSIE3 = (ua.indexOf("MSIE 3.0")>=1);

        // IE4
        var iMSIE4 = ua.indexOf("MSIE 4.0");
        bMSIE4 = (iMSIE4>=1);
        if (bMSIE4)
        {
            var sMinorVer = ua.charAt(iMSIE4+8);
            // Some folks are still running an IE4 beta!
            // (the Mac IE team used a 'p' to mark their beta)
            bMSIE4_beta = bMSIE4 && ((sMinorVer == "b") || (sMinorVer == "p"));

            // IE4.01
            bMSIE4_01 = bMSIE4 && (sMinorVer == "1");
        }
        // IE5
        bMSIE5 = (ua.indexOf("MSIE 5.0")>=1);
    }
    else if (an == "Netscape")
    {
        bNetscape = true;
        appVer = parseInt(navigator.appVersion);
        if (appVer >= 4)
            bNetscape_4 = true;
        else if (appVer >= 3)
            bNetscape_3 = true;
        else
            bNetscape_2 = true;
    }
}
function doKP(event){
	textFrame = window.parent.doKeypress(event);
}


function newPage(pageHREF)
{
	var navFrame = window.parent.frames["NAV"];
	if (navFrame == null)
		return;
	if (navFrame.document.readyState == null)
		return;
	if (navFrame.document.readyState != "complete")
		return;
     //special SAP customization
     //alert("Exece...");
	textFrame = window.parent.frames["TEXT"];
     textFrame.document.body.attachEvent('onkeypress',doKP);
     window.parent.document.body.attachEvent('onkeypress',doKP);

	
	navFrame.doNewTextPage(pageHREF);
}

function newSelection()
{
	// Don't allow double clicks if this is not loaded via HTTP
	if (document.location.protocol != "http:" && document.location.protocol != "https:" )
	{
		return;
	}

	if (recordSelect == false)
		return;

	var navFrame = window.parent.frames["NAV"];
	if (navFrame == null)
		return;
	if (navFrame.document.readyState == null)
		return;
	if (navFrame.document.readyState != "complete")
		return;
	for (var targetElement = window.event.srcElement;
			targetElement != null;
			targetElement = targetElement.parentElement)
	{
		if (targetElement.getAttribute("srctreeloc") != null)
		{
			navFrame.textSelection(targetElement);
			window.event.cancelBubble = true;
			return;
		}
	}
	window.event.cancelBubble = true;
}

function gettingFocus()
{
	if (window.event.srcElement == window.document.body)
		return;
	recordSelect = true;
}

function losingFocus()
{
	if (window.event.srcElement == window.document.body)
		return;
	recordSelect = false;
}
