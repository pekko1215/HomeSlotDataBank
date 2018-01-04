(function(definition) { // 定義する関数を引数にとる
    // ロードされた文脈に応じてエクスポート方法を変える

    // CommonJS
    if (typeof exports === "object") {
        module.exports = definition();

        // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

        // <script>
    } else {
        SCCParser = definition();
    }

})(function() { // 実際の定義を行う関数
    var SCCParser = function SCCParser(text) {
        var ret = {};
        try {
            var arr = text.split('\n');
            var base;
            arr.forEach(data => {
                switch (true) {
                    case /\[.+\]/.test(data):
                        base = data.match(/\[(.+)\]/)[1];
                        ret[base] = {};
                        break;
                    case /(.+)=(\d+)/.test(data):
                        var matcher = data.match(/(.+)=(\d+)/);
                        var arrparse = matcher[1].match(/([^\d]+)(\d+)$/)
                        if (arrparse) {
                            var arrname = arrparse[1];
                            if (!ret[base][arrname]) {
                                ret[base][arrname] = [];
                            }
                            ret[base][arrname].push(parseInt(matcher[2]))
                        } else {
                            ret[base][matcher[1]] = parseInt(matcher[2]);
                        }
                        break;
                }
            })
        } catch (e) {
            ret = false;
        }
        return Object.keys(ret).length&&ret.GameCount?ret:false;
    };

    // モジュールのエクスポート
    return SCCParser;
});