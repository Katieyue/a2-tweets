class Tweet {
  private text: string;
  time: Date;

  constructor(tweet_text: string, tweet_time: string) {
    this.text = tweet_text;
    this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
  }

  //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
  get source(): string {
    //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
    var text_lower = this.text.toLowerCase();
    if (
      text_lower.includes("completed") ||
      text_lower.includes("posted") //  && (text_lower.includes("mi") || text_lower.includes("km")))
    )
      return "completed_event";
    else if (text_lower.includes("achieved")) return "achievement";
    else if (text_lower.includes("right now")) return "live_event";
    else return "miscellaneous";
  }

  //returns a boolean, whether the text includes any content written by the person tweeting.
  get written(): boolean {
    //TODO: identify whether the tweet is written
    var stripped = this.text.split(" ");
    if (stripped.includes("-")) return true;
    return false;
  }

  get writtenText(): string {
    if (!this.written) {
      return "";
    }
    //TODO: parse the written text from the tweet
    var text_arr = this.text.split(" ");
    for (var i = 0; i < text_arr.length; i++) {
      if (text_arr[i].includes("Runkeeper") || text_arr[i].includes("https"))
        text_arr[i] = "";
    }
    var stripped = text_arr.join(" ");
    return stripped.slice(this.text.indexOf(" - ") + 2);
  }

  get activityType(): string {
    if (this.source != "completed_event") {
      return "unknown";
    }
    //TODO: parse the activity type from the text of the tweet
    var stripped = this.text.split(" ");
    if (stripped.includes("mi")) return stripped[stripped.indexOf("mi") + 1];
    else if (stripped.includes("km"))
      return stripped[stripped.indexOf("km") + 1];
    else if (stripped.includes("posted"))
      return stripped[stripped.indexOf("posted") + 2];
    return "";
  }

  get distance(): number {
    if (this.source != "completed_event") {
      return 0;
    }
    //TODO: parse the distance from the text of the tweet
    var stripped = this.text.split(" ");
    if (stripped.includes("mi")) return +stripped[stripped.indexOf("mi") - 1];
    else if (stripped.includes("km"))
      return +stripped[stripped.indexOf("km") - 1] / 1.609;
    return 0;
  }

  getHTMLTableRow(rowNumber: number): string {
    //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
    var stripped = this.text.split(/\s/);

    // replace all link text with link tag
    for (var i = 0; i < stripped.length; i++) {
      if (stripped[i].startsWith("http")) {
        stripped[i] =
          `<a href="${stripped[i]}" target="_blank">${stripped[i]}</a>`;
      }
    }
    return `<td>${rowNumber}</td><td>${this.activityType}</td> <td>${stripped.join(" ")}</td>`;
  }
}
