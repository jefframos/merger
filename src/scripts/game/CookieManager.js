export default class CookieManager {
	constructor() {
		let defaultStats = {
			test: 0
		}
		let defaultEconomy = {
			resources: 0
		}
		let defaultResources = {
			version: '0.0.1'
		}
		let defaultProgression = {
			version: '0.0.1',
			currentEnemyLevel: 1,
			currentEnemyLife:0
		}
		let defaultBoard = {
			version: '0.0.1',
			currentBoardLevel: 0,
			entities:{},
			dataProgression:{}
		}
		this.economy = {}
		this.stats = {}
		this.resources = {}
		this.progression = {}
		this.board = {}
		this.economy = this.sortCookieData('economy', defaultEconomy);
		this.stats = this.sortCookieData('stats', defaultStats);
		this.resources = this.sortCookieData('resources', defaultResources);
		this.progression = this.sortCookieData('progression', defaultProgression);
		this.board = this.sortCookieData('board', defaultBoard);

	}

	sortCookieData(nameID, defaultData) {
		let cookie = this.getCookie(nameID);
		let target
		if (cookie) {
			target = cookie;

			for (const key in defaultData) {
				const element = defaultData[key];
				if (target[key] === undefined) {
					target[key] = element;
					this.storeObject(nameID, target)
				}
			}
			console.log(target)
		} else {
			target = defaultData
			this.storeObject(nameID, target)
		}

		return target
	}
	updateResources(total) {
		this.economy.resources = total;
		this.storeObject('economy', this.economy)
	}
	pickResource(mergeData) {
		this.resources[mergeData.rawData.nameID].currentLevel = mergeData.currentLevel
		this.resources[mergeData.rawData.nameID].latestResourceCollect = Date.now() / 1000 | 0
		this.resources[mergeData.rawData.nameID].pendingResource = 0

		this.storeObject('resources', this.resources)

	}
	addResourceUpgrade(mergeData) {
		this.resources[mergeData.rawData.nameID].currentLevel = mergeData.currentLevel
		this.storeObject('resources', this.resources)
	}
	addPendingResource(mergeData, current) {
		this.resources[mergeData.rawData.nameID].pendingResource = current
		this.resources[mergeData.rawData.nameID].latestResourceAdd = Date.now() / 1000 | 0

		this.storeObject('resources', this.resources)
	}
	buyResource(mergeData) {
		this.resources[mergeData.rawData.nameID] = {
			currentLevel: mergeData.currentLevel,
			latestResourceCollect: Date.now() / 1000 | 0,
			pendingResource: 0,
			latestResourceAdd: 0
		}
		this.storeObject('resources', this.resources)
	}

	addMergePiece(mergeData, i, j) {
		if (mergeData == null) {
			this.board.entities[i + ";" + j] = null
		} else {
			this.board.entities[i + ";" + j] = {
				nameID: mergeData.rawData.nameID
			}
		}
		this.storeObject('board', this.board)
	}
	addMergePieceUpgrade(mergeData) {

		if (this.board.dataProgression[mergeData.rawData.nameID] == null) {
			this.board.dataProgression[mergeData.rawData.nameID] = {
				currentLevel:mergeData.currentLevel
			}
		}else{
			this.board.dataProgression[mergeData.rawData.nameID].currentLevel = mergeData.currentLevel
		}

		this.storeObject('board', this.board)
	}
	saveBoardLevel(level) {
		this.board.currentBoardLevel = level;
		this.storeObject('board', this.board)

	}
	saveEnemyLife(value){
		this.progression.currentEnemyLife = value;
		this.storeObject('progression', this.progression)
	}
	saveEnemyLevel(level) {
		this.progression.currentEnemyLevel = level;
		this.storeObject('progression', this.progression)
	}

	createCookie(name, value, days) {
		let sValue = JSON.stringify(value);
		try {
			window.localStorage.setItem(name, sValue)
		} catch (e) {
			// alert(sValue)
			//  	alert(e)
		}
	}
	getEconomy() {
		return this.getCookie('economy')
	}
	getResources() {
		return this.getCookie('resources')
	}
	getProgression() {
		return this.getCookie('progression')
	}
	getBoard() {
		return this.getCookie('board')
	}
	getCookie(name) {
		return JSON.parse(window.localStorage.getItem(name))//(result === null) ? null : result[1];
	}
	storeObject(name, value) {
		window.localStorage.setItem(name, JSON.stringify(value))
	}
	resetCookie() {
		for (var i in window.localStorage) {
			window.localStorage.removeItem(i);
		}
	}
	wipeData() {
		this.resetCookie();
		window.localStorage.clear();
		window.location.reload();
	}
}