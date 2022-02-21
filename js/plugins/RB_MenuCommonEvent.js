//=============================================================================
// メニュー画面(メニュー、アイテム)からコモンイベントを実行するプラグイン
// RB_MenuCommonEvent.js
// 作成者     : 龍尾
// 作成日     : 2018/03/28
// 最終更新日 : 2020/11/08
// バージョン : v1.2 装備画面でも動くように追記
//            : v1.1 戦闘中に呼ばれた場合に処理しないように修正
//                   アイテム残数0の場合にactorWindowを閉じる処理を削除
//            : v1.0 初版
//=============================================================================
/*:ja
 * @plugindesc メニュー画面からコモンイベントを実行する
 * @author 龍尾
 *
 * @help
 *-----------------------------------------------------------------------------
 * 概要
 *-----------------------------------------------------------------------------
 * メニュー画面上(メニュー画面、アイテム画面でのアイテム使用時)に、
 * 設定したコモンイベントを実行できるようにします。
 *
 * (注)このプラグインで実行するコモンイベントでは、
 *     メッセージウィンドウやピクチャー表示は行えません。
 *
 * フトコロ(futokoro)様作のFTKR_MenuEvent.jsを参考にさせて頂きました。
 * https://github.com/futokoro/RPGMaker/blob/master/README.md
 *
 *-----------------------------------------------------------------------------
 * コモンイベントの設定方法
 *-----------------------------------------------------------------------------
 * メニュー画面でコモンイベントを実行する際、コモンイベントの最後に、
 * 必ず状況に応じた以下のプラグインコマンドを追加してください。
 * 
 * 1.アクターを選択するアイテムからコモンイベント呼ぶ場合
 *     ACTIVATE_ACTOR_WINDOW
 * 
 * 2.アクターを選択しないアイテムからコモンイベント呼ぶ場合
 *     ACTIVATE_ITEM_WINDOW
 * 
 * 3.メニューのステータスウィンドウを更新する場合
 *     REFRESH_STATUS_WINDOW
 * 
 */
(function() {

	//=============================================================================
	// DataManager
	//=============================================================================
	var _RB_MCE_DataManager_createGameObjects = DataManager.createGameObjects;
	DataManager.createGameObjects = function() {
		_RB_MCE_DataManager_createGameObjects.call(this);
		$gameMenu = new Game_Menu();
	};

	//=============================================================================
	// プラグインコマンド
	//=============================================================================
	var _RB_MCE_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_RB_MCE_Game_Interpreter_pluginCommand.call(this, command, args);
		switch (command) {
		case 'ACTIVATE_ACTOR_WINDOW':
				if ($gameParty.inBattle()) break;

				SceneManager._scene._actorWindow.refresh();
				SceneManager._scene._itemWindow.refresh();
				SceneManager._scene._actorWindow.activate();
				break;
/*
 *アイテム残数で処理変えることを中止
				if (!$gameParty.hasItem(SceneManager._scene.item())) {
					SceneManager._scene._actorWindow.hide();
					SceneManager._scene._itemWindow.refresh();
					SceneManager._scene._itemWindow.activate();
				} else {
					SceneManager._scene._actorWindow.refresh();
					SceneManager._scene._itemWindow.refresh();
					SceneManager._scene._actorWindow.activate();
				}
				break;
*/

		case 'ACTIVATE_ITEM_WINDOW':
				if ($gameParty.inBattle()) break;
				SceneManager._scene._itemWindow.refresh();
				SceneManager._scene._itemWindow.activate();
				break;

		case 'REFRESH_STATUS_WINDOW':
				SceneManager._scene._statusWindow.refresh();
		}
	};

	//=============================================================================
	// メニュー画面でコモンイベントを動かすためのクラス
	// Game_Menu
	//=============================================================================
	function Game_Menu() {
		this.initialize.apply(this, arguments);
	}

	Game_Menu.prototype.initialize = function() {
		this._interpreter = new Game_Interpreter();
		this._active = false;
	};

	Game_Menu.prototype.update = function(sceneActive) {
		if (sceneActive) {
			this._active = true;
			this.updateInterpreter();
		} else {
			this._active = false;
		}
	};

	Game_Menu.prototype.updateInterpreter = function() {
		for (;;) {
			this._interpreter.update();
			if (this._interpreter.isRunning()) {
				return;
			}
			if (!this.setupStartingEvent()) {
				return;
			}
		}
	};

	Game_Menu.prototype.setupStartingEvent = function() {
		if (this._interpreter.setupReservedCommonEvent()) {
			return true;
		}
		return false;
	};

	//=============================================================================
	// アイテム画面用設定
	//=============================================================================
	var _RB_MCE_Scene_ItemBase_prototype_update = Scene_ItemBase.prototype.update;
	Scene_ItemBase.prototype.update = function() {
		this.updateMain();
		_RB_MCE_Scene_ItemBase_prototype_update.call(this);
	};

	Scene_ItemBase.prototype.updateMain = function() {
		var active = this.isActive();
		$gameMenu.update(active);
		$gameScreen.update();
	};

	Scene_ItemBase.prototype.checkCommonEvent = function() {
		if ($gameTemp.isCommonEventReserved()) {
			this._itemWindow.deactivate();
			this._actorWindow.deactivate();
		} else {
//			SceneManager.goto(Scene_Map);
		}
	};

	var _RB_MCE_Scene_ItemBase_activateItemWindow = Scene_ItemBase.prototype.activateItemWindow;
	Scene_ItemBase.prototype.activateItemWindow = function() {
		this._itemWindow.refresh();
		if (!$gameTemp.isCommonEventReserved()) {
			_RB_MCE_Scene_ItemBase_activateItemWindow.call(this);
		}
	};

	//=============================================================================
	// メニュー画面用設定
	//=============================================================================
	var _RB_MCE_Scene_Menu_prototype_update = Scene_Menu.prototype.update;
	Scene_Menu.prototype.update = function() {
		_RB_MCE_Scene_Menu_prototype_update.call(this);
	};

	Scene_Menu.prototype.updateMain = function() {
		var active = this.isActive();
		$gameMenu.update(active);
		$gameScreen.update();
	};

	//=============================================================================
	// 装備画面用設定
	//=============================================================================
	var _RB_MCE_Scene_Equip_prototype_update = Scene_Equip.prototype.update;
	Scene_Equip.prototype.update = function() {
		this.updateMain();
		_RB_MCE_Scene_Equip_prototype_update.call(this);
	};

	Scene_Equip.prototype.updateMain = function() {
		var active = this.isActive();
		$gameMenu.update(active);
		$gameScreen.update();
	};

})();
