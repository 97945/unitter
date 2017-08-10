package unitter.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import unitter.domain.model.Timeline;


public interface TimelineRepository extends JpaRepository<Timeline, Integer> {
	Page<Timeline> findByUser_UserId(@Param("userId") String userId, Pageable pageable);
	Timeline findByTweet_TweetId(Integer tweetId);
	Timeline findByUser_UserIdAndTweet_TweetId(String userId, Integer tweetId);
}
