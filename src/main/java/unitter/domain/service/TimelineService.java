package unitter.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unitter.domain.model.Timeline;
import unitter.domain.repository.TimelineRepository;

@Service
@Transactional
public class TimelineService {

	@Autowired
	TimelineRepository timelineRepository;

	public List<Timeline> findAll() {
		return timelineRepository.findAll();
	}

	public List<Timeline> findByUserId(String userId, int page, int size) {
		Sort sort = new Sort(Direction.DESC, "timelineTimestamp");
		Pageable pageable = new PageRequest(page, size, sort);
		return timelineRepository.findByUser_UserId(userId, pageable).getContent();
	}

	public Timeline findByTweetId(Integer tweetId) {
		return timelineRepository.findByTweet_TweetId(tweetId);
	}

	public void add(Timeline timeline) {
		timelineRepository.saveAndFlush(timeline);
	}

	public void deleteTimeline(Integer id) {
		timelineRepository.delete(id);
	}

	public Timeline findByUserAndTweet(String userId, Integer tweetId) {
		return timelineRepository.findByUser_UserIdAndTweet_TweetId(userId, tweetId);
	}

}
