//=============================================================================
// ゲーム終了コマンド追加プラグイン
// gamEnd.js
// Copyright (c) 2018 村人Ａ
//
// 2019/03/30 タイトルにコマンドを追加する他プラグインとの競合対応(龍尾)
//=============================================================================

/*:ja
 * @plugindesc このプラグインはタイトル画面にウィンドウを閉じるゲーム終了コマンドを追加します。
 * @author 村人A
 *
 * @param endName
 * @desc ゲーム終了の表記です
 * @default ゲーム終了
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * 「endName」にはタイトルで表記するゲーム終了のコマンド名を入れてください。
 */

(function() {
	
    var parameters = PluginManager.parameters('gameEnd');
    var EndName = String(parameters['endName'] || 'ゲーム終了');
	console.log(parameters['endName'])

	// 龍尾 makeCommadListを追加型に変更
	var Window_TitleCommand_makeCommandList =
		Window_TitleCommand.prototype.makeCommandList;

	Window_TitleCommand.prototype.makeCommandList = function() {
		Window_TitleCommand_makeCommandList.call(this);
		this.addCommand(EndName,   'gameEnd');
	};
	

	// 龍尾 createCommandWindowを追加型に変更
    var Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;

	Scene_Title.prototype.createCommandWindow = function() {
        Scene_Title_createCommandWindow.call(this);
		this._commandWindow.setHandler('gameEnd',  this.commandGameEnd.bind(this));
	};
	
	Scene_Title.prototype.commandGameEnd = function() {
		if(StorageManager.isLocalMode()){
			window.close();
		} else {
			window.open('about:blank', '_self').close();
		}
	};
})();