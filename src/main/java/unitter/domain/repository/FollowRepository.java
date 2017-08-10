package unitter.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import unitter.domain.model.Follow;

public interface FollowRepository extends JpaRepository<Follow, Integer> {
	List<Follow> findByFollowerUser_UserIdOrderByFollowTimestampAsc(String userId);
	Follow findByFollowUser_UserIdAndFollowerUser_UserId(String followUserId, String followerUserId);
}
