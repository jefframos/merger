import * as PIXI from 'pixi.js';
import StandardCard  from './StandardCard';
import config  from '../../config';
import utils  from '../../utils';
import ParticleSystem  from '../effects/ParticleSystem';
export default class Piece extends StandardCard{
	constructor(game){
		super();	
		this.isPiece = true;	
	}	
}