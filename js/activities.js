function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  // create object of counts per category (excluding unknown)
  activities_counts = {};
  for (const tweet of tweet_array) {
    if (tweet.activityType != "unknown") {
      activities_counts[tweet.activityType] =
        (activities_counts[tweet.activityType] || 0) + 1;
    }
  }

  // combine total counts to get total number of tweets with non-unknown categories
  var numCompleted = Object.values(activities_counts).reduce(
    function (total, current) {
      return total + current;
    },
  );

  var activities_sorted = Object.entries(activities_counts).sort(
    (a, b) => b[1] - a[1],
  );

  document.getElementById("numberActivities").innerText = numCompleted;
  document.getElementById("firstMost").innerText = activities_sorted[0][0];
  document.getElementById("secondMost").innerText = activities_sorted[1][0];
  document.getElementById("thirdMost").innerText = activities_sorted[2][0];

  document.getElementById("longestActivityType").innerText = "bike";
  document.getElementById("shortestActivityType").innerText = "walk";
  document.getElementById("weekdayOrWeekendLonger").innerText = "Sunday";

  //TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
  const days_of_week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  var completed_tweets = tweet_array
    .filter((tweet) => tweet.source === "completed_event")
    .map((tweet) => ({
      activityType: tweet.activityType,
      distance: tweet.distance,
      day: days_of_week[tweet.time.getDay()],
    }));

  var top_three = activities_sorted.slice(0, 3).map((pair) => pair[0]); // just get the top 3 activity names
  var top_three_tweets = completed_tweets.filter((info) =>
    top_three.includes(info.activityType),
  );

  // 1) plot of how many of each type of activity exists in the dataset
  activity_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A graph of the number of Tweets containing each type of activity.",
    data: {
      values: completed_tweets,
    },
    mark: "bar",
    encoding: {
      x: {
        field: "activityType",
        type: "nominal",
        title: "Activity Type",
      },
      y: {
        aggregate: "count",
        type: "quantitative",
        title: "Number of Tweets",
      },
    },
  };
  vegaEmbed("#activityVis", activity_vis_spec, { actions: false });

  const mean_button = document.getElementById("aggregate");
  const all_activities = document.getElementById("distanceVis");
  const activity_means = document.getElementById("distanceVisAggregated");

  activity_means.style.display = "none";

  mean_button.addEventListener("click", function () {
    if (mean_button.innerText == "Show means") {
      mean_button.innerText = "Show all activities";
      all_activities.style.display = "none";
      activity_means.style.display = "";
    } else {
      mean_button.innerText = "Show means";
      activity_means.style.display = "none";
      all_activities.style.display = "";
    }
  });

  //TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
  //Use those visualizations to answer the questions about which activities tended to be longest and when.

  // 2) plot of the distances by day of the week for all of the three most tweeted-about activities.
  // Day of the week should be encoded on the x-axis, distance on the y-axis, and activity type by color
  distances_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A graph of the distances by day of the week for the three most tweeted-about activities",
    data: {
      values: top_three_tweets,
    },
    mark: "point",
    encoding: {
      x: {
        field: "day",
        type: "nominal",
        title: "time (day)",
        sort: days_of_week,
      },
      y: {
        field: "distance",
        type: "quantitative",
        title: "distance",
      },
      color: { field: "activityType", type: "nominal" },
    },
  };
  vegaEmbed("#distanceVis", distances_vis_spec, { actions: false });

  // 3) plot of the distances by day of the week for all of the three most
  // tweeted-about activities, aggregating the activities by the mean
  distances_mean_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A graph of the distances by day of the week for the three most tweeted-about activities, aggregating the activities by the mean",
    data: {
      values: top_three_tweets,
    },
    mark: "point",
    encoding: {
      x: {
        field: "day",
        type: "nominal",
        title: "time (day)",
      },
      y: {
        field: "distance",
        aggregate: "mean",
        type: "quantitative",
        title: "Mean of distance",
      },
      color: { field: "activityType", type: "nominal" },
    },
  };
  vegaEmbed("#distanceVisAggregated", distances_mean_vis_spec, {
    actions: false,
  });
}
//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
});
