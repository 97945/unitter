package unitter.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unitter.domain.model.Tweet;
import unitter.domain.repository.TweetRepository;

@Service
@Transactional
public class TweetService {
	@Autowired
	TweetRepository tweetRepository;



	public Tweet findTweet(Integer id) {
			return tweetRepository.findOne(id);
	}

	public List<Tweet> findAll(){
		return tweetRepository.findAll();
	}

	public List<Tweet> findByUserId(String userId){
		return tweetRepository.findByUser_UserIdOrderByTweetTimestampAsc(userId);
	}

	public List<Tweet> findByUserIdContaining(String userId){
		return tweetRepository.findByUser_UserIdContainingOrderByTweetTimestampAsc(userId);
	}


	public List<Tweet> findByNicknameContaining(String nickname) {
		return tweetRepository.findByUser_NicknameContainingOrderByTweetTimestampAsc(nickname);
	}

	public List<Tweet> findByBodySentenceContaining(String bodySentence) {
		return tweetRepository.findByBodySentenceContainingOrderByTweetTimestampAsc(bodySentence);
	}

	public List<Tweet> searchAll(String userId, String nickname, String bodySentence, int page, int size) {
		Sort sort = new Sort(Direction.DESC, "tweetTimestamp");
		Pageable pageable = new PageRequest(page, size, sort);
		return tweetRepository.findByUser_UserIdContainingOrUser_NicknameContainingOrBodySentenceContaining(userId, nickname, bodySentence, pageable).getContent();
	}

	public void deleteTweet(Integer id) {
		tweetRepository.delete(id);
	}

	public Tweet add(Tweet tweet){
		return tweetRepository.saveAndFlush(tweet);
	}
}
