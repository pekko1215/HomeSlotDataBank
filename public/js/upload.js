$(function() {
    var timer;
    $('input[id=lefile]').change(function(e) {
        var file = e.target.files[0];
        var reader = new FileReader;
        $('.information-data').each((e) => {
            e.innerText = "";
        });
        $('.information-box').hide();
        $('.information-datawrap').children().remove();
        reader.onload = function() {
            var text = reader.result;
            var data = SCCParser(text);
            if (!data) {
                $('.alert').show();
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    $('.alert').hide();
                    timer = false;
                }, 3000)
            } else {
                var arr = file.name.split('.');
                arr.pop();
                $('#dataname').text(arr.join('.'))
                $('#allplaycount').text(data.GameCount.TotalGames);
                $('#playcount').text(data.GameCount.NowGames);
                $('#coin').text(data.Coins.TotalCoinOut - data.Coins.TotalCoinIn);
                $('#incoin').text(data.Coins.TotalCoinIn);
                $('#outcoin').text(data.Coins.TotalCoinOut);
                data.BonusCounter.Counter.forEach((val, i) => {
                    var $count = $('<h3/>', {
                        class: 'information-data-count',
                        id: "count" + (i + 1),
                        name: "count" + (i + 1)
                    })
                    $count.html(`カウント${i+1}<br>${val}`);
                    $('.information-datawrap').append($count);
                })
                $('.information-box').show();
                $('#sendbutton')[0].onclick = function(e) {
                    if (!confirm("データを送信します。よろしいですか？")) { return; }
                    data.slotname = $('#slotselect').val();
                    $.post('/user/upload', {
                        data: JSON.stringify(data),
                        name: arr.join('.')
                    }, (data) => {
                        if (data) {
                            alert("データの登録に成功しました。")
                            $('.information-data').each((e) => {
                                e.innerText = "";
                            });
                            $('.information-box').hide();
                            $('.information-datawrap').children().remove();
                        } else {
                            alert("データの登録に失敗しました。")
                        }
                    });
                }
            }
        }
        reader.readAsText(file)
    });
    $('#search').on('click',e=>{
        var query = $('#q').val();
        $.get(`/user/utils/search?q=${query}`,data=>{
            $('#slotselect > option').remove();
            data.forEach(d=>{
                $('#slotselect').append($('<option/>',{
                    value:d.name,
                    text:d.name
                }))
            })
        })
    })
    $('#q').on('keydown',(e)=>{
        if(e.key=='Enter'){
            $('#search').click();
        }
    })
})