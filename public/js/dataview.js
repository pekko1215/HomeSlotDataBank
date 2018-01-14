$(() => {
    $('#sougoubutton').click(ev=>{
		var targets = datatable.data().filter(d=>d[9] == "true");
		if(targets.length==0){return}
		var $fulldata = $('#fulldata');
		$fulldata.show();
		var coin,allplay,incoin,outcoin,count;
		coin = allplay = incoin = outcoin = 0;
		count = Array(4).fill(0);
		targets.each(data=>{
			allplay += parseInt(data[3]);
			count = count.map((d,i)=>d+=parseInt(data[i+5]));
			incoin += parseInt(data[10]);
			outcoin += parseInt(data[11]);
		})
		coin = outcoin - incoin;
		var differ = (outcoin/incoin*100).toFixed(2);
		$('#allplay').text(allplay);
		$('#coin').text(coin);
		$('#incoin').text(incoin);
		$('#outcoin').text(outcoin);
		$('#percent').text(differ);
		count.forEach((d,i)=>{
			$('#count'+(i+1)).text(d);
		})
		if(coin>=0){
			$('#coin').removeClass('minus').addClass('plus');
		}else{
			$('#coin').removeClass('plus').addClass('minus');
		}
		if(differ>=0){
			$('#percent').removeClass('minus').addClass('plus');
		}else{
			$('#percent').removeClass('plus').addClass('minus');
		}
    });
    $('#hikakubutton');
})