//=============================================================================
// パーティ対応ステータス画面立ち絵表示プラグイン
// RB_StatusPicture_Multi.js
// 作成者     : 龍尾
// 作成日     : 2019/10/19
// 最終更新日 : 2019/11/21
// バージョン : v1.4 RB_LuckCritical.jsとの共有のため修正
// バージョン : v1.3 多数のスイッチに対応させるためにファイル名付与形式に変更
// バージョン : v1.2 Actor1以外にもスイッチ適用してたバグ修正
// バージョン : v1.1 ステータス立ち絵変更スイッチに対応
//                   自己紹介スペース追加
// バージョン : v1.0 初版
//=============================================================================
/*:ja
 * @plugindesc ステータス画面で、身体防具により異なる立ち絵を表示します。
 * @author 龍尾
 *
 * @param picture_x
 * @desc 立ち絵表示の始点(X座標)
 * @default 0
 *
 * @param picture_y
 * @desc 立ち絵表示の始点(Y座標)
 * @default 0
 *
 * @param fontsize
 * @desc 文字フォントサイズ
 * @default 24
 *
 * @param lineheight
 * @desc 文字1行の高さ
 * @default 30
 *
 * @param DebugFlag
 * @type boolean
 * @on YES
 * @off NO
 * @desc デバッグ用のコンソール出力(YES/NO)
 * @default false
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 * アクターID1の場合のみ身体防具により異なる立ち絵を表示。
 * 身体防具を追加する場合は、RB_StsPct_ATBLに追加してください。
 * アクターID1以外を追加する場合は、RB_StsPct_TBLに追加してください。
 * アーマーブレイクの割合は、RB_AB_TBLを変更してください。
 *
 * アクターID1の防具をスイッチで切り替えるには RB_StsPct_RULETBL に
 * 対応するスイッチと、OFF/ON時の付与ファイル名を記載してください。
 * 最終的な立ち絵ファイル名は、RB_StsPct_ATBL と RB_StsPct_RULETBL の
 * 合成したファイル名になります。
 * 例)RB_StsPct_RULETBL = [5, "_5off", "_5on"]
 *    RB_StsPct_ATBL    = ["actor1-1", "actor1-2", "actor1-3"]
 *    スイッチID5がONで、HPが5割だった場合のActor1ファイル名は
 *    actor1-2_5on になる
 *
 * 自己紹介はアクターのメモに追記してください。
 * 3行分まで表示します。1行が長いと詰めて表示します。
 * <rb_si1:自己紹介の1行目です>
 * <rb_si2:自己紹介の2行目です>
 * <rb_si3:自己紹介の3行目です>
 */
(function() {

	var VocabEVA = "回避";
	var VocabMEV = "魔法回避";
	var VocabHIT = "命中";
	var VocabCRI = "クリティカル";

	// アーマーブレイクHP閾値配列
	var RB_AB_TBL = [0.70, 0.40, 0];

	// ステータス画面立ち絵表示用配列
	// (Actor1専用スイッチ式ファイル名付与)                        // スイッチID,OFF時の付与ファイル名,ON時の付与ファイル名
	var RB_StsPct_RULETBL = [ [ 217, "_01", "_02"],        // スイッチ1(髪色)、金髪(OFF)、銀髪(ON)
       
	];

	// ステータス画面立ち絵表示用配列(Actor1専用)
	var RB_StsPct_ATBL = [ ["Status01_01","Status02_01","Status03_01"],    // 全裸グラ
						   ["Status01_01","Status02_01","Status03_01"],   // 身体防具ID1を装備時の立ち絵
						   ["Status01_01","Status02_01","Status03_01"],   // 身体防具ID2
						   ["Status01_01","Status02_01","Status03_01"],   // 身体防具ID3
						   ["Status01_01","Status02_01","Status03_01"],   // 身体防具ID4
						   ["Status01_01","Status02_01","Status03_01"],   // 身体防具ID5
						   ["Status01_01","Status02_01","Status03_01"],   // 身体防具ID6
                           ["Status01_01","Status02_01","Status03_01"],   // 身体防具ID7
                           ["Status01_01","Status02_01","Status03_01"],   // 身体防具ID8
                           ["Status01_01","Status02_01","Status03_01"],   // 身体防具ID9
                           ["Status01_01","Status02_01","Status03_01"],   // 身体防具ID10
                           ["Status01_01","Status02_01","Status03_01"],   // 身体防具ID11
                           ["Status01_01","Status02_01","Status03_01"],   // 身体防具ID12
                           ["StatusDianaB1","StatusDianaB2","StatusDianaB3"],   // 身体防具ID13
                           ["StatusDianaB1","StatusDianaB2","StatusDianaB3"],   // 身体防具ID14
                           ["StatusDianaB1","StatusDianaB2","StatusDianaB3"],   // 身体防具ID15
                           ["StatusDianaB1","StatusDianaB2","StatusDianaB3"],   // 身体防具ID16
                           ["StatusDianaB1","StatusDianaB2","StatusDianaB3"],   // 身体防具ID17
                           ["StatusDianaB1","StatusDianaB2","StatusDianaB3"],   // 身体防具ID18
                           ["StatusDianaB1","StatusDianaB2","StatusDianaB3"],   // 身体防具ID19
                           ["StatusDianaB1","StatusDianaB2","StatusDianaB3"],   // 身体防具ID20
                           ["StatusDianaB1","StatusDianaB2","StatusDianaB3"],   // 身体防具ID21
                           ["StatusDianaB1","StatusDianaB2","StatusDianaB3"],   // 身体防具ID22         
						   ["StatusDianaN1","StatusDianaN2","StatusDianaN3"],   // 身体防具ID23
	];

	// ステータス画面立ち絵表示用配列(Actor1を除く)
	var RB_StsPct_TBL = [ [ , , ],										    // Actor 0枠(空欄のまま)
						  [ , , ],										    // Actor 1枠(空欄のまま)
						  ["Status_Helen1", "Status_Helen2", "Status_Helen3"],    // Actor 2枠
						  ["Status_Ellis1", "Status_Ellis2", "Status_Ellis3"],    // Actor 3枠
						  ["Status_sayo1", "Status_sayo2", "Status_sayo3"],    // Actor 4枠(HP差分ないキャラは全部同じ画像を指定)
						  ["Status_Helen1", "Status_Helen2", "Status_Helen3"],										    // Actor 5枠(空欄だと絵表示自体しない)
						  ["Status_Ellis1", "Status_Ellis2", "Status_Ellis3"],										    // Actor 6枠
						  ["Status_sayo1", "Status_sayo2", "Status_sayo3"],										    // Actor 7枠
						  ["Status_Chryse1", "Status_Chryse2", "Status_Chryse3"],										    // Actor 8枠
						  [ , , ],										    // Actor 9枠
						  ["Actor10_1_bg", "Actor10_2_bg", "Actor10_3_bg"], // Actor10枠
	];
	var parameters = PluginManager.parameters('RB_StatusPicture_Multi');
	var rb_picture_x  = JSON.parse(parameters['picture_x']       ||  0);
	var rb_picture_y  = JSON.parse(parameters['picture_y']       ||  0);
	var rb_fontsize   = JSON.parse(parameters['fontsize']        || 24);
	var rb_lineheight = JSON.parse(parameters['lineheight']      || 30);
	var rb_debug_flag = JSON.parse(parameters['DebugFlag']);

	//HP閾値による表示画像のテーブル位置選択
	rb_armorBreakElement = function(hpRate) {
		for(var element = 0; element < RB_AB_TBL.length; element++) {
			if (hpRate >= RB_AB_TBL[element]) break;
		}
		return element;
	}

	var _RB_StatusPicture_Window_Status_initialize = Window_Status.prototype.initialize;
	Window_Status.prototype.initialize = function() {
		_RB_StatusPicture_Window_Status_initialize.call(this);
		this.createSprites();
	};

	Window_Status.prototype.lineHeight = function() {
		return rb_lineheight;
	};

	Window_Status.prototype.createSprites = function()
	{
		this._pictureSprite = new Sprite();
		this._pictureSprite.anchor.x = 0;
		this._pictureSprite.anchor.y = 0;
		this._pictureSprite.visible = false;
		this.addChild(this._pictureSprite);
	};

	Window_Status.prototype.refresh = function() {
		this.contents.clear();
		if (this._actor) {
			var lineHeight = this.lineHeight();
			this.drawBlock1  (lineHeight * 0);
			this.drawHorzLine(lineHeight * 1);
			this.drawBlock2  (lineHeight * 2);
			this.drawBlock3  (lineHeight * 7);
			this.drawHorzLine(lineHeight * 19);
			this.drawBlock4  (lineHeight * 20);

		}
	};

	// NAME、職業、NickName
	Window_Status.prototype.drawBlock1 = function(y) {
		this.drawActorName(this._actor, 4, y);
		this.drawActorClass(this._actor, 170, y);
		this.drawActorNickname(this._actor, 288, y);
	};

	// LV、HPMPバー、経験値、立ち絵
	Window_Status.prototype.drawBlock2 = function(y) {
		this.drawBasicInfo(4, y);
		this.drawExpInfo(138+42, y);
		this.drawActorIllust(rb_picture_x, rb_picture_y);
	};

	// ステータス、装備品
	Window_Status.prototype.drawBlock3 = function(y) {
		this.drawParameters(4, y);
		this.drawSlotName(250, y);
		this.drawEquipments(274, y + this.lineHeight());
	};

	// 自己紹介
	Window_Status.prototype.drawBlock4 = function(y) {
		var actor = this._actor;
		var actId = actor.actorId();
		var lineHeight = this.lineHeight();
		this.drawText("自己紹介", 4, y);
		this.drawText($dataActors[actId].meta['rb_si1'], 4, y + lineHeight*1, 512);
		this.drawText($dataActors[actId].meta['rb_si2'], 4, y + lineHeight*2, 512);
		this.drawText($dataActors[actId].meta['rb_si3'], 4, y + lineHeight*3, 512);
	};

	// LV, HP, MP
	Window_Status.prototype.drawBasicInfo = function(x, y) {
		var lineHeight = this.lineHeight();
		this.contents.fontSize = rb_fontsize;
		this.drawActorLevel(this._actor, x, y + lineHeight * 0);
		this.drawActorHp(this._actor, x, y + lineHeight * 2.0, 220);
		this.drawActorMp(this._actor, x, y + lineHeight * 3.0, 220);
	};

	// 現在経験値、NEXT経験値
	Window_Status.prototype.drawExpInfo = function(x, y) {
		var lineHeight = this.lineHeight();
		var expTotal = TextManager.expTotal.format(TextManager.exp);
		var expNext  = TextManager.expNext.format(TextManager.level);
		var value1 = this._actor.currentExp();
		var value2 = this._actor.nextRequiredExp();
		if (this._actor.isMaxLevel()) {
			value1 = '-------';
			value2 = '-------';
		}
		this.contents.fontSize = rb_fontsize;
		this.changeTextColor(this.systemColor());
		this.drawText(expTotal, x + 70, y + lineHeight * 0, 180);
		this.drawText(expNext,  x + 70, y + lineHeight * 2, 180);
		this.resetTextColor();
		this.drawText(value1, x, y + lineHeight * 1, 200, 'right');
		this.drawText(value2, x, y + lineHeight * 3, 200, 'right');
	};

	// パラメータ
	Window_Status.prototype.drawParameters = function(x, y) {
		var lineHeight = this.lineHeight();
		for (var i = 0; i < 10; i++) {
			this.drawActorParam(x, y + lineHeight * i, i + 2);
		}
	};

	// 各パラメータ
	Window_Status.prototype.drawActorParam = function(x, y, paramId) {
		switch (paramId) {
		//攻撃力,防御力,魔法力,魔法防御力,敏捷性,運
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
			var paramName  = TextManager.param(paramId);
			var paramValue = this._actor.param(paramId);
			break;
		case 8: //物理回避率
			var paramName  = VocabEVA;
			var paramValue = this._actor.eva * 100;
			break;
		case 9: //魔法回避率
			var paramName  = VocabMEV;
			var paramValue = this._actor.mev * 100;
			break;
		case 10: //命中率
			var paramName  = VocabHIT;
			var paramValue = this._actor.hit * 100;
			break;
		case 11: //クリティカル率
			var paramName  = VocabCRI;
//			var paramValue = this._actor.cri * 100;
			var paramValue = rb_luckCriticalColc(this._actor.cri, this._actor.luk);
			break;
		}
		paramValue =  Math.floor(paramValue);
		this.contents.fontSize = rb_fontsize;
		this.changeTextColor(this.systemColor());
		this.drawText(paramName, x, y, 160);
		this.resetTextColor();
		this.drawText(paramValue, x + 160, y, 60, 'right');
	};

	// RB_LuckCritical.jsとの共有のため
	rb_luckCriticalColc = function(cri, luk) {
		console.log("No RB_LuckCritical.js");
		return cri * 100;
	}

	// 装備スロット名
	Window_Status.prototype.drawSlotName = function(x, y) {
		var lineHeight = this.lineHeight();
		var slots = this._actor.equipSlots();
		var count = slots.length;
		for (var i = 0; i < count; i++) {
		var y2 = y + lineHeight * i * 2;
			this.contents.fontSize = rb_fontsize;
			this.changeTextColor(this.systemColor());
			this.drawText($dataSystem.equipTypes[slots[i]], x, y2, 200);
		}
	};

	// 装備アイテム名(Icon付)
	Window_Status.prototype.drawEquipments = function(x, y) {
		var lineHeight = this.lineHeight();
		var equips = this._actor.equips();
		var count = equips.length;
		for (var i = 0; i < count; i++) {
			var y2 = y + lineHeight * i * 2 - 3;
			this.contents.fontSize = rb_fontsize;
			this.resetTextColor();
			this.drawItemName(equips[i], x, y2);
		}
	};

	// Actor1用立ち絵ファイル名合成
	RB_StatusPicture_a1MargeFname = function(fname) {
		for (var i = 0; i < RB_StsPct_RULETBL.length; i++) {
			// スイッチ状態取得
			var sval = $gameSwitches.value(RB_StsPct_RULETBL[i][0]);
			// Actor1ファイル名合成
			fname += (sval == false) ? RB_StsPct_RULETBL[i][1] : RB_StsPct_RULETBL[i][2];
		}
		if (rb_debug_flag) console.log("RB_StatusPicture_Multi: " + fname);
		return fname;
	}

	// 立ち絵テーブル取得
	RB_StatusPicture_grpTbl = function(aid) {
		var tbl = (aid == 1) ? RB_StsPct_ATBL : RB_StsPct_TBL;
		return tbl;
	}

	// 立ち絵ファイル名取得
	RB_StatusPicture_grpSet = function(aid, eid, element) {
		var tbl = RB_StatusPicture_grpTbl(aid);
		var fname = "";
		if (aid == 1) { 
			fname = RB_StatusPicture_a1MargeFname(tbl[eid][element]);
		} else {
			fname = tbl[aid][element];
		}
		return fname;
	}

	// 立ち絵表示
	Window_Status.prototype.drawActorIllust = function(x, y) {
		var actor = this._actor;
		var hpRate  = actor.hpRate();
		var element = rb_armorBreakElement(hpRate);
		var bitmapName ="";
		var actId = actor.actorId();

		if (actId == 1) {
			// 身体防具IDによりグラフィック変更
		    var equips = actor.equips();
			// 表示する立ち絵NAMEを指定
			if (equips[3] == null) {
				// 全裸グラ表示
				bitmapName = RB_StatusPicture_grpSet(actId, 0, element);
			} else if (equips[3].id < RB_StatusPicture_grpTbl(actId).length) {
				// 身体ID毎のグラ表示
				bitmapName = RB_StatusPicture_grpSet(actId, equips[3].id, element);
			} else {
				// 全裸グラ表示(異常処理)
				bitmapName = RB_StatusPicture_grpSet(actId, 1, element);
				console.log("龍尾ERROR:RB_StsPct_ATBLを超えた身体IDが装備されました");
			}
		} else if (actId < RB_StatusPicture_grpTbl(actId).length) {
			//Actor1以外用処理
			bitmapName = RB_StatusPicture_grpSet(actId, actId, element);
		} else {
			//異常系処理
			console.log("ERROR:ActorID(" + actId + ")が、RB_StsPct_TBLの定義数を超えてます");
		}

		// 表示する立ち絵設定
		this._pictureSprite.bitmap = ImageManager.loadPicture(bitmapName);
		this._pictureSprite.x = x;
		this._pictureSprite.y = y;
		this._pictureSprite.visible = true;
	};

})();
