/*:ja
 * @plugindesc イベントアニメーションを拡張します。
 * @author Lib
 *
 * @param
 * @desc
 * @default
 *
 * @help
 * 足踏みと向きの変更全てを使ってキャラをアニメーションさせます。
 * <Animation2>でアニメーションを開始します。
 *	<Heigher>で近景より上にアニメーションを表示します。
 *
 * Plugin Command:
 * プラグインコマンドはありません。
 *
*/

(function() {

////////////////////////////////////////////////////////////////////////
//Game_Event
////////////////////////////////////////////////////////////////////////
var _Game_Event_prototype_update = Game_Event.prototype.update;
Game_Event.prototype.update = function() {
	_Game_Event_prototype_update.call(this);
	if(this.page()){	//一時消去するとページが消え去る。
		this.updateAnim(this.list(),this._pageIndex,this.event().note);
	}
};

var _Game_Event_prototype_clearPageSettings = Game_Event.prototype.clearPageSettings;
Game_Event.prototype.clearPageSettings = function() {
	_Game_Event_prototype_clearPageSettings.call(this);
	this.clearAnimSettings();
};

var _Game_Event_prototype_setupPageSettings = Game_Event.prototype.setupPageSettings;
Game_Event.prototype.setupPageSettings = function() {

	if(this.isLock()){
		this.clearAnimSettings();
   	this.setDirection(this.page().image.direction);
      this.setPattern(this.page().image.pattern);
	}
	
	_Game_Event_prototype_setupPageSettings.call(this);
};

////////////////////////////////////////////////////////////////////////
//Game_CharacterBase
////////////////////////////////////////////////////////////////////////
var _Game_CharacterBase_prototype_initMembers = Game_CharacterBase.prototype.initMembers
Game_CharacterBase.prototype.initMembers = function() {
	this.clearAnimSettings();
	_Game_CharacterBase_prototype_initMembers.call(this);
};

var _Game_CharacterBase_prototype_update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
	if( this.isLock() ){
		this.updateProminence();
	}else{
		_Game_CharacterBase_prototype_update.call(this);
	}
};

Game_CharacterBase.prototype.updateProminence = function() {

	if (this.isStopping()) {
		this.updateStop();
	}
	if (this.isJumping()) {
		this.updateJump();
	} else if (this.isMoving()) {
		this.updateMove();
	}

	this.updateAnimCount();
   if ( this.isAnimation(this.realMoveSpeed()) ) {
		this._pattern = this.getStp();
		this._characterIndex = this.getIdx();
		this._direction = this.getDir();
		this.updateAnimNo();
	}
};

var _Game_CharacterBase_prototype_setDirection = Game_CharacterBase.prototype.setDirection;
Game_CharacterBase.prototype.setDirection = function(d) {
	if( this.isLock() ){
		return;
	}
	_Game_CharacterBase_prototype_setDirection.call(this,d);
};

var _Game_CharacterBase_prototype_updatePattern = Game_CharacterBase.prototype.updatePattern;
Game_CharacterBase.prototype.updatePattern = function() {
	if( this.isLock() ){
		return;
	}
	_Game_CharacterBase_prototype_updatePattern.call(this);
};

////////////////////////////////////////////////////////////////////////
// Sprite_Character
////////////////////////////////////////////////////////////////////////
var _Sprite_Character_prototype_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function() {

	if( this._character.bitmap_loaded ){
		return;
	}
	
	_Sprite_Character_prototype_setCharacterBitmap.call(this);	//インデックス変更時の再ロードを防ぐ
	
	if( this._character.prominence_flg ){
		this._character.bitmap_loaded = true;
	}
};

var _Sprite_Character_prototype_updateCharacterFrame = Sprite_Character.prototype.updateCharacterFrame;
Sprite_Character.prototype.updateCharacterFrame = function() {

	if( this._character.prominence_flg && this.bitmap ==  null ){
		_Sprite_Character_prototype_setCharacterBitmap.call(this);
		this._character.bitmap_loaded = true;
	}

	_Sprite_Character_prototype_updateCharacterFrame.call(this);
};

var _Spriteset_Map_prototype_createLowerLayer2 = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {

	_Spriteset_Map_prototype_createLowerLayer2.call(this);

	for (var i = 0; i < this._characterSprites.length; i++) {
		if( this.heightCheck(this._characterSprites[i]._character) ){
			this._foreground.addChild(this._characterSprites[i]);
		}
	}
};

Spriteset_Map.prototype.heightCheck = function(character) {
	if(character._eventId){
		if ( character.event().note.indexOf('<Heigher>') !== -1 ){
			return true;
		}
	}
	return false;
};

////////////////////////////////////////////////////////////////////////
//旧：マップアニメーションクラス2
////////////////////////////////////////////////////////////////////////
Game_CharacterBase.prototype.clearAnimSettings = function(data) {
	this.prominence_flg = false;
	this.anim_no = 0;
	this.anim_count = 0;
	this.anim_loop = true;
	this.page_index = -100;
	this.bitmap_loaded = false;
};

Game_CharacterBase.prototype.updateAnim = function(list,pageIndex,note) {
	if(list && this.page_index !== pageIndex){
		this.page_index = pageIndex;
		this.prominence_flg = this.startAnimCheck(list,note);
	}
};

Game_CharacterBase.prototype.updateAnimCount = function() {
	this.anim_count += 1;
};

Game_CharacterBase.prototype.updateAnimNo = function() {
	this.anim_count = 0;
   this.anim_no += 1;
	
	if(this.anim_loop){
		this.anim_no %= 96;
	}else{
		this.anim_no = 96;
	}
};

Game_CharacterBase.prototype.heightCheck = function(note) {
	//メモチェック
	if ( note && note.indexOf('<Heigher>') !== -1 ){
		return true;
	}
	return false;
};

Game_CharacterBase.prototype.startAnimCheck = function(list,note) {

	//メモチェック
	if ( note && note.indexOf('<Animation2>') !== -1 && this.page_index === 0 ){
		return true;
	}
	
	//注釈チェック
	if (list && list.length > 1) {
	   for (var i = 0; i < list.length; i++) {
			if( list[i].code === 108 ){
				if( list[i].parameters[0].indexOf('<NoLoop>') != -1 ){
					this.anim_loop = false;
				}
				if( list[i].parameters[0].indexOf('<Animation2>') != -1 ){
					return true;
				}
			}
		}
	}
	
	return false;
};

Game_CharacterBase.prototype.getIdx = function() {
	var idx_array = [0,0,0, 1,1,1, 2,2,2, 3,3,3, 0,0,0, 1,1,1, 2,2,2, 3,3,3, 0,0,0, 1,1,1, 2,2,2, 3,3,3, 0,0,0, 1,1,1, 2,2,2, 3,3,3, 4,4,4, 5,5,5, 6,6,6, 7,7,7, 4,4,4, 5,5,5, 6,6,6, 7,7,7, 4,4,4, 5,5,5, 6,6,6, 7,7,7, 4,4,4, 5,5,5, 6,6,6, 7,7,7];
	return idx_array[this.anim_no];
};

Game_CharacterBase.prototype.getDir = function() {
	var dir_array = [2,2,2, 2,2,2, 2,2,2, 2,2,2, 4,4,4, 4,4,4, 4,4,4, 4,4,4, 6,6,6, 6,6,6, 6,6,6, 6,6,6, 8,8,8, 8,8,8, 8,8,8, 8,8,8, 2,2,2, 2,2,2, 2,2,2, 2,2,2, 4,4,4, 4,4,4, 4,4,4, 4,4,4, 6,6,6, 6,6,6, 6,6,6, 6,6,6, 8,8,8, 8,8,8, 8,8,8, 8,8,8];
	return dir_array[this.anim_no];
};

Game_CharacterBase.prototype.getStp = function() {
	var stp_array = [0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2];
	return stp_array[this.anim_no];
};

Game_CharacterBase.prototype.isLock = function() {
	return this.prominence_flg;
};

Game_CharacterBase.prototype.isLoaded = function() {
	return this.bitmap_loaded;
};

Game_CharacterBase.prototype.isAnimation = function(realMoveSpeed) {
	var array = [15,15,15,30,60,60,60];
	if ( this.anim_count > 60 / array[realMoveSpeed] ) {
		return true;
	}
	return false;
};

})();
