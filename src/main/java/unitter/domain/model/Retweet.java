package unitter.domain.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Retweet implements Serializable{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer retweetId;


	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne
	@JoinColumn(name = "tweet_id")
	private Tweet tweet;

	private LocalDateTime retweetTimestamp;




	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}

	public Tweet getTweet() {
		return tweet;
	}
	public void setTweet(Tweet tweet) {
		this.tweet = tweet;
	}
	public Integer getRetweetId() {
		return retweetId;
	}
	public void setRetweetId(Integer retweetId) {
		this.retweetId = retweetId;
	}
	public LocalDateTime getRetweetTimestamp() {
		return retweetTimestamp;
	}
	public void setRetweetTimestamp(LocalDateTime retweetTimestamp) {
		this.retweetTimestamp = retweetTimestamp;
	}


}
