package unitter.domain.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;


@Entity
@Table(name = "tweet")
public class Tweet implements Serializable{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tweet_id")
	private Integer tweetId;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@Size(max=140)
	private String bodySentence;

	private String bodyImage;
	private Integer bodyImageHeight;
	private Integer bodyImageWidth;
	private LocalDateTime tweetTimestamp;

	@OneToMany(mappedBy = "tweet" , cascade = CascadeType.ALL)
	private List<Timeline> timelineList;


	@OneToMany(mappedBy = "tweet" , cascade = CascadeType.ALL)
	private List<Favorite> favoriteList;


	@OneToMany(mappedBy = "tweet" , cascade = CascadeType.ALL)
	private List<Retweet> retweetList;






	public Integer getTweetId() {
		return tweetId;
	}
	public void setTweetId(Integer tweetId) {
		this.tweetId = tweetId;
	}

	public String getBodyImage() {
		return bodyImage;
	}
	public void setBodyImage(String bodyImage) {
		this.bodyImage = bodyImage;
	}

	public String getBodySentence() {
		return bodySentence;
	}
	public void setBodySentence(String bodySentence) {
		this.bodySentence = bodySentence;
	}
	public LocalDateTime getTweetTimestamp() {
		return tweetTimestamp;
	}
	public void setTweetTimestamp(LocalDateTime tweetTimestamp) {
		this.tweetTimestamp = tweetTimestamp;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public List<Timeline> getTimelineList() {
		if(timelineList == null) {
			timelineList = new ArrayList<>();
		}
		return timelineList;
	}
	public void setTimelineList(List<Timeline> timelineList) {
		this.timelineList = timelineList;
	}
	public List<Favorite> getFavoriteList() {
		if(favoriteList == null) {
			favoriteList = new ArrayList<>();
		}
		return favoriteList;
	}
	public void setFavoriteList(List<Favorite> favoriteList) {
		this.favoriteList = favoriteList;
	}
	public List<Retweet> getRetweetList() {
		if(retweetList == null) {
			retweetList = new ArrayList<>();
		}
		return retweetList;
	}
	public void setRetweetList(List<Retweet> retweetList) {
		this.retweetList = retweetList;
	}
	public Integer getBodyImageHeight() {
		return bodyImageHeight;
	}
	public void setBodyImageHeight(Integer bodyImageHeight) {
		this.bodyImageHeight = bodyImageHeight;
	}
	public Integer getBodyImageWidth() {
		return bodyImageWidth;
	}
	public void setBodyImageWidth(Integer bodyImageWidth) {
		this.bodyImageWidth = bodyImageWidth;
	}

}
