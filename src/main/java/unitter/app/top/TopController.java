package unitter.app.top;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import unitter.domain.service.UnitterUserDetailsService;

@Controller
public class TopController {


	@Autowired
	UnitterUserDetailsService unitterUserDetailsService;

	//topページ表示メソッド

	@RequestMapping("top")
	public String top(){
		return "top/top";
	}

	@RequestMapping("loginerror")
	public String loginError() {
		return "error/loginerror";
	}



	@RequestMapping(path = "accountcreate", method = RequestMethod.GET)
	public String accountCreate(){
		return "top/accountcreate";
	}
	/*
	//検索メソッド
	@RequestMapping(method = RequestMethod.POST)
	public String search(Model model) {
		return "searchTest";
	}

	//アカウント作成ページ(リンクによる画面遷移)
	@RequestMapping(method = RequestMethod.GET, path="accountForm")
	public String AccountForm(Model model)
	{
		return "accountForm";
	}

	//ユーザー登録
	@RequestMapping(method = RequestMethod.POST, path="createAccount")
	public String createAccount(Model model) {

		return "createTest";
	}

*/




}
