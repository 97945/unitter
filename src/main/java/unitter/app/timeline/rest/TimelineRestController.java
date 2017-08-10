package unitter.app.timeline.rest;

import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URI;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import unitter.domain.model.Favorite;
import unitter.domain.model.Follow;
import unitter.domain.model.Retweet;
import unitter.domain.model.Timeline;
import unitter.domain.model.Tweet;
import unitter.domain.model.User;
import unitter.domain.resource.AccountCreateResource;
import unitter.domain.resource.ProfileResource;
import unitter.domain.resource.SearchResource;
import unitter.domain.resource.TimelineResource;
import unitter.domain.resource.TweetResource;
import unitter.domain.service.FavoriteService;
import unitter.domain.service.FollowService;
import unitter.domain.service.RetweetService;
import unitter.domain.service.TimelineService;
import unitter.domain.service.TweetService;
import unitter.domain.service.UploadImageException;
import unitter.domain.service.UserService;


@CrossOrigin
@RestController
@RequestMapping("unitter")
public class TimelineRestController {
	@Autowired
	TimelineService timelineService;

	@Autowired
	UserService userService;

	@Autowired
	TweetService tweetService;

	@Autowired
	FollowService followService;

	@Autowired
	FavoriteService favoriteService;

	@Autowired
	RetweetService retweetService;

	@Autowired
	PasswordEncoder passwordEncoder;


	//タイムライン表示用
	@RequestMapping(path = "timeline/{userId}/{pageId}", method = RequestMethod.GET)
	public List<TimelineResource> getTimeline(@PathVariable("userId") String userId, @PathVariable("pageId") Integer pageId) {
		List<Timeline> timelines = timelineService.findByUserId(userId, pageId, 10);

		return timelines.stream().map(timeline -> {
			TimelineResource resource = new TimelineResource();
			User user = timeline.getUser();
			User otherUser = timeline.getTweet().getUser();

			Tweet tweet = timeline.getTweet();
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
			resource.setFavoriteFlg(isFavorite(user, tweet));
			resource.setRetweetFlg(isRetweet(user, tweet));
			//お気に入りをした人のリスト
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

			//リツイートした人のリスト
			resource.setRetweet(tweet.getRetweetList().stream().map(retweet -> {
				ProfileResource retweetResource = new ProfileResource();
				User retweetUser = retweet.getUser();
				String retweetUserId = "";
				String nickname = "";
				String profileImage = "";
				String headderImage = "";
				String retweetMessage = "";
				boolean isFollow = false;
				if(retweetUser != null) {
					retweetUserId =retweetUser.getUserId();
					nickname = retweetUser.getNickname();
					profileImage = retweetUser.getProfileImage();
					headderImage = retweetUser.getHeadderImage();
					isFollow = isFollow(user, retweetUser);
					if(isFollow(user, retweetUser)) {
						retweetMessage = nickname + "さんが" + tweet.getUser().getNickname() + "さんのツイートをリツイートしました";
						resource.setRetweetMessage(retweetMessage);
					}

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


			//フォローのリスト
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


			//フォロワーのリスト
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

			//タイムラインした人のお気に入りリスト
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


			//タイムラインのツイートリスト
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

	//フォローチェック
	public Boolean isFollow(User user, User otherUser) {
		List<Follow> followList = otherUser.getFollowList();
		for(Follow follow : followList) {
			if(user.equals(follow.getFollowerUser())){
				return true;
			}
		}
		return false;
	}

	//お気に入りチェック
	public Boolean isFavorite(User user, Tweet tweet) {
		List<Favorite> favoriteList = tweet.getFavoriteList();
		for(Favorite favorite : favoriteList) {
			if(user.equals(favorite.getUser())) {
				return true;
			}
		}
		return false;
	}

	//リツイートチェック
	public Boolean isRetweet(User user, Tweet tweet) {
		List<Retweet> retweetList = tweet.getRetweetList();
		for(Retweet retweet : retweetList) {
			if(user.equals(retweet.getUser())) {
				return true;
			}
		}

		return false;
	}


	//ツイート作成
	@RequestMapping(method = RequestMethod.POST)
	public TweetResource createTweet(@Validated @RequestBody TweetResource tweetResource
			, UriComponentsBuilder uriBuilder) {


		//自分のタイムラインに登録
		User user = userService.findOne(tweetResource.getUserId());
		Tweet tweet = new Tweet();
		Timeline timeline = new Timeline();
		tweet.setBodySentence(tweetResource.getTweet());
		tweet.setUser(user);
		tweet.setTweetTimestamp(LocalDateTime.now());
		tweet.setBodyImage("loading");
		tweet.setBodyImageHeight(0);
		tweet.setBodyImageWidth(0);
		timeline.setTweet(tweet);
		timeline.setUser(user);
		timeline.setTimelineTimestamp(LocalDateTime.now());
		List<Timeline> timelineList = tweet.getTimelineList();
		timelineList.add(timeline);
		tweet.setTimelineList(timelineList);
		tweet = tweetService.add(tweet);

		List<Follow> followList = user.getFollowList();



		//他の人のタイムラインに登録
		User  otherUser = new User();
		for(Follow follow : followList ) {
			otherUser = userService.findOne(follow.getFollowerUser().getUserId());
			timeline = new Timeline();
			timeline.setUser(otherUser);
			timeline.setTweet(tweet);
			timeline.setTimelineTimestamp(LocalDateTime.now());
			timelineService.add(timeline);
		}




		tweetResource.setTweetId(tweet.getTweetId());
		return tweetResource;
	}

	@RequestMapping(path = "{tweetId}", method = RequestMethod.DELETE)
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteTweet(@PathVariable Integer tweetId) {
		tweetService.deleteTweet(tweetId);
	}


	//ツイート画像アップロード
	@RequestMapping(path = "upload/{tweetId}", method = RequestMethod.POST)
	public  ResponseEntity<Void> pictureUpload(@RequestParam("upload_file") MultipartFile multipartFile,
												@PathVariable("tweetId") Integer tweetId,
											  UriComponentsBuilder uriBuilder) {



		Tweet tweet = tweetService.findTweet(tweetId);
		User user = tweet.getUser();
		String userId = user.getUserId();


		URI resourceUri = uriBuilder.path("unitter/{userId}").buildAndExpand(userId)
				.encode()
				.toUri();


		if(multipartFile.isEmpty())
		{

			if(tweet.getBodySentence().isEmpty()){
				tweetService.deleteTweet(tweetId);
				return ResponseEntity.created(resourceUri).build();
			}else {
				tweet.setBodyImage("");
				tweet.setBodyImageHeight(0);
				tweet.setBodyImageWidth(0);
			}

		} else {

			if(!multipartFile.getContentType().matches("image/.*")){
				throw new UploadImageException();
			}
			StringBuffer filePath = new StringBuffer(System.getProperty("user.dir") + "/src/main/resources/static/photo").append(File.separator).append(userId);

			File uploadDir = mkdirs(filePath);

			try {

				String prefixFile = checkFile(filePath);
				tweet.setBodyImage(userId + "/"  + prefixFile);
				InputStream file = multipartFile.getInputStream();
				BufferedImage image = ImageIO.read(file);
				tweet.setBodyImageHeight(image.getHeight());
				tweet.setBodyImageWidth(image.getWidth());

				File uploadFile = new File(uploadDir.getPath() + "/" + prefixFile);
				byte[] bytes = multipartFile.getBytes();
				BufferedOutputStream uploadFileStream =
						new BufferedOutputStream(new FileOutputStream(uploadFile));
				uploadFileStream.write(bytes);
				uploadFileStream.close();

			}catch (Exception e) {
				e.printStackTrace();
			}catch(Throwable t) {
				t.printStackTrace();
			}


		}
				tweetService.add(tweet);


		return ResponseEntity.created(resourceUri).build();
	}

	private File mkdirs(StringBuffer filePath) {
		File uploadDir = new File(filePath.toString());

		if(!uploadDir.exists()){
			uploadDir.mkdirs();
		}

		return uploadDir;

	}

	private String checkFile(StringBuffer filePath) {
		Date now = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
		int prefix = 0;
		String prefixFile = sdf.format(now);
		File file = new File(filePath.toString(),sdf.format(now));
		while(file.exists()) {
			prefix++;
			prefixFile += "_" + String.valueOf(prefix);
			file = new File(filePath.toString() + String.valueOf(prefix));
		}
		return prefixFile;
	}

	@RequestMapping(path = "update/{userId}", method = RequestMethod.POST)
	public AccountCreateResource accountCreate(@Validated @RequestBody AccountCreateResource createResource, @PathVariable String userId) {

		User user = userService.findOne(userId);
		user.setUserId(userId);
		user.setNickname(createResource.getNickname());
		user.setMailAddress(createResource.getMailAddress());
		userService.add(user);
		return createResource;
	}

	@RequestMapping(path = "password/{userId}", method = RequestMethod.POST)
	public AccountCreateResource passwordCreate(@Validated @RequestBody AccountCreateResource createResource, @PathVariable String userId) {

		User user = userService.findOne(userId);
		user.setUserId(userId);
		String password = passwordEncoder.encode(createResource.getPassword());
		user.setPassword(password);
		userService.add(user);
		return createResource;
	}

	@RequestMapping(path = "profile/{userId}", method = RequestMethod.POST)
	public AccountCreateResource profileCreate(@Validated @RequestBody AccountCreateResource createResource, @PathVariable String userId) {

		User user = userService.findOne(userId);
		user.setUserId(userId);
		user.setNickname(createResource.getNickname());
		user.setSelfIntroduction(createResource.getSelfIntroduction());

		userService.add(user);
		return createResource;
	}

	//プロフィール画像アップロード
	@RequestMapping(path = "profileimage/{userId}", method = RequestMethod.POST)
	public  ResponseEntity<Void> pictureUpload2(@RequestParam("upload_file2") MultipartFile multipartFile,
												@PathVariable("userId") String userId,
											  UriComponentsBuilder uriBuilder) {




		if(multipartFile.isEmpty()) {

		} else {
			if(!multipartFile.getContentType().matches("image/.*")){
				throw new UploadImageException();
			}
			User user = userService.findOne(userId);
			StringBuffer filePath = new StringBuffer(System.getProperty("user.dir") + "/src/main/resources/static/photo").append(File.separator).append(userId);

			File uploadDir = mkdirs(filePath);

			try {

				String prefixFile = checkFile(filePath);
				user.setProfileImage(userId + "/" +  prefixFile);
				File uploadFile = new File(uploadDir.getPath() + "/" + prefixFile);
				byte[] bytes = multipartFile.getBytes();
				BufferedOutputStream uploadFileStream =
						new BufferedOutputStream(new FileOutputStream(uploadFile));
				uploadFileStream.write(bytes);
				uploadFileStream.close();

			}catch (Exception e) {
				e.printStackTrace();
			}catch(Throwable t) {
				t.printStackTrace();
			}
			userService.add(user);
		}



		URI resourceUri = uriBuilder.path("unitter/{userId}").buildAndExpand(userId)
				.encode()
				.toUri();

		return ResponseEntity.created(resourceUri).build();
	}


	//ヘッダー画像アップロード
	@RequestMapping(path = "headderimage/{userId}", method = RequestMethod.POST)
	public  ResponseEntity<Void> pictureUpload3(@RequestParam("upload_file3") MultipartFile multipartFile,
												@PathVariable("userId") String userId,
											  UriComponentsBuilder uriBuilder) {




		if(multipartFile.isEmpty()) {

		} else {

			if(!multipartFile.getContentType().matches("image/.*")){
				throw new UploadImageException();
			}
			User user = userService.findOne(userId);

			StringBuffer filePath = new StringBuffer(System.getProperty("user.dir") + "/src/main/resources/static/photo").append(File.separator).append(userId);

			File uploadDir = mkdirs(filePath);

			try {

				String prefixFile = checkFile(filePath);
				user.setHeadderImage(userId + "/" +  prefixFile);
				File uploadFile = new File(uploadDir.getPath() + "/" + prefixFile);
				byte[] bytes = multipartFile.getBytes();
				BufferedOutputStream uploadFileStream =
						new BufferedOutputStream(new FileOutputStream(uploadFile));
				uploadFileStream.write(bytes);
				uploadFileStream.close();

			}catch (Exception e) {
				e.printStackTrace();
			}catch(Throwable t) {
				t.printStackTrace();
			}
			userService.add(user);

		}



		URI resourceUri = uriBuilder.path("unitter/{userId}").buildAndExpand(userId)
				.encode()
				.toUri();

		return ResponseEntity.created(resourceUri).build();
	}

	@RequestMapping(path = "follow/{userId}/{otherUserId}", method = RequestMethod.GET)
	public ResponseEntity<Void> follow(@PathVariable("userId") String userId,
									   @PathVariable("otherUserId") String otherUserId,
									   UriComponentsBuilder uriBuilder) {
		User user = userService.findOne(userId);
		User otherUser = userService.findOne(otherUserId);
		Follow existFollow = followService.checkFollow(otherUserId, userId);

		if(existFollow == null) {
			Follow follow = new Follow();

			follow.setFollowUser(otherUser);
			follow.setFollowerUser(user);
			follow.setFollowTimestamp(LocalDateTime.now());
			followService.add(follow);

		}else {
			followService.followDelete(existFollow.getFollowId());
		}




		URI resourceUri = uriBuilder.path("unitter/{userId}").buildAndExpand(userId)
				.encode()
				.toUri();

		return ResponseEntity.created(resourceUri).build();
	}

	@RequestMapping(path = "favorite/{userId}/{tweetId}", method = RequestMethod.GET)
	public ResponseEntity<Void> favorite(@PathVariable("userId") String userId,
									   @PathVariable("tweetId") Integer tweetId,
									   UriComponentsBuilder uriBuilder) {
		User user = userService.findOne(userId);
		Favorite existFavorite = favoriteService.checkFavorite(userId, tweetId);
		if(existFavorite == null){
			Favorite favorite = new Favorite();
			Tweet tweet = tweetService.findTweet(tweetId);
			favorite.setUser(user);
			favorite.setTweet(tweet);
			favorite.setFavoriteTimestamp(LocalDateTime.now());

			favoriteService.add(favorite);
		}else {
			favoriteService.favoriteDelete(existFavorite.getFavoriteId());
		}



		URI resourceUri = uriBuilder.path("unitter/{userId}").buildAndExpand(userId)
				.encode()
				.toUri();

		return ResponseEntity.created(resourceUri).build();
	}


	@RequestMapping(path = "retweet/{userId}/{tweetId}", method = RequestMethod.GET)
	public ResponseEntity<Void> retweet(@PathVariable("userId") String userId,
									   @PathVariable("tweetId") Integer tweetId,
									   UriComponentsBuilder uriBuilder) {
		User user = userService.findOne(userId);
		Retweet existRetweet = retweetService.checkRetweet(userId, tweetId);
		if(existRetweet == null){
			Retweet retweet = new Retweet();
			Tweet tweet = tweetService.findTweet(tweetId);
			retweet.setUser(user);
			retweet.setTweet(tweet);
			retweet.setRetweetTimestamp(LocalDateTime.now());

			retweetService.add(retweet);

			List<Follow> followList = user.getFollowList();



			//他の人のタイムラインに登録
			Timeline timeline = new Timeline();
			User  otherUser = new User();
			for(Follow follow : followList ) {
				otherUser = userService.findOne(follow.getFollowerUser().getUserId());
				timeline = timelineService.findByUserAndTweet(otherUser.getUserId(), tweetId);
				if(timeline == null) {
					timeline  = new Timeline();
				}
				timeline.setUser(otherUser);
				timeline.setTweet(tweet);
				timeline.setTimelineTimestamp(LocalDateTime.now());
				timelineService.add(timeline);
			}
		}else {
			retweetService.retweetDelete(existRetweet.getRetweetId());
		}


		URI resourceUri = uriBuilder.path("unitter/{userId}").buildAndExpand(userId)
				.encode()
				.toUri();

		return ResponseEntity.created(resourceUri).build();
	}

	//検索結果
	@RequestMapping(path = "search/{pageId}", method = RequestMethod.GET)
	public List<TimelineResource> getSearch(@Validated SearchResource searchResource, @PathVariable("pageId") Integer pageId) {
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

		List<Tweet> timelines = tweetService.searchAll(searchResource.getUserName(), searchResource.getUserName(), searchResource.getTweet(), pageId, 50);

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
			resource.setFavoriteFlg(isFavorite(user, tweet));
			resource.setRetweetFlg(isRetweet(user, tweet));
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


}



