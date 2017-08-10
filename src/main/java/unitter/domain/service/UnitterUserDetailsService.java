package unitter.domain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import unitter.domain.model.User;
import unitter.domain.repository.UserRepository;

@Service
public class UnitterUserDetailsService implements UserDetailsService {
	@Autowired
	UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO 自動生成されたメソッド・スタブ
		User user = userRepository.findOne(username);
		if(user == null) {
			throw new UsernameNotFoundException(username +  "is not found.");
		}

		return new UnitterUserDetails(user);
	}

}
