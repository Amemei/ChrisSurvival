//=============================================================================
// 釣り可否判定プラグイン
// RB_Fishing.js
// 作成者     : 龍尾
// 作成日     : 2020/07/26
// バージョン : v1.0 初版
//=============================================================================
/*:ja
 * @plugindesc プレイヤーの現在地とリージョンIDから釣り可否判定を実行する
 * @author 龍尾
 *
 * @param fishOnSwitch
 * @desc 釣果スイッチID
 * @type number
 * @min 0
 * @default 1
 *
 * @param fishItem
 * @desc 釣り竿アイテムID
 * @type number
 * @min 0
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
 * フィールド画面で任意のキーを押下した際に、プラグインコマンドで呼び出して貰い、
 * その場で釣りが可能かを判定する。
 * 釣り可能となるための判定条件は以下の通り
 * ・釣り竿アイテムIDを所持していること
 * ・プレイヤー現在値のリージョンIDと、プレイヤーの向きが一致すること
 *    リージョンID   プレイヤーの向き
 *         1             右
 *         2             下
 *         3             左
 *         4             上
 *         5             右or下
 *         6             下or左
 *         7             左or上
 *         8             上or右
 *         9             右or下or左
 *        10             下or左or上
 *        11             右or左or上
 *        12             右or下or上
 * ・釣り可能と判定した場合、釣果スイッチIDをONにする
 *
 * プラグインコマンド:
 *   RB_FISHING         # その場で釣り可否判定を実施する
 */
(function() {

	var parameters = PluginManager.parameters('RB_Fishing');
	var rb_fishOnSwitch = JSON.parse(parameters['fishOnSwitch'] || 1);
	var rb_fishItem     = JSON.parse(parameters['fishItem']     || 1);
	var rb_debug_flag   = JSON.parse(parameters['DebugFlag']);

	//=============================================================================
	// プラグインコマンド
	//=============================================================================
	var _RB_FISH_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_RB_FISH_Game_Interpreter_pluginCommand.call(this, command, args);
		switch (command) {
		case 'RB_FISHING':
			rb_fishing();
			break;
		}
	};

	//=============================================================================
	// 釣り可否判定
	//=============================================================================
	rb_fishing = function() {
		// 釣りアイテム所持チェック
		if (!$gameParty.hasItem($dataItems[rb_fishItem])) {
		if (rb_debug_flag) console.log("釣り道具持ってない");
			return;
		}

		var reginId = $gameMap.regionId($gamePlayer.x, $gamePlayer.y);
		var direction = $gamePlayer.direction();

		if (direction == 2) {
			// 下向き
			if (reginId == 2 || reginId == 5 || reginId == 6 || reginId == 9 || reginId == 10 || reginId == 12) {
				$gameSwitches.setValue(rb_fishOnSwitch, true);
			} else {
				$gameSwitches.setValue(rb_fishOnSwitch, false);
			}
		} else if (direction == 4) {
			// 左向き
			if (reginId == 13 || reginId == 6 || reginId == 7 || reginId == 9 || reginId == 10 || reginId == 11) {
				$gameSwitches.setValue(rb_fishOnSwitch, true);
			} else {
				$gameSwitches.setValue(rb_fishOnSwitch, false);
			}
		} else if (direction == 6) {
			// 右向き
			if (reginId == 14 || reginId == 5 || reginId == 8 || reginId == 9 || reginId == 11 || reginId == 12) {
				$gameSwitches.setValue(rb_fishOnSwitch, true);
			} else {
				$gameSwitches.setValue(rb_fishOnSwitch, false);
			}
		} else if (direction == 8) {
			// 上向き
			if (reginId == 4 || reginId == 7 || reginId == 8 || reginId == 10 || reginId == 11 || reginId == 12) {
				$gameSwitches.setValue(rb_fishOnSwitch, true);
			} else {
				$gameSwitches.setValue(rb_fishOnSwitch, false);
			}
		}
		if (rb_debug_flag) console.log("向き:"+ direction + ",Rコード:" + reginId + ",SW(" + rb_fishOnSwitch +  "):" + $gameSwitches.value(rb_fishOnSwitch));
	}

})();
