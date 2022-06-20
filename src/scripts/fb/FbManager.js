import FbScoreAPI from './FbScoreAPI';
// import Utils 	from 'fido/utils/Utils';
import * as PIXI from 'pixi.js';

class FbManager
{
	constructor( )
	{
		this.debug = true;
	 	this.live = true;

	}

	connect()
	{
		this.live = true;
		if(this.live)
		{
			this.debugDiv = document.createElement('div');
			this.debugDiv.id = 'debug'
			// document.body.appendChild(this.debugDiv);

			this.log('connecting..');
			let t = FBInstant.initializeAsync()
			console.log(t);
			return t
			.then( () => {

				this.log('connection success :)');
				this.log(FBInstant.context.getType())

			})

		}
		else
		{
			this.log('local mode');

			return new Promise(resolve => {resolve()})
		}
	}
	getContextType() {
		return FBInstant.context.getType();
	}
	getImage()
	{
		if(this.live)
		{
			return PIXI.Texture.from( FBInstant.player.getPhoto() );
		}
		else
		{
			return PIXI.Texture.from( 'icon_fb_avatar.png' );
		}
	}

	start()
	{
		if(this.live)
		{
			return FBInstant.startGameAsync();
		}
		else
		{
			return new Promise(resolve => {resolve()})
		}
	}

	savePB()
	{

	}

	getPB()
	{

	}
	appendDebug(text) {
		// let p = document.createElement('p')
		// p.innerHTML = text;
		// this.debugDiv.appendChild(p);

	}
	showAdd(cb, params) {
		if(!this.live) return;
		var ad = null;
		FBInstant.getRewardedVideoAsync(
		  '572860816402905_572873263068327',
		).then((rewardedVideo)=> {
		  ad = rewardedVideo;
			this.appendDebug(rewardedVideo);

		  return ad.loadAsync();
		}).then(()=> {
		  // Ad loaded
		  return ad.showAsync();
		}).then((e)=> {
		  // Ad watched
			console.log('Add watched');

			this.appendDebug(e);

			if(cb) {
				cb(params, true)
				screenManager.hideVideoLoader();
			}
		}, (err)=> {
			console.log('Error', err);
			this.appendDebug(err.code);
			this.appendDebug(err.message);

			// console.log(cb);
			if(cb) {
				cb(params, false)
				screenManager.hideVideoLoader();
			}
		});
	}
	getInfosPlayer() {
		return {
			$ConnectedPlayer1: {
				id: FBInstant.player.getID(),
				name: FBInstant.player.getName(),
				photo: FBInstant.player.getPhoto(),
			}

		}
	}
	getName() {
		return FBInstant.player.getName() || '';
	}
	getId() {
		return FBInstant.player.getID();
	}
	getFriends(playersAPI, cb) {
		if (this.live) {
			FBInstant.player.getConnectedPlayersAsync()
			.then( (_players) => {
				let players = JSON.parse(JSON.stringify(_players))
				players.push(this.getInfosPlayer());

				let result = [];
				for (var j = 0; j < playersAPI.length; j++) {

				for (var i = 0; i < players.length; i++) {

						if(players[i].$ConnectedPlayer1.id === playersAPI[j].facebook_id) {
							result.push({
								id: players[i].$ConnectedPlayer1.id,
								name: players[i].$ConnectedPlayer1.name,
								photo: players[i].$ConnectedPlayer1.photo,
								score: playersAPI[j].score
							})
							break;
						}
					}
				}
				cb(result);

			});
		} else {
			cb([]);
		}


	}
	getFriendsIds(cb) {
		FBInstant.player.getConnectedPlayersAsync()
		.then( players =>{
			const ids = players.map( p => p.$ConnectedPlayer1.id );
			ids.push(FBInstant.player.getID());
			cb(ids);
		});
	}
	sendScore(score)
	{
		console.log("SENDING SCORE = " + score)
		return FbScoreAPI.sendScore(FBInstant.player.getID(), score);
	}

	loadScores()
	{
		// get user ids..
		return FBInstant.player.getConnectedPlayersAsync()
		.then( players =>{

			const ids = players.map( p => p.id );

			ids.push(FBInstant.player.getID());

			FbScoreAPI.getScores(ids);

		});
	}

	trackLoader(loader)
	{
		if(!this.live)return;

		console.log(loader);

		loader.onProgress.add((e)=>{

			console.log(e);

			FBInstant.setLoadingProgress(e.progress);

		})
	}

	log(value)
	{
		if(this.debug)console.log("FB: " + value);
	}


	switchContext()
	{
		if(!this.live)return;

		this.log('switching context');
		FBInstant.context.chooseAsync().then(() => {


		})
	}

	shareScore(renderTexture, score)
	{
		if(!this.live)return;

		var base64Picture = window.renderer.extract.base64(renderTexture);
		const user = FBInstant.player.getName();

		// post that a user has leveled up!
		FBInstant.shareAsync({
			intent:'INVITE',
			image:base64Picture,
			text:`${user} just scored ${Utils.formatScore(score).toUpperCase()}! Can you do better?`,
			data:{},
		}).then((d)=>{
			console.log('success');
		})
		.catch(function(e){
			console.log('error');
    });
	}
	postShareScoreUpdate(renderTexture, score)
	{
		if(!this.live)return;

		const user = FBInstant.player.getName();

		var base64Picture = window.renderer.extract.base64(renderTexture);


		FBInstant.updateAsync({
			action:'CUSTOM',
			template: 'play_turn',
			cta:'Play',
			// cta:`${user} has challenged you to beat their high score`,
			image:base64Picture,
			// text:`${user} posted a new high score. Can you do better?`,
			text:`${user} just scored ${Utils.formatScore(score).toUpperCase()}! Can you do better?`,
			data:{},
			strategy:'IMMEDIATE',
		}).then((d)=>{
			console.log('Success');
			// FBInstant.quit();
		})
		.catch(function(e){

		});
	}

	postScoreUpdate(playerBeaten, renderTexture)
	{
		if(!this.live)return;

		const user = FBInstant.player.getName();

		var base64Picture = window.renderer.extract.base64(renderTexture);
		var names = playerBeaten.join(', ');

		FBInstant.updateAsync({
			action:'CUSTOM',
			template: 'play_turn',
			cta:'Try to beat '+ user +'!',
			// cta:`${user} has challenged you to beat their high score`,
			image:base64Picture,
			// text:`${user} posted a new high score. Can you do better?`,
			text:'Wow, ' + user + ' beat the high score of ' + names+'!',
			data:{},
			strategy:'IMMEDIATE',
		}).then((d)=>{
			console.log('Success');
			// FBInstant.quit();
		})
		.catch(function(e){

		});
	}

	postBeltUpdate(belt)
	{
		if(!this.live)return;

		const user = FBInstant.player.getName();

		var redSquare = new PIXI.Container();
		redSquare.addChild(new PIXI.Graphics().beginFill(belt.hex).drawRect(0,0,100,100));

		const renderTexture = PIXI.RenderTexture.create(100, 100);

		window.renderer.render(redSquare, renderTexture);

		var base64Picture = window.renderer.extract.base64(renderTexture);

		// post that a user has leveled up!
		FBInstant.updateAsync({
			action:'CUSTOM',
			cta:'I can do better than '+user+'!',
			image:base64Picture,
			text:user + ' just got the '+belt.name+' belt on coin cat!',
			data:{},
			strategy:'IMMEDIATE',
		}).then((d)=>{

		})
		.catch(function(e){

      	});
	}


	postAchievmentCompleterUpdate()
	{
		if(!this.live)return;

		// generate a coincat belt picture..


		// post that a user has leveled up!
		FB.updateAsync({
			action:'CUSTOM',
			cta:'I can do better!',
			text:'Mat just got a new belt on coin cat!',
			data:{},
			strategy:'IMMEDIATE',

		}).then(()=>{

			// sent!

		});
		// post that a user has just nailed an achievment
	}
}

export default new FbManager();
