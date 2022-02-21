/*:ja
 * @plugindesc 戦闘中立ち絵表示＆戦闘中ステート立ち絵表示(アーマーブレイク対応) v2.5
 * @author 龍尾
 *
 * @param picture_x
 * @desc 立ち絵表示の始点(X座標)
 * @default 550
 *
 * @param picture_y
 * @desc 立ち絵表示の始点(Y座標)
 * @default 20
 *
 * @param StatePicture
 * @desc ステート付与による立ち絵表示の有無(on/off)
 * @default on
 *
 * @param picture_type
 * @desc 立ち絵表示の切替(w/a) w:武器 a:身体防具
 * @default w
 *
 * @param durability
 * @desc 耐久度システムに連動させるかの切替(on/off)
 * @default on
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 * 戦闘中のみ、指定した立ち絵を表示します。
 * 武器    を追加する場合は、RB_BSP_WTBLに追加してください。
 * 身体防具を追加する場合は、RB_BSP_ATBLに追加してください。
 *
 * 戦闘中指定したステートをアクターが受けた際に、指定した立ち絵を表示します。
 * ステートIDと立ち絵の指定は、RB_SP_TBLに記載して下さい。
 * 複数のステートを受けた際は、ステート優先度が一番高いものを表示します。
 * 表示してるステートが治った際は、その次に優先度が高いステート立ち絵を表示します。
 * 全てのステート立ち絵に対応するステートが治った際は、戦闘立ち絵の表示に戻ります。
 *
 * ステート立ち絵表示はプラグイン引数StatePictureでon/offを切替可能です。
 *
 * アーマーブレイクのHP閾値はRB_AB_TBLに記載して下さい。
 *
 * V2.5 ステート配列に存在しないステートにのみ掛かってる場合のエラーを修正
 * V2.4 ステートに掛かってない場合のエラーを修正
 * v2.3 ステート立ち絵の表示優先度を、ステート立ち絵配列の設定順に変更
 * v2.2 戦闘開始時にステート立ち絵表示するように改造。
 *      戦闘外でステート変化した際にステート立ち絵表示してたバグ修正。
 * v2.1 耐久度システム(RB_DurabilitySystem.js)との連動を選択できるように修正。
 * v2.0 戦闘立ち絵を武器/身体防具の両方に対応(プラグイン引数にて指定可能)
 * v1.2 戦闘開始＆終了時に、戦闘中のステート立ち絵配列を初期化する処理を追加(念のため)
 *
 */
(function() {

	// 立ち絵表示に使用するピクチャーID
	var RB_PICTURE_ID = 1;

	// 表示中のステート立ち絵配列index(-1はステート立ち絵非表示を示す)
	var rb_StatePictureIndex = -1;

	// アーマーブレイクHP閾値配列
	var RB_AB_TBL = [0.70, 0.40, 0];

	// 戦闘立ち絵表示用 武器ID配列
	var RB_BSP_WTBL = [ ["Battle01_01", "Battle02_01", "Battle03_01"],    // 素手グラ
						["Battle01_01", "Battle02_01", "Battle03_01"],    // 武器ID1を装備時の立ち絵NAME
						["Battle01_01", "Battle02_01", "Battle03_01"],    // 武器ID2～
						["Battle01_01", "Battle02_01", "Battle03_01"],    // 
						["Battle01_01", "Battle02_01", "Battle03_01"],   // 
						["Battle01_01", "Battle02_01", "Battle03_01"],   // 
						["Battle01_01", "Battle02_01", "Battle03_01"],    // 
						["Battle01_01", "Battle02_01", "Battle03_01"],   // 
	];

	// 戦闘立ち絵表示用 身体防具ID配列
	var RB_BSP_ATBL = [ ["Battle01_01", "Battle02_01", "Battle03_01"],    // 全裸グラ
						["Battle01_01", "Battle02_01", "Battle03_01"],    // 身体防具ID1を装備時の立ち絵NAME
						["Battle01_01", "Battle02_01", "Battle03_01"],    // 身体防具ID2～
						["Battle01_01", "Battle02_01", "Battle03_01"],    // 
						["Battle01_01", "Battle02_01", "Battle03_01"],   // 
						["Battle01_01", "Battle02_01", "Battle03_01"],   // 
						["Battle01_01", "Battle02_01", "Battle03_01"],    // 
						["Battle01_01", "Battle02_01", "Battle03_01"],   // 
	];

	// ステート立ち絵配列(StatePictureTable)
	var RB_SP_TBL = [ [276, "Gel_manko30",  "Gel_manko30",  "Gel_manko30"],
	                  [275, "Gel_manko21",  "Gel_manko21",  "Gel_manko21"],
	                  [274, "Gel_manko10",  "Gel_manko10",  "Gel_manko10"],
	                  [273, "Gel_manko01",  "Gel_manko01",  "Gel_manko01"],
	                  [272, "Metal_restraint30",  "Metal_restraint30",  "Metal_restraint30"],
	                  [271, "Metal_restraint21",  "Metal_restraint21",  "Metal_restraint21"],
	                  [270, "Metal_restraint11",  "Metal_restraint11",  "Metal_restraint11"],
	                  [269, "Metal_restraint01",  "Metal_restraint01",  "Metal_restraint01"],
	                  [268, "goblin_Anal16",  "goblin_Anal16",  "goblin_Anal16"],
	                  [267, "goblin_Anal14",  "goblin_Anal14",  "goblin_Anal14"],
	                  [266, "goblin_Anal11",  "goblin_Anal11",  "goblin_Anal11"],
	                  [265, "goblin_Anal06",  "goblin_Anal06",  "goblin_Anal06"],
	                  [264, "goblin_Anal04",  "goblin_Anal04",  "goblin_Anal04"],
	                  [263, "goblin_Anal01",  "goblin_Anal01",  "goblin_Anal01"],
	                  [262, "Roper_syokusyu27",  "Roper_syokusyu27",  "Roper_syokusyu27"],
					  [261, "Roper_syokusyu21",  "Roper_syokusyu21",  "Roper_syokusyu21"],
	                  [260, "Roper_syokusyu07",  "Roper_syokusyu07",  "Roper_syokusyu07"],  
					  [259, "Roper_syokusyu01",  "Roper_syokusyu01",  "Roper_syokusyu01"],
	                  [258, "Minotaur_manko30",  "Minotaur_manko30",  "Minotaur_manko30"],
	                  [257, "Minotaur_manko21",  "Minotaur_manko21",  "Minotaur_manko21"],
	                  [256, "Minotaur_manko10",  "Minotaur_manko10",  "Minotaur_manko10"],
	                  [255, "Minotaur_manko01",  "Minotaur_manko01",  "Minotaur_manko01"],
	                  [254, "WereWolf_manko25",  "WereWolf_manko25",  "WereWolf_manko25"],
	                  [253, "WereWolf_manko21",  "WereWolf_manko21",  "WereWolf_manko21"],
	                  [252, "WereWolf_manko05",  "WereWolf_manko05",  "WereWolf_manko05"],
	                  [251, "WereWolf_manko01",  "WereWolf_manko01",  "WereWolf_manko01"],
	                  [250, "Spider_restraint31",  "Spider_restraint31",  "Spider_restraint31"],
	                  [249, "Spider_restraint21",  "Spider_restraint21",  "Spider_restraint21"],
	                  [248, "Spider_restraint11",  "Spider_restraint11",  "Spider_restraint11"],
	                  [247, "Spider_restraint01",  "Spider_restraint01",  "Spider_restraint01"],
	                  [246, "cuttlefish_syokusyu16",  "cuttlefish_syokusyu16",  "cuttlefish_syokusyu16"],
					  [245, "cuttlefish_syokusyu11",  "cuttlefish_syokusyu11",  "cuttlefish_syokusyu11"],
	                  [244, "cuttlefish_syokusyu06",  "cuttlefish_syokusyu06",  "cuttlefish_syokusyu06"], 
					  [243, "cuttlefish_syokusyu01",  "cuttlefish_syokusyu01",  "cuttlefish_syokusyu01"],
					  [242, "slime_gel20",  "slime_gel20",  "slime_gel20"],
	                  [241, "slime_gel16",  "slime_gel16",  "slime_gel16"],
	                  [240, "slime_gel11",  "slime_gel11",  "slime_gel11"],
	                  [239, "slime_gel10",  "slime_gel10",  "slime_gel10"],
	                  [238, "slime_gel06",  "slime_gel06",  "slime_gel06"],
	                  [237, "slime_gel01",  "slime_gel01",  "slime_gel01"],
	                  [236, "Treant_gas20",  "Treant_gas20",  "Treant_gas20"],
	                  [235, "Treant_gas16",  "Treant_gas16",  "Treant_gas16"],
	                  [234, "Treant_gas11",  "Treant_gas11",  "Treant_gas11"],
	                  [233, "Treant_gas10",  "Treant_gas10",  "Treant_gas10"],
	                  [232, "Treant_gas6",  "Treant_gas6",  "Treant_gas6"],
	                  [231, "Treant_gas1",  "Treant_gas1",  "Treant_gas1"],
	                  [230, "KillerBee_Anal16",  "KillerBee_Anal16",  "KillerBee_Anal16"],
	                  [229, "KillerBee_Anal14",  "KillerBee_Anal14",  "KillerBee_Anal14"],
	                  [228, "KillerBee_Anal11",  "KillerBee_Anal11",  "KillerBee_Anal11"],
	                  [227, "KillerBee_Anal06",  "KillerBee_Anal06",  "KillerBee_Anal06"],
	                  [226, "KillerBee_Anal04",  "KillerBee_Anal04",  "KillerBee_Anal04"],
	                  [225, "KillerBee_Anal01",  "KillerBee_Anal01",  "KillerBee_Anal01"],
	                  [224, "dorodoro_doro19",  "dorodoro_doro19",  "dorodoro_doro19"],
	                  [223, "dorodoro_doro16",  "dorodoro_doro16",  "dorodoro_doro16"],
	                  [222, "dorodoro_doro11",  "dorodoro_doro11",  "dorodoro_doro11"],
	                  [221, "dorodoro_doro09",  "dorodoro_doro09",  "dorodoro_doro09"],
	                  [220, "dorodoro_doro06",  "dorodoro_doro06",  "dorodoro_doro06"],
	                  [219, "dorodoro_doro01",  "dorodoro_doro01",  "dorodoro_doro01"],
	                  [218, "orc_irama19",  "orc_irama19",  "orc_irama19"],
	                  [217, "orc_irama16",  "orc_irama16",  "orc_irama16"],
					  [216, "orc_irama11",  "orc_irama11",  "orc_irama11"],
					  [215, "orc_irama09",  "orc_irama09",  "orc_irama09"],
	                  [214, "orc_irama06",  "orc_irama06",  "orc_irama06"],
					  [213, "orc_irama01",  "orc_irama01",  "orc_irama01"],
					  [212, "gen_irama19",  "gen_irama19",  "gen_irama19"],
	                  [211, "gen_irama16",  "gen_irama16",  "gen_irama16"],
					  [210, "gen_irama11",  "gen_irama11",  "gen_irama11"],
					  [209, "gen_irama09",  "gen_irama09",  "gen_irama09"],
					  [208, "gen_irama06",  "gen_irama06",  "gen_irama06"],
					  [207, "gen_irama01",  "gen_irama01",  "gen_irama01"],
					  [199, "Scorpion_Anal16",  "Scorpion_Anal16",  "Scorpion_Anal16"],
	                  [198, "Scorpion_Anal14",  "Scorpion_Anal14",  "Scorpion_Anal14"],
	                  [197, "Scorpion_Anal11",  "Scorpion_Anal11",  "Scorpion_Anal11"],
	                  [206, "Scorpion_Anal06",  "Scorpion_Anal06",  "Scorpion_Anal06"],
	                  [205, "Scorpion_Anal04",  "Scorpion_Anal04",  "Scorpion_Anal04"],
	                  [204, "Scorpion_Anal01",  "Scorpion_Anal01",  "Scorpion_Anal01"],
					  [196, "buka_irama19",  "buka_irama19",  "buka_irama19"],
					  [195, "buka_irama16",  "buka_irama16",  "buka_irama16"],
					  [194, "buka_irama11",  "buka_irama11",  "buka_irama11"],
					  [203, "buka_irama09",  "buka_irama09",  "buka_irama09"],
	                  [202, "buka_irama06",  "buka_irama06",  "buka_irama06"],
	                  [201, "buka_irama01",  "buka_irama01",  "buka_irama01"],
					  [193, "shiracco_manko30",  "shiracco_manko30",  "shiracco_manko30"],
					  [192, "shiracco_manko21",  "shiracco_manko21",  "shiracco_manko21"],
					  [19, "shiracco_manko10",  "shiracco_manko10",  "shiracco_manko10"],
	                  [18, "shiracco_manko01",  "shiracco_manko01",  "shiracco_manko01"],
					  [191, "MonsterFlour_syokusyu16",  "MonsterFlour_syokusyu16",  "MonsterFlour_syokusyu16"],
					  [190, "MonsterFlour_syokusyu11",  "MonsterFlour_syokusyu11",  "MonsterFlour_syokusyu11"],
	                  [16, "MonsterFlour_syokusyu06",  "MonsterFlour_syokusyu06",  "MonsterFlour_syokusyu06"],  
					  [12, "MonsterFlour_syokusyu01",  "MonsterFlour_syokusyu01",  "MonsterFlour_syokusyu01"],
					  [189, "Battle04_02",  "Battle05_02",  "Battle06_02"],
					  [188, "Battle04_01",  "Battle05_01",  "Battle06_01"],
					  [15, "Battle01_02",  "Battle02_02",  "Battle03_02"],
	];

	// スクリプト引数
	var parameters = PluginManager.parameters('RB_BattleStatePicture_DUR');
	var rb_picture_x        = parseInt(parameters['picture_x']    ||  550);
	var rb_picture_y        = parseInt(parameters['picture_y']    ||   20);
	var rb_StatePictureFlag = String(  parameters['StatePicture'] || 'on');
	var rb_picture_type     = String(  parameters['picture_type'] ||  'w');
	var rb_durabirity       = String(  parameters['durability']   || 'on');

	// HP閾値による表示画像選択
	rb_armorBreakElement = function(hpRate) {
		for(var element = 0; element < RB_AB_TBL.length; element++) {
			if (hpRate >= RB_AB_TBL[element]) break;
		}
		return element;
	}

	//----------------------------------------------------------------
	// 戦闘立ち絵処理
	//----------------------------------------------------------------

	// 戦闘立ち絵表示処理
	rb_battleStandShowPicture = function() {
		// 念のため、表示中のステート立ち絵配列初期化
		rb_StatePictureIndex = -1;

		var hpRate = (rb_durabirity == 'on') ? rb_DUR_dActorHpRate() : $gameActors.actor(1).hpRate();
		var element = rb_armorBreakElement(hpRate);

		var equips = $gameActors.actor(1).equips();
		if (rb_picture_type == 'w') { // 武器IDによりグラフィック変更
			// 表示する立ち絵NAMEを指定
			if (equips[0] == null) {
				// 素手グラ表示
				var bitmapName = RB_BSP_WTBL[0][element];
			} else if (equips[0].id < RB_BSP_WTBL.length) {
				// 武器ID毎のグラ表示
				var bitmapName = RB_BSP_WTBL[equips[0].id][element];
			} else {
				// 武器ID1のグラ表示(異常処理)
				var bitmapName = RB_BSP_WTBL[1][element];
				console.log("龍尾:武器IDエラー");
			}
		} else {                      // 身体防具IDによりグラフィック変更
			// 表示する立ち絵NAMEを指定
			if (equips[3] == null) {
				// 全裸グラ表示
				var bitmapName = RB_BSP_ATBL[0][element];
			} else if (equips[3].id < RB_BSP_ATBL.length) {
				// 身体ID毎のグラ表示
				var bitmapName = RB_BSP_ATBL[equips[3].id][element];
			} else {
				// 身体ID1のグラ表示(異常処理)
				var bitmapName = RB_BSP_ATBL[1][element];
				console.log("龍尾:身体IDエラー");
			}
		}

		$gameScreen.showPicture(RB_PICTURE_ID, bitmapName, 0,
								rb_picture_x, rb_picture_y, 100, 100, 255, 0);
	}

	// 戦闘立ち絵削除処理
	rb_battleStandErasePicture = function() {
		$gameScreen.erasePicture(RB_PICTURE_ID);
	}

	rb_CheckBattleStartState = function() {
		//表示させるステートのステート立ち絵配列の中のindexを、配列最大値に初期化
		var stateIdTblIndex = RB_SP_TBL.length + 1;

		//Actor1の現在掛かってるステート全部を対象としてループ
		for (s_index = 0; s_index < $gameActors.actor(1)._states.length; s_index++) {
			//ステート1個ずつ取得
			var stateId = $gameActors.actor(1)._states[s_index];
			// ステート立ち絵配列に登録されたステートかチェック
			var done_index = rb_SpTblIndex(stateId);
			if (done_index >= 0) {
				// ステート立ち絵配列(RB_SP_TBL)の設定順判定
				if (done_index < stateIdTblIndex) {
					// ステート立ち絵配列のindex更新
					stateIdTblIndex = done_index;
				}
			}
		}

		//表示させるステートがあった場合
		if (stateIdTblIndex <= RB_SP_TBL.length) {
			// 表示するステートのステート立ち絵配列の中のindex設定
			rb_StatePictureIndex = stateIdTblIndex;
		}
	}

	// 戦闘開始＆終了時に戦闘立ち絵表示(既存関数に追加)
	BattleManager.update = function() {
		if (!this.isBusy() && !this.updateEvent()) {
			switch (this._phase) {
			case 'start':
				// 龍尾追加
				rb_CheckBattleStartState();
				if (rb_StatePictureIndex != -1) {
					// ステート立ち絵表示
					rb_battleStateShowPicture(rb_StatePictureIndex);
				} else {
					// 戦闘立ち絵表示
					rb_battleStandShowPicture();
				}
				this.startInput();
				break;
			case 'turn':
				this.updateTurn();
				break;
			case 'action':
				this.updateAction();
				break;
			case 'turnEnd':
				this.updateTurnEnd();
				break;
			case 'battleEnd':
				rb_battleStateErasePicture(); // 念のため追加
				rb_battleStandErasePicture(); // 追加
				this.updateBattleEnd();
				break;
			}
		}
	};

	// 戦闘中アクターのHP増減時に立ち絵変更処理追加(既存関数に追加)
	var _RB_Game_Battler_gainHp = Game_Battler.prototype.gainHp;
	Game_Battler.prototype.gainHp = function(value) {
		_RB_Game_Battler_gainHp.call(this, value);
		if ($gameParty.inBattle() && this.isActor() && value != 0) {
			if (rb_StatePictureIndex != -1) {
				// ステート立ち絵表示
				rb_battleStateShowPicture(rb_StatePictureIndex);
			} else {
				// 戦闘立ち絵表示
				rb_battleStandShowPicture();
			}
		}
	};

	//----------------------------------------------------------------
	// ステート立ち絵処理
	//----------------------------------------------------------------

	// 指定したstateIdが、ステータス立ち絵配列に登録されているindexを返す
	rb_SpTblIndex = function(stateId) {
		for(var index = 0; index < RB_SP_TBL.length; index++) {
			if (stateId == RB_SP_TBL[index][0]) break;
		}
		if (index >= RB_SP_TBL.length) index = -1;
		return index;
	};

	// ステート立ち絵表示処理
	rb_battleStateShowPicture = function(index) {
		var hpRate = (rb_durabirity == 'on') ? rb_DUR_dActorHpRate() : $gameActors.actor(1).hpRate();
		var element = rb_armorBreakElement(hpRate);
		rb_battleStateErasePicture();
		$gameScreen.showPicture(RB_PICTURE_ID, RB_SP_TBL[index][element+1], 0,
								rb_picture_x, rb_picture_y, 100, 100, 255, 0);
		rb_StatePictureIndex = index;
	}

	// ステート立ち絵削除処理
	rb_battleStateErasePicture = function() {
		rb_battleStandErasePicture();
		rb_StatePictureIndex = -1;
	}

	// ステート付与された際に立ち絵表示を呼び出す処理追加(既存関数に追加)
	var _RB_Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
	Game_BattlerBase.prototype.addNewState = function(stateId) {
		_RB_Game_BattlerBase_addNewState.call(this, stateId);
		// 戦闘中の条件追加
		if ($gameParty.inBattle() && rb_StatePictureFlag == 'on' && this.isActor()) {
			this.rb_addStatePicture(stateId);
		}
	};

	// 追加するstateIdに対応する立ち絵を表示する処理
	Game_Battler.prototype.rb_addStatePicture = function(stateId) {
		// 追加するステートがステート立ち絵配列に登録されてなければ終了
		var index = rb_SpTblIndex(stateId);
		if (index == -1) return;

		// 現在掛かってるステート全部を対象としてループ
		var done_index;
		for (var s_index = 0; s_index < this._states.length; s_index++) {
			done_stateId = this._states[s_index];
			// ステート立ち絵配列に登録されたステートかチェック
			done_index = rb_SpTblIndex(done_stateId);
			if (done_index >= 0) {
				// ステート立ち絵配列(RB_SP_TBL)の設定順判定。既存より低いなら終了
				if (done_index < index) return;
			}
		}

		// ステート立ち絵表示処理
		rb_battleStateShowPicture(index);
	};

	// ステート削除された際に立ち絵削除する処理追加(既存関数に追加)
	var _RB_Game_Battler_removeState = Game_Battler.prototype.removeState;
	Game_Battler.prototype.removeState = function(stateId) {
		if (this.isStateAffected(stateId)) {
			if (stateId === this.deathStateId()) {
				this.revive();
			}
			this.eraseState(stateId);
			// 戦闘中の条件追加
			if ($gameParty.inBattle() && rb_StatePictureFlag == 'on' && this.isActor()) {
				this.rb_eraseStatePicture(stateId);
			}
			this.refresh();
			this._result.pushRemovedState(stateId);
		}
	};

	// 削除するstateIdに対応する立ち絵を削除する処理
	Game_Battler.prototype.rb_eraseStatePicture = function(stateId) {
		// 削除するステートがステート立ち絵配列に登録されてなければ終了
		var index = rb_SpTblIndex(stateId);
		if (index == -1) return;

		// 現在掛かってるステート全部を対象としてループ
		var done_index;
		var adopt_index = -1;
		this._states.forEach(function(done_stateId) {
			// ステート立ち絵配列に登録されたステートかチェック
			done_index = rb_SpTblIndex(done_stateId);
			// 未登録なら、次のステートに移行(forEachで次の要素へ)
			if (done_index == -1) return;
			if (adopt_index == -1) {
				// 初回設定
				adopt_index = done_index;
			} else {
				// ステート立ち絵配列(RB_SP_TBL)の設定順判定
				if (done_index < adopt_index) {
					// ステート立ち絵配列のindex更新
					adopt_index = done_index;
				}
			}
		}, this);

		// 現在掛かってるステート内でステート立ち絵配列に登録されているものがある場合
		if (adopt_index != -1) {
			// ステート立ち絵表示処理
			rb_battleStateShowPicture(adopt_index);
		} else {
			// ステート立ち絵削除処理
			rb_battleStateErasePicture();
			// 戦闘立ち絵表示
			rb_battleStandShowPicture();
		}
	};

})();
