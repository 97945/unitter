package unitter.domain.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Follow implements Serializable{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer followId;


	@ManyToOne
	private User followUser;


	@ManyToOne
	private User followerUser;

	private LocalDateTime followTimestamp;


	public Integer getFollowId() {
		return followId;
	}
	public void setFollowId(Integer followId) {
		this.followId = followId;
	}
	public User getFollowUser() {
		return followUser;
	}
	public void setFollowUser(User followUser) {
		this.followUser = followUser;
	}
	public User getFollowerUser() {
		return followerUser;
	}
	public void setFollowerUser(User followerUser) {
		this.followerUser = followerUser;
	}
	public LocalDateTime getFollowTimestamp() {
		return followTimestamp;
	}
	public void setFollowTimestamp(LocalDateTime followTimestamp) {
		this.followTimestamp = followTimestamp;
	}



}
