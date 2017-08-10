package unitter.domain.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;

@Entity
@Table(name = "usr")
public class User implements Serializable{
	@Id
	@Size(min = 5, max = 15)
	private String userId;
	private String password;

	@Size(max = 255)
	private String mailAddress;

	@Size(max = 30)
	private String nickname;

	@Size(max = 255)
	private String selfIntroduction;
	private String profileImage;
	private String headderImage;
	private LocalDateTime userTimestamp;

	@OneToMany(mappedBy = "user" , cascade = CascadeType.ALL)
	private List<Tweet> tweetList;

	@OneToMany(mappedBy = "followUser" , cascade = CascadeType.ALL)
	private List<Follow> followList;

	@OneToMany(mappedBy = "followerUser" , cascade = CascadeType.ALL)
	private List<Follow> followerList;

	@OneToMany(mappedBy = "user" , cascade = CascadeType.ALL)
	private List<Favorite> favoriteList;

	@OneToMany(mappedBy = "user" , cascade = CascadeType.ALL)
	private List<Retweet> RetweetList;


	@OneToMany(mappedBy = "user" , cascade = CascadeType.ALL)
	private List<Timeline> timelineList;



	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getMailAddress() {
		return mailAddress;
	}
	public void setMailAddress(String mailAddress) {
		this.mailAddress = mailAddress;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public String getSelfIntroduction() {
		return selfIntroduction;
	}
	public void setSelfIntroduction(String selfIntroduction) {
		this.selfIntroduction = selfIntroduction;
	}


	public List<Tweet> getTweetList() {
		if(tweetList == null) {
			tweetList = new ArrayList<>();
		}
		return tweetList;
	}
	public void setTweetList(List<Tweet> tweetList) {
		this.tweetList = tweetList;
	}

	public String getProfileImage() {
		return profileImage;
	}
	public void setProfileImage(String profileImage) {
		this.profileImage = profileImage;
	}
	public String getHeadderImage() {
		return headderImage;
	}
	public void setHeadderImage(String headderImage) {
		this.headderImage = headderImage;
	}
	public List<Follow> getFollowList() {
		if(followList == null) {
			followList = new ArrayList<>();
		}
		return followList;
	}
	public void setFollowList(List<Follow> followList) {
		this.followList = followList;
	}
	public List<Follow> getFollowerList() {
		if(followerList == null) {
			followerList = new ArrayList<>();
		}
		return followerList;
	}
	public void setFollowerList(List<Follow> followerList) {
		this.followerList = followerList;
	}
	public List<Favorite> getFavoriteList() {
		return favoriteList;
	}
	public void setFavoriteList(List<Favorite> favoriteList) {
		this.favoriteList = favoriteList;
	}
	public List<Timeline> getTimelineList() {
		return timelineList;
	}
	public void setTimelineList(List<Timeline> timelineList) {
		this.timelineList = timelineList;
	}
	public List<Retweet> getRetweetList() {
		return RetweetList;
	}
	public void setRetweetList(List<Retweet> retweetList) {
		RetweetList = retweetList;
	}
	public LocalDateTime getUserTimestamp() {
		return userTimestamp;
	}
	public void setUserTimestamp(LocalDateTime userTimestamp) {
		this.userTimestamp = userTimestamp;
	}






}
