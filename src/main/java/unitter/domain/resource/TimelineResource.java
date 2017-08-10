package unitter.domain.resource;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

public class TimelineResource implements Serializable {
	private static final long serialVersionUID = 1L;
	private String otherId;
	private String otherNickname;
	private String tweet;
	private String tweetImage;
	private Integer tweetImageHeight;
	private Integer tweetImageWidth;
	private String userId;
	private String userNickname;
	private String profileImage;
	private String headderImage;
	private String selfIntroduction;
	private int tweetId;
	private ProfileResource profile;
	private List<ProfileResource> favorite;
	private List<ProfileResource> retweet;
	private boolean isFavoriteFlg;
	private boolean isRetweetFlg;
	private String retweetMessage;


	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
	private LocalDateTime tweetTimestamp;




	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getOtherId() {
		return otherId;
	}
	public void setOtherId(String otherId) {
		this.otherId = otherId;
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
	public String getOtherNickname() {
		return otherNickname;
	}
	public void setOtherNickname(String otherNickName) {
		this.otherNickname = otherNickName;
	}
	public String getTweetImage() {
		return tweetImage;
	}
	public void setTweetImage(String tweetImage) {
		this.tweetImage = tweetImage;
	}
	public LocalDateTime getTweetTimestamp() {
		return tweetTimestamp;
	}
	public void setTweetTimestamp(LocalDateTime tweetTimestamp) {
		this.tweetTimestamp = tweetTimestamp;
	}
	public ProfileResource getProfile() {
		if(profile == null) {
			profile = new ProfileResource();
		}
		return profile;
	}
	public void setProfile(ProfileResource profile) {
		this.profile = profile;
	}
	public String getUserNickname() {
		return userNickname;
	}
	public void setUserNickname(String userNickname) {
		this.userNickname = userNickname;
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
	public String getSelfIntroduction() {
		return selfIntroduction;
	}
	public void setSelfIntroduction(String selfIntroduction) {
		this.selfIntroduction = selfIntroduction;

	}
	public List<ProfileResource> getFavorite() {
		return favorite;
	}
	public void setFavorite(List<ProfileResource> favorite) {
		this.favorite = favorite;
	}
	public List<ProfileResource> getRetweet() {
		return retweet;
	}
	public void setRetweet(List<ProfileResource> retweet) {
		this.retweet = retweet;
	}
	public boolean isFavoriteFlg() {
		return isFavoriteFlg;
	}
	public void setFavoriteFlg(boolean isFavoriteFlg) {
		this.isFavoriteFlg = isFavoriteFlg;
	}
	public boolean isRetweetFlg() {
		return isRetweetFlg;
	}
	public void setRetweetFlg(boolean isRetweetFlg) {
		this.isRetweetFlg = isRetweetFlg;
	}
	public String getRetweetMessage() {
		return retweetMessage;
	}
	public void setRetweetMessage(String retweetMessage) {
		this.retweetMessage = retweetMessage;
	}
	public Integer getTweetImageHeight() {
		return tweetImageHeight;
	}
	public void setTweetImageHeight(Integer tweetImageHeight) {
		this.tweetImageHeight = tweetImageHeight;
	}
	public Integer getTweetImageWidth() {
		return tweetImageWidth;
	}
	public void setTweetImageWidth(Integer tweetImageWidth) {
		this.tweetImageWidth = tweetImageWidth;
	}



}
