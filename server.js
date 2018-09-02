var fs = require('fs');
var http = require('http');
var server = http.createServer();
var express = require('express')
var app = express();
app.use(express.static(__dirname + '/'));
var server = http.createServer(app);

var io = require('socket.io').listen(server);
server.listen(8000);

var Player = require('./js/player.js');

var MAX_MESSAGES_SIZE = 30;
var data = {
	messages : []
};
var gameInfo = {};
var playerMap = {};
// ----------------------------------------------------------------------
// プレイヤーIDを生成.
// ----------------------------------------------------------------------
function createPlayerId(params, callback) {
	var playerId = generateUuid();
	callback(playerId);
}
// ----------------------------------------------------------------------
// ゲームに参加.
// ----------------------------------------------------------------------
function addGame(params, callback, io, socket) {
	playerMap[params.playerId] = new Player(params.playerId, params.userName, io, socket);
	console.log(playerMap[params.playerId]);
}
// ----------------------------------------------------------------------
// ゲームスタート.
// ----------------------------------------------------------------------
function startGame(params) {
	// ゲーム情報のステータスをゲーム中に更新
	gameInfo.status = "ゲーム中";
	// 参加者
	var sankashaList = getSankashaList(playerMap);
	// 役職割振り
	setYakushoku(sankashaList);
	// 準備完了状態のプレイヤーにゲーム開始共通処理を実施
	$.each(sankashaList, function(i, d) {
		d.setDefault();
	});
	var gameLoop = setInterval(function() {
		// 全員の行動が完了するまで待機
		if (gameInfo.gameTime === "夜" &&
				!existsKodoMikanryo(sankashaList)) {
			// 処刑者発表
			// 夜の行動
			$.each(sankashaList, function(i, d) {
				d.doNight(gameInfo.day);
			});
			gameInfo.gameTime = "朝";
		}
		// 全員の行動が完了するまで待機
		if (gameInfo.gameTime === "朝" &&
				!existsKodoMikanryo(sankashaList)) {
			gameInfo.day++;
			// 人狼の被害者発表
			// ゲーム終了チェック
			// 朝の行動
			$.each(sankashaList, function(i, d) {
				d.doMorning(gameInfo.day);
			});
			gameInfo.gameTime = "夜";
		}
	}, 1000);
}
// ----------------------------------------------------------------------
// 参加者リストを返す.
// ----------------------------------------------------------------------
function getSankashaList(playerMap) {
	var sankashaList = [];
	var keys = Object.keys(playerMap);
	$.each(keys, function(i, d) {
		var player = playerMap[d];
		if (player.isReadyToStart === true) {
			sankashaList.push(player);
		}
	});
	return sankashaList;
}
// ----------------------------------------------------------------------
// 役職割振.
// ----------------------------------------------------------------------
function setYakushoku(playerList) {
	var yakushokuList = ["狂人", "占い師", "霊媒師", "狩人"];
	yakushokuList = addJinro(yakushokuList, playerList.length);
	yakushokuList = addMurabito(yakushokuList, playerList.length);
	arrayShuffle(playerList);
	arrayShuffle(yakushokuList);
	for (var i = 0; i < playerList.length; i++) {
		var entity = playerList[i];
		var yakushoku = yakushokuList[i];
		entity.setYakushoku(yakushoku);
	}
}
// ----------------------------------------------------------------------
// 人数に応じて人狼を追加.
// ----------------------------------------------------------------------
function addJinro(yakushokuList, sankashaNinzu) {
	yakushokuList.push("人狼");
	for (var i = 0; i < sankashaNinzu / 7; i++) {
		yakushokuList.push("人狼");
	}
	return yakushokuList;
}
// ----------------------------------------------------------------------
// 人数に応じて村人を追加.
// ----------------------------------------------------------------------
function addSmurabito(yakushokuList, sankashaNinzu) {
	for (var i = 0; i < sankashaNinzu; i++) {
		yakushokuList.push("村人");
	}
	return yakushokuList;
}
// ----------------------------------------------------------------------
// UUID生成.
// ----------------------------------------------------------------------
function generateUuid() {
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
};
//----------------------------------------------------------------------
// 配列をシャッフルする.
//----------------------------------------------------------------------
function arrayShuffle(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var r = Math.floor(Math.random() * (i + 1));
		var tmp = array[i];
		array[i] = array[r];
		array[r] = tmp;
	}
}
// ----------------------------------------------------------------------
// 現在の日時を取得する.
// ----------------------------------------------------------------------
function getDateTime() {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var day = now.getDate();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
// ----------------------------------------------------------------------
// 現在の日時を取得する（ログ用）.
// ----------------------------------------------------------------------
function getDateTimeForLog() {
	return "[" + getDateTime() + "] ";
}
// ----------------------------------------------------------------------
// 接続処理.
// ----------------------------------------------------------------------
io.sockets.on("connection", function(socket) {
	socket.on("createPlayerId", createPlayerId);
	socket.on("addGame", function(params, callback) {
		addGame(params, callback, io, socket);
	});
	// 渡されたUUIDとsocketIdを紐づける
	socket.on("setSocketId", function(playerId) {
		if (playerMap[playerId]) {
			playerMap[playerId].setSocketId(socket.id);
			console.log("setSocketId: " + playerId + ", " + socket.id);
		} else {
			console.log("not added game: " + playerId);
		}
	});
	socket.on("startGame", startGame);
});
