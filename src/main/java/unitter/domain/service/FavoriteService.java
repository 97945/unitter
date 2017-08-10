package unitter.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unitter.domain.model.Favorite;
import unitter.domain.repository.FavoriteRepository;

@Service
@Transactional
public class FavoriteService {
	@Autowired
	FavoriteRepository favoriteRepository;

	public void add(Favorite favorite) {
		favoriteRepository.saveAndFlush(favorite);
	}
	public List<Favorite> findByUserId(String userId) {
		return favoriteRepository.findByUser_UserIdOrderByFavoriteTimestampAsc(userId);
	}


	public void favoriteDelete(Integer id) {
		favoriteRepository.delete(id);
	}

	public Favorite checkFavorite(String userId, Integer tweetId){
		return favoriteRepository.findByUser_UserIdAndTweet_TweetId(userId, tweetId);
	}
}
