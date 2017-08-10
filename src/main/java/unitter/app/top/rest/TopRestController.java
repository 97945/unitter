package unitter.app.top.rest;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import unitter.domain.model.Follow;
import unitter.domain.model.Tweet;
import unitter.domain.model.User;
import unitter.domain.resource.ProfileResource;
import unitter.domain.resource.SearchResource;
import unitter.domain.resource.TimelineResource;
import unitter.domain.service.TweetService;


@CrossOrigin
@RestController
@RequestMapping("begin")
public class TopRestController {
	@Autowired
	TweetService tweetService;



	//トップページのタイムライン表示用
	@RequestMapping(path = "{pageId}", method = RequestMethod.GET)
	public List<TimelineResource> getTopTimeline(@Validated SearchResource searchResource, @PathVariable("pageId") Integer pageId) {

		/*
		List<Tweet> findUserIdTweet = tweetService.findByUserIdContaining(searchResource.getUserName());
		List<Tweet> findNicknameTweet = tweetService.findByNicknameContaining(searchResource.getUserName());
		List<Tweet> findBodySentence = tweetService.findByBodySentenceContaining(searchResource.getTweet());
		List<Tweet> timelines = new ArrayList<>();
		timelines.addAll(findUserIdTweet);
		timelines.addAll(findNicknameTweet);
		timelines.addAll(findBodySentence);
		timelines = timelines.stream().distinct().collect(Collectors.toList());
		*/

		List<Tweet> timelines = tweetService.searchAll(searchResource.getUserName(), searchResource.getUserName(), searchResource.getTweet(), pageId, 20);
		return timelines.stream().map(timeline -> {
			TimelineResource resource = new TimelineResource();
			User user = timeline.getUser();
			User otherUser = timeline.getUser();

			Tweet tweet = timeline;
			ProfileResource profile = new ProfileResource();
			resource.setUserId(user.getUserId());
			resource.setUserNickname(user.getNickname());
			resource.setProfileImage(user.getProfileImage());
			resource.setHeadderImage(user.getHeadderImage());
			resource.setSelfIntroduction(user.getSelfIntroduction());
			resource.setOtherId(otherUser.getUserId());
			resource.setOtherNickname(otherUser.getNickname());
			resource.setTweet(tweet.getBodySentence());
			resource.setTweetId(tweet.getTweetId());
			resource.setTweetImage(tweet.getBodyImage());
			resource.setTweetImageHeight(tweet.getBodyImageHeight());
			resource.setTweetImageWidth(tweet.getBodyImageWidth());
			resource.setTweetTimestamp(tweet.getTweetTimestamp());
			resource.setFavorite(tweet.getFavoriteList().stream().map(favorite -> {
				ProfileResource favoriteResource = new ProfileResource();
				User favoriteUser = favorite.getUser();
				String favoriteUserId = "";
				String nickname = "";
				String profileImage = "";
				String headderImage = "";
				boolean isFollow = false;
				if(favoriteUser != null) {
					favoriteUserId = favoriteUser.getUserId();
					nickname = favoriteUser.getNickname();
					profileImage = favoriteUser.getProfileImage();
					headderImage = favoriteUser.getHeadderImage();
					isFollow = isFollow(user, favoriteUser);
				}
				favoriteResource.setUserId(favoriteUserId);
				favoriteResource.setNickname(nickname);
				favoriteResource.setProfileImage(profileImage);
				favoriteResource.setHeadderImage(headderImage);
				favoriteResource.setFollowFlg(isFollow);
				return favoriteResource;
			}).collect(Collectors.toList()));


			resource.setRetweet(tweet.getRetweetList().stream().map(retweet -> {
				ProfileResource retweetResource = new ProfileResource();
				User retweetUser = retweet.getUser();
				String retweetUserId = "";
				String nickname = "";
				String profileImage = "";
				String headderImage = "";
				boolean isFollow = false;
				if(retweetUser != null) {
					retweetUserId =retweetUser.getUserId();
					nickname = retweetUser.getNickname();
					profileImage = retweetUser.getProfileImage();
					headderImage = retweetUser.getHeadderImage();
					isFollow = isFollow(user, retweetUser);
				}
				retweetResource.setUserId(retweetUserId);
				retweetResource.setNickname(nickname);
				retweetResource.setProfileImage(profileImage);
				retweetResource.setHeadderImage(headderImage);
				retweetResource.setFollowFlg(isFollow);
				return retweetResource;
			}).collect(Collectors.toList()));


			profile.setUserId(otherUser.getUserId());
			profile.setNickname(otherUser.getNickname());

			profile.setFollow(otherUser.getFollowerList().stream().map(follower -> {
				ProfileResource followResource = new ProfileResource();
				User followUser = follower.getFollowUser();
				String followUserId = "";
				String nickname = "";
				String profileImage = "";
				String headderImage = "";
				boolean isFollow = false;
				if(followUser != null) {
					followUserId = followUser.getUserId();
					nickname = followUser.getNickname();
					profileImage = followUser.getProfileImage();
					headderImage = followUser.getHeadderImage();
					isFollow = isFollow(user, followUser);
				}

				followResource.setUserId(followUserId);
				followResource.setNickname(nickname);
				followResource.setProfileImage(profileImage);
				followResource.setHeadderImage(headderImage);
				followResource.setFollowFlg(isFollow);


				return followResource;
			}).collect(Collectors.toList()));

			profile.setFollower(otherUser.getFollowList().stream().map(follow -> {
				ProfileResource followerResource = new ProfileResource();
				User followerUser = follow.getFollowerUser();
				String followerUserId = "";
				String nickname = "";
				String profileImage = "";
				String headderImage = "";
				boolean isFollow = false;
				if(followerUser != null) {
					followerUserId = followerUser.getUserId();
					nickname = followerUser.getNickname();
					profileImage = followerUser.getProfileImage();
					headderImage = followerUser.getHeadderImage();
					isFollow = isFollow(user, followerUser);
				}

				followerResource.setUserId(followerUserId);
				followerResource.setNickname(nickname);
				followerResource.setProfileImage(profileImage);
				followerResource.setHeadderImage(headderImage);
				followerResource.setFollowFlg(isFollow);


				return followerResource;
			}).collect(Collectors.toList()));

			profile.setFavorite(otherUser.getFavoriteList().stream().map(favorite ->{
				TimelineResource favoriteResource = new TimelineResource();
				User favoriteUser = favorite.getTweet().getUser();
				String favoriteUserId = "";
				String nickname = "";
				int tweetId = 0;
				String tweetBody ="";
				String tweetImage = "";
				if(favoriteUser != null) {
					favoriteUserId = favoriteUser.getUserId();
					nickname = favoriteUser.getNickname();
					tweetId = favorite.getTweet().getTweetId();
					tweetBody = favorite.getTweet().getBodySentence();
					tweetImage = favorite.getTweet().getBodyImage();
				}
				favoriteResource.setOtherId(favoriteUserId);
				favoriteResource.setOtherNickname(nickname);
				favoriteResource.setTweetId(tweetId);
				favoriteResource.setTweet(tweetBody);
				favoriteResource.setTweetImage(tweetImage);

				return favoriteResource;
			}).collect(Collectors.toList()));

			profile.setTweet(otherUser.getTweetList().stream().map(anTweet ->{
				TimelineResource tweetResource = new TimelineResource();
				User tweetUser = anTweet.getUser();
				String tweetUserId = "";
				String nickname = "";
				int tweetId = 0;
				String tweetBody ="";
				String tweetImage = "";
				if(tweetUser != null) {
					tweetUserId = tweetUser.getUserId();
					nickname = tweetUser.getNickname();
					tweetId = anTweet.getTweetId();
					tweetBody = anTweet.getBodySentence();
					tweetImage = anTweet.getBodyImage();
				}
				tweetResource.setOtherId(tweetUserId);
				tweetResource.setOtherNickname(nickname);
				tweetResource.setTweetId(tweetId);
				tweetResource.setTweet(tweetBody);
				tweetResource.setTweetImage(tweetImage);

				return tweetResource;
			}).collect(Collectors.toList()));




			profile.setFollowFlg(isFollow(user, otherUser));

			profile.setProfileImage(otherUser.getProfileImage());
			profile.setHeadderImage(otherUser.getHeadderImage());
			profile.setSelfIntroduction(otherUser.getSelfIntroduction());
			resource.setProfile(profile);


			return resource;
		}).collect(Collectors.toList());
	}

	public Boolean isFollow(User user, User otherUser) {
		List<Follow> followList = otherUser.getFollowList();
		for(Follow follow : followList) {
			if(user.equals(follow.getFollowerUser())){
				return true;
			}
		}
		return false;
	}

}
