var written_tweets = [];

function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  //TODO: Filter to just the written tweets
  written_tweets = tweet_array.filter((tweet) => tweet.written);
}

function addEventHandlerForSearch() {
  //TODO: Search the written tweets as text is entered into the search box, and add them to the table
  var search_bar = document.getElementById("textFilter");
  var matching_tweets = [];
  const table_body = document.getElementById("tweetTable");

  document.getElementById("searchCount").innerText = 0;
  document.getElementById("searchText").innerText = "";

  search_bar.addEventListener("input", function () {
    // clear the rows on each changed input, exit function if input is empty
    table_body.replaceChildren();
    document.getElementById("searchCount").innerText = 0;
    document.getElementById("searchText").innerText = "";
    if (search_bar.value === "") return;

    // filter by inputted text
    matching_tweets = written_tweets.filter((tweet) =>
      tweet.writtenText.includes(search_bar.value),
    );

    document.getElementById("searchCount").innerText = matching_tweets.length;
    document.getElementById("searchText").innerText = search_bar.value;

    // extract formatted html row per tweet, append to table body
    for (var i = 0; i < matching_tweets.length; i++) {
      const newRow = document.createElement("tr");
      newRow.innerHTML = matching_tweets[i].getHTMLTableRow(i + 1);
      table_body.appendChild(newRow);
    }
  });
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  addEventHandlerForSearch();
  loadSavedRunkeeperTweets().then(parseTweets);
});
