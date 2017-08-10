package unitter.domain.resource;

import java.io.Serializable;

public class SearchResource implements Serializable {
	private static final long serialVersionUID = 1L;

	private String userName;
	private String tweet;


	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getTweet() {
		return tweet;
	}
	public void setTweet(String tweet) {
		this.tweet = tweet;
	}



}
