function doMyInit()
{
	if (document.all != null && document.all("Feedback",0) != null)
	{
		// If this is not an HTTP page, disable feedback
		if (document.location.protocol != "http:" && document.location.protocol != "https:" )
		{
			document.all("Feedback",0).innerHTML = "";
			document.all("Feedback",0).onclick = null;
		}
	}
}

function doLocalXMLInit()
{
// This is only used by IE4 and up when supporting XML table of contents.
	if (document.all("Feedback",0) != null)
	{
		// Let's see if the navigation bar has decided about using feedback.
		if (window.parent.useFeedback != null)
		{
			useFeedback = window.parent.useFeedback;
			displayFeedback(useFeedback);
		}
	}
}


//Hide the navigation menu
function HideMenu()
{
   var  oFramesets=window.parent.document.getElementsByTagName("frameset");
	oFramesets.item(1).cols="0,*";
}

//Display the navigation menu					
function DisplayMenu()
{
    var oFramesets=window.parent.document.getElementsByTagName("frameset");
	oFramesets.item(1).cols="240,*";
}


