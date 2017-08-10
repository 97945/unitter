package unitter.domain.resource;

import java.io.Serializable;

public class MessageResource implements Serializable {
	private static final long serialVersionUID = 1L;
	private String Message;
	public String getMessage() {
		return Message;
	}
	public void setMessage(String message) {
		Message = message;
	}
}
