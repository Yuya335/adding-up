'use strict';

//FileSystemオブジェクトを生成
const fs = require('fs');
//ファイルを一行ずつ読み込むモジュールの呼び出し
const readline = require('readline');

//Streamオブジェクトを生成
const rs = fs.ReadStream('./popu-pref.csv');


//Readlineオブジェクトを生成し、inputに読み込むファイルのアドレスを渡す
const rl = readline.createInterface({ 'input': rs, 'output': {}});

//key:都道府県,value:集計データのオブジェクトの連想配列をインスタンス化
const map = new Map();

//Readlineオブジェクトでlineイベント発生時にコンソールに出力するイベントプログラミング
rl.on('line', (lineString) => {
    //一行を','区切りで分割し配列に格納する
    const columns = lineString.split(',');

    //配列に格納されたデータを添え字で呼び出し「年度」「都道府県」「人口」をセットする。
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);

    //年度が「2020」か「2015」の場合はコンソールに出力する。
    if (year ===2010 || year == 2015 ) {
        let value = map.get(prefecture)
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 += popu;
        }
        if (year === 2015) {
            value.popu15 += popu;
        }
        map.set(prefecture, value);
    }
});

//ストリームに出力
rl.resume();

rl.on('close', () => {

    for (let pair of map) {
        const value = pair[1];
        value.change = value.popu15 /value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });

    const rankingString = rankingArray.map((pair, soeji) => {
        return ( soeji + 1 ) + '位　' + pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' ' + '変化率:' + pair[1].change;
    });
    console.log(rankingString);
});
