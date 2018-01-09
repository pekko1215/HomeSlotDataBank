var client = require('cheerio-httpcli')
module.exports = function(Slot) {
    client.fetch('http://slothistory.com/zen_all.html')
        .then(result => {
            var $ = result.$
            var base = $('font[face="メイリオ"]').eq(1).text();
            base.split("\n").slice(0, -2).map(text => {
                text = text
                    .replace(/#NAME\?/, " リノタイプ");
                if (/1,2/.test(text)) {
                    text = text.replace(/1,2/g, "");
                    var arr = text.match(/(\d+)[\s　](.+?)[\s　]｜(.+?)[\s　](.+?)[\s　](.+?)[\s　](.+?)[\s　]*$/);
                    if (!arr) { return }
                    var name = arr[2];
                    var maker = arr[4];
                    var unittype = parseFloat(arr[5]);
                    var type = arr[6];
                    return () => {
                        return Slot.update({
                                createdBy: 'system',
                                maker: maker,
                                type: type,
                                unittype: unittype
                            },{
                                where:{
                                    name:name
                                }
                            })
                            .then((user, created) => {
                                console.log(`Change ${name}`);
                            })
                            .catch(console.log)
                    }
                }
                return;
                var arr = text.match(/(\d+)[\s　](.+?)[\s　]｜(.+?)[\s　](.+?)[\s　](.+?)[\s　](.+?)[\s　]*$/);
                if (!arr) { return }
                var name = arr[2];
                var maker = arr[4];
                var unittype = arr[5];
                var type = arr[6];
                return () => {
                    return Slot.create({
                            name: name,
                            createdBy: 'system',
                            maker: maker,
                            type: type,
                            unittype: unittype
                        })
                        .then((user, created) => {
                            console.log(`Add ${name}`);
                        })
                        .catch(console.log)
                }
            }).reduce((p, m) => p.then(m), Promise.resolve());
        }).catch(console.log)
}