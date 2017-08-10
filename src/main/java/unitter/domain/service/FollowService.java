package unitter.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unitter.domain.model.Follow;
import unitter.domain.repository.FollowRepository;

@Service
@Transactional
public class FollowService {
	@Autowired
	FollowRepository followRepository;

	public void add(Follow follow) {
		followRepository.saveAndFlush(follow);
	}
	public List<Follow> findByUserId(String userId) {
		return followRepository.findByFollowerUser_UserIdOrderByFollowTimestampAsc(userId);
	}

	public void followDelete(Integer id) {
		followRepository.delete(id);
	}

	public Follow checkFollow(String followUserId, String followerUserId){
		return followRepository.findByFollowUser_UserIdAndFollowerUser_UserId(followUserId, followerUserId);
	}
}
