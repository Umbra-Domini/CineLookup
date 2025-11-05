let searchHistory = [];

function addToHistory(query) {
  if (!query) return;
  searchHistory.unshift(query);
  if (searchHistory.length > 10) searchHistory.pop();
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "multi-search",
    title: "Search selected text on...",
    contexts: ["selection"]
  });

  const sites = [
    { id: "search-imdb", title: "Search on IMDb" },
    { id: "search-wikipedia", title: "Search on Wikipedia" },
    { id: "search-youtube", title: "Search on YouTube (Trailer)" },
    { id: "search-rottentomatoes", title: "Search on Rotten Tomatoes" },
    { id: "search-tmdb", title: "Search on TMDb" },
    { id: "search-all", title: "Search on All Sites" }
  ];

  sites.forEach(site => {
    chrome.contextMenus.create({
      id: site.id,
      parentId: "multi-search",
      title: site.title,
      contexts: ["selection"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const query = info.selectionText?.trim();
  if (!query) {
    console.warn("No text selected.");
    return;
  }

  addToHistory(query);

const searchBuilders = {
  "search-imdb": q =>
    `https://www.imdb.com/find?q=${encodeURIComponent(q)}`,

  "search-wikipedia": q => {
    const normalized = q.trim().toLowerCase();
    if (["weapons", "drive", "heat"].includes(normalized)) {
      return `https://en.wikipedia.org/wiki/${encodeURIComponent(normalized)}_(disambiguation)`;
    }
    return `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q + " film or TV series")}&fulltext=1`;
  },

  "search-youtube": q =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(q + " Official Trailer")}`,

  "search-rottentomatoes": q =>
    `https://www.rottentomatoes.com/search?search=${encodeURIComponent(q)}`,

  "search-tmdb": q =>
    `https://www.themoviedb.org/search?query=${encodeURIComponent(q)}`
};


  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["copy.js"]
  });

  if (info.menuItemId === "search-all") {
    Object.values(searchBuilders).forEach(fn => {
      chrome.tabs.create({ url: fn(query), active: false });
    });
  } else {
    const buildUrl = searchBuilders[info.menuItemId];
    if (buildUrl) {
      chrome.tabs.create({ url: buildUrl(query), active: false });
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getHistory") {
    sendResponse({ history: searchHistory });
  }
});
