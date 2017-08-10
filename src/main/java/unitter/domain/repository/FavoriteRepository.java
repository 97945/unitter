package unitter.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import unitter.domain.model.Favorite;

public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
	List<Favorite> findByUser_UserIdOrderByFavoriteTimestampAsc(String userId);
	Favorite findByUser_UserIdAndTweet_TweetId(String userId, Integer tweetId);
}
