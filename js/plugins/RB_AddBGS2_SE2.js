//=============================================================================
// BGS2とSE2を追加するプラグイン
// RB_AddBGS2_SE2.js
// 作成者     : 龍尾
// 作成日     : 2018/06/25
// 最終更新日 : 2018/06/25
// バージョン : v1.1 SE2再生時の仕様変更対応
//              v1.0 初版
//=============================================================================
/*:ja
 * @plugindesc BGS2とSE2を追加する。オプションで音量設定可能。
 * @author 龍尾
 *
 * @param BGS2 Volume Text
 * @desc BGS2音量のオプション画面での表記を変更します。
 * @type string
 * @default BGS2 音量
 *
 * @param BGS2 Volume Default
 * @desc BGS2音量のデフォルト値。
 * 0～100の間で設定して下さい。
 * @type number
 * @min 0
 * @max 100
 * @default 100
 *
 * @param SE2 Volume Text
 * @desc SE2音量のオプション画面での表記を変更します。
 * @type string
 * @default SE2 音量
 *
 * @param SE2 Volume Default
 * @desc SE2音量のデフォルト値。
 * 0～100の間で設定して下さい。
 * @type number
 * @min 0
 * @max 100
 * @default 100
 *
 * @help
 *-----------------------------------------------------------------------------
 * 概要
 *-----------------------------------------------------------------------------
 * BGS2とSE2を追加するプラグインです。
 * 既存のBGSやSEと同時再生可能です。個別にも再生、停止できます。
 * また、オプションにBGS2とSE2の音量設定が追加されます。
 * 注)SE2再生中、BGS2は再生中断します。SE2停止後自動的にBGS2は再開されます。
 * 注)SE2再生時、SE2音量設定が0の場合は、SE2を再生しません。
 *
 * スクリプトとして、以下の記述をしてください。
 * ・BGS2再生
 * AudioManager.playBgs2({"name":"aaa","volume":bbb,"pitch":ccc,"pan":ddd})
 *         aaa:BGS filename(拡張子なし)
 *         bbb:音量(0～100:標準90)
 *         ccc:ピッチ(0～100:標準100)
 *         ddd:位相(-150～+150:標準0)
 * ・BGS2停止
 * AudioManager.stopBgs2()
 *
 * ・SE2再生
 * AudioManager.playSe2({"name":aaa,"volume":bbb,"pitch":ccc,"pan":ddd})
 *         aaa:BGS filename(拡張子なし)
 *         bbb:音量(0～100:標準90)
 *         ccc:ピッチ(0～100:標準100)
 *         ddd:位相(-150～+150:標準0)
 * ・SE2停止
 * AudioManager.stopSe2()
 * 
 * プラグインコマンドはありません。
 * 
 * アクマの脳髄様の「オプションをデフォルトに戻すコマンド」に対応してます。
 */
(function() {

	var parameters = PluginManager.parameters('RB_AddBGS2_SE2');
	var rb_BGSE2_bgsVol2Text = parameters['BGS2 Volume Text'];
	var rb_BGSE2_bgsVol2Def  = JSON.parse(parameters['BGS2 Volume Default'] || 100);
	var rb_BGSE2_seVol2Text  = parameters['SE2 Volume Text'];
	var rb_BGSE2_seVol2Def   = JSON.parse(parameters['SE2 Volume Default'] || 100);

	//-------------------------------------------------------------------------
	// AudioManager
	//-------------------------------------------------------------------------

	AudioManager._bgsVolume2  = rb_BGSE2_bgsVol2Def;
	AudioManager._bgsBuffer2  = null;
	AudioManager._currentBgs2 = null;
	AudioManager._seVolume2   = rb_BGSE2_seVol2Def;
	AudioManager._seBuffers2  = [];

	Object.defineProperty(AudioManager, 'bgsVolume2', {
		get: function() {
			return this._bgsVolume2;
		},
		set: function(value) {
			this._bgsVolume2 = value;
			this.updateBgsParameters2(this._currentBgs);
		},
		configurable: true
	});

	Object.defineProperty(AudioManager, 'seVolume2', {
		get: function() {
			return this._seVolume2;
		},
		set: function(value) {
			this._seVolume2 = value;
		},
		configurable: true
	});

	AudioManager.playBgs2 = function(bgs, pos) {
		if (this.isCurrentBgs2(bgs)) {
		    this.updateBgsParameters2(bgs);
		} else {
			this.stopBgs2();
			if (bgs.name) {
				this._bgsBuffer2 = this.createBuffer('bgs', bgs.name);
				this.updateBgsParameters2(bgs);
				this._bgsBuffer2.play(true, pos || 0);
			}
		}
		this.updateCurrentBgs2(bgs, pos);
	};

	AudioManager.isCurrentBgs2 = function(bgs) {
		return (this._currentBgs2 && this._bgsBuffer2 &&
				this._currentBgs2.name === bgs.name);
	};

	AudioManager.updateBgsParameters2 = function(bgs) {
		this.updateBufferParameters(this._bgsBuffer2, this._bgsVolume2, bgs);
	};

	AudioManager.updateCurrentBgs2 = function(bgs, pos) {
		this._currentBgs2 = {
			name: bgs.name,
			volume: bgs.volume,
			pitch: bgs.pitch,
			pan: bgs.pan,
			pos: pos
		};
	};

	AudioManager.stopBgs2 = function() {
		if (this._bgsBuffer2) {
			this._bgsBuffer2.stop();
			this._bgsBuffer2 = null;
			this._currentBgs2 = null;
		}
	};

	AudioManager.fadeOutBgs2 = function(duration) {
		if (this._bgsBuffer2 && this._currentBgs2) {
			this._bgsBuffer2.fadeOut(duration);
			this._currentBgs2 = null;
		}
	};

	AudioManager.playSe2 = function(se) {
		// SE2のオプション音量が0の場合、SE2再生をしない
		if (this._seVolume2 == 0) return;
		if (se.name) {
			this._seBuffers2 = this._seBuffers2.filter(function(audio) {
				return audio.isPlaying();
			});

			// SE2再生時、BGS2を一時停止させる
			if (this._bgsBuffer2 && this._currentBgs2) {
				this._currentBgs2.pos = this._bgsBuffer2.seek();
				this._bgsBuffer2.stop();
			}

			var buffer = this.createBuffer('se', se.name);
			this.updateSeParameters2(buffer, se);
			buffer.play(false);
			this._seBuffers2.push(buffer);

			buffer.addStopListener(this.stopSeForBgs2.bind(this));
		}
	};

	AudioManager.stopSeForBgs2 = function() {
		if (this._bgsBuffer2 && this._currentBgs2 && !this._bgsBuffer2.isPlaying()) {
			this._bgsBuffer2.play(true, this._currentBgs2.pos);
			this._bgsBuffer2.fadeIn(this._replayFadeTime);
		}
	};

	AudioManager.updateSeParameters2 = function(buffer, se) {
		this.updateBufferParameters(buffer, this._seVolume2, se);
	};

	AudioManager.stopSe2 = function() {
		this._seBuffers2.forEach(function(buffer) {
			buffer.stop();
		});
		this._seBuffers2 = [];
	};

	//-------------------------------------------------------------------------
	// Scene_Base
	//-------------------------------------------------------------------------
	Scene_Base.prototype.fadeOutAll = function() {
		var time = this.slowFadeSpeed() / 60;
		AudioManager.fadeOutBgm(time);
		AudioManager.fadeOutBgs(time);
		AudioManager.fadeOutBgs2(time); // 追加
		AudioManager.fadeOutMe(time);
		this.startFadeOut(this.slowFadeSpeed());
	};

	//-------------------------------------------------------------------------
	// ConfigManager
	//-------------------------------------------------------------------------

	Object.defineProperty(ConfigManager, 'bgsVolume2', {
		get: function() {
			return AudioManager.bgsVolume2;
		},
		set: function(value) {
			AudioManager.bgsVolume2 = value;
		},
		configurable: true
	});

	Object.defineProperty(ConfigManager, 'seVolume2', {
		get: function() {
			return AudioManager.seVolume2;
		},
		set: function(value) {
			AudioManager.seVolume2 = value;
		},
		configurable: true
	});

	var RB_BGSE2_ConfigManager_makeData = ConfigManager.makeData;

	ConfigManager.makeData = function() {
		var config = RB_BGSE2_ConfigManager_makeData.call(this);
	    config.bgsVolume2 = this.bgsVolume2;
	    config.seVolume2  = this.seVolume2;
	    return config;
	};

	var RB_BGSE2_ConfigManager_applyData = ConfigManager.applyData;

	ConfigManager.applyData = function(config) {
		RB_BGSE2_ConfigManager_applyData.call(this, config);
		this.bgsVolume2 = this.readVolume_bgs2(config, 'bgsVolume2');
		this.seVolume2  = this.readVolume_se2(config, 'seVolume2');
	};

	// BGS2用の初期値設定を追加(プラグインでの初期値設定を有効にさせるため)
	ConfigManager.readVolume_bgs2 = function(config, name) {
		var value = config[name];
		if (value !== undefined) {
			return Number(value).clamp(0, 100);
		} else {
			return rb_BGSE2_bgsVol2Def;
		}
	};

	// SE2用の初期値設定を追加(プラグインでの初期値設定を有効にさせるため)
	ConfigManager.readVolume_se2 = function(config, name) {
		var value = config[name];
		if (value !== undefined) {
			return Number(value).clamp(0, 100);
		} else {
			return rb_BGSE2_seVol2Def;
		}
	};

	//-------------------------------------------------------------------------
	// Window_Options
	//-------------------------------------------------------------------------

	var RB_BGSE2_Window_Options_addVolumeOptions = Window_Options.prototype.addVolumeOptions;

	Window_Options.prototype.addVolumeOptions = function() {
		RB_BGSE2_Window_Options_addVolumeOptions.call(this);
		this.addCommand(rb_BGSE2_bgsVol2Text, 'bgsVolume2');
		this.addCommand(rb_BGSE2_seVol2Text, 'seVolume2');
	};

	// アクマの脳髄様の「オプションをデフォルトに戻すコマンド」に対応
	if(!!PluginManager._parameters["AKUNOU_OptionDefault".toLowerCase()]) {

		var akunou6_defaultAll = Window_Options.prototype.defaultAll;

		Window_Options.prototype.defaultAll = function() {
			akunou6_defaultAll.call(this);
			this.changeValue('bgsVolume2', rb_BGSE2_bgsVol2Def);
			this.changeValue('seVolume2', rb_BGSE2_seVol2Def);
		};
	}

})();
