// This file contains all of the internationalization code for the default framesets in Epic.
// The only content is a single function used as a prototype and the creation of an object.
// based on the prototype. The resulting object has the localized strings directly accessable
// within it.

function Messages()
{
	// This message is displayed when a user tries to go to the last page and the system
	// cannot find the last page. Should never occur.
	this.noFirstPage = "No First Page";

	// This message is displayed when a user tries to go to the last page and the system
	// cannot find the last page. Should never occur.
	this.noLastPage = "No Last Page";

	// This message is displayed when a user tries to go to the next page and there is
	// no next page in the current document.
	this.noNextPage = "No Next Page";

	// This message is displayed when a user tries to go to the previous page and there
	// is no previous page in the current document.
	this.noPreviousPage = "No Previous Page";

	// This message is displayed when a user selects a keyword in the keyword index
	// and the associated text cannot be displayed because the user has chosen a profile
	// that does not include the associated text. For example, if a user has profiled a
	// document so that only the Unix text is displayed and then clicks on the word
	// Registry in the keyword index, they may get this message.
	this.keywordNotAvailable = "Keyword not available in your current profile";

	// This message is displayed if the system cannot display the feedback window for
	// the user. This should not happen under normal circumstances.
	this.feedbackNotAvailable = "Feedback cannot be recorded at this time";

	// This message is displayed if the user searches the table of contents for a
	// specific word and that word is not found.
	this.stringNotFound = "String not found";

	// This message is displayed if the window for displaying multiple keyword selections
	// is appearing and no selections were passed. This should not happen under normal
	// circumstances.
	this.noSelectionsPassed = "No selections passed";
}

messages = new Messages();
