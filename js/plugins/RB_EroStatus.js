//=============================================================================
// エロステータスウィンドウを表示するプラグイン
// RB_EroStatus.js
// 作成者     : 龍尾
// 作成日     : 2018/03/20
// 最終更新日 : 2021/09/06
// バージョン : v3.2 状態異常表示個数を可変に変更
// バージョン : v3.1 状態異常テキストウィンドウを追加
// バージョン : v3.0 立ち絵を重ね合わせ可能に変更
// バージョン : v2.2 状態異常表示枠を4行に縮小
// バージョン : v2.1 状態異常をウィンドウ化
//                   設定した状態異常の中で発症中の物のみ表示
// バージョン : v2.0 1024*768対応
//                   中央立ち絵の切替機能
// バージョン : v1.0 初版
//=============================================================================
/*:ja
 * @plugindesc エロステータスウィンドウ表示
 * @author 龍尾
 *
 * @param picture_x
 * @desc 立ち絵表示の始点(X座標)
 * @type number
 * @min 0
 * @default 352
 *
 * @param picture_y
 * @desc 立ち絵表示の始点(Y座標)
 * @type number
 * @min 0
 * @default 0
 *
 * @param badtext_x
 * @desc 状態異常テキストウィンドウの始点(Y座標)
 * @type number
 * @min 0
 * @default 350
 *
 * @param badtext_y
 * @desc 状態異常テキストウィンドウの始点(Y座標)
 * @type number
 * @min 0
 * @default 600
 *
 * @param badtext_width
 * @desc 状態異常テキストウィンドウの幅
 * @type number
 * @min 0
 * @default 300
 *
 * @param badtext_height
 * @desc 状態異常テキストウィンドウの高さ
 * @type number
 * @min 0
 * @default 100
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
 * メニュー画面にコマンドを追加し、新規のステータスウィンドウを表示します。
 * 背景画像を変更したい場合        ：RB_Eros_Picture
 * 状態異常背景画像を変更したい場合：RB_Eros_BadPicture
 * コマンド名を変更したい場合      ：RB_Eros_Command
 * 状態異常テキストのウィンドウ枠  ：RB_Eros_BadTextMeg
 *
 * 立ち絵変更用変数を変えたい場合、RB_EroS_PicVAL を変更してください
 *
 * ステータス画面に表示する文言及び参照する変数IDは、
 * RB_EroS_Dataに記載して下さい。
 *
 * 立ち絵をスイッチで切り替えるには RB_Eros_RULETBL に
 * 対応するスイッチと、OFF/ON時の付与ファイル名を記載してください。
 * 例)RB_Eros_RULETBL = [5, "SW5_off", "SW5_on"]
 *    RB_EroS_PicTBL  = [100, 200, 999],
 *                      ["actor1-1", "actor1-2", "actor1-3"]
 *    スイッチID5がONで、立ち絵変更用変数の値が120だった場合、
 *    「actor1-2」 と 「SW5_on」 の画像を重ねた立ち絵になる。
 *
 * 状態異常背景画像サイズは 255*232 です。
 * 状態異常ウィンドウに表示したいステータスIDは、RB_EroS_BadTBL に記載してください。
 *
 *
 * 状態異常時に表示させたいテキストがあれば、ステートメモに記載してください。
 * <RB_EroS_Text:表示させたい文言>
 * テキスト内に「\n」を入れることで改行できるようにするには、
 * トリアコンタン様の UsableCarriageReturn.js が必要です
 *
 * 状態異常テキストを、変数値で切り替えたい場合以下のように記載してください。
 * 例) <RB_EroS_Val:16>
 *     <RB_EroS_Lmt:25,50,75>
 *     <RB_EroS_Text1:変数100未満なら表示されるテキスト>
 *     <RB_EroS_Text2:変数100～200未満なら表示されるテキスト>
 *     <RB_EroS_Text3:変数200～300未満なら表示されるテキスト>
 *
 * このプラグインには、プラグインコマンドはありません。
 *
 */
(function() {

	RB_EroS_fontsize   = 26;
	RB_EroS_LvColor    = '#ffff00';
	RB_Eros_Picture    = "Hstatus1";
	RB_Eros_Command    = "色情状态板";
	RB_Eros_BadPicture = "BadStatus_BackImage";

	RB_EroS_BadTextfontsize = 20;
	RB_Eros_BadTextMeg = "Window_Message";

	// エロステータス立ち絵変更用変数ID
	var RB_EroS_PicVAL = 16;

	// エロステータス画面立ち絵変更用閾値＆ファイル名配列
	var RB_EroS_PicTBL = [ [25, 50, 75],
						   ["Hstatus_Base1", "Hstatus_Base2", "Hstatus_Base3"]
	];

	// エロステータス画面状態異常表示ステータス配列
	var RB_EroS_BadTBL = [15,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,188,189];

	// エロステータス画面立ち絵表示用配列
	var RB_Eros_RULETBL = [ [ 201,                                                      // SW番号
							  "",                             "1Botebata",  // 閾値100以下OFF、閾値100以下ON
							  "",                             "1Botebata",  // 閾値300以下OFF、閾値300以下ON
							  "",                             "1Botebata",  // 閾値301以下OFF、閾値301以下ON
							],
							[ 202,                                                                 // SW番号
							  "2Oppai1",       "2Oppai1", // 閾値1以下OFF、閾値1以下ON
							  "2Oppai1",       "2Oppai1", // 閾値2以下OFF、閾値2以下ON
							  "2Oppai1",       "2Oppai1", // 閾値2以下OFF、閾値2以下ON
							],
							[ 217,
							  "2Oppai1", "2Oppai2",
							  "2Oppai1", "2Oppai2",
							  "2Oppai1", "2Oppai2",
							],
							[ 203,
							  "", "4Inmon_N",
							  "", "4Inmon_N",
							  "", "4Inmon_N",
							],  
							[ 204,
							  "", "4Inmon_B",
							  "", "4Inmon_B",
							  "", "4Inmon_B",
							], 
							[ 201,
							  "3Garter_Normal",       "3Garter_NormalB",
							  "3Garter_Normal",       "3Garter_NormalB",
							  "3Garter_Base3",        "3Garter_Base3B",
							  
							],
						    [ 205,
							  "", "5Rakugaki1",
							  "", "5Rakugaki1",
							  "", "5Rakugaki2",
							],  
							[ 206,
							  "", "6Syokusyu",
							  "", "6Syokusyu",
							  "", "6Syokusyu",
							],  
							[ 207,
							  "", "7Syokusou1",
							  "", "7Syokusou2",
							  "", "7Syokusou3",
							],  
							[ 208,
							  "", "7Syokusou1B",
							  "", "7Syokusou2B",
							  "", "7Syokusou3B",
							],  
							[ 218,
							  "", "7Syokusou4",
							  "", "7Syokusou5",
							  "", "7Syokusou6",
							],  
							[ 219,
							  "", "7Syokusou4B",
							  "", "7Syokusou5B",
							  "", "7Syokusou6B",
							],  
							[ 209,
							  "", "8Kikkou1",
							  "", "8Kikkou1",
							  "", "8Kikkou2",
							],  
							[ 210,
							  "", "8Kikkou1B",
							  "", "8Kikkou1B",
							  "", "8Kikkou2B",
							],  
							[ 220,
							  "", "8Kikkou3",
							  "", "8Kikkou3",
							  "", "8Kikkou4",
							],  
							[ 221,
							  "", "8Kikkou3B",
							  "", "8Kikkou3B",
							  "", "8Kikkou4B",
                            ],
                            [ 211,
							  "", "9Teisou1",
							  "", "9Teisou1",
							  "", "9Teisou2",
							],  
							[ 212,
							  "", "9Teisou1B",
							  "", "9Teisou1B",
							  "", "9Teisou2B",
                            ],
                            [ 213,
							  "", "10Mekakushi",
							  "", "10Mekakushi",
							  "", "10Mekakushi",
                            ],
                            [ 214,
							  "", "11Gyagu",
							  "", "11Gyagu",
							  "", "11Gyagu",
                            ],
							[ 215,
							  "", "12Bonyuu1",
							  "", "12Bonyuu1",
							  "", "12Bonyuu1",
							],
							[ 222,
							  "", "12Bonyuu2",
							  "", "12Bonyuu2",
							  "", "12Bonyuu2",
                            ],
							[ 216,
							  "", "13Semen1",
							  "", "13Semen2",
							  "", "13Semen3",
                            ],
							[ 223,
							  "", "13Semen4",
							  "", "13Semen5",
							  "", "13Semen6",							  
							],
	];
                                                     // TID
	var RB_EroS_Data = [ ["名字:"],                  //  0
						 ["3サイズ:86/58/85"],       //  1
						 ["【第一次的对向】"      ,  6], //  2  項目名、変数ID
						 ["【状態異常】"      ,  2], //  3

						 ["　手交回数  :   回",  38], //  4
						 ["　足交回数  :   回",  39], //  5
						 ["人类経験人数:   回",   9], //  6
						 ["魔物経験人数:   回",  10], //  7
						 ["出産経験回数:   回",  11], //  8

						 ["口内射精回数:   回", 999], //  9 未使用(削除しないこと)
						 ["  外射回数  :   回", 999], // 10 未使用(削除しないこと)
						 ["膣内射精回数:   回", 999], // 11 未使用(削除しないこと)
						 ["肛門射精回数:   回", 999], // 12 未使用(削除しないこと)

						 ["口内射精量:     ml", 12], // 13
						 ["  外射量  :     ml", 13], // 14
						 ["膣内射精量:     ml", 14], // 15
						 ["肛門射精量:     ml", 15], // 16

						 ["身体感度Lv:",        16], // 17 (出力)

						 ["口内開発Lv:",        17], // 18 (出力)
						 ["  口交  :   回",     18], // 19
						 ["  亲吻  :   回",     19], // 20
						 ["精飲回数:   回",     20], // 21
						 ["口内高潮:   回",     21], // 22

						 ["乳房開発Lv:",        22], // 23 (出力)
						 ["  揉胸  :   回",     23], // 24
						 [" 捏乳头 :   回",     24], // 25
						 ["  乳交  :   回",     25], // 26
						 ["乳头高潮:   回",     26], // 27

						 ["小穴開発Lv:",        27], // 28 (出力)
						 ["  性交  :   回",     28], // 29
						 ["触手挿入:   回",     29], // 30
						 ["異物挿入:   回",     30], // 31
						 ["膣内絶頂:   回",     31], // 32

						 ["肛門開発Lv:",        32], // 33 (出力)
						 [" 后庭奸 :   回",     33], // 34
						 ["触手挿入:   回",     34], // 35
						 ["異物挿入:   回",     35], // 36
						 ["肛門高潮:   回",     36], // 37
	];

	var parameters = PluginManager.parameters('RB_EroStatus');
	var rb_picture_x  = JSON.parse(parameters['picture_x']  ||  352);
	var rb_picture_y  = JSON.parse(parameters['picture_y']  ||    0);
	var rb_badtext_x  = JSON.parse(parameters['badtext_x']  ||  350);
	var rb_badtext_y  = JSON.parse(parameters['badtext_y']  ||  600);
	var rb_badtext_width  = JSON.parse(parameters['badtext_width']  || 300);
	var rb_badtext_height = JSON.parse(parameters['badtext_height'] || 100);
	var rb_debug_flag = JSON.parse(parameters['DebugFlag']);

	//-----------------------------------------------------------------------------
	// Scene_Menu
	//-----------------------------------------------------------------------------
	var RB_EroS_Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
		Scene_Menu.prototype.createCommandWindow = function() {
		RB_EroS_Scene_Menu_createCommandWindow.call(this);
		this._commandWindow.setHandler('erostatus', this.commandEroStatus.bind(this));
	};

	Scene_Menu.prototype.commandEroStatus = function() {
	    SceneManager.push(Scene_EroStatus);
	};

	// Actor選択部分をオミット
/*
	var RB_EroS_Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
	Scene_Menu.prototype.onPersonalOk = function() {
		RB_EroS_Scene_Menu_onPersonalOk.call(this);
		switch (this._commandWindow.currentSymbol()) {
		case 'erostatus':
			SceneManager.push(Scene_EroStatus);
			break;
		}
	};
*/

	//-----------------------------------------------------------------------------
	// Window_MenuCommand
	//-----------------------------------------------------------------------------
	var RB_EroS_Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
	Window_MenuCommand.prototype.addOriginalCommands = function() {
		RB_EroS_Window_MenuCommand_addOriginalCommands.call(this);
		this.addCommand(RB_Eros_Command, 'erostatus', true);
	};

	//-----------------------------------------------------------------------------
	// Scene_EroStatus
	//-----------------------------------------------------------------------------
	function Scene_EroStatus() {
		this.initialize.apply(this, arguments);
	}

	Scene_EroStatus.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_EroStatus.prototype.constructor = Scene_EroStatus;

	Scene_EroStatus.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_EroStatus.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);

		this._ErostatusWindow = new Window_EroStatus();
		this._ErostatusWindow.setHandler('cancel',   this.popScene.bind(this));
		this._ErostatusWindow.reserveFaceImages();
		this.addWindow(this._ErostatusWindow);

		// 状態異常ウィンドウ追加
		this._BadstatusWindow = new Window_BadStatus();
		this._BadstatusWindow.setHandler('ok',       this.badTextOk.bind(this));
		this._BadstatusWindow.setHandler('cancel',   this.popScene.bind(this));
		this.addWindow(this._BadstatusWindow);

		this.createBadTextWindow();

	};

	// 状態異常ウィンドウで決定キー押下時
	Scene_EroStatus.prototype.badTextOk = function() {
		this._badStatus = this._BadstatusWindow.status();
		var ret = false;
		if(this._badStatus) {
			// 状態異常があればそのステートのメモを表示
			ret = this._badTextWindow.setup(this._badStatus);
		}
		if (ret == true) {
			this._badTextWindow.show();
			this._BadstatusWindow.activate();
		} else {
			// 状態異常がない、もしくは状態異常テキストがない場合
			// テキストウィンドウ非表示
			this._badTextWindow.hide();
			this._BadstatusWindow.activate();
		}
	};

	Scene_EroStatus.prototype.createBadTextWindow = function() {

		// 状態異常テキストウィンドウ追加
		this._badTextWindow = new Window_BadText(0, 0);
		this.hideTextWindow();
		this.addWindow(this._badTextWindow);
	};

	Scene_EroStatus.prototype.hideTextWindow = function() {
		this._badTextWindow.deactivate();
		this._badTextWindow.hide();
	};

	Scene_EroStatus.prototype.start = function() {
		Scene_MenuBase.prototype.start.call(this);
		this.refreshActor();
	};

	Scene_EroStatus.prototype.refreshActor = function() {
		var actor = this.actor();
		this._ErostatusWindow.setActor(actor);
		this._BadstatusWindow.setActor(actor);
		this._badTextWindow.setActor(actor);
//		this._BadstatusWindow.activate();
	};

	Scene_EroStatus.prototype.onActorChange = function() {
		this.refreshActor();
		this._ErostatusWindow.activate();
	};

	//-----------------------------------------------------------------------------
	// Sprite_BadWindowBackImage
	//  ウィンドウ背景画像のスプライト
	//-----------------------------------------------------------------------------
	function Sprite_BadWindowBackImage() {
		this.initialize.apply(this, arguments);
	}

	Sprite_BadWindowBackImage.prototype = Object.create(Sprite.prototype);
	Sprite_BadWindowBackImage.prototype.constructor = Sprite_BadWindowBackImage;

	Sprite_BadWindowBackImage.prototype.initialize = function(bitmap) {
		Sprite.prototype.initialize.call(this);
		this.bitmap = bitmap;
	};

	//-----------------------------------------------------------------------------
	// Sprite_EroWindowBackImage
	//  ウィンドウ背景画像のスプライト
	//-----------------------------------------------------------------------------
	function Sprite_EroWindowBackImage() {
		this.initialize.apply(this, arguments);
	}

	Sprite_EroWindowBackImage.prototype = Object.create(Sprite.prototype);
	Sprite_EroWindowBackImage.prototype.constructor = Sprite_EroWindowBackImage;

	Sprite_EroWindowBackImage.prototype.initialize = function(bitmap) {
		Sprite.prototype.initialize.call(this);
		this.bitmap = bitmap;
	};

	//-----------------------------------------------------------------------------
	// Window_BadStatus
	//-----------------------------------------------------------------------------
	function Window_BadStatus() {
		this.initialize.apply(this, arguments);
	}

	Window_BadStatus.prototype = Object.create(Window_Selectable.prototype);
	Window_BadStatus.prototype.constructor = Window_BadStatus;

	Window_BadStatus.prototype.initialize = function() {
		var width  = 255;
		var height = 302 - 70;
		Window_ItemList.prototype.initialize.call(this, 17, 190, width, height);
		this._createBackImage();
		this._actor = null;
		this.refresh();
		this.setTopRow(0);
		this.select(0);
		this.activate();
	};

	Window_BadStatus.prototype._createBackImage = function() {
		this._windowBackSprite.visible = false;
		this._windowFrameSprite.visible = false;
		var bitmap = ImageManager.loadPicture(RB_Eros_BadPicture);
		this._windowBackImageSprite = new Sprite_BadWindowBackImage(bitmap);
		this._windowSpriteContainer.addChild(this._windowBackImageSprite);

		this._backImageDx = 0;
		this._backImageDy = 0;
		this._windowBackImageSprite.scale.x = 1;
		this._windowBackImageSprite.scale.y = 1;
	};

	Window_BadStatus.prototype.maxCols = function() {
		return 1;
	};

	Window_BadStatus.prototype.spacing = function() {
		return 48;
	};

	Window_BadStatus.prototype.maxItems = function() {
//		return 5;
		// 最大値をActor1の掛かってるステータスのうちRB_EroS_BadTBLに存在する数にする
		var cnt = 0;
		for(var index = 0; index < $gameActors.actor(1)._states.length; index++) {
			var state = $gameActors.actor(1)._states[index];
			if (RB_EroS_BadTBL.includes(state)) {
				cnt++;
			}
		}
		return cnt;
	};

	Window_BadStatus.prototype.makeItemList = function() {
		this._data = [];
		for(var index = 0; index < this._actor._states.length; index++) {
			var state = this._actor._states[index];
			if (RB_EroS_BadTBL.includes(state)) {
				this._data.push(state);
			}
		}
	};

	Window_BadStatus.prototype.refresh = function() {
		if (this._actor) {
			this.makeItemList();
			this.createContents();
			this.drawAllItems();
		}
	};

	Window_BadStatus.prototype.drawItem = function(index) {
	    var item = this._data[index];
		if (item) {
			var rect = this.itemRect(index);
			rect.width -= this.textPadding();
			this.drawText($dataStates[item].name, rect.x, rect.y, rect.width, 'left');
		}
	};

	Window_BadStatus.prototype.setActor = function(actor) {
		if (this._actor !== actor) {
			this._actor = actor;
			this.refresh();
		}
	};

	Window_BadStatus.prototype.status = function() {
		return this._data[this.index()];
	};
	//-----------------------------------------------------------------------------
	// Window_BadText
	//-----------------------------------------------------------------------------
	function Window_BadText() {
		this.initialize.apply(this, arguments);
	}

	Window_BadText.prototype = Object.create(Window_Base.prototype);
	Window_BadText.prototype.constructor = Window_BadText;
	Window_BadText.prototype.initialize = function() {
		var width  = rb_badtext_width;
		var height = rb_badtext_height;
		Window_Base.prototype.initialize.call(this, rb_badtext_x, rb_badtext_y, width, height);
		this._actor = null;
		this.backOpacity = 255;
	};

	Window_BadText.prototype.loadWindowskin = function() {
		this.windowskin = ImageManager.loadSystem(RB_Eros_BadTextMeg);
	};

	Window_BadText.prototype.setup = function(index) {
		this.contents.clear();
		if (index > 0) {
			var batTextMeta;

			// メモの状態異常テキストの閾値IDと閾値が存在する場合
			if ($dataStates[index].meta.RB_EroS_Val && $dataStates[index].meta.RB_EroS_Lmt) {
				// メモの状態異常テキストの閾値IDmeta取得
				if (rb_debug_flag) console.log($dataStates[index].meta.RB_EroS_Val);
				var valId = $dataStates[index].meta.RB_EroS_Val;

				// メモの状態異常テキストの閾値meta取得
				if (rb_debug_flag) console.log($dataStates[index].meta.RB_EroS_Lmt);
				var limit = $dataStates[index].meta.RB_EroS_Lmt;
				// 閾値を配列に変換
				limit = limit.split(',');

				// 閾値により表示するテキスト選択
				var cnt;
				for (cnt = 0; cnt < limit.length; cnt++) {
					// 閾値IDの値取得
					if ($gameVariables.value(valId) < limit[cnt]) {
						cnt++;
						break;
					}
				}
				// 閾値上限オーバ対策
				cnt = (cnt >= limit.length) ? limit.length : cnt;
				console.log("閾値cnt:" + cnt);
				// 状態異常テキストのmeta決定
				batTextMeta = "RB_EroS_Text" + cnt;
			} else {
				// メモの状態異常テキストの閾値IDと閾値が存在しない場合
				// 状態異常テキストのmeta決定
				batTextMeta = "RB_EroS_Text";
			}

			// 状態異常テキスト取得
			var badText = $dataStates[index].meta[batTextMeta];
			if (rb_debug_flag) console.log(badText);
			if (badText) {
				this.resetTextColor();
				this.contents.fontSize = RB_EroS_BadTextfontsize;
				this.drawTextEx(badText, 0, 0);
				return true;
			}
		}
		return false;
	};

	Window_BadText.prototype.setActor = function(actor) {
		if (this._actor !== actor) {
			this._actor = actor;
		}
	};

	// resetFontSettingsをさせないようにする
	Window_BadText.prototype.drawTextEx = function(text, x, y) {
		if (text) {
			var textState = { index: 0, x: x, y: y, left: x };
			textState.text = this.convertEscapeCharacters(text);
			textState.height = this.calcTextHeight(textState, false);
//	        this.resetFontSettings();
			while (textState.index < textState.text.length) {
				this.processCharacter(textState);
			}
			return textState.x - x;
		} else {
			return 0;
		}
	};

	//-----------------------------------------------------------------------------
	// Window_EroStatus
	//-----------------------------------------------------------------------------
	function Window_EroStatus() {
		this.initialize.apply(this, arguments);
	}

	Window_EroStatus.prototype = Object.create(Window_ItemList.prototype);
	Window_EroStatus.prototype.constructor = Window_EroStatus;

	Window_EroStatus.prototype.initialize = function() {
		var width = Graphics.boxWidth;
		var height = Graphics.boxHeight;
		Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
		this._createBackImage();
		this._actor = null;
		this._pictureSprite = [];
		this.createSprites();
		this.refresh();
		this.activate();
	};

	Window_EroStatus.prototype._createBackImage = function() {
		this._windowBackSprite.visible = false;
		this._windowFrameSprite.visible = false;
		var bitmap = ImageManager.loadPicture(RB_Eros_Picture);
		this._windowBackImageSprite = new Sprite_EroWindowBackImage(bitmap);
		this._windowSpriteContainer.addChild(this._windowBackImageSprite);

		this._backImageDx = 0;
		this._backImageDy = 0;
		this._windowBackImageSprite.scale.x = 1;
		this._windowBackImageSprite.scale.y = 1;
	};

	Window_EroStatus.prototype.setActor = function(actor) {
		if (this._actor !== actor) {
			this._actor = actor;
			this.refresh();
		}
	};

	Window_EroStatus.prototype.createSprites = function()
	{
		// ベースとSW分のSpriteをまとめて定義
		for (var i = 0; i <= RB_Eros_RULETBL.length; i++) {
			this._pictureSprite[i] = new Sprite();
			this._pictureSprite[i].anchor.x = 0;
			this._pictureSprite[i].anchor.y = 0;
			this._pictureSprite[i].visible = false;
			this.addChild(this._pictureSprite[i]);
		}
	};

	Window_EroStatus.prototype.refresh = function() {
		this.contents.clear();
		this.contents.fontSize = RB_EroS_fontsize;
		if (this._actor) {
			this.drawActorName(0, 15);
//			this.drawThreeSize(0, 60);
			this.drawFirstName(0, 60);
			this.drawStateName(0, 140);
			this.drawExpNumber(8, 425);
//			this.drawEjaculateNumber(8, 455);
			this.drawEjaculateVolume(8, 591);
			this.drawMouthLevel(680, 60);
			this.drawBreastLevel(680, 228);
			this.drawVaginaLevel(680, 396);
			this.dwawAnalLevel(680, 564);
			this.drawBodyLevel(680, 15);
			this.drawActorIllust(rb_picture_x, rb_picture_y);
		}
	};

	// 立ち絵表示
	Window_EroStatus.prototype.drawActorIllust = function(x, y) {
		// 立ち絵変更用変数の値取得
		var paramValue = $gameVariables.value(RB_EroS_PicVAL);
		var baseIndex = 0;
		// 現在の閾値のbaseIndex算出
		for (baseIndex = 0; baseIndex < RB_EroS_PicTBL[0].length; baseIndex++) {
			if (paramValue <= RB_EroS_PicTBL[0][baseIndex]) break;
		}
		if (baseIndex >= RB_EroS_PicTBL[0].length) baseIndex = RB_EroS_PicTBL[0].length - 1;

		// 表示する立ち絵ベース設定
		this._pictureSprite[0].bitmap = ImageManager.loadPicture(RB_EroS_PicTBL[1][baseIndex]);
		this._pictureSprite[0].x = x;
		this._pictureSprite[0].y = y;
//		this._pictureSprite[0].visible = true;

		// 表示する立ち絵SW重ね合わせ設定
		for (var i = 0; i < RB_Eros_RULETBL.length; i++) {
			// スイッチ状態取得
			var sval = $gameSwitches.value(RB_Eros_RULETBL[i][0]);
			// 重ね合わせ画像取得
			var stackname = (sval == false) ? RB_Eros_RULETBL[i][baseIndex*2+1] : RB_Eros_RULETBL[i][baseIndex*2+2];
			if (rb_debug_flag) console.log("SW(" + RB_Eros_RULETBL[i][0] + "):" + stackname);
			// 画像指定がなければSKIP
			if (stackname == "") continue;
			// 表示する立ち絵重ね合わせ設定
			this._pictureSprite[i+1].bitmap = ImageManager.loadPicture(stackname);
			this._pictureSprite[i+1].x = x;
			this._pictureSprite[i+1].y = y;
//			this._pictureSprite[i+1].visible = true;
		}

		// 最後にまとめて表示
		for (var i = 0; i <= RB_Eros_RULETBL.length; i++) {
			this._pictureSprite[i].visible = true;
		}

	};

	// 名前
	Window_EroStatus.prototype.drawActorName = function(x, y) {
		this.resetTextColor();

		paramName = this._actor.name();
		this.drawText(RB_EroS_Data[0][0] + paramName, x, y, 250, 'center');
	};

	// 3サイズ
	Window_EroStatus.prototype.drawThreeSize = function(x, y) {
		this.resetTextColor();

		this.drawText(RB_EroS_Data[1][0], x, y, 250, 'center');
	};

	// 初体験
	Window_EroStatus.prototype.drawFirstName = function(x, y) {
		this.resetTextColor();

		this.drawText(RB_EroS_Data[2][0], x, y, 250, 'center');
		var paramValue = $gameVariables.value(RB_EroS_Data[2][1]);
		if (isNaN(paramValue)) {
			this.drawText(paramValue, x, y + 30, 250, 'center');
		}
	};

	// ステータス異常
	Window_EroStatus.prototype.drawStateName = function(x, y) {
		this.resetTextColor();

		this.drawText(RB_EroS_Data[3][0], x, y, 250, 'center');
//		var paramValue = $gameVariables.value(RB_EroS_Data[3][1]);
//		if (paramValue > 0) {
//			var state = $dataStates[paramValue];
//			this.drawText(state.name, x, y + 30, 250, 'center');
//		}
	};

	// 経験人数
	Window_EroStatus.prototype.drawExpNumber = function(x, y) {
		this.drawExpParts(RB_EroS_Data[4][0], RB_EroS_Data[4][1], x, y +   0, 160,  48, 999);
		this.drawExpParts(RB_EroS_Data[5][0], RB_EroS_Data[5][1], x, y +  30, 160,  48, 999);
		this.drawExpParts(RB_EroS_Data[6][0], RB_EroS_Data[6][1], x, y +  60, 160,  48, 999);
		this.drawExpParts(RB_EroS_Data[7][0], RB_EroS_Data[7][1], x, y +  90, 160,  48, 999);
		this.drawExpParts(RB_EroS_Data[8][0], RB_EroS_Data[8][1], x, y + 120, 160,  48, 999);
	};

	// 射精回数
	Window_EroStatus.prototype.drawEjaculateNumber = function(x, y) {
		this.drawExpParts(RB_EroS_Data[ 9][0], RB_EroS_Data[ 9][1], x, y,      160, 48, 999);
		this.drawExpParts(RB_EroS_Data[10][0], RB_EroS_Data[10][1], x, y + 30, 160, 48, 999);
		this.drawExpParts(RB_EroS_Data[11][0], RB_EroS_Data[11][1], x, y + 60, 160, 48, 999);
		this.drawExpParts(RB_EroS_Data[12][0], RB_EroS_Data[12][1], x, y + 90, 160, 48, 999);
	};

	// 射精量
	Window_EroStatus.prototype.drawEjaculateVolume = function(x, y) {
		this.drawExpParts(RB_EroS_Data[13][0], RB_EroS_Data[13][1], x, y,      126, 80, 99999);
		this.drawExpParts(RB_EroS_Data[14][0], RB_EroS_Data[14][1], x, y + 30, 126, 80, 99999);
		this.drawExpParts(RB_EroS_Data[15][0], RB_EroS_Data[15][1], x, y + 60, 126, 80, 99999);
		this.drawExpParts(RB_EroS_Data[16][0], RB_EroS_Data[16][1], x, y + 90, 126, 80, 99999);
	};

	// 左側部位表示
	Window_EroStatus.prototype.drawExpParts = function(item, id, x, y, xsub, xwidth, max) {
		this.resetTextColor();

		this.drawText(item, x, y);
		var paramValue = $gameVariables.value(id);
		this.drawText(paramValue.clamp(0,max), x + xsub, y, xwidth, 'right');
	};

	// 身体感度
	Window_EroStatus.prototype.drawBodyLevel = function(x, y) {
		var paramValue = this.MouthLevel + this.BreastLevel + this.VaginaLevel + this.AnalLevel;
		paramValue /= 4;
		this.BodyLevel = this.drawDevelopLevel(RB_EroS_Data[17][0], parseInt(paramValue), x, y);
		$gameVariables.setValue(RB_EroS_Data[17][1], this.BodyLevel);
	};

	// 口内開発
	Window_EroStatus.prototype.drawMouthLevel = function(x, y) {
		this.MouthLevel = this.drawDevelopParts(18, 19, 20, 21, 22, x, y);
		$gameVariables.setValue(RB_EroS_Data[18][1], this.MouthLevel);
	};

	// 乳房開発
	Window_EroStatus.prototype.drawBreastLevel = function(x, y) {
		this.BreastLevel = this.drawDevelopParts(23, 24, 25, 26, 27, x, y);
		$gameVariables.setValue(RB_EroS_Data[23][1], this.BreastLevel);
	};

	// 膣内開発
	Window_EroStatus.prototype.drawVaginaLevel = function(x, y) {
		this.VaginaLevel = this.drawDevelopParts(28, 29, 30, 31, 32, x, y);
		$gameVariables.setValue(RB_EroS_Data[28][1], this.VaginaLevel);
	};

	// 肛門開発
	Window_EroStatus.prototype.dwawAnalLevel = function(x, y) {
		this.AnalLevel = this.drawDevelopParts(33, 34, 35, 36, 37, x, y);
		$gameVariables.setValue(RB_EroS_Data[33][1], this.AnalLevel);
	};

	// XX開発LVと部位表示
	Window_EroStatus.prototype.drawDevelopParts = function(level, parts1, parts2, parts3, parts4, x, y) {
		var paramValue = 0;
		paramValue += this.drawDevelopNumber(RB_EroS_Data[parts1][0], RB_EroS_Data[parts1][1], x, y +  30);
		paramValue += this.drawDevelopNumber(RB_EroS_Data[parts2][0], RB_EroS_Data[parts2][1], x, y +  60);
		paramValue += this.drawDevelopNumber(RB_EroS_Data[parts3][0], RB_EroS_Data[parts3][1], x, y +  90);
		paramValue += this.drawDevelopNumber(RB_EroS_Data[parts4][0], RB_EroS_Data[parts4][1], x, y + 120);
		paramValue /= 10;
		return this.drawDevelopLevel(RB_EroS_Data[level][0], parseInt(paramValue), x, y);
	};

	// XX開発 LV表示
	Window_EroStatus.prototype.drawDevelopLevel = function(item, paramValue, x, y) {
	    this.changeTextColor(RB_EroS_LvColor);

		this.drawText(item, x, y);
		this.drawText(paramValue.clamp(1,99), x + 142, y);
		return paramValue.clamp(1,99);
	};

	// XX開発 回数表示
	Window_EroStatus.prototype.drawDevelopNumber = function(item, id, x, y) {
		this.resetTextColor();

		this.drawText(item, x + 120, y);
		var paramValue = $gameVariables.value(id);
		this.drawText(paramValue.clamp(0,999), x + 228, y, 48, 'right');
		return paramValue.clamp(0,999);
	};

})();
