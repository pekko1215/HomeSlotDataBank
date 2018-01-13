MapGraph = function(_data) {
    const NS = "http://www.w3.org/2000/svg"
    _data = Object.assign(_data, {
        width: 676,
        height: 130
    })
    const Max = Math.max(..._data.datas.reduce((c, d) => {
        var stmp = (new Date(d.date)).toLocaleDateString()
        var idx = c.findIndex(p => p.date == stmp);
        if (idx != -1) {
            c[idx].value += d.value;
        } else {
            c.push({ value: d.value, date: stmp });
        }
        return c
    }, []).map(d => d.value));
    _data.colors = _data.colors.map(color => {
        return isNaN(color) ? color : '#' + color.toString(16)
    })
    window.addEventListener('load', () => {
        const $target = document.querySelector(_data.selector);
        const $svg = document.createElementNS(NS, 'svg');

        $svg.setAttribute('width', _data.width)
        $svg.setAttribute('height', _data.height)
        $svg.setAttribute('viewBox', `0 0 ${_data.width} ${_data.height}`)
        $svg.style.boxSizing = 'border-box';

        $target.style.border = "1px #e1e4e8 solid"
        $target.appendChild($svg);

        $allwrap = document.createElementNS(NS, 'g');
        $allwrap.setAttribute('transform', "translate(16, 20)")

        $svg.appendChild($allwrap);

        var date = new Date();
        var idx = 0;
        var xidx = 13;
        var weekidx = 0;
        var $g = document.createElementNS(NS, 'g');
        $g.setAttribute('transform', `translate(${weekidx * 13},0)`)
        for (var i = 0; i < 12; i++) {
            date.setMonth(i + 1);
            date.setDate(0);
            var d = date.getDate();
            $allwrap.appendChild($g);
            date.setDate(1);
            var day = date.getDay();
            for (var k = 1; k <= d; k++) {
                var $rect = document.createElementNS(NS, 'rect');
                $rect.dataset.idx = idx;
                $rect.dataset.day = k;
                $rect.dataset.month = i + 1
                $rect.setAttribute('width', 10);
                $rect.setAttribute('height', 10);

                $rect.setAttribute('fill', _data.colors[0]);
                $rect.setAttribute('x', xidx)
                $rect.setAttribute('y', 12 * day)
                $g.appendChild($rect)
                if (day == 6) {
                    $g = document.createElementNS(NS, 'g');
                    xidx--;
                    weekidx++;
                    $g.setAttribute('transform', `translate(${weekidx * 13},0)`)
                    $allwrap.appendChild($g);
                }
                idx++;
                day = (day + 1) % 7;
            }
        }
        _data.datas.forEach(data => {
            var nowyear = (new Date).getFullYear();
            var ddate = new Date(data.date);
            if (ddate.getFullYear() < nowyear) {
                return;
            }
            var $rect = document.querySelector(`rect[data-day="${ddate.getDate()}"][data-month="${ddate.getMonth()+1}"]`)
            var value = parseInt($rect.dataset.value) || 0;
            value += data.value;
            var level = parseInt(value / Max * (_data.colors.length - 2)) + 1;
            $rect.setAttribute('fill', _data.colors[level])
            $rect.dataset.value = value;
            console.log($rect)
        })
    })
}