//=============================================================================
// RecollectionMode.js
// Copyright (c) 2015 rinne_grid
// This plugin is released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//
// Version
// 1.0.0 2015/12/26 公開
// 1.1.0 2016/04/19 回想一覧にサムネイルを指定できるように対応
// 1.1.1 2016/05/03 セーブデータ20番目のスイッチが反映されない不具合を修正
//                  セーブデータ間のスイッチ共有オプション
//                  (share_recollection_switches)を追加
//=============================================================================

/*:ja
 * @plugindesc 回想モード機能を追加します。
 * @author rinne_grid
 *
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 */

//-----------------------------------------------------------------------------
// ◆ プラグイン設定
//-----------------------------------------------------------------------------
    var rngd_recollection_mode_settings = {
        //---------------------------------------------------------------------
        // ★ 回想モードで再生するBGMの設定をします
        //---------------------------------------------------------------------
        "rec_mode_bgm": {
            "bgm": {
                "name"  : "blank_memories",
                "pan"   : 0,
                "pitch" : 100,
                "volume": 90
            }
        },
        //---------------------------------------------------------------------
        // ★ 回想CG選択ウィンドウの設定を指定します
        //---------------------------------------------------------------------
        "rec_mode_window" : {
            "x": 400,
            "y": 300,
            "recollection_title": "回想模式",
            "str_select_recollection": "观看回想",
            "str_select_cg": "观看CG",
            "str_select_back_title": "回到主菜单"
        },
        //---------------------------------------------------------------------
        // ★ 回想リストウィンドウの設定を指定します
        //---------------------------------------------------------------------
        "rec_list_window": {
            // 1画面に表示する縦の数
            "item_height": 3,
            // 1画面に表示する横の数
            "item_width" : 2,
            // 1枚のCGに説明テキストを表示するかどうか
            "show_title_text": true,
            // タイトルテキストの表示位置(left:左寄せ、center:中央、right:右寄せ）
            "title_text_align": "center",
            // 閲覧したことのないCGの場合に表示するピクチャファイル名
            "never_watch_picture_name": "never_watch_picture",
            // 閲覧したことのないCGのタイトルテキスト
            "never_watch_title_text": "？？？"
        },
        //---------------------------------------------------------------------
        // ★ 回想用のCGを指定します
        //---------------------------------------------------------------------
        "rec_cg_set": {
            1: {
                "title": "Scene1",
                "pictures": ["CS01_01", "CS01_02","CS01_02_2", "CS01_03","CS01_03_02", "CS01_04","CS01_04_02", "CS01_05", "CS01_06", "CS01_07", "CS01_08_2", "CS01_08", "CS01_09", "CS01_11", "CS01_12","CS01_12_2", "CS01_13","CS01_13_02", "CS01_14","CS01_14_02", "CS01_15", "CS01_16", "CS01_17","CS01_08_2", "CS01_18", "CS01_19"],
                "common_event_id": 212,
                "switch_id": 21,    
            },
            2: {
                "title": "Scene2",
                "pictures": ["syussan01", "syussan02", "syussan03", "syussan04", "syussan05"],
                "common_event_id": 213,
                "switch_id": 22
            },
            3: {
                "title": "Scene3",
                "pictures": ["CS03_01", "CS03_02", "CS03_03", "CS03_04", "CS03_05", "CS03_06", "CS03_07", "CS03_08", "CS03_09", "CS03_10", "CS03_11", "CS03_21", "CS03_22", "CS03_23", "CS03_24", "CS03_25", "CS03_26", "CS03_27", "CS03_28", "CS03_29", "CS03_30", "CS03_31"],
                "common_event_id": 214,
                "switch_id": 23
            },
            4: {
                "title": "Scene4",
                "pictures": ["CS04_01", "CS04_02", "CS04_03", "CS04_04","CS04_04_02", "CS04_05","CS04_05_02", "CS04_06", "CS04_07", "CS04_08", "CS04_09", "CS04_11", "CS04_12", "CS04_13", "CS04_14","CS04_14_02", "CS04_15","CS04_15_02", "CS04_16", "CS04_17", "CS04_18", "CS04_19"],
                "common_event_id": 215,
                "switch_id": 24
            },
            5: {
                "title": "Scene5",
                "pictures": ["CS05_01", "CS05_02", "CS05_03", "CS05_04", "CS05_11", "CS05_12", "CS05_13", "CS05_14"],
                "common_event_id": 216,
                "switch_id": 25
            },
            6: {
                "title": "Scene6",
                "pictures": ["CS02_01", "CS02_02", "CS02_03", "CS02_03_2", "CS02_04","CS02_04_2", "CS02_05", "CS02_06", "CS02_07", "CS02_08", "CS02_11", "CS02_12", "CS02_13", "CS02_13_2", "CS02_14","CS02_14_2", "CS02_15", "CS02_16", "CS02_17", "CS02_18"],
                "common_event_id": 217,
                "switch_id": 26
            },
            7: {
                "title": "Scene7",
                "pictures": ["CS09_01", "CS09_02", "CS09_03", "CS09_04","CS09_04_2", "CS09_05", "CS09_06", "CS09_07","CS09_08","CS09_09","CS09_10", "CS09_11", "CS09_12", "CS09_13", "CS09_14","CS09_14_2", "CS09_15", "CS09_16", "CS09_17", "CS09_18", "CS09_19", "CS09_20"],
                "common_event_id": 218,
                "switch_id": 27
 },
            8: {
                "title": "Scene8",
                "pictures": ["CS10_01", "CS10_02","CS10_02s", "CS10_03","CS10_03s", "CS10_04","CS10_04s", "CS10_05","CS10_05s", "CS10_06", "CS10_07", "CS10_08", "CS10_09", "CS10_10", "CS10_11", "CS10_12", "CS10_12s","CS10_13","CS10_13s", "CS10_14","CS10_14s", "CS10_15","CS10_15s", "CS10_16", "CS10_17", "CS10_18", "CS10_19", "CS10_20"],
                "common_event_id": 219,
                "switch_id": 28
            },
            9: {
                "title": "Scene9",
                "pictures": ["CS11_01", "CS11_02", "CS11_03", "CS11_11", "CS11_12", "CS11_13"],
                "common_event_id": 220,
                "switch_id": 29
            },
           10: {
                "title": "Scene10",
                "pictures": ["CS06_01", "CS06_02", "CS06_03", "CS06_04", "CS06_05", "CS06_06", "CS06_07", "CS06_11", "CS06_12", "CS06_13", "CS06_14", "CS06_15", "CS06_16", "CS06_17"],
                "common_event_id": 221,
                "switch_id": 30
			},
           11: {
                "title": "Scene11",
                "pictures": ["shower", "shower2"],
                "common_event_id": 222,
                "switch_id": 31	
            },
           12: {
                "title": "Scene12",
                "pictures": ["CS07_01", "CS07_02", "CS07_03", "CS07_03s", "CS07_04", "CS07_05", "CS07_06", "CS07_07", "CS07_08", "CS07_11", "CS07_12", "CS07_13", "CS07_13s", "CS07_14", "CS07_15", "CS07_16", "CS07_17", "CS07_18"],
                "common_event_id": 223,
                "switch_id": 32
            },
           13: {
                "title": "Scene13",
                "pictures": ["CS08_01", "CS08_02", "CS08_03", "CS08_11", "CS08_12", "CS08_13"],
                "common_event_id": 224,
                "switch_id": 33
           	},
           14: {
                "title": "Scene14",
                "pictures": ["CS18_01", "CS18_02", "CS18_02s", "CS18_03","CS18_03s", "CS18_04", "CS18_05", "CS18_06", "CS18_07", "CS18_08", "CS18_11", "CS18_12", "CS18_12s", "CS18_13","CS18_13s", "CS18_14", "CS18_15", "CS18_16", "CS18_17", "CS18_18"],
                "common_event_id": 225,
                "switch_id": 34
            },
           15: {
                "title": "Scene15",
                "pictures": ["CS19_01", "CS19_02", "CS19_03", "CS19_04", "CS19_05", "CS19_06", "CS19_07", "CS19_08", "CS19_09","CS19_10","CS19_11", "CS19_12",  "CS19_13", "CS19_14", "CS19_15", "CS19_16", "CS19_17", "CS19_18", "CS19_19", "CS19_20"],
                "common_event_id": 226,
                "switch_id": 35
            },
           16: {
                "title": "Scene16",
                "pictures": ["CS22_01", "CS22_02", "CS22_03", "CS22_11", "CS22_12", "CS22_13"],
                "common_event_id": 227,
                "switch_id": 36
            },
           17: {
                "title": "Scene17",
                "pictures": ["CS16_01", "CS16_02", "CS16_02s", "CS16_03", "CS16_03s", "CS16_04", "CS16_04s", "CS16_05", "CS16_05s", "CS16_06", "CS16_06s", "CS16_07", "CS16_08", "CS16_09", "CS16_10", "CS16_11", "CS16_12", "CS16_13", "CS16_21", "CS16_22", "CS16_22s", "CS16_23", "CS16_23s", "CS16_24", "CS16_24s", "CS16_25", "CS16_25s", "CS16_26", "CS16_26s", "CS16_27", "CS16_28", "CS16_29", "CS16_30", "CS16_31", "CS16_32", "CS16_33"],
                "common_event_id": 228,
                "switch_id": 37
            },
           18: {
                "title": "Scene18",
                "pictures": ["CS17_01", "CS17_02", "CS17_03", "CS17_11", "CS17_12", "CS17_13"],
                "common_event_id": 229,
                "switch_id": 38
            },
           19: {
                "title": "Scene19",
                "pictures": ["CS14_01", "CS14_02", "CS14_03", "CS14_03s", "CS14_04", "CS14_04s", "CS14_05", "CS14_05s", "CS14_06", "CS14_07", "CS14_08", "CS14_09", "CS14_10", "CS14_11", "CS14_12", "CS14_13", "CS14_13s", "CS14_14", "CS14_14s", "CS14_15", "CS14_15s", "CS14_16", "CS14_17", "CS14_18", "CS14_19", "CS14_20"],
                "common_event_id": 230,
                "switch_id": 39
            },
           20: {
                "title": "Scene20",
                "pictures": ["CS12_01", "CS12_02", "CS12_03", "CS12_03s", "CS12_04", "CS12_04s", "CS12_05", "CS12_05s", "CS12_06", "CS12_06s", "CS12_07", "CS12_08", "CS12_09", "CS12_10", "CS12_11", "CS12_21", "CS12_22", "CS12_23", "CS12_23s", "CS12_24", "CS12_24s", "CS12_25", "CS12_25s", "CS12_26", "CS12_26s", "CS12_27", "CS12_28", "CS12_29", "CS12_30", "CS12_31"],
                "common_event_id": 231,
                "switch_id": 40
            },
           21: {
                "title": "Scene21",
                "pictures": ["CS15_01", "CS15_02", "CS15_03", "CS15_04", "CS15_04s", "CS15_05", "CS15_05s", "CS15_06", "CS15_06s", "CS15_07", "CS15_08", "CS15_09", "CS15_10", "CS15_11", "CS15_12", "CS15_13", "CS15_14", "CS15_14s", "CS15_15", "CS15_15s", "CS15_16", "CS15_16s", "CS15_17", "CS15_18", "CS15_19", "CS15_20"],
                "common_event_id": 232,
                "switch_id": 41
            },
           22: {
                "title": "Scene22",
                "pictures": ["CS20_01", "CS20_02", "CS20_03", "CS20_04", "CS20_05", "CS20_06", "CS20_07", "CS20_08", "CS20_09", "CS20_10", "CS20_11", "CS20_12", "CS20_13", "CS20_14", "CS20_15", "CS20_16", "CS20_17", "CS20_18", "CS20_19", "CS20_20"],
                "common_event_id": 233,
                "switch_id": 42	
            },
           23: {
                "title": "Scene23",
                "pictures": ["CS23_01", "CS23_02", "CS23_02s", "CS23_03", "CS23_03s", "CS23_04", "CS23_04s", "CS23_05", "CS23_05s", "CS23_06", "CS23_06s", "CS23_07", "CS23_08", "CS23_11", "CS23_12", "CS23_12s", "CS23_13", "CS23_13s", "CS23_14", "CS23_14s", "CS23_15", "CS23_15s", "CS23_16", "CS23_16s", "CS23_17", "CS23_18"],
                "common_event_id": 234,
                "switch_id": 43	
            },
           24: {
                "title": "Scene24",
                "pictures": ["CS24_01", "CS24_02", "CS24_03", "CS24_03s", "CS24_04", "CS24_04s", "CS24_05", "CS24_06", "CS24_07", "CS24_08", "CS24_11", "CS24_12", "CS24_13", "CS24_13s", "CS24_14", "CS24_14s", "CS24_15", "CS24_16", "CS24_17", "CS24_18"],
                "common_event_id": 235,
                "switch_id": 44	
            },
           25: {
                "title": "Scene25",
                "pictures": ["CS25_01", "CS25_02", "CS25_02s", "CS25_03", "CS25_03s", "CS25_04", "CS25_04s", "CS25_05", "CS25_05s", "CS25_06", "CS25_06s", "CS25_07", "CS25_08", "CS25_11", "CS25_12", "CS25_12s", "CS25_13", "CS25_13s", "CS25_14", "CS25_14s", "CS25_15", "CS25_15s", "CS25_16", "CS25_16s", "CS25_17", "CS25_18"],
                "common_event_id": 236,
                "switch_id": 45	
            },
           26: {
                "title": "Scene26",
                "pictures": ["CS13_01", "CS13_02", "CS13_03", "CS13_03s", "CS13_04", "CS13_04s", "CS13_05", "CS13_05s", "CS13_06", "CS13_07", "CS13_08", "CS13_09", "CS13_10", "CS13_21", "CS13_22", "CS13_23", "CS13_23s", "CS13_24", "CS13_24s", "CS13_25", "CS13_25s", "CS13_26", "CS13_27", "CS13_28", "CS13_29", "CS13_30"],
                "common_event_id": 237,
                "switch_id": 46	
            },
           27: {
                "title": "Scene27",
                "pictures": ["CS27_01", "CS27_02", "CS27_02s", "CS27_03", "CS27_03s", "CS27_04", "CS27_04s", "CS27_05", "CS27_05s", "CS27_06", "CS27_06s", "CS27_07", "CS27_07s", "CS27_08", "CS27_09", "CS27_10", "CS27_11", "CS27_21", "CS27_22", "CS27_22s", "CS27_23", "CS27_23s", "CS27_24", "CS27_24s", "CS27_25", "CS27_25s", "CS27_26", "CS27_26s", "CS27_27", "CS27_27s", "CS27_28", "CS27_29", "CS27_30", "CS27_31"],
                "common_event_id": 238,
                "switch_id": 47	
            },
           28: {
                "title": "Scene28",
                "pictures": ["CS28_01", "CS28_02", "CS28_02s", "CS28_03", "CS28_03s", "CS28_04", "CS28_05", "CS28_06", "CS28_07", "CS28_11", "CS28_12", "CS28_12s", "CS28_13", "CS28_13s", "CS28_14", "CS28_15", "CS28_16", "CS28_17"],
                "common_event_id": 239,
                "switch_id": 48	
            },
           29: {
                "title": "Scene29",
                "pictures": ["CS29_01", "CS29_02", "CS29_02s", "CS29_03", "CS29_03s", "CS29_04", "CS29_04s", "CS29_05", "CS29_06", "CS29_07", "CS29_08", "CS29_09", "CS29_11", "CS29_12", "CS29_12s", "CS29_13", "CS29_13s", "CS29_14", "CS29_14s", "CS29_15", "CS29_16", "CS29_17", "CS29_18", "CS29_19"],
                "common_event_id": 240,
                "switch_id": 49	
            },
           30: {
                "title": "Scene30",
                "pictures": ["CS21_01", "CS21_02", "CS21_02s", "CS21_03", "CS21_03s", "CS21_04", "CS21_04s", "CS21_05", "CS21_05s", "CS21_06", "CS21_06s", "CS21_07", "CS21_07s", "CS21_08", "CS21_08s", "CS21_09", "CS21_09s", "CS21_10", "CS21_10s", "CS21_11", "CS21_12", "CS21_13", "CS21_14", "CS21_15", "CS21_16", "CS21_21", "CS21_22", "CS21_22s", "CS21_23", "CS21_23s", "CS21_24", "CS21_24s", "CS21_25", "CS21_25s", "CS21_26", "CS21_26s", "CS21_27", "CS21_27s", "CS21_28", "CS21_28s", "CS21_29", "CS21_29s", "CS21_30", "CS21_30s", "CS21_31", "CS21_32", "CS21_33", "CS21_34", "CS21_35", "CS21_36"],
                "common_event_id": 241,
                "switch_id": 50	
            },
           31: {
                "title": "Scene31",
                "pictures": ["CS31_01", "CS31_02", "CS31_03", "CS31_04", "CS31_05", "CS31_06", "CS31_07", "CS31_08", "CS31_08s", "CS31_09", "CS31_09s", "CS31_10", "CS31_10s", "CS31_11", "CS31_11s", "CS31_12", "CS31_13", "CS31_14", "CS31_15", "CS31_16", "CS31_17", "CS31_18", "CS31_19", "CS31_20", "CS31_21", "CS31_32", "CS31_33", "CS31_34", "CS31_35", "CS31_36", "CS31_37", "CS31_38", "CS31_38s", "CS31_39", "CS31_39s", "CS31_40", "CS31_40s", "CS31_41", "CS31_41s", "CS31_42", "CS31_43", "CS31_44", "CS31_46", "CS31_47", "CS31_48", "CS31_49", "CS31_50", "CS31_51"],
                "common_event_id": 242,
                "switch_id": 51
			},
           32: {
                "title": "Scene32",
                "pictures": ["CS30_01", "CS30_02", "CS30_03", "CS30_04", "CS30_05"],
                "common_event_id": 243,
                "switch_id": 51
            },
           33: {
                "title": "Scene33",
                "pictures": ["CS32_01", "CS32_02", "CS32_03", "CS32_03s", "CS32_04", "CS32_04s", "CS32_05", "CS32_05s", "CS32_06", "CS32_06s", "CS32_07", "CS32_08", "CS32_09", "CS32_10", "CS32_11", "CS32_12", "CS32_13", "CS32_13s", "CS32_14", "CS32_14s", "CS32_15", "CS32_15s", "CS32_16", "CS32_16s", "CS32_17", "CS32_18", "CS32_19", "CS32_20"],
                "common_event_id": 244,
                "switch_id": 52
            },
           34: {
                "title": "Scene34",
                "pictures": ["CS33_01", "CS33_02", "CS33_03", "CS33_03s", "CS33_04", "CS33_04s", "CS33_05", "CS33_05s", "CS33_06", "CS33_06s", "CS33_07", "CS33_07s", "CS33_08", "CS33_08s", "CS33_09", "CS33_10", "CS33_11", "CS33_12", "CS33_21", "CS33_22", "CS33_23", "CS33_23s", "CS33_24", "CS33_24s", "CS33_25", "CS33_25s", "CS33_26", "CS33_26s", "CS33_27", "CS33_27s", "CS33_28", "CS33_28s", "CS33_29", "CS33_30", "CS33_31", "CS33_32"],
                "common_event_id": 245,
                "switch_id": 53
            },
           35: {
                "title": "Scene35",
                "pictures": ["CS34_01", "CS34_02", "CS34_11", "CS34_12"],
                "common_event_id": 246,
                "switch_id": 54
            },
           36: {
                "title": "Scene36",
                "pictures": ["CS38_01", "CS38_01s", "CS38_02", "CS38_02s", "CS38_03", "CS38_03s", "CS38_04", "CS38_05", "CS38_06", "CS38_07", "CS38_11", "CS38_11s", "CS38_12", "CS38_12s", "CS38_13", "CS38_13s", "CS38_14", "CS38_15", "CS38_16", "CS38_17"],
                "common_event_id": 247,
                "switch_id": 55
            },
           37: {
                "title": "Scene37",
                "pictures": ["CS36_01"],
                "common_event_id": 248,
                "switch_id": 56
            },
           38: {
                "title": "Scene38",
                "pictures": ["CS36_01"],
                "common_event_id": 249,
                "switch_id": 57
            },
           39: {
                "title": "Scene39",
                "pictures": ["CS35_01", "CS35_02", "CS35_03", "CS35_04", "CS35_11", "CS35_12", "CS35_13", "CS35_14"],
                "common_event_id": 250,
                "switch_id": 58
            },
           40: {
                "title": "Scene40",
                "pictures": ["CS39_01", "CS39_02", "CS39_03", "CS39_04", "CS39_05", "CS39_11", "CS39_12", "CS39_13", "CS39_14", "CS39_15"],
                "common_event_id": 251,
                "switch_id": 59
            },
           41: {
                "title": "Scene41",
                "pictures": ["CS41_01", "CS41_02", "CS41_03", "CS41_11", "CS41_12", "CS41_13"],
                "common_event_id": 252,
                "switch_id": 60
            },
           42: {
                "title": "Scene42",
                "pictures": ["CS36_01", "CS40_01"],
                "common_event_id": 253,
                "switch_id": 61				
            }
            },
        //---------------------------------------------------------------------
        // ★ 回想時に一時的に利用するマップIDを指定します
        //---------------------------------------------------------------------
        // 通常は何もないマップを指定します
        //---------------------------------------------------------------------
        "sandbox_map_id": 14,
        //---------------------------------------------------------------------
        // ★ 回想用スイッチをセーブデータ間で共有するかどうかを指定します
        //---------------------------------------------------------------------
        // パラメータの説明
        // true:
        //      回想用スイッチを共有します。
        //
        //      例1：セーブ1で回想スイッチ1, 2, 3がONとする
        //          ニューゲームで開始し、セーブ1を上書きする
        //          →セーブ1の回想スイッチ1, 2, 3はONのままとなる。
        //
        //      例2: セーブ1で回想スイッチ1, 2, 3がONとする
        //          セーブ1をロードし、セーブ2を保存する
        //          セーブ2で回想スイッチ1, 2, 3, 7がONとする
        //          セーブ1, セーブ2それぞれで、回想スイッチ1, 2, 3, 7がONとなる
        //
        // false:
        //      回想用スイッチを共有しません
        //
        // すべてのセーブデータを削除した場合にのみ、スイッチがリセットされます
        //---------------------------------------------------------------------
        "share_recollection_switches": true
    };

    function rngd_hash_size(obj) {
        var cnt = 0;
        for(var o in obj) {
            cnt++;
        }
        return cnt;
    }

//-----------------------------------------------------------------------------
// ◆ Scene関数
//-----------------------------------------------------------------------------

    //=========================================================================
    // ■ Scene_Recollection
    //=========================================================================
    // 回想用のシーン関数です
    //=========================================================================
    function Scene_Recollection() {
        this.initialize.apply(this, arguments);
    }

    Scene_Recollection.prototype = Object.create(Scene_Base.prototype);
    Scene_Recollection.prototype.constructor = Scene_Recollection;

    Scene_Recollection.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };

    Scene_Recollection.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createWindowLayer();
        this.createCommandWindow();
    };

    // 回想モードのカーソル
    Scene_Recollection.rec_list_index = 0;

    // 回想モードの再読み込み判定用 true: コマンドウィンドウを表示せず回想リストを表示 false:コマンドウィンドウを表示
    Scene_Recollection.reload_rec_list = false;

    Scene_Recollection.prototype.createCommandWindow = function() {

        if(Scene_Recollection.reload_rec_list) {
            // 回想モード選択ウィンドウ
            this._rec_window = new Window_RecollectionCommand();
            this._rec_window.setHandler('select_recollection', this.commandShowRecollection.bind(this));
            this._rec_window.setHandler('select_cg', this.commandShowCg.bind(this));
            this._rec_window.setHandler('select_back_title', this.commandBackTitle.bind(this));

            // リロードの場合：選択ウィンドウを非表示にする。通常はここがtrue
            this._rec_window.visible = false;
            this._rec_window.deactivate();
            this.addWindow(this._rec_window);

            // 回想リスト
            this._rec_list = new Window_RecList(0, 0, Graphics.width, Graphics.height);

            // リロードの場合：回想リストを表示にする。通常はここがfalse
            this._rec_list.visible = true;
            this._rec_list.setHandler('ok', this.commandDoRecMode.bind(this));
            this._rec_list.setHandler('cancel', this.commandBackSelectMode.bind(this));
            this._mode = "recollection";
            this._rec_list.activate();
            this._rec_list.select(Scene_Recollection.rec_list_index);

            this.addWindow(this._rec_list);

            // CG参照用ダミーコマンド
            this._dummy_window = new Window_Command(0, 0);
            this._dummy_window.deactivate();
            this._dummy_window.visible = false;
            this._dummy_window.setHandler('ok', this.commandDummyOk.bind(this));
            this._dummy_window.setHandler('cancel', this.commandDummyCancel.bind(this));
            this._dummy_window.addCommand('next', 'ok');
            this.addWindow(this._dummy_window);

            Scene_Recollection.reload_rec_list = false;

        } else {
            // 回想モード選択ウィンドウ
            this._rec_window = new Window_RecollectionCommand();
            this._rec_window.setHandler('select_recollection', this.commandShowRecollection.bind(this));
            this._rec_window.setHandler('select_cg', this.commandShowCg.bind(this));
            this._rec_window.setHandler('select_back_title', this.commandBackTitle.bind(this));
            this.addWindow(this._rec_window);

            // 回想リスト
            this._rec_list = new Window_RecList(0, 0, Graphics.width, Graphics.height);
            this._rec_list.visible = false;
            this._rec_list.setHandler('ok', this.commandDoRecMode.bind(this));
            this._rec_list.setHandler('cancel', this.commandBackSelectMode.bind(this));
            this._rec_list.select(Scene_Recollection.rec_list_index);
            this.addWindow(this._rec_list);

            // CG参照用ダミーコマンド
            this._dummy_window = new Window_Command(0, 0);
            this._dummy_window.deactivate();
            this._dummy_window.visible = false;
            this._dummy_window.setHandler('ok', this.commandDummyOk.bind(this));
            this._dummy_window.setHandler('cancel', this.commandDummyCancel.bind(this));
            this._dummy_window.addCommand('next', 'ok');
            this.addWindow(this._dummy_window);
        }

    };

    //-------------------------------------------------------------------------
    // ● 開始処理
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        this._rec_window.refresh();
        this._rec_list.refresh();
        AudioManager.playBgm(rngd_recollection_mode_settings.rec_mode_bgm.bgm);
        Scene_Recollection._rngd_recollection_doing = false;
    };

    //-------------------------------------------------------------------------
    // ● 更新処理
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.update = function() {
        Scene_Base.prototype.update.call(this);

    };

    //-------------------------------------------------------------------------
    // ● 「回想を見る」を選択した際のコマンド
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.commandShowRecollection = function() {
        // モードウィンドウの無効化とリストウィンドウの有効化
        this.do_exchange_status_window(this._rec_window, this._rec_list);
        this._mode = "recollection";
    };

    //-------------------------------------------------------------------------
    // ● 「CGを見る」を選択した際のコマンド
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.commandShowCg = function() {
        this.do_exchange_status_window(this._rec_window, this._rec_list);
        this._mode = "cg";
    };

    //-------------------------------------------------------------------------
    // ● 「タイトルに戻る」を選択した際のコマンド
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.commandBackTitle = function() {
        Scene_Recollection.rec_list_index = 0;
        SceneManager.goto(Scene_Title);
    };

    //-------------------------------------------------------------------------
    // ● 回想orCGモードから「キャンセル」して前の画面に戻った場合のコマンド
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.commandBackSelectMode = function() {
        this.do_exchange_status_window(this._rec_list, this._rec_window);
    };

    //-------------------------------------------------------------------------
    // ● 回想orCGモードにおいて、実際の回想orCGを選択した場合のコマンド
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.commandDoRecMode = function() {
        var target_index = this._rec_list.index() + 1;
        Scene_Recollection.rec_list_index = target_index - 1;

        if (this._rec_list.is_valid_picture(this._rec_list.index() + 1)) {
            // 回想モードの場合
            if (this._mode == "recollection") {
                Scene_Recollection._rngd_recollection_doing = true;

                DataManager.setupNewGame();
                $gamePlayer.setTransparent(255);
                this.fadeOutAll();
                // TODO: パーティを透明状態にする

                //$dataSystem.optTransparent = false;
                $gameTemp.reserveCommonEvent(rngd_recollection_mode_settings.rec_cg_set[target_index]["common_event_id"]);
                $gamePlayer.reserveTransfer(rngd_recollection_mode_settings.sandbox_map_id, 0, 0, 0);
                SceneManager.push(Scene_Map);

                // CGモードの場合
            } else if (this._mode == "cg") {
                this._cg_sprites = [];
                this._cg_sprites_index = 0;

                // シーン画像をロードする
                rngd_recollection_mode_settings.rec_cg_set[target_index].pictures.forEach(function (name) {
                    var sp = new Sprite();
                    sp.bitmap = ImageManager.loadPicture(name);
                    // 最初のSprite以外は見えないようにする
                    if (this._cg_sprites.length > 0) {
                        sp.visible = false;
                    }

                    // TODO: 画面サイズにあわせて、拡大・縮小すべき
                    this._cg_sprites.push(sp);
                    this.addChild(sp);

                }, this);

                this.do_exchange_status_window(this._rec_list, this._dummy_window);
                this._dummy_window.visible = false;
            }
        } else {
            this._rec_list.activate();
        }
    };

    Scene_Recollection.prototype.commandDummyOk = function() {

        if(this._cg_sprites_index < this._cg_sprites.length - 1) {
            this._cg_sprites[this._cg_sprites_index].visible = false;
            this._cg_sprites_index++;
            this._cg_sprites[this._cg_sprites_index].visible = true;

            this._dummy_window.activate();
        } else {
            this.commandDummyCancel();
        }
    };

    Scene_Recollection.prototype.commandDummyCancel = function() {
        this._cg_sprites.forEach(function(obj) {
            obj.visible = false;
            obj = null;
        });
        this.do_exchange_status_window(this._dummy_window, this._rec_list);
    };

    // コモンイベントから呼び出す関数
    Scene_Recollection.prototype.rngd_exit_scene = function() {
        if(Scene_Recollection._rngd_recollection_doing) {
            // Window_RecListを表示する
            Scene_Recollection.reload_rec_list = true;
            SceneManager.push(Scene_Recollection);
        }
    };

    //-------------------------------------------------------------------------
    // ● ウィンドウの無効化と有効化
    //-------------------------------------------------------------------------
    // win1: 無効化するウィンドウ
    // win2: 有効化するウィンドウ
    //-------------------------------------------------------------------------
    Scene_Recollection.prototype.do_exchange_status_window = function(win1, win2) {
        win1.deactivate();
        win1.visible = false;
        win2.activate();
        win2.visible = true;
    };
    //-------------------------------------------------------------------------
    // ● セーブ・ロード・ニューゲーム時に必要なスイッチをONにする
    //-------------------------------------------------------------------------
    Scene_Recollection.setRecollectionSwitches = function() {
        // 各セーブデータを参照し、RecollectionMode用のスイッチを検索する
        // スイッチが一つでもONになっている場合は回想をONにする
        for(var i = 1; i <= DataManager.maxSavefiles(); i++) {
            var data = null;
            try {
                data = StorageManager.loadFromLocalFile(i);
            } catch(e) {
                data = StorageManager.loadFromWebStorage(i);
            }
            if(data) {
                var save_data_obj = JsonEx.parse(data);
                var rec_cg_max = rngd_hash_size(rngd_recollection_mode_settings.rec_cg_set);

                for(var j = 0; j < rec_cg_max; j++) {
                    var cg = rngd_recollection_mode_settings.rec_cg_set[j+1];
                    if(save_data_obj["switches"]._data[cg.switch_id] &&
                        save_data_obj["switches"]._data[cg.switch_id] == true) {
                        $gameSwitches.setValue(cg.switch_id, true);
                    }
                }
            }
        }
    };

//-----------------------------------------------------------------------------
// ◆ Window関数
//-----------------------------------------------------------------------------

    //=========================================================================
    // ■ Window_RecollectionCommand
    //=========================================================================
    // 回想モードかCGモードを選択するウィンドウです
    //=========================================================================
    function Window_RecollectionCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_RecollectionCommand.prototype = Object.create(Window_Command.prototype);
    Window_RecollectionCommand.prototype.constructor = Window_RecollectionCommand;

    Window_RecollectionCommand.prototype.initialize = function() {
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.x = rngd_recollection_mode_settings.rec_mode_window.x;
        this.y = rngd_recollection_mode_settings.rec_mode_window.y;

    };

    Window_RecollectionCommand.prototype.makeCommandList = function() {
        Window_Command.prototype.makeCommandList.call(this);
        this.addCommand(rngd_recollection_mode_settings.rec_mode_window.str_select_recollection, "select_recollection");
        this.addCommand(rngd_recollection_mode_settings.rec_mode_window.str_select_cg, "select_cg");
        this.addCommand(rngd_recollection_mode_settings.rec_mode_window.str_select_back_title, "select_back_title");
    };

    //=========================================================================
    // ■ Window_RecollectionList
    //=========================================================================
    // 回想またはCGを選択するウィンドウです
    //=========================================================================
    function Window_RecList() {
        this.initialize.apply(this, arguments);
    }

    Window_RecList.prototype = Object.create(Window_Selectable.prototype);
    Window_RecList.prototype.constructor = Window_RecList;

    //-------------------------------------------------------------------------
    // ● 初期化処理
    //-------------------------------------------------------------------------
    Window_RecList.prototype.initialize = function(x, y, width, height) {
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.windowWidth = width;
        this.windowHeight = height;
        this.select(0);
        this._formationMode = false;
        this.get_global_variables();
        this.refresh();

    };

    Window_RecList.prototype.maxItems = function() {
        return rngd_hash_size(rngd_recollection_mode_settings.rec_cg_set);
    };

    Window_RecList.prototype.itemHeight = function() {
        return (this.height - this.standardPadding()) / rngd_recollection_mode_settings.rec_list_window.item_height;
    };

    //Window_RecList.prototype.maxRows = function() {
    //    return rngd_recollection_mode_settings.rec_list_window.item_height;
    //};

    Window_RecList.prototype.maxCols = function() {
        return rngd_recollection_mode_settings.rec_list_window.item_width;
    };

    Window_RecList.prototype.maxPageRows = function() {
        var pageHeight = this.height;// - this.padding * 2;
        return Math.floor(pageHeight / this.itemHeight());
    };

    Window_RecList.prototype.drawItem = function(index) {
        // TODO: itemWidthにあわせたサイズに拡大・縮小する
        // 1番目のCGセットを取得
        var rec_cg = rngd_recollection_mode_settings.rec_cg_set[index+1];
        var rect = this.itemRect(index);
        var text_height = 0;
        if(rngd_recollection_mode_settings.rec_list_window.show_title_text) {
            if(this._global_variables["switches"][rec_cg.switch_id]) {
                this.contents.drawText(rec_cg.title, rect.x + 4, rect.y + 4, this.itemWidth(), 32,
                    rngd_recollection_mode_settings.rec_list_window.title_text_align);
            } else {
                this.contents.drawText(rngd_recollection_mode_settings.rec_list_window.never_watch_title_text,
                    rect.x + 4, rect.y + 4, this.itemWidth(), 32,
                    rngd_recollection_mode_settings.rec_list_window.title_text_align);
            }
            text_height = 32;
        }

        // CGセットのスイッチ番号が、全てのセーブデータを走査した後にTrueであればピクチャ表示
        if(this._global_variables["switches"][rec_cg.switch_id]) {

            var thumbnail_file_name = rec_cg.pictures[0];
            if(rec_cg.thumbnail !== undefined && rec_cg.thumbnail !== null) {
                thumbnail_file_name = rec_cg.thumbnail;
            }

            this.drawRecollection(thumbnail_file_name, 0, 0,
                this.itemWidth() - 36, this.itemHeight() - 8 - text_height, rect.x + 16, rect.y + 4 +text_height);


        } else {
            this.drawRecollection(rngd_recollection_mode_settings.rec_list_window.never_watch_picture_name,
                    0, 0 , this.itemWidth() - 36,
                    this.itemHeight() - 8 - text_height, rect.x + 16, rect.y + 4 + text_height);

        }

    };

    //-------------------------------------------------------------------------
    // ● 全てのセーブデータを走査し、対象のシーンスイッチ情報を取得する
    //-------------------------------------------------------------------------
    Window_RecList.prototype.get_global_variables = function() {
        this._global_variables = {
            "switches": {}
        };
        var maxSaveFiles = DataManager.maxSavefiles();
        for(var i = 1; i <= maxSaveFiles; i++) {
            if(DataManager.loadGame(i)) {
                var rec_cg_max = rngd_hash_size(rngd_recollection_mode_settings.rec_cg_set);

                for(var j = 0; j < rec_cg_max; j++) {
                    var cg = rngd_recollection_mode_settings.rec_cg_set[j+1];
                    if($gameSwitches._data[cg.switch_id]) {
                        this._global_variables["switches"][cg.switch_id] = true;
                    }
                }
            }
        }
    };
    //-------------------------------------------------------------------------
    // ● index番目に表示された回想orCGが有効かどうか判断する
    //-------------------------------------------------------------------------
    Window_RecList.prototype.is_valid_picture = function(index) {
        // CG情報の取得と対象スイッチの取得
        var _rec_cg_obj = rngd_recollection_mode_settings.rec_cg_set[index];
        return ( this._global_variables["switches"][_rec_cg_obj.switch_id] == true);

    };


(function(){

//-----------------------------------------------------------------------------
// ◆ 組み込み関数Fix
//-----------------------------------------------------------------------------

    Window_Base.prototype.drawRecollection = function(bmp_name, x, y, width, height, dx, dy) {
        var bmp = ImageManager.loadPicture(bmp_name);

        var _width = width;
        var _height = height;
        if(_width > bmp.width) {
            _width = bmp.width - 1;
        }

        if(_height > bmp.height) {
            _height = bmp.height - 1;
        }
        this.contents.blt(bmp, x, y, _width, _height, dx, dy);
    };

    var Window_TitleCommand_makeCommandList =
        Window_TitleCommand.prototype.makeCommandList;

    Window_TitleCommand.prototype.makeCommandList = function() {
        Window_TitleCommand_makeCommandList.call(this);
        this.clearCommandList();
        this.addCommand(TextManager.newGame,   'newGame');
        this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
        this.addCommand(rngd_recollection_mode_settings.rec_mode_window.recollection_title, 'recollection');
        this.addCommand(TextManager.options,   'options');
    };

    Scene_Title.prototype.commandRecollection = function() {
        SceneManager.push(Scene_Recollection);
    };

    var Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler('recollection', this.commandRecollection.bind(this));
    };

    // セーブデータ共有オプションが指定されている場合のみ、カスタマイズ
    if(rngd_recollection_mode_settings["share_recollection_switches"]) {
        DataManager.makeSaveContents = function() {
            // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.

            Scene_Recollection.setRecollectionSwitches();

            var contents = {};
            contents.system       = $gameSystem;
            contents.screen       = $gameScreen;
            contents.timer        = $gameTimer;
            contents.switches     = $gameSwitches;
            contents.variables    = $gameVariables;
            contents.selfSwitches = $gameSelfSwitches;
            contents.actors       = $gameActors;
            contents.party        = $gameParty;
            contents.map          = $gameMap;
            contents.player       = $gamePlayer;

            return contents;
        };

        DataManager.extractSaveContents = function(contents) {
            $gameSystem        = contents.system;
            $gameScreen        = contents.screen;
            $gameTimer         = contents.timer;
            $gameSwitches      = contents.switches;
            $gameVariables     = contents.variables;
            $gameSelfSwitches  = contents.selfSwitches;
            $gameActors        = contents.actors;
            $gameParty         = contents.party;
            $gameMap           = contents.map;
            $gamePlayer        = contents.player;

            Scene_Recollection.setRecollectionSwitches();
        };

        DataManager.setupNewGame = function() {
            this.createGameObjects();
            Scene_Recollection.setRecollectionSwitches();
            this.selectSavefileForNewGame();
            $gameParty.setupStartingMembers();
            $gamePlayer.reserveTransfer($dataSystem.startMapId,
                $dataSystem.startX, $dataSystem.startY);
            Graphics.frameCount = 0;
        };
    }

})();