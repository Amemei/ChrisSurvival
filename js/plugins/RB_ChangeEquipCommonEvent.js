//=============================================================================
// 装備変更時にコモンイベントを呼ぶプラグイン
// RB_ChangeEquipCommonEvent.js
// 作成者     : 龍尾
// 作成日     : 2020/11/08
// バージョン : v1.0 初版
//=============================================================================
/*:ja
 * @plugindesc 装備変更時に指定されたコモンベントを呼ぶ
 * @author 龍尾
 *
 * @param CommonEventID
 * @desc ID
 * @type switch
 * @default 1
 *
 * @param DebugFlag
 * @type boolean
 * @on YES
 * @off NO
 * @desc デバッグ用のコンソール出力(YES/NO)
 * @default false
 *
 * @help
 *-----------------------------------------------------------------------------
 * 概要
 *-----------------------------------------------------------------------------
 *
 * プラグインコマンド:
 */
(function() {

	var parameters = PluginManager.parameters('RB_ChangeEquipCommonEvent');
	var CommonEventID = JSON.parse(parameters['CommonEventID'] || 1);
	var rb_debug_flag   = JSON.parse(parameters['DebugFlag']);

    //=============================================================================
    // Game_Actor
    //  装備が変更された際のスイッチ、変数制御を追加定義します。
    //=============================================================================
    var _RB_Game_Actor_changeEquip      = Game_Actor.prototype.changeEquip;
    Game_Actor.prototype.changeEquip = function(slotId, item) {
        _RB_Game_Actor_changeEquip.apply(this, arguments);

		if (CommonEventID > 0) {
			$gameTemp.reserveCommonEvent(CommonEventID);
		}
    };

})();
