//=============================================================================
// Save/Load時のFile枠を1個減らすプラグイン
// RB_Savefile1less.js
// 作成者     : 龍尾
// 作成日     : 2019/07/14
// バージョン : v1.0 初版
//=============================================================================
/*:ja
 * @plugindesc Save/Load時のFile枠を1個減らす
 * @author 龍尾
 *
 * @help
 *-----------------------------------------------------------------------------
 * 概要
 *-----------------------------------------------------------------------------
 * Save/Load時のFile枠を1個減らします。
 * DataManager.maxSavefiles自体の値は変えていません。
 *
 * このプラグインには、プラグインコマンドはありません。
 *
 */
(function() {

//-----------------------------------------------------------------------------
// Window_SavefileList
//
// The window for selecting a save file on the save and load screens.

	Window_SavefileList.prototype.maxItems = function() {
		return DataManager.maxSavefiles() - 1;
	};

})();
