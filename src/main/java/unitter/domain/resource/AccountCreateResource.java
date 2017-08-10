package unitter.domain.resource;

import java.io.Serializable;

import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

public class AccountCreateResource implements Serializable {
	private static final long serialVersionUID = 1L;

	@Size(min = 5, max = 15, message = "5文字以上15文字以下の入力をしてください")
	private String userId;

	@NotEmpty(message = "ニックネームを入力してください")
	@Size(max = 30, message = "30文字以下の入力をしてください")
	private String nickname;

	@NotEmpty(message = "メールアドレスを入力してください")
	@Size(max = 255, message = "255文字以下の入力をしてください")
	private String mailAddress;

	@Size(min = 8, message = "8文字以上の入力をしてください")
	private String password;

	@Size(max = 255, message = "255文字以下の入力をしてください")
	private String selfIntroduction;
	private String profileImage;
	private String headderImage;



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
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public String getMailAddress() {
		return mailAddress;
	}
	public void setMailAddress(String mailAddress) {
		this.mailAddress = mailAddress;
	}
	public String getSelfIntroduction() {
		return selfIntroduction;
	}
	public void setSelfIntroduction(String selfIntroduction) {
		this.selfIntroduction = selfIntroduction;
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
}
