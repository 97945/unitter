package unitter.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unitter.domain.model.Retweet;
import unitter.domain.repository.RetweetRepository;

@Service
@Transactional
public class RetweetService {
	@Autowired
	RetweetRepository retweetRepository;

	public void add(Retweet retweet) {
		retweetRepository.saveAndFlush(retweet);
	}
	public List<Retweet> findByUserId(String userId) {
		return retweetRepository.findByUser_UserIdOrderByRetweetTimestampAsc(userId);
	}

	public void retweetDelete(Integer id) {
		retweetRepository.delete(id);
	}

	public Retweet checkRetweet(String userId, Integer tweetId){
		return retweetRepository.findByUser_UserIdAndTweet_TweetId(userId, tweetId);
	}

}
