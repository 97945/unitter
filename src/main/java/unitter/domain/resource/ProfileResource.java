package unitter.domain.resource;

import java.io.Serializable;
import java.util.List;

public class ProfileResource implements Serializable {
	private static final long serialVersionUID = 1L;

	private String userId;
	private String nickname;
	private List<ProfileResource> follow;
	private List<ProfileResource> follower;
	private String profileImage;
	private String headderImage;
	private String selfIntroduction;
	private boolean isFollowFlg;
	private List<TimelineResource> favorite;
	private List<TimelineResource> tweet;



	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public List<ProfileResource> getFollow() {
		return follow;
	}

	public void setFollow(List<ProfileResource> follow) {
		this.follow = follow;
	}

	public List<ProfileResource> getFollower() {
		return follower;
	}

	public void setFollower(List<ProfileResource> follower) {
		this.follower = follower;
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

	public boolean isFollowFlg() {
		return isFollowFlg;
	}

	public void setFollowFlg(boolean isFollowFlg) {
		this.isFollowFlg = isFollowFlg;
	}

	public List<TimelineResource> getFavorite() {
		return favorite;
	}

	public void setFavorite(List<TimelineResource> favorite) {
		this.favorite = favorite;
	}

	public List<TimelineResource> getTweet() {
		return tweet;
	}

	public void setTweet(List<TimelineResource> tweet) {
		this.tweet = tweet;
	}




}
