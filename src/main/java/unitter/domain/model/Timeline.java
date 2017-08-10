package unitter.domain.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name = "timeline")
public class Timeline implements Serializable{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer timelineId;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne
	@JoinColumn(name = "tweet_id")
	private Tweet tweet;

	private LocalDateTime timelineTimestamp;




	public Integer getTimelineId() {
		return timelineId;
	}
	public void setTimelineId(Integer timelineId) {
		this.timelineId = timelineId;
	}


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
	public LocalDateTime getTimelineTimestamp() {
		return timelineTimestamp;
	}
	public void setTimelineTimestamp(LocalDateTime timelineTimestamp) {
		this.timelineTimestamp = timelineTimestamp;
	}




}
