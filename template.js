var Node;

function kindexHref(nodeIndex)
{
	if (window.parent.kindexHref != null)
		window.parent.kindexHref(nodeIndex);
}

function simpleExpandCollapse(nodeIndex)
{
	Node.xref[nodeIndex].expandCollapse();
	document.location.replace("navjs.htm");
}

function doMainNav()
{
	var loadFirstPage = false;
	if (window.parent.getNode == null)
		return;
	Node = window.parent.getNode();
	if (!Node.navLoaded)
	{
		loadNav(Node);
		Node.navLoaded = true;
		loadFirstPage = true;
	}

	// if there is both a Toc and a Keyword Index, display
	// controls to let the user change which one is seen.
	if (Node.tocKindexMode == "toc")
	{
		if (Node.rootKindexArrayLength > 0)
			document.writeln("<div class=\"navtab\"><img src=\"images/contentson.gif\"></img><a  href=\"javascript:gotoIndex();\"><img src=\"images/indexoff.gif\"></img></a></div>");
	 	document.writeln("<div class=\"navtoc\">");
		for (var i = 0; i < Node.rootTocArrayLength; i++)
			Node.rootTocArray[i].output(document)
		document.writeln("</div>");
	}
	else if (tocKindexMode == "kindex")
	{
		if (Node.rootTocArrayLength > 0)
			document.writeln("<div class=\"navtab\"><a href=\"javascript:gotoToc();\"><img src=\"images/contentsoff.gif\"></img></a><img src=\"images/indexon.gif\"></img></div>");
		document.writeln("<div class=\"navindex\">");
		for (var i = 0; i < Node.rootKindexArrayLength; i++)
			Node.rootKindexArray[i].output(document);
		document.writeln("</div>");
	}
	if (loadFirstPage)
	{
		window.parent.frames["TEXT].document.location.replace = Node.rootTocArray[0].href;
		loadFirstPage = false;
	}
}

function gotoIndex()
{
	Node.tocKindexMode = "index";
}

function gotoToc()
{
	Node.tocKindexMode = "toc";
}

function loadNav(Node)
{
	var tocNodeIndex = 0;
	var currentNode;

	// Load Toc information

<-- Insert HTML -->


}

