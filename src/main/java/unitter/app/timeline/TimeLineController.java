package unitter.app.timeline;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import unitter.domain.model.User;
import unitter.domain.service.UnitterUserDetails;
import unitter.domain.service.UnitterUserDetailsService;

@Controller
@RequestMapping("unitter")
public class TimeLineController {


	@Autowired
	UnitterUserDetailsService unitterUserDetaisService;


	@RequestMapping(method = RequestMethod.GET)
	String timeline(Model model, @AuthenticationPrincipal UnitterUserDetails userDetails) {
		User user = userDetails.getUser();
		model.addAttribute("userId", user.getUserId());
		model.addAttribute("userNickname", user.getNickname());
		model.addAttribute("mailaddress", user.getMailAddress());
		model.addAttribute("password", user.getPassword());
		model.addAttribute("profileImage", user.getProfileImage());
		model.addAttribute("headderImage", user.getHeadderImage());

		return "timeline/timeline";
	}

}

