package unitter.domain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unitter.domain.model.User;
import unitter.domain.repository.UserRepository;

@Service
@Transactional
public class UserService {
	@Autowired
	UserRepository userRepository;

	public User findOne(String userId) {
		return userRepository.findOne(userId);
	}

	public void add(User user) {
		userRepository.saveAndFlush(user);
	}

	public void deleteUser(String id) {
		userRepository.delete(id);


	}


}
