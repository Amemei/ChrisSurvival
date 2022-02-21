//=============================================================================
// 会心率の基準値を運に影響するよう改造するプラグイン
// RB_LuckCritical.js
// 作成者     : 龍尾
// 作成日     : 2018/03/07
// 最終更新日 : 2018/03/07
// バージョン : v1.0 初版
//=============================================================================
/*:ja
 * @plugindesc 会心率基準値改造(運)
 * @author 龍尾
 *
 * @param cri_rate
 * @desc 会心率の変更基準値(%)
 * @default 5
 *
 * @param debug_flag
 * @desc デバッグ用のコンソール出力(on/off)
 * @default off
 *
 * @help
 *-----------------------------------------------------------------------------
 * 概要
 *-----------------------------------------------------------------------------
 * 会心率の基準値を、運×cri_rate(%)にするようにします。
 * その値に、その他要素(装備、スキル、ステート)による会心率を加算し、
 * 最終的な会心率として算出します。
 *
 * このプラグインには、プラグインコマンドはありません。
 *
 */
(function() {

	var parameters = PluginManager.parameters('RB_LuckCritical');
	var rb_cri_rate   = parseInt(parameters['cri_rate']   || 5) / 100;
	var rb_debug_flag = String(  parameters['debug_flag'] || 'off');

	var RB_Game_Action_prototype_itemCri = Game_Action.prototype.itemCri;
	Game_Action.prototype.itemCri = function(target) {
		var new_cri = (this.subject().luk * rb_cri_rate) / 100;
		var last_cri = new_cri + this.subject().cri;
		if (rb_debug_flag == 'on') {
			console.log("--------RB_LuckCritical(" + this.subject()._name + ")--------");
			console.log("原本cri:" + this.subject().cri);
			console.log("　　luk:" + this.subject().luk);
			console.log("新型cri:" + new_cri + "[(" + this.subject().luk + "*" + rb_cri_rate + ")/100]");
			console.log("最終cri:" + last_cri + "[" + new_cri + "+" + this.subject().cri + "]");
		}

		return this.item().damage.critical ? last_cri * (1 - target.cev) : 0;
	};

})();
