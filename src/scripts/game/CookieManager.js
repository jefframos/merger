export default class CookieManager {
	constructor() {
		let defaultStats = {
			test: 0
		}
		let defaultEconomy = {
			resources: 0
		}
		let defaultResources = {
			version:'0.0.1'
		}
		this.economy = {}
		this.stats = {}
		this.resources = {}
		this.economy = this.sortCookieData('economy', defaultEconomy);
		this.stats = this.sortCookieData( 'stats', defaultStats);
		this.resources = this.sortCookieData( 'resources', defaultResources);

		console.log('resourcesresources',this.resources)
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
}