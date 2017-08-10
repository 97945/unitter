package unitter.domain.resource;

import java.io.Serializable;

import javax.validation.constraints.Size;

public class TweetResource implements Serializable {
	private String userId;

	@Size(max=140, message = "文字数が140文字以上です")
	private String tweet;

	private int tweetId;

	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getTweet() {
		return tweet;
	}
	public void setTweet(String tweet) {
		this.tweet = tweet;
	}
	public int getTweetId() {
		return tweetId;
	}
	public void setTweetId(int tweetId) {
		this.tweetId = tweetId;
	}
}
