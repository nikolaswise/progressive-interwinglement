// Replace plain-text keywords with links to pages.
// Needs access to the Graph, find URLs that have
// associated altLabel, prefLabel, or hiddenLabel.
// Wort doing at a compile time I think, keep the
// graph out of the client, and allow injection rdfa
// since it basically transforms the graph.