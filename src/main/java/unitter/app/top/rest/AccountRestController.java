package unitter.app.top.rest;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import unitter.domain.model.User;
import unitter.domain.resource.AccountCreateResource;
import unitter.domain.resource.ChangePasswordResource;
import unitter.domain.resource.PasswordResource;
import unitter.domain.service.ChangePasswordMisMatchException;
import unitter.domain.service.PasswordCheckException;
import unitter.domain.service.UserExistException;
import unitter.domain.service.UserIdPatternException;
import unitter.domain.service.UserService;

@CrossOrigin
@RestController
@RequestMapping("account")
public class AccountRestController {

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	UserService userService;



	@RequestMapping(path = "create", method = RequestMethod.POST)
	public AccountCreateResource accountCreate(@Validated @RequestBody AccountCreateResource createResource) {
		User user = null;

		user = userService.findOne(createResource.getUserId());

		if(user != null){
			throw new UserExistException();
		}

		if(!createResource.getUserId().matches("[a-zA-Z0-9-]+")) {
			throw new UserIdPatternException();
		}


		user = new User();
		user.setUserId(createResource.getUserId());
		user.setNickname(createResource.getNickname());
		user.setMailAddress(createResource.getMailAddress());
		String password = passwordEncoder.encode(createResource.getPassword());
		user.setPassword(password);
		user.setUserTimestamp(LocalDateTime.now());
		user.setSelfIntroduction("");
		user.setProfileImage("castle-02.jpg");
		user.setHeadderImage("castle-02.jpg");
		userService.add(user);
		return createResource;
	}

	@RequestMapping(path = "create/{userId}", method = RequestMethod.GET)
	public Object idCheck(@PathVariable String userId) {
		User user = null;

		user = userService.findOne(userId);

		if(user != null){
			throw new UserExistException();
		}

		if(!userId.matches("[a-zA-Z0-9-]+")) {
			throw new UserIdPatternException();
		}

		return "OK";
	}

	@RequestMapping(path = "password", method = RequestMethod.POST)
	public Object passwordCheck(@Validated @RequestBody PasswordResource passwordResource) {
		User user = null;
		user = userService.findOne(passwordResource.getUserId());
		String userPassword = user.getPassword();
		String checkPassword = passwordResource.getPassword();
		if(!passwordEncoder.matches(checkPassword, userPassword)){

			throw new PasswordCheckException();
		}

		return "OK";
	}

	@RequestMapping(path = "{userId}", method = RequestMethod.DELETE)
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteUser(@PathVariable String userId) {

		userService.deleteUser(userId);
	}

	@RequestMapping(path = "changepassword", method = RequestMethod.POST)
	public Object changePassword(@Validated @RequestBody ChangePasswordResource changePasswordResource) {
		User user = null;
		user = userService.findOne(changePasswordResource.getUserId());
		String userPassword = user.getPassword();
		String checkPassword = changePasswordResource.getPassword();
		if(!passwordEncoder.matches(checkPassword, userPassword)){
			throw new PasswordCheckException();
		}
		if(!changePasswordResource.getChangePassword().equals(changePasswordResource.getAgainPassword())){
			throw new ChangePasswordMisMatchException();
		}

		return "OK";
	}
}
