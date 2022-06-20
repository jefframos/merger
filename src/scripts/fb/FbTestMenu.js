import * as PIXI from 'pixi.js';
import FbManager from './FbManager'
import FbScoreAPI from './FbScoreAPI'

class FbTestMenu extends PIXI.Container
{
	constructor( )
	{
		super();

		this.buttons = [];
		this.addButton('post belt update', ()=>{ FbManager.postBeltUpdate({name:'black', hex:0x000000}) } );
		this.addButton('post score update', ()=>{ FbManager.postScoreUpdate(30000) } );
		this.addButton('post score share', ()=>{ FbManager.shareScore(30000) } );
		this.addButton('change context', ()=>{ FbManager.switchContext() } );
		this.addButton('get scores', ()=>{
			FbScoreAPI.getScores([1028, 123, 127, 125, 1239]).then((r)=>{

				console.log(r)
				console.log('--------')

			})
		});

		this.addButton('send scores', ()=>{
			// FbScoreAPI.sendScore('matty', 300).then((r)=>{
			//
			// 	console.log(r)
			// 	console.log('--------')
			//
			// })
		});
	}

	addButton(title, func)
	{
		var w = 200;
		var h = 30;

		var button = new PIXI.Graphics().beginFill(0xFFCC00).drawRect(0,0,w, h);
		var title = new PIXI.Text(title);
		title.anchor.set(0.5);
		title.x = w/2;
		title.y = h/2;
		button.addChild(title)

		this.addChild(button);

		button.position.y = this.buttons.length * 40;
		this.buttons.push(button);

		button.interactive = true;

		button.tap = button.click = ()=>{

			func();
		}
	}


}

export default FbTestMenu;
