package unitter.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import unitter.domain.model.Retweet;

public interface RetweetRepository extends JpaRepository<Retweet, Integer> {
	List<Retweet> findByUser_UserIdOrderByRetweetTimestampAsc(String userId);
	Retweet findByUser_UserIdAndTweet_TweetId(String userId, Integer tweetId);
}
