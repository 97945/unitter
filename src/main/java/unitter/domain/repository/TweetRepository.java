package unitter.domain.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import unitter.domain.model.Tweet;

public interface TweetRepository extends JpaRepository<Tweet, Integer> {
	Page<Tweet> findByUser_UserIdContainingOrUser_NicknameContainingOrBodySentenceContaining(@Param("userId") String userId, @Param("nickname") String nickname,
																							@Param("bodySentence")String bodySentence, Pageable pageable);

	List<Tweet> findByUser_UserIdOrderByTweetTimestampAsc(String userId);
	List<Tweet> findByUser_UserIdContainingOrderByTweetTimestampAsc(String userId);
	List<Tweet> findByUser_NicknameContainingOrderByTweetTimestampAsc(String nickname);
	List<Tweet> findByBodySentenceContainingOrderByTweetTimestampAsc(String bodySentence);
	Integer deleteByTweetId(Integer id);


}
