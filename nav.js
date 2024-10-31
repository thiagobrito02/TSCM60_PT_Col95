//
// This is the main function library for viewing pages built by Epic from ArborText.
//
// There are a large number of routines in this code so here is a quick index. Use
// this list to scroll down to the appropriate area.
//
// doNewTextPage(hrefString) - Called when a new page is loaded in the main view area.
// pageFirst() - move to the first page in the main view area.
// pageLast() - move to the last page in the main view area.
// pageNext() - move to the next page from the current page.
// pagePrev() - move to the previous page from the current page.
// hideItem(item) - marks the passed item as hidden.
// revealItem(item) - reveals the passed item.
// DoInit() - Initialization for the navigation page.
// OutputIndex() - Outputs the main keyword index.
// OutputProfiledIndex() - Does profiling of the keyword index.
// gotoIndex() - Make the keyword index visible hiding the toc.
// gotoToc() - Make the toc visible hiding the keyword index.
// outputChoose() - Outputs the profiling dropdowns.
// outputItem() - Recursively outputs the table of contents.
// DoOver() - Change the appearance of items in the index or toc as the mouse cursor
//            hovers over them.
// DoOut() - Change appearance back after hover.
// ExpandCollapse() - Process a click on the toc. This expands/collapses the local region
//                    and changes the current page if a link is available.
// DoAllEffectivity() - Processes all effectivity information.
// DoEffectivity() - Process effectivity attributes in the main text page.
// GetEffectItem() - Determine effectivity for a single element.
// DoTocEffectivity() - Process effectivity for the TOC.
// DoTocEffectItem() - Process effectivity for a single TOC item.
// KeywordClicked() - Handle a click on a keyword item.
// BucketClicked() - Handle a click on a keyword bucket item.
// TreeWalk() - Use a treeloc to traverse an XML parse tree.
// provideFeedback() - WebReview by any other name.
// openFeedbackWindow() - opens the feedback window


var currentchunk;
var prevSelection=null;

var ver = 0;
var collapsed = "<img src=\"$$$SLF$$$images/collapsd.gif\">";
var expanded = "<img src=\"$$$SLF$$$images/expanded.gif\">";
var leaf = "<img src=\"$$$SLF$$$images/leaf.gif\">";
var indexOn = "<img src=\"$$$SLF$$$images/indexon.gif\">";
var contentsOn = "<img src=\"$$$SLF$$$images/ctntson.gif\">";
var indexOff = "<img src=\"$$$SLF$$$images/indexoff.gif\" onClick=\"gotoIndex();\">";
var contentsOff = "<img src=\"$$$SLF$$$images/ctntsoff.gif\" onClick=\"gotoToc();\">";
var findButton = "<img src=\"$$$SLF$$$images/findb.gif\">";
var nextButton = "<img src=\"$$$SLF$$$images/nextb.gif\">";
var defaultLevel = 1;
var tocIndexMultiplier = 5;
var currentDiv;
var currentPage;
var effectArray;
var effectLength = 0;
var tocArray;
var tocLength;
var currentHref = null;
var indexXML = null;
var indexHTML = null;
var tabButtons = 0;
var tabHTML = new Array();
var tabCount = 0;
var textSelectArea = null;
var windowFeedback = null;
var textFrame = null;
var localFrame = null;

var firstPage = "text.htm";

var loadFirstPage = true;  //???

var xmlToc = null;
var currentToc = null;
var newToc = "toc";
var xmlChunk = null;
var currentChunk = null;
var newChunk = "chunk";
var xmlKindex = null;
var currentKindex = null;
var newKindex = "kindex";
var initialMode = "toc";
var multiToc = false;

//var xml = null;
var extraTries = 1;
var chunkList = null;
var ttsMode = "disabled";
var ttsIndex = 0;
var ttsString;
var ttsFoundTarget = null;
var ttsOldDecoration;
var suppressHistory = true;

// the following variable is part of a work-around to CR 35161
// on unix the window.closed property is inaccurate
// so implemented Epic close tracking
var feedbackWindowOpen = false;

function test(){
	alert("Test over");
}
function doNewTextPage(hrefString)
{
    DoEffectivity();
    //markActive(hrefString);
    //alert(hrefString);
    currentHref = hrefString;
    textSelectArea = window.parent.frames("TEXT").document.body.children(0);
	focusThisLink(window.parent.frames("NAV"),hrefString);
}

function checkCurrentPage()
{
    if (currentHref == null)
        currentHref = window.parent.frames("TEXT").document.location.pathname;
}

function pageFirst()
{
	var hrefString;
	var thisChunk;

	if (chunkList == null)
	{
	    
		for (var i = 0; i < toc.all.length; i++)
		{
			var workItem = toc.all.item(i);
			if (workItem.tagName != "DIV")
				continue;
			if (workItem.getAttribute("href") != null && workItem.className != "hidden")
			{
				window.parent.frames("TEXT").document.location.replace(workItem.getAttribute("href"));
				suppressHistory = false;
				return;
			}
		}
    }

	if (ver == 4)
	{
		for (var i = 0; i < chunkList.length; i++)
		{
			thisChunk = chunkList.item(i);
			if (thisChunk.type > 0)
				continue;
			if (thisChunk.tagName != "CHUNK")
				continue;
			hrefString = thisChunk.getAttribute("href");
			if (hrefString == null)
				continue;
			window.parent.frames("TEXT").document.location.replace(hrefString);
			suppressHistory = false;
			return;
		}
	}
	else
	{
		for (var i = 0; i < chunkList.length; i++)
		{
			thisChunk = chunkList.item(i);
			if (thisChunk.nodeType > 1)
				continue;
			if (thisChunk.nodeName != "chunk")
				continue;
			hrefString = thisChunk.getAttribute("href");
			if (hrefString == null)
				continue;
			window.parent.frames("TEXT").document.location.replace(hrefString);
			suppressHistory = false;
			return;
		}
	}

    alert(parent.messages.noFirstPage);
}

function pageLast()
{
	var hrefString;
	var thisChunk;

	if (ver == 4)
	{
		for (var i = chunkList.length - 1; i > -1; i--)
		{
			thisChunk = chunkList.item(i);
			if (thisChunk.type > 0)
				continue;
			if (thisChunk.tagName != "CHUNK")
				continue;
			hrefString = thisChunk.getAttribute("href");
			if (hrefString == null)
				continue;
            if (window.parent.frames("TEXT") != null)
                window.parent.frames("TEXT").document.location = hrefString;
			return;
		}
	}
	else
	{
		for (var i = chunkList.length - 1; i > -1; i--)
		{
			thisChunk = chunkList.item(i);
			if (thisChunk.nodeType > 1)
				continue;
			if (thisChunk.nodeName != "chunk")
				continue;
			hrefString = thisChunk.getAttribute("href");
			if (hrefString == null)
				continue;
            if (window.parent.frames("TEXT") != null)
                window.parent.frames("TEXT").document.location = hrefString;
			return;
		}
	}

    alert(parent.messages.noLastPage);
}


function pageNext()
{
	if (chunkList == null)
		return;
    checkCurrentPage();

    var targetFound = false;
    var hrefTarget = currentHref;
    var tocLength = toc.all.length;

	if (hrefTarget.lastIndexOf("/") != 0)
	{
		hrefTarget = hrefTarget.substr(hrefTarget.lastIndexOf("/")+1);
	}
	else if (hrefTarget.lastIndexOf("\\") != 0)
	{
		hrefTarget = hrefTarget.substr(hrefTarget.lastIndexOf("\\")+1);
	}


	if (ver == 4)
	{
		for (var i = 0; i < chunkList.length; i++)
		{
			thisChunk = chunkList.item(i);
			if (thisChunk.type > 0)
				continue;
			if (thisChunk.tagName != "CHUNK")
				continue;
			hrefString = thisChunk.getAttribute("href");
			if (hrefString == null)
				continue;
			if (hrefString == hrefTarget)
			{
				targetFound = true;
			}
			else if (targetFound)
			{
				if (!getEffectItem(thisChunk))
					continue;
	            if (window.parent.frames("TEXT") != null)
		            window.parent.frames("TEXT").document.location = hrefString;
				return;
			}
		}
	}
	else
	{
		for (var i = 0; i < chunkList.length; i++)
		{
			thisChunk = chunkList.item(i);
			if (thisChunk.nodeType > 1)
				continue;
			if (thisChunk.nodeName != "chunk")
				continue;
			hrefString = thisChunk.getAttribute("href");
			if (hrefString == null)
				continue;
			if (hrefString == hrefTarget)
			{
				targetFound = true;
			}
			else if (targetFound)
			{
				//customizatio for SAP
				//var navFrame=window.parent.frames("NAV")
				//focusThisLink(navFrame,hrefString);
				if (!getEffectItem(thisChunk))
					continue;
	            if (window.parent.frames("TEXT") != null)
		            window.parent.frames("TEXT").document.location = hrefString;
				return;
			}
		}
	}

    alert(parent.messages.noNextPage);
}

function pagePrev()
{
	if (chunkList == null)
		return;
    checkCurrentPage();

    var targetFound = false;
    var hrefTarget = currentHref;
	if (hrefTarget.lastIndexOf("/") != 0)
	{
		hrefTarget = hrefTarget.substr(hrefTarget.lastIndexOf("/")+1);
	}
	else if (hrefTarget.lastIndexOf("\\") != 0)
	{
		hrefTarget = hrefTarget.substr(hrefTarget.lastIndexOf("\\")+1);
	}


	if (ver == 4)
	{
		for (var i = chunkList.length - 1; i > -1; i--)
		{
			thisChunk = chunkList.item(i);
			if (thisChunk.type > 0)
				continue;
			if (thisChunk.tagName != "CHUNK")
				continue;
			hrefString = thisChunk.getAttribute("href");
			if (hrefString == null)
				continue;
			if (hrefString == hrefTarget)
			{
				targetFound = true;
			}
			else if (targetFound)
			{
				if (!getEffectItem(thisChunk))
					continue;
	            if (window.parent.frames("TEXT") != null)
		            window.parent.frames("TEXT").document.location = hrefString;
				return;
			}
		}
	}
	else
	{
		for (var i = chunkList.length - 1; i > -1; i--)
		{
			thisChunk = chunkList.item(i);
			if (thisChunk.nodeType > 1)
				continue;
			if (thisChunk.nodeName != "chunk")
				continue;
			hrefString = thisChunk.getAttribute("href");
			if (hrefString == null)
				continue;
			if (hrefString == hrefTarget)
			{
				targetFound = true;
			}
			else if (targetFound)
			{
				//customizatio for SAP
				//var navFrame=window.parent.frames("NAV")
				//focusThisLink(navFrame,hrefString);
				if (!getEffectItem(thisChunk))
					continue;
	            if (window.parent.frames("TEXT") != null)
		            window.parent.frames("TEXT").document.location = hrefString;
				return;
			}
		}
	}

    alert(parent.messages.noPreviousPage);
}

function hideItem( targetItem )
{

    var currentClass = targetItem.className;
    if (currentClass == "hidden")
        return;

    targetItem.setAttribute("oldClass", currentClass, true);

    targetItem.className = "hidden";
}

function revealItem( targetItem )
{

    if (targetItem.className != "hidden")
        return;
    targetItem.className = targetItem.getAttribute("oldClass", true);
}

function doInit()
{
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf ( "MSIE " );
    var doSLF = window.parent.doSLF;
    textFrame = window.parent.frames("TEXT");
    localFrame = window.parent.frames("LOCAL");
    tabCount = 0;
    if (doSLF != null)
    {
        collapsed = doSLF(collapsed);
        expanded = doSLF(expanded);
        leaf = doSLF(leaf);
        indexOn = doSLF(indexOn);
        indexOff = doSLF(indexOff);
        contentsOn = doSLF(contentsOn);
        contentsOff = doSLF(contentsOff);
	findButton = doSLF(findButton);
	nextButton = doSLF(nextButton);
    }

    if (xmlToc != null)
        if (!multiToc)
            return;

    if ( msie > 0 )        // is Microsoft Internet Explorer; return version number
        ver = parseInt ( ua.substring ( msie+5, ua.indexOf ( ".", msie ) ) );
	else
		ver = 1;
	//if (ver > 4)
	//	ver = 4;

    if (newChunk != currentChunk)
    {
	effectArray = new Array();
	effectLength = 0;
    }

    if (currentToc != newToc)
    {
	toc.innerHTML = "";
	tocArray = new Array();
	tocLength = 0;
    }
    if (ver == 4)
    {
//        xml = new ActiveXObject("msxml");
	if (xmlToc == null)
            xmlToc = new ActiveXObject("msxml");
        if (xmlChunk == null)
            xmlChunk = new ActiveXObject("msxml");
	if (xmlKindex == null)
	    xmlKindex = new ActiveXObject("msxml");


        var upperPath = document.location.pathname;
        var lastSlash;
        if (document.location.protocol == "file:")
            lastSlash = upperPath.lastIndexOf("\\");
        else
            lastSlash = upperPath.lastIndexOf("/");
        if (lastSlash != upperPath.length)
        {
            if (lastSlash > -1)
            {
                upperPath = upperPath.substring(0,lastSlash+1);
            }
            else
            {
                upperPath = "";
            }
        }
	if(currentToc != newToc)
	{
	    xmlToc.URL = document.location.protocol + "//" + document.location.host + upperPath + newToc + ".xml";
	}
	
	if (xmlToc.root.getAttribute("toptoc") != null) 
	{
	    //multiple toc/kindex files
	    multiToc = true;
            if (initialMode == "toc")
            {
                newKindex = "kindex";
            }
	    if (xmlChunk == null)
	    {
		xmlChunk = new ActiveXObject("microsoft.xmldom");
		xmlChunk.async = "FALSE";
	    }
	    if (newChunk != currentChunk)
		xmlChunk.URL = document.location.protocol + "//" + document.location.host + upperPath + newChunk + ".xml";
	    if (xmlKindex == null)
	    {
		xmlKindex = new ActiveXObject("microsoft.xmldom");
		xmlKindex.async = "FALSE";
	    }
	    if (newKindex != currentKindex)
	    {
		xmlKindex.URL = document.location.protocol + "//" + document.location.host + upperPath + newKindex + ".xml";
	    }
	}
	else
	{
	    //single toc.xml, set xmlChunk and xmlKindex to it
	    xmlChunk.URL = document.location.protocol + "//" + document.location.host + upperPath + "toc.xml";
	    xmlKindex.URL = document.location.protocol + "//" + document.location.host + upperPath + "toc.xml";
	}

    }
    else if (ver > 4)
    {
//        xml = new ActiveXObject("microsoft.xmldom");
//        xml.async = "FALSE";
//        xml.load("toc.xml");
	
        if (xmlToc == null)
        {
            xmlToc = new ActiveXObject("microsoft.xmldom");
	    xmlToc.async = "FALSE";
        }
        if (newToc != currentToc)
	{
            xmlToc.load(newToc + ".xml"); 
	}
	var docroot= xmlToc.documentElement;
	if (docroot.getAttribute("toptoc") != null) 
	{     
	    //multiple toc/kindex files
	    multiToc = true;
            if (initialMode == "toc")
            {
                newKindex = "kindex";
            }
	    if (xmlChunk == null)
	    {
		xmlChunk = new ActiveXObject("microsoft.xmldom");
		xmlChunk.async = "FALSE";
	    }
	    if (newChunk != currentChunk)
		xmlChunk.load(newChunk + ".xml");
	    if (xmlKindex == null)
	    {
		xmlKindex = new ActiveXObject("microsoft.xmldom");
		xmlKindex.async = "FALSE";
	    }
	    if (newKindex != currentKindex)
	    {
		xmlKindex.load(newKindex + ".xml");
	    }
	}
	else
	{
	    //single toc file
	    xmlChunk = new ActiveXObject("microsoft.xmldom");
	    xmlChunk.async = "FALSE";
	    xmlChunk.load("toc.xml");
	    xmlKindex = new ActiveXObject("microsoft.xmldom");
	    xmlKindex.async = "FALSE";
	    xmlKindex.load("toc.xml");
	}
    }

	if (ver > 3)
	{
		doXMLInit();
	}
}

function doXMLInit()
{
    var docroot;

    if (ver == 4)
    {
        if (xmlToc.ReadyState != 4 || window.parent.frames("LOCAL").document.all("Feedback",0) == null)
        {
            window.setTimeout("doXMLInit()",250);
            return;
        }
    }
    if (ver == 4)
    {
	if (currentToc != newToc)
        {
	    docroot = xmlToc.root;
			// Check if the user is specifying the number of levels to expand
	    if (docroot.getAttribute("expandtoclevels") != null)
	    {
		//defaultLevel = docroot.getAttribute("expandtoclevels");
		defaultLevel = 1;
	    }
	    // Check if the user is disabling feedback
	    if (docroot.getAttribute("feedback") != "1")
	    {
		if (window.parent.frames("LOCAL").document.readyState == "complete")
		{
		  //  window.parent.frames("LOCAL").displayFeedback(false);
		}
		window.parent.useFeedback = false;
	    }
	    else
	    {
		if (window.parent.frames("LOCAL").document.readyState == "complete")
		{
		  //  window.parent.frames("LOCAL").displayFeedback(true);
		}
		window.parent.useFeedback = true;
	    }
	    for (i = 0; i <docroot.children.length; i++)
	    {
		var workItem = docroot.children.item(i);
		if (workItem.type > 0)
		    continue;
		if (workItem.tagName == "TOC")
		{
		    insertTocTextSearch();
		    tabHTML[tabCount] = "<div class=\"navtab\">" + contentsOn + "</img>" + indexOff + "</img></div>";
		    tabCount++;
		    for (var j = 0; j < workItem.children.length; j++)
		    {
			if (workItem.children.item(j).tagName != "ITEM")
			    continue;
			toc.insertAdjacentHTML("beforeEnd", outputItem(workItem.children.item(j), 0));
		    }
		} 
// 		else if (workItem.tagName == "CHOOSE")
// 		{
// 		    outputChoose(workItem, choose);
// 		} else if (workItem.tagName == "INDEX")
// 		{
// 		    outputIndex(workItem, kindex);
// 		} else if (workItem.tagName == "CHUNKS")
// 		{
// 		    chunkList = workItem.children;
// 		}
	    }
	}
	// Process the choose and chunk entries separately
        if (currentChunk != newChunk)
        {
	    docroot = xmlChunk.root;
	    for (i = 0; i <docroot.children.length; i++)
	    {
		var workItem = docroot.children.item(i);
		if (workItem.type > 0)
		    continue;
		if (workItem.tagName == "CHUNKS")
		{
		    chunkList = workItem.children;
		}
                else
                {
                    if (workItem.tagName == "CHOOSE")
		    {
			outputChoose(workItem, choose);
		    }
                }
	    }
        }
	// Process the keyword index separately
        if (currentKindex != newKindex)
        {
	    docroot = xmlKindex.root;
	    for (i = 0; i <docroot.children.length; i++)
	    {
		var workItem = docroot.children.item(i);
		if (workItem.tagName == "INDEX")
		{
		    outputIndex(workItem, kindex);
		}
	    }
        }
    }
    else if (ver > 4)
    {
	if (currentToc != newToc)
        {
	    docroot = xmlToc.documentElement;
	    // Check if the user is specifying the number of levels to expand
	    if (docroot.getAttribute("expandtoclevels") != null)
	    {
		//Dermot 28-04-2009
		//defaultLevel = docroot.getAttribute("expandtoclevels");
		defaultLevel = 1;
		//alert('docroot defaultLevel :' + defaultLevel);
	    }
	    // Check if the user is disabling feedback
	    if (docroot.getAttribute("feedback") != "1")
	    {
		if (window.parent.frames("LOCAL").document.readyState == "complete")
		{
		  //  window.parent.frames("LOCAL").displayFeedback(false);
		}
		window.parent.useFeedback = false;
	    }
	    else
	    {
		if (window.parent.frames("LOCAL").document.readyState == "complete")
		{
		 //   window.parent.frames("LOCAL").displayFeedback(true);
		}
		window.parent.useFeedback = true;
	    }
	    for (i = 0; i <docroot.childNodes.length; i++)
	    {
		var workItem = docroot.childNodes.item(i);
		if (workItem.nodeName == "toc")
		{
		    insertTocTextSearch(toc);
		    
		    tabHTML[tabCount] = "<div class=\"navtab\">" + contentsOn + "</img>" + indexOff + "</img></div>";
		    tabCount++;
		    for (var j = 0; j < workItem.childNodes.length; j++)
		    {
			if (workItem.childNodes.item(j).nodeName != "item")
			    continue;
			toc.insertAdjacentHTML("beforeEnd", outputItem(workItem.childNodes.item(j), 0));
		    }
		}
// 		else if (workItem.nodeName == "choose")
// 		{
// 		    outputChoose(workItem, choose);
// 		} else if (workItem.nodeName == "index")
// 		{
// 		    outputIndex(workItem, kindex);
// 		} else if (workItem.nodeName == "chunks")
// 		{
// 		    chunkList = workItem.childNodes;
// 		}
	    }
	}
    
	if (newChunk != currentChunk)
	{
	    docroot = xmlChunk.documentElement;
	    for (i = 0; i <docroot.childNodes.length; i++)
	    {
		var workItem = docroot.childNodes.item(i);
		if (workItem.nodeName == "chunks")
		{
		    chunkList = workItem.childNodes;
		}
		else
		{
		    if (workItem.nodeName == "choose")
		    {
			outputChoose(workItem, choose);
		    }
		}
	    }
	}
	if (newKindex != currentKindex)
	{
	    docroot = xmlKindex.documentElement;
	    for (i = 0; i <docroot.childNodes.length; i++)
	    {
		var workItem = docroot.childNodes.item(i);
		if (workItem.nodeName == "index")
		{
		    outputIndex(workItem, kindex);
		}
	    }
	}
    }
    if(newToc != currentToc)
	doTocEffectivity();

    currentToc = newToc;
    currentKindex = newKindex;
    currentChunk = newChunk;
    

    if (initialMode == "toc")
        gotoToc();
    if (initialMode == "kindex")
        gotoIndex();


    // CR 36688, check if the starting page has been changed.
    checkCurrentPage();
    var hrefTarget = currentHref;
    if (hrefTarget.lastIndexOf("/") != 0)
    {
        hrefTarget = hrefTarget.substr(hrefTarget.lastIndexOf("/")+1);
    }
    else if (hrefTarget.lastIndexOf("\\") != 0)
    {
        hrefTarget = hrefTarget.substr(hrefTarget.lastIndexOf("\\")+1);
    }
    if (hrefTarget != firstPage)
        return;

    if (window.parent.startPage != null)
	textFrame.document.location.replace(window.parent.startPage);
    else
    {
	suppressHistory = true;
	pageFirst();
    }
}

function outputIndex(thisItem, targetItem)
{
    indexXML = thisItem;
    tabHTML[tabCount++] = "<div class=\"navtab\">" + contentsOff + "</img>" + indexOn + "</img></div>";
    outputProfiledIndex(thisItem, targetItem);
    return;
}

function outputProfiledIndex(thisItem, targetItem)
{
    var kindexHTML = "";
    var OldkindexHTML ="";
    var workItem;
    var kIdx;
    targetItem.innerHTML = "";

    if (ver == 4)
    {
		if (thisItem.children == null)
			return;
        var loopLen = thisItem.children.length;
        var workItem;
        var i;
        var j;
        var k;
        var innerLoopLen;
        var innerWorkItem;
        var in2LoopLen;
        var in2WorkItem;
        var newHTML;

        for (i = 0; i < loopLen; i++)
        {
            workItem = thisItem.children.item(i);
            if (workItem.type != 0)
                continue;
            if (workItem.tagName == "INDEXBUCKET")
            {
		OldkindexHTML = kindexHTML;
		kindexHTML = kindexHTML
		    + '<div class="cnavbucket" expanded="deferred" deferlink="' + (i+1) + '">'
		    + '<nobr>'
		    + workItem.getAttribute("bucket")
		    + '</nobr>'
		    + '</div>';
                if (workItem.children == null || xmlToc.root.getAttribute("toptoc") == null)
                {
                    continue;
                }
                innerLoopLen = workItem.children.length;
		if(innerLoopLen != 0) 
		{
		    kindexHTML = OldkindexHTML 
			+ '<div class="navbucket" expanded="yes" deferlink="' + (i+1) + '">'
			+ '<nobr>'
			+ workItem.getAttribute("bucket")
			+ '</nobr>';
			//+ '</div>';
		}
		newHTML = "";
                for (j = 0; j < innerLoopLen; j++)
                {
                    innerWorkItem = workItem.children.item(j);
                    if (innerWorkItem.type != 0)
                        continue;
                    in2LoopLen = innerWorkItem.children.length;
                    for (k = 0; k < in2LoopLen; k++)
                    {
                        in2WorkItem = innerWorkItem.children.item(k);
                        if (in2WorkItem.type != 0)
                            continue;
                        if (in2WorkItem.children.length > 1)
                            newHTML = newHTML + '<div class="'
                                    + in2WorkItem.getAttribute("class")
                                    + '" link="' + (i+1) + "." + (j+1) + "." + (k+1) + "." + '">'
                                    + '<nobr>'
                                    + in2WorkItem.children.item(0).text
                                    + '</nobr>'
                                    + '</div>';
                        else
                            newHTML = newHTML + '<div class="'
                                    + in2WorkItem.getAttribute("class") + '">'
                                    + '<nobr>'
                                    + in2WorkItem.children.item(0).text
                                    + '</nobr>'
                                    + '</div>';
                    }
                }
		if(innerLoopLen != 0)
		    kindexHTML = kindexHTML + newHTML + '</div>';	    
		else
		    kindexHTML = kindexHTML + newHTML;
            }
            else
            {
                if (workItem.children == null)
                {
                    continue;
                }
                innerLoopLen = workItem.children.length;
                for (j = 0; j < innerLoopLen; j++)
                {
                    innerWorkItem = workItem.children.item(j);
                    if (innerWorkItem.type != 0)
                        continue;
		    if (innerWorkItem.children.length > 1)
			newHTML = '<div class="'
			    + innerWorkItem.getAttribute("class")
			    + '" link="' + (i+1) + "." + (j+1) + "." + '">'
			    + '<nobr>'
			    + innerWorkItem.children.item(0).text
			    + '</nobr>'
			    + '</div>';
		    else
			newHTML = '<div class="'
			    + innerWorkItem.getAttribute("class") + '">'
			    + '<nobr>'
			    + innerWorkItem.children.item(0).text
			    + '</nobr>'
			    + '</div>';
		    kindexHTML = kindexHTML + newHTML;
		    }
            }
        }
        targetItem.insertAdjacentHTML("beforeEnd", kindexHTML);
    }
    else
    {
	if (thisItem.childNodes == null)
	    return;
        var loopLen = thisItem.childNodes.length;
        var workItem;
        var i;
        var j;
        var k;
        var innerLoopLen;
        var innerWorkItem;
        var in2LoopLen;
        var in2WorkItem;
        var newHTML;
       for (i = 0; i < loopLen; i++)
        {
            workItem = thisItem.childNodes.item(i);
            if (workItem.nodeType != 1)
                continue;
            if (workItem.nodeName == "indexbucket")
            {

		OldkindexHTML = kindexHTML;
		kindexHTML = kindexHTML
		    + '<div class="cnavbucket" expanded="deferred" deferlink="' + (i+1) + '">'
		    + '<nobr>'
		    + workItem.getAttribute("bucket")
		    + '</nobr>'
		    + '</div>';

            
                if (workItem.childNodes == null || xmlToc.documentElement.getAttribute("toptoc") == null)
		{
                    continue;
		}

                innerLoopLen = workItem.childNodes.length;
		if(innerLoopLen != 0) 
		{
		    kindexHTML = OldkindexHTML 
			+ '<div class="navbucket" expanded="yes" deferlink="' + (i+1) + '">'
			+ '<nobr>'
			+ workItem.getAttribute("bucket")
			+ '</nobr>'
			;//+ '</div>';
		}
		newHTML = "";
                for (j = 0; j < innerLoopLen; j++)
                {
                    innerWorkItem = workItem.childNodes.item(j);
                    if (innerWorkItem.nodeType != 1)
                        continue;
                    in2LoopLen = innerWorkItem.childNodes.length;
                    for (k = 0; k < in2LoopLen; k++)
                    {
                        in2WorkItem = innerWorkItem.childNodes.item(k);
                        if (in2WorkItem.nodeType != 1)
                            continue;
                        if (in2WorkItem.childNodes.length > 1)
                            newHTML = newHTML + '<div class="'
				+ in2WorkItem.getAttribute("class")
				+ '" link="' + (i+1) + "." + (j+1) + "." + (k+1) + "." + '">'
				+ '<nobr>'
				+ in2WorkItem.childNodes.item(0).nodeValue
				+ '</nobr>'
				+ '</div>';
                        else
                            newHTML = newHTML + '<div class="'
				+ in2WorkItem.getAttribute("class") + '">'
				+ '<nobr>'
				+ in2WorkItem.childNodes.item(0).nodeValue
				+ '</nobr>'
				+ '</div>';
                    }
                }
		if(innerLoopLen != 0)
		    kindexHTML = kindexHTML + newHTML + '</div>';	    
		else
		    kindexHTML = kindexHTML + newHTML;
	    }
            else
            {
                if (workItem.childNodes == null)
                {
                    continue;
                }
                innerLoopLen = workItem.childNodes.length;
                for (j = 0; j < innerLoopLen; j++)
                {
                    innerWorkItem = workItem.childNodes.item(j);
                    if (innerWorkItem.nodeType != 1)
                        continue;
                    if (innerWorkItem.childNodes.length > 1)
                        newHTML = '<div class="'
			    + innerWorkItem.getAttribute("class")
			    + '" defaultClass="'
			    + innerWorkItem.getAttribute("class")
			    + '" link="' + (i+1) + "." + (j+1) + "." + '">'
			    + '<nobr>'
			    + innerWorkItem.childNodes.item(0).nodeValue
			    + '</nobr>'
			    + '</div>';
                    else
                        newHTML = '<div class="'
			    + innerWorkItem.getAttribute("class") + '">'
			    + '" defaultClass="'
			    + innerWorkItem.getAttribute("class")
			    + '<nobr>'
			    + innerWorkItem.childNodes.item(0).nodeValue
			    + '</nobr>'
			    + '</div>';
                    kindexHTML = kindexHTML + newHTML;
                }
            }
        }
        targetItem.insertAdjacentHTML("beforeEnd", kindexHTML);
    }
}

function gotoIndex()
{

	if (ver < 4)
	{
	    window.parent.gotoIndex();
	    window.parent.doInit(self.document);
	}
	else
	{
	    initialMode = "kindex";
	    kindex.className = "navindex";
	    toc.className = "hidden";
	    tts.className = "hidden";
	    tab.innerHTML = tabHTML[1];
	}
}

function gotoToc()
{

	if (ver < 4)
	{
		window.parent.gotoToc();
		window.parent.doInit(self.document);
	}
	else
	{
	    initialMode = "toc";
	    toc.className = "navtoc";
	    if( multiToc )
		tts.className = "hidden";  //hide find if multitoc
	    else 
		//tts.className = "navtts";
	        tts.className = "hidden";
	        kindex.className = "hidden";
	    if (tabCount > 1 || multiToc)
	        tab.innerHTML = tabHTML[0];
	}
}



function outputChoose(thisItem, targetItem)
{
    var HTMLString;
    var firstOption;

	if (effectLength == 0) //This is the first time a choose has been written
	{
		targetItem.insertAdjacentHTML("beforeEnd", '<h4>Custom Document View</h4>');
		targetItem.insertAdjacentHTML("afterEnd", '<hr>');
	}

    if (ver == 4)
    {
	    HTMLString = '<DIV>' + thisItem.children.item("name",0).text + '</DIV><SELECT NAME="' + thisItem.getAttribute("attribute") + '" SIZE="1" onchange="doAllEffectivity();">';
        firstOption = " SELECTED ";
        for (var i = 0; i < thisItem.children.length; i++)
        {
            if (thisItem.children.item(i).tagName != "ITEM")
                continue;
            HTMLString = HTMLString
                               + '<OPTION ' + firstOption + 'VALUE="'
                               + thisItem.children.item(i).children.item("value",0).text + '">'
                               + thisItem.children.item(i).children.item("name",0).text;
            firstOption = ""
        }
		HTMLString = HTMLString + "</SELECT>";
    }
    else
    {
	    HTMLString = '<DIV>' + getTextFromFirst(thisItem, "name") + '</DIV><SELECT NAME="' + thisItem.getAttribute("attribute") + '" SIZE="1" onChange="doAllEffectivity();">';
        firstOption = " SELECTED ";
        for (var i = 0; i < thisItem.childNodes.length; i++)
        {
            if (thisItem.childNodes.item(i).nodeName != "item")
                continue;
            HTMLString = HTMLString
                               + '<OPTION ' + firstOption + 'VALUE="'
                               + getTextFromFirst(thisItem.childNodes.item(i), "value") + '">'
                               + getTextFromFirst(thisItem.childNodes.item(i), "name");
            firstOption = ""
        }
		HTMLString = HTMLString + "</SELECT>";
    }

    var newNode = targetItem.children.length;

    targetItem.insertAdjacentHTML("beforeEnd", HTMLString);

    effectArray[effectLength] = targetItem.children.item(newNode+1);
    effectLength++;
}

function outputItem(thisItem, level)
{
    var styleString;
    var itemChildren;
    var subToc;
    if (ver == 4)
    {
        itemChildren = thisItem.children;
    }
    else
    {
        itemChildren = thisItem.childNodes;
    }

    tocArray[tocLength] = thisItem;
    tocLength++;

    var childHTML = "";
    for (var i = 0; i <itemChildren.length; i++)
    {
        var workItem = itemChildren.item(i);
        if (workItem.type > 0)
            continue;
        if (ver == 4)
        {
            if (workItem.tagName == "ITEM")
                childHTML = childHTML + outputItem(workItem, level + 1);
			if (workItem.tagName == "NAME")
				window.parent.document.title.innerText = workItem.text;
        }
        else
        {
            if (workItem.nodeName == "item")
                childHTML = childHTML + outputItem(workItem, level + 1);
			if (workItem.nodeName == "NAME")
				window.parent.document.title.innerText = workItem.nodeValue;
        }
    }

    subToc = thisItem.getAttribute("subtoc");

    

    if (childHTML == "" && subToc == null)
        styleString = 'class="leaf"';
    else
    {
        if ((level < defaultLevel && subToc == null) || thisItem.getAttribute("ptp")=="1")  
	{
	    //(subToc == null) makes sure a subToc item is collapsed
	    styleString = 'class="xnode"';
	}
        else
	{
            styleString = 'class="cnode"';
	}
    }
    
    var hrefString;
    if (thisItem.getAttribute("href") == null)
    {
        hrefString = "";
    }
    else
    {
        hrefString = ' href="' + thisItem.getAttribute("href") + '" ';
    }

    var htmlString = '<div  ' + hrefString + styleString + ">"
	var tocStyle = thisItem.getAttribute("class");
	var tocStyleString = " ";
	if (tocStyle != null)
	{
		tocStyleString = ' class="' + tocStyle + '" defaultClass="' + tocStyle + '" ';
	}
    if (ver == 4)
    {
        if (childHTML == "" && subToc == null)
	{
            htmlString = htmlString + '<NOBR><SPAN class="navtree" id="control">' + leaf + '</SPAN>' + '<SPAN id="text"' + tocStyleString + '>' + itemChildren.item(0).text + '</SPAN></NOBR>' + childHTML + "</div>";
	}
        else if (level < defaultLevel && subToc == null)
	    htmlString = htmlString + '<NOBR><SPAN class="navtree" id="control">' + expanded + '</SPAN>' + '<SPAN id="text"' + tocStyleString + '>' + itemChildren.item(0).text + '</SPAN></NOBR>' + childHTML + "</div>";
	else if (subToc==null && styleString == 'class="cnode"')
	    htmlString = htmlString + '<NOBR><SPAN class="navtree" id="control">' + collapsed + '</SPAN>' + '<SPAN id="text"' + tocStyleString + '>' + itemChildren.item(0).text + '</SPAN></NOBR>' + childHTML + "</div>";
	else if (subToc==null)
	    htmlString = htmlString + '<NOBR><SPAN class="navtree" id="control">' + expanded + '</SPAN>' + '<SPAN id="text"' + tocStyleString + '>' + itemChildren.item(0).text + '</SPAN></NOBR>' + childHTML + "</div>";
	else if (styleString == 'class="cnode"')
	    htmlString = htmlString + '<NOBR><SPAN class="navtree" id="control" subtoc="' + subToc + '">' + collapsed + '</SPAN>' + '<SPAN id="text"' + tocStyleString + '>' + itemChildren.item(0).text + '</SPAN></NOBR>' + childHTML + "</div>";
	else
	    htmlString = htmlString + '<NOBR><SPAN class="navtree" id="control" subtoc="' + subToc + '">' + expanded + '</SPAN>' + '<SPAN id="text"' + tocStyleString + '>' + itemChildren.item(0).text + '</SPAN></NOBR>' + childHTML + "</div>";
    }
    else
    {
        if (childHTML == ""  && subToc == null)
            htmlString = htmlString + '<NOBR><SPAN class="navtree" id="control">' + leaf + '</SPAN>' + '<SPAN id="text"' + tocStyleString + '>' + getTextFromFirst(thisItem, "name") + '</SPAN></NOBR>' + childHTML + "</div>";
        else if (level < defaultLevel && subToc == null)
	    htmlString = htmlString + '<NOBR><SPAN class="navtree" id="control">' + expanded + '</SPAN>' + '<SPAN id="text"' + tocStyleString + '>' + getTextFromFirst(thisItem, "name") + '</SPAN></NOBR>' + childHTML + "</div>";
	else if (subToc==null && styleString == 'class="cnode"')
	    htmlString = htmlString + '<NOBR><SPAN class="navtree" id="control">' + collapsed + '</SPAN>' + '<SPAN id="text"' + tocStyleString + '>' + getTextFromFirst(thisItem, "name") + '</SPAN></NOBR>' + childHTML + "</div>";
	else if(subToc == null)
	{
	    //		  alert("expanded name, subToc==null="+ getTextFromFirst(thisItem, "name"));
	    htmlString = htmlString + '<NOBR><SPAN class="navtree" id="control">' + expanded + '</SPAN>' + '<SPAN id="text"' + tocStyleString + '>' + getTextFromFirst(thisItem, "name") + '</SPAN></NOBR>' + childHTML + "</div>";
	}
	else if (styleString == 'class="cnode"')
	{
	    htmlString = htmlString + '<NOBR><SPAN class="navtree" id="control" subtoc="' + subToc + '">' + collapsed + '</SPAN>' + '<SPAN id="text"' + tocStyleString + '>' + getTextFromFirst(thisItem, "name") + '</SPAN></NOBR>' + childHTML + "</div>";
	}		    
	else
	{
	    htmlString = htmlString + '<NOBR><SPAN class="navtree" id="control" subtoc="' + subToc + '">' + expanded + '</SPAN>' + '<SPAN id="text"' + tocStyleString + '>' + getTextFromFirst(thisItem, "name") + '</SPAN></NOBR>' + childHTML + "</div>";
	}
    }
    return htmlString;
}

function DoOver() {
    if (ver >= 4)
    {
        var thisElement = window.event.srcElement;
        var targetDiv;
        var targetSpan1;
		var targetSpan2;

        if (thisElement.tagName == "SPAN")
        {
            targetDiv = thisElement.parentElement.parentElement;
        }
        else
        {
            window.event.cancelBubble = true;
            return;
        }
        var controlElement = targetDiv.children.item(0).children.item("control");
		targetSpan1 = targetDiv.children.item(0).children.item(0);
		targetSpan2 = targetDiv.children.item(0).children.item(1);
        if (targetDiv.getAttribute("link") == null)
            if (targetDiv.getAttribute("deferlink") == null)
                if (targetDiv.getAttribute("href") == null)
                {
                    window.event.cancelBubble = true;
                    return;
                }
                if (targetSpan2.className!="navselected")
		     {
			if (controlElement == thisElement)
			{
				targetSpan1.className = "navtreehover";
			}
			else
			{
				targetSpan2.className = "hover";
			}
		    }
        window.event.cancelBubble = true;
    }
}

function DoOut() {
    if (ver >= 4)
    {
        var thisElement = window.event.srcElement;
        var targetDiv;
        var targetSpan1;
		var targetSpan2;

        if (thisElement.tagName == "SPAN")
        {
            targetDiv = thisElement.parentElement.parentElement;
        }
        else
        {
            window.event.cancelBubble = true;
            return;
        }

		targetSpan1 = targetDiv.children.item(0).children.item(0);
		targetSpan2 = targetDiv.children.item(0).children.item(1);
        	targetSpan1.className = "navtree";
           if (targetSpan2.className!="navselected")
	     	{
			if (targetSpan2.getAttribute("defaultClass") != null)
				targetSpan2.className = targetSpan2.getAttribute("defaultClass");
			else
				targetSpan2.className = "";
		}
        window.event.cancelBubble = true;
    }
}


function DoIndexOver() {
    if (ver >= 4)
    {
        var thisElement = window.event.srcElement;
        var targetDiv;
        var targetSpan;

        if (thisElement.tagName == "NOBR")
        {
            targetDiv = thisElement.parentElement;
			targetSpan = thisElement;
        }
        else
        {
            window.event.cancelBubble = true;
            return;
        }
        if (targetDiv.getAttribute("link") == null)
            if (targetDiv.getAttribute("deferlink") == null)
                if (targetDiv.getAttribute("href") == null)
                {
                    window.event.cancelBubble = true;
                    return;
                }
		targetSpan.setAttribute("oldClass", targetSpan.className);
		targetSpan.className = "hover";
        window.event.cancelBubble = true;
    }
}

function DoIndexOut() {
    if (ver >= 4)
    {
        var thisElement = window.event.srcElement;
        var targetDiv;
        var targetSpan;

        if (thisElement.tagName == "NOBR")
        {
            targetDiv = thisElement.parentElement;
			targetSpan = thisElement;
        }
        else
        {
            window.event.cancelBubble = true;
            return;
        }

		if (targetSpan.getAttribute("oldClass") != null)
			targetSpan.className = targetSpan.getAttribute("oldClass");
		else
			targetSpan.classname = "";
        window.event.cancelBubble = true;
    }
}

function simpleExpandCollapse(nodeIndex)
{
	window.parent.tocExpandCollapse(nodeIndex);
	window.parent.doInit(self.document);
}

function ExpandCollapse()
{

    if (ver < 4) return;

    var controlSpan = false;
    var controlElement;
    var parentDiv = window.event.srcElement;
    if (parentDiv.tagName == "IMG")
	parentDiv = parentDiv.parentElement;
    
    if (parentDiv.tagName == "SPAN")
    {
	if (parentDiv.id == "control")
	{
	    controlSpan = true;
	    controlElement = parentDiv;
	}
        parentDiv = parentDiv.parentElement.parentElement;
    }
    else
    {
	window.event.cancelBubble = true;
	return;
    }

    if (window.event.altKey && controlSpan) //Control key means do all toc entries below this point
    {
	if (parentDiv.className == "cnode")
	{
	    controlElement.innerHTML = expanded;
	    parentDiv.className = "xnode";
			alert ('element :' + parentDiv.parentElement.innerHTML);
	    ExpandCollapseDownwards(parentDiv, true);
	}
	else if (parentDiv.className == "xnode")
	{
	    controlElement.innerHTML = collapsed;
	    parentDiv.className = "cnode";
	    ExpandCollapseDownwards(parentDiv, false);
	}
	window.event.cancelBubble = true;
	return;
    }
    
    if (!controlSpan)
    {
	if (parentDiv.getAttribute("href") != null)
	{
	    if (window.parent.frames("TEXT") != null)
		window.parent.frames("TEXT").document.location = parentDiv.getAttribute("href");
	}
	window.event.cancelBubble = true;
	return;
    }
    if (controlSpan)
    {
	if (parentDiv.className == "cnode")
	{
	    var subToc = controlElement.getAttribute("subtoc");
	    if (subToc != null)
	    {
		if (subToc != currentToc)
		{
		    newToc = subToc;
		    initialMode = "toc";  //make sure mode is set to toc
		    doInit();
		    window.event.cancelBubble = true;
		    return;
		}
	    }
	    controlElement.innerHTML = expanded;
	    parentDiv.className = "xnode";
	}
	else if (parentDiv.className == "xnode")
	{
	    controlElement.innerHTML = collapsed;
	    parentDiv.className = "cnode";
	}
    }

    window.event.cancelBubble = true;
}

function ExpandCollapseDownwards(currentNode, Expand)
{
	var parentDiv;
	var controlElement;
	
    for (var i = 0; i < currentNode.children.length; i++)
	{
		parentDiv = currentNode.children.item(i);
		if (parentDiv.tagName == "DIV")
		{
		    controlElement = parentDiv.children.item("control");
			if (Expand && (parentDiv.className == "xnode" || parentDiv.className == "cnode"))
			{
				controlElement.innerHTML = expanded;
				parentDiv.className = "xnode";
				ExpandCollapseDownwards(parentDiv, true);
			}
			else if (!Expand && (parentDiv.className == "xnode" || parentDiv.className == "cnode"))
			{
				controlElement.innerHTML = collapsed;
				parentDiv.className = "cnode";
				ExpandCollapseDownwards(parentDiv, false);
			}
		}
	}
}

function doAllEffectivity()
{
    choose.style.cursor = "wait";
    doTocEffectivity();
    DoEffectivity()
    choose.style.cursor = "auto";
}

function DoEffectivity()
{
    if (ver < 4) return;
    if (effectLength < 1) return;

    var effectElements = window.parent.frames("TEXT").document.all("effectivity");
    if (effectElements == null)
    {
        return;
    }

    var lenElements = effectElements.length;
      if (lenElements > 0)
      {
          for (i=0; i < lenElements; i++)
          {
              doTocEffectItem( effectElements(i), effectElements(i) );
          }
      }
      else
      {
          doTocEffectItem( effectElements, effectElements);
      }
}

function getEffectItem( targetItem )
{

    var hideElement = false;

    for (var i = 0; i < effectLength && hideElement == false; i++)
    {
        var targetChoose = effectArray[i].name;
        var currentValues = targetItem.getAttribute(targetChoose);
        if (currentValues == null)
            continue;
        hideElement = true;
        chooseOptions = effectArray[i].options;
        for (var j = 0; j < chooseOptions.length && hideElement == true; j++)
        {
            if (!chooseOptions(j).selected)
                continue;
            if (currentValues.indexOf(chooseOptions(j).value) > -1)
            {
                hideElement = false;
                continue;
            }
        }
    }
    if (hideElement)
        return false;
    else
        return true;
}

function doTocEffectivity()
{
   for (var i = 0; i < tocLength; i++)
   {
       doTocEffectItem( tocArray[i], toc.all.item(i*tocIndexMultiplier) );
   }
}

function doTocEffectItem( targetNode, targetItem )
{

    var hideElement = false;


    for (var i = 0; i < effectLength && hideElement == false; i++)
    {
        var targetChoose = effectArray[i].name;
        var currentValues = targetNode.getAttribute(targetChoose);
        if (currentValues == null)
            continue;
        hideElement = true;
        chooseOptions = effectArray[i].options;
        for (var j = 0; j < chooseOptions.length && hideElement == true; j++)
        {
            if (!chooseOptions(j).selected)
                continue;
            if (currentValues.indexOf(chooseOptions(j).value) > -1)
            {
                hideElement = false;
                continue;
            }
        }
    }        
    if (hideElement)
        hideItem(targetItem);
    else
        revealItem(targetItem);
}

function KeywordClicked()
{
    if (ver < 4) return;
    var parentDiv = window.event.srcElement;

    if (parentDiv.tagName != "DIV")
    {
	parentDiv = parentDiv.parentElement;
    }
    if (parentDiv.tagName != "DIV")
    {
        window.event.cancelBubble = true;
        return;
    }
    
    var kIdx = parentDiv.getAttribute("link");
    if (kIdx == null)
    {
        BucketClicked(parentDiv);
        return;
    }
    var kPointer = TreeWalk(indexXML, kIdx);

    var kCount = 0;
    var returnHref = null;
    var gotoHref = null;

    var kArray = keywordEffectivity(kPointer);
    kCount = kArray.length;
    if (kCount < 1)
    {
        alert(parent.messages.keywordNotAvailable);
        return;
    }
    if (kCount == 1)
    {
        gotoHref = kArray[0].getAttribute("href");
        if (gotoHref != null)
            if (window.parent.frames("TEXT") != null)
                window.parent.frames("TEXT").document.location = gotoHref;
        return;
    }
    else
        returnHref = window.showModalDialog("select.htm", kArray);   

    if (returnHref != null)
        window.parent.frames("TEXT").document.location = returnHref;
}

function keywordEffectivity(kPointer)
{
	var kChildren;
	var kChild;
	var kLength;
	var kArray = new Array();
	var kIndex = 0;
	var ignoreEntry = true;

	if (ver == 4)
	{
		kChildren = kPointer.children;
		kLength = kChildren.length;
		for (var i=0; i<kLength; i++)
		{
			kChild = kChildren.item(i);
			if (kChild.type != 0)
			{
				continue;
			}

			if (getEffectItem(kChild))
			{
				kArray[kIndex++] = kChild;
			}
		}
	}
	else
	{
		kChildren = kPointer.childNodes;
		kLength = kChildren.length;
		for (var i=0; i<kLength; i++)
		{
			kChild = kChildren.item(i);
			if (kChild.nodeType != 1)
				continue;
			if (getEffectItem(kChild) == true)
			{
				kArray[kIndex++] = kChild;
			}
		}
	}
	return kArray;
}


function BucketClicked(parentDiv)
{
    var i = parentDiv.getAttribute("deferlink");
    if (i == null)
        return;
    i--;
    
    // Check if this bucket uses a subindex

    if(ver==4)
      var subIndex = indexXML.children.item(i).getAttribute("subindex");
    else
      var subIndex = indexXML.childNodes.item(i).getAttribute("subindex");
    if (subIndex != null && subIndex != "expanded")
    {
        // Ok, let's see if we are pointing at the right subindex
        if (subIndex != currentKindex)
        {
            // Ok, let's load the right subindex
            initialMode = "kindex";
            newKindex = subIndex;
            doInit();
	     return;
        }
    } 
    var expanded = parentDiv.getAttribute("expanded");
    if (expanded == "yes")
    {
        parentDiv.setAttribute("expanded","no");
        parentDiv.className = "cnavbucket";
        return;
    }
    if (expanded == "no")
    {
        parentDiv.setAttribute("expanded","yes");
        parentDiv.className = "navbucket";
        return;
    }
    parentDiv.setAttribute("expanded","yes");
    parentDiv.className = "navbucket";
    var j;
    var k;
    var innerLoopLen;
    var in2LoopLen;
    var workItem;
    var innerWorkItem;
    var in2WorkItem;

    
    
    newHTML = "";
    if (ver == 4)
    {
        workItem = indexXML.children.item(i);
        innerLoopLen = workItem.children.length;
        for (j = 0; j < innerLoopLen; j++)
        {
            innerWorkItem = workItem.children.item(j);
            if (innerWorkItem.type != 0)
                continue;
            in2LoopLen = innerWorkItem.children.length;
            for (k = 0; k < in2LoopLen; k++)
            {
                in2WorkItem = innerWorkItem.children.item(k);
                if (in2WorkItem.type != 0)
                    continue;
                if (in2WorkItem.children.length > 1)
                    newHTML = newHTML + '<div class="'
                            + in2WorkItem.getAttribute("class")
                            + '" link="' + (i+1) + "." + (j+1) + "." + (k+1) + "." + '">'
                            + '<nobr>'
                            + in2WorkItem.children.item(0).text
                            + '</nobr>'
                            + '</div>';
                else
                    newHTML = newHTML + '<div class="'
                            + in2WorkItem.getAttribute("class") + '">'
                            + '<nobr>'
                            + in2WorkItem.children.item(0).text
                            + '</nobr>'
                            + '</div>';
            }
        }
    }
    else
    {
        workItem = indexXML.childNodes.item(i);
        innerLoopLen = workItem.childNodes.length;
        for (j = 0; j < innerLoopLen; j++)
        {
            innerWorkItem = workItem.childNodes.item(j);
            if (innerWorkItem.nodeType != 1)
                continue;
            in2LoopLen = innerWorkItem.childNodes.length;
            for (k = 0; k < in2LoopLen; k++)
            {
                in2WorkItem = innerWorkItem.childNodes.item(k);
                if (in2WorkItem.nodeType != 1)
                    continue;
                if (in2WorkItem.childNodes.length > 1)
                    newHTML = newHTML + '<div class="'
                            + in2WorkItem.getAttribute("class")
                            + '" link="' + (i+1) + "." + (j+1) + "." + (k+1) + "." + '">'
                            + '<nobr>'
                            + in2WorkItem.childNodes.item(0).nodeValue
                            + '</nobr>'
                            + '</div>';
                else
                    newHTML = newHTML + '<div class="'
                            + in2WorkItem.getAttribute("class") + '">'
                            + '<nobr>'
                            + in2WorkItem.childNodes.item(0).nodeValue
                            + '</nobr>'
                            + '</div>';
            }
        }
    }
    parentDiv.insertAdjacentHTML("beforeEnd", newHTML);
}
function TreeWalk(startPoint, path)
{
    if (path == null)
        return startPoint;
    if (path == "")
        return startPoint;

    var dotPointer = 0;
    var startPointer = 0;
    var pathIdx;

    while ((dotPointer = path.indexOf(".", startPointer)) > 0)
    {
        pathIdx = path.substring(startPointer,dotPointer);
        pathIdx--;
        startPointer = dotPointer + 1;
        if (ver == 4)
            startPoint = startPoint.children.item(pathIdx);
        else
            startPoint = startPoint.childNodes.item(pathIdx);
    }
    return startPoint;
}

function openFeedbackWindow() {

	// default values
	var height = 410;
	var width = 500;
	
    if ( ver >= 4 ) {

		var availHeight = screen.availHeight;
		var availWidth = screen.availWidth;
	
		if (availHeight >= 700) {
			height = 600;
		} else if (availHeight >= 600) {
			height = 550;
		} else if (availHeight >= 500) {
			height = 450;
		} else if (availHeight >= 400) {
			height = 350;
		}

		if (availWidth >= 600) {
			width = 500;
		}
	}

	windowFeedback = window.open("enter.htm", "feedback", "resizable,scrollbars,width=" + width + ",height=" + height);
	feedbackWindowOpen = true;
}

function textSelection(textElement)
{
	textSelectArea = textElement;
	if (windowFeedback == null || windowFeedback.closed == true || feedbackWindowOpen == false)
		openFeedbackWindow()

	if (windowFeedback != null)
	{
		if (windowFeedback.opener == null)
			windowFeedback.opener = self;
		windowFeedback.focus();
	}
}

function provideFeedback()
{
	if (textSelectArea == null)
	{
		var textWindow = window.parent.frames("TEXT");
		if (textWindow == null)
		{
			alert(parent.messages.feedbackNotAvailable);
			return;
		}
		textSelectArea = textWindow.document.body.children(0);
		if (textSelectArea == null)
		{
			alert(parent.messages.feedbackNotAvailable);
			return;
		}
	}
	if (windowFeedback == null || windowFeedback.closed == true || feedbackWindowOpen == false)
		openFeedbackWindow()

	if (windowFeedback != null)
	{
		if (windowFeedback.opener == null)
			windowFeedback.opener = self;
		windowFeedback.focus();
	}
}

function getTextTreeLoc()
{
	return textSelectArea;
}

function getTextFromFirst(thisElement, thisTarget)
{
	var searchList = thisElement.childNodes;
	var searchLength = searchList.length;
	var foundString = "";

	for (var i = 0; i < searchLength && foundString == "" ; i++)
	{
		var candidateNode = searchList.item(i);
		if (candidateNode.nodeType != 1)
			continue;
		if (candidateNode.nodeName != thisTarget)
			continue;
		for (var j = 0; j < candidateNode.childNodes.length && foundString == ""; j++)
		{
			if (candidateNode.childNodes.item(j).nodeType == 3) // Found Text
			{
				foundString = candidateNode.childNodes.item(j).nodeValue;
				continue;
			}
		}
	}

	return foundString;
}

function insertTocTextSearch()
{
	if (ttsFoundTarget != null)
		ttsFoundTarget.style.textDecorationUnderline = ttsOldDecoration;
	tts.children("ttsinput").className = "navTTS";
	ttsfind.className = "navTTSenabled";
	ttsfind.innerHTML = findButton;
	tts.children("ttsinput").value = "";
}

function changeTocTextSearch()
{
	if (ttsMode != "new")
	{
		ttsMode = "new";
		ttsfind.className = "navTTSenabled";
		ttsfind.innerHTML = findButton;
	}
}

function findTocTextSearch()
{
	if (ttsFoundTarget != null)
		ttsFoundTarget.style.textDecorationUnderline = ttsOldDecoration;
	if (ttsMode == "disabled")
		return;
	ttsString = tts.children("ttsinput").value.toUpperCase();
	if (ttsMode == "new")
	{
		ttsIndex = -1;
		ttsMode = "old";
	}
	for (var i = ttsIndex + 1; i < tocLength; i++)
	{
		if (checkTocMatch(i))
		{
			if (expandItem(i))
			{
				ttsIndex = i;
				ttsfind.className = "navTTSenabled";
				ttsfind.innerHTML = nextButton;
				return;
			}
		}
	}
	alert(parent.messages.stringNotFound);
}

function checkTocMatch(tocIndex)
{
	var targetString;

	if (ver == 4)
	{
		targetString = tocArray[tocIndex].children.item(0).children.item(0).text;
		targetString = targetString.toUpperCase();
	}
	else
	{
		targetString = tocArray[tocIndex].childNodes.item(0).childNodes.item(0).nodeValue;
		targetString = targetString.toUpperCase();
	}
	if (targetString.indexOf(ttsString) == -1)
		return false;
	else
		return true;
}

function expandItem(tocIndex)
{
	var thisXMLItem = tocArray[tocIndex];
	var thisHTMLItem = toc.all.item(tocIndex*tocIndexMultiplier);
	// Check if we are hidden
	var hiddenFlag = false;
	var loopFlag = true;
	for (var x = thisHTMLItem; (x != toc) && (x != null); x = x.parentElement)
	{
		if (x.className == "hidden")
		{
			return false;
		}
	}
	// Let's expand the parents
	for (var x = thisHTMLItem.parentElement; (x != toc) && (x != null); x = x.parentElement)
	{
		if (x.className == "cnode")
			x.className = "xnode";
	}
	ttsFoundTarget = thisHTMLItem.children.item(0).children("text");
	ttsFoundTarget.parentElement.scrollIntoView();
	ttsOldDecoration = ttsFoundTarget.style.textDecorationUnderline;
	ttsFoundTarget.style.textDecorationUnderline = !ttsOldDecoration;

	return true;
}

function cancelFeedback()
{
		if (windowFeedback == null || windowFeedback.closed == true)
			return;
		windowFeedback.close();
}


function focusThisLink(navFrame,focusLink){
	str="Focus:"+focusLink;
	if (prevSelection !=null){
		prevSelection.className=prevSelection.getAttribute("defaultClass");
	}
	var curObj=navFrame.document.body.all["toc"].all[0];
	var targetLink = findTarget(curObj,focusLink);
	//alert(targetLink.className+"\n"+targetLink.outerHTML);
	var span=targetLink.all[3];
	span.className="navselected";
	prevSelection=span;
	targetLink.all[2].scrollIntoView(false);
}


function findTarget(curObj,focusLink)
{
	var allThings=curObj.all;
	for (var i = 0; i < allThings.length; i++)
	{
		var thing = allThings[i];
		if (thing.outerHTML.indexOf(focusLink) >= 0){
			str = str+"\n"+i+":"+ thing.id+":"+thing.classname+":"+thing.outerHTML;
			var span=thing.all[3];
			str = str+"\n"+i+":"+ span.id+":"+span.classname+":"+span.outerHTML;
			//alert(str);
			if (curObj.className=="cnode"){
				var img=curObj.all[2];
				img.src="images/expanded.gif";
				curObj.className="xnode";
			}
			return findTarget(thing,focusLink);
		}
	}
	return curObj;
}

function doMenu(levelValue) 
{
  var docroot;
	//alert('currentToc: ' + currentToc + " " + newToc);
	if (currentToc == newToc)
  {
	    docroot = xmlToc.documentElement;
	    // Check if the user is specifying the number of levels to expand
	    if (docroot.getAttribute("expandtoclevels") != null)
	    {
			 //Dermot 28-04-2009
			 //defaultLevel = docroot.getAttribute("expandtoclevels");
			 defaultLevel = levelValue;
			 //alert('docroot defaultLevel + docroot :' + defaultLevel + docroot.innerHTML);
	    }
	    // Check if the user is disabling feedback
	   	if (docroot.getAttribute("feedback") != "1")
	    {
			 if (window.parent.frames("LOCAL").document.readyState == "complete")
			 {
		   //  window.parent.frames("LOCAL").displayFeedback(false);
			 }
			 window.parent.useFeedback = false;
	    }
	    else
	    {
			 if (window.parent.frames("LOCAL").document.readyState == "complete")
			 {
		 	 //   window.parent.frames("LOCAL").displayFeedback(true);
			 }
			 window.parent.useFeedback = true;
	    }
	    for (i = 0; i <docroot.childNodes.length; i++)
	    {
			 var workItem = docroot.childNodes.item(i);
			 if (workItem.nodeName == "toc")
			 {
		    insertTocTextSearch(toc);
				toc.innerHTML = "";
				//location.reload(true);
				//alert('tabCount:' + toc.innerHTML);
		    tabHTML[tabCount] = "<div class=\"navtoc\">" + contentsOn + "</img>" + indexOff + "</img></div>";
		    tabCount++;
		    for (var j = 0; j < workItem.childNodes.length; j++)
		    {
				 	if (workItem.childNodes.item(j).nodeName != "item")
			    continue;						
					toc.insertAdjacentHTML("beforeEnd", outputItem(workItem.childNodes.item(j), 0));
		    }
			 }
			}
	}
}

function doUnitMenu() 
{
		defaultLevel = 1;
		doMenu(defaultLevel);
}

function doLessonMenu() 
{
		defaultLevel = 2;
		doMenu(defaultLevel);
}

function doAllMenu() 
{
		defaultLevel = 3;
		doMenu(defaultLevel);
}