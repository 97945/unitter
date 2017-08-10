package unitter.domain.resource;

import java.io.Serializable;

import javax.validation.constraints.Size;

public class ChangePasswordResource implements Serializable {
	private static final long serialVersionUID = 1L;

	private String userId;
	private String password;

	@Size(min = 8, message = "8文字以上の入力をしてください")
	private String changePassword;

	private String againPassword;


	public String getChangePassword() {
		return changePassword;
	}


	public void setChangePassword(String changePassword) {
		this.changePassword = changePassword;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public String getUserId() {
		return userId;
	}


	public void setUserId(String userId) {
		this.userId = userId;
	}


	public String getAgainPassword() {
		return againPassword;
	}


	public void setAgainPassword(String againPassword) {
		this.againPassword = againPassword;
	}



}
