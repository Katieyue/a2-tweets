function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  //This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
  //It works correctly, your task is to update the text of the other tags in the HTML file!
  var numTweets = tweet_array.length;
  document.getElementById("numberTweets").innerText = numTweets;

  // Create array of tweets sorted by date
  var tweets_copy = tweet_array.slice(0);
  tweets_copy.sort(function (a, b) {
    return a.time - b.time;
  });

  // Identify earliest/latest date
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  document.getElementById("firstDate").innerText =
    tweets_copy[0].time.toLocaleDateString("en-US", options);
  document.getElementById("lastDate").innerText = tweets_copy[
    numTweets - 1
  ].time.toLocaleDateString("en-US", options);

  // Update categories count
  const category_map = {};
  for (const tweet of tweet_array) {
    category_map[tweet.source] = (category_map[tweet.source] || 0) + 1;
  }
  document.getElementsByClassName("completedEvents").item(0).innerText =
    category_map["completed_event"];
  document.getElementsByClassName("completedEvents").item(1).innerText =
    category_map["completed_event"];

  const rounding_options = { notation: "fixed", precision: 2 };
  document.getElementsByClassName("completedEventsPct").item(0).innerText =
    math.format(
      (category_map["completed_event"] / numTweets) * 100,
      rounding_options,
    ) + "%";

  document.getElementsByClassName("achievements").item(0).innerText =
    category_map["achievement"];
  document.getElementsByClassName("achievementsPct").item(0).innerText =
    math.format(
      (category_map["achievement"] / numTweets) * 100,
      rounding_options,
    ) + "%";

  document.getElementsByClassName("liveEvents").item(0).innerText =
    category_map["live_event"];
  document.getElementsByClassName("liveEventsPct").item(0).innerText =
    math.format(
      (category_map["live_event"] / numTweets) * 100,
      rounding_options,
    ) + "%";

  document.getElementsByClassName("miscellaneous").item(0).innerText =
    category_map["miscellaneous"];
  document.getElementsByClassName("miscellaneousPct").item(0).innerText =
    math.format(
      (category_map["miscellaneous"] / numTweets) * 100,
      rounding_options,
    ) + "%";

  // Update written count
  var num_written = 0;
  for (const tweet of tweet_array) {
    if (tweet.written) num_written++;
  }
  document.getElementsByClassName("written").item(0).innerText = num_written;
  document.getElementsByClassName("writtenPct").item(0).innerText =
    math.format((num_written / numTweets) * 100, rounding_options) + "%";
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
});
