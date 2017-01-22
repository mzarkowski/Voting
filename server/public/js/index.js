MAXHEIGHT = 200;
MINHEIGHT = 70;

var Sockets = Sockets || {};

Sockets.socket = io.connect(window.location.hostname);

Sockets.socket.on('poll update', function(data) {
	if(isNumeric(data.option1) && isNumeric(data.option2)){
		updateBars(data);
	}
});

var vote = function(that, voteOption) {
    $(that).parent().siblings().remove();
    $(that).addClass('disabled');
    $(that).addClass('voted');
    $(that).text('voted');
    Sockets.socket.emit('vote', voteOption);
}

function calculatePercentage(data) {
    var option1 = data.option1;
    var option2 = data.option2;

    var total = option1 + option2;

    return {
        option1: option1 / total,
        option2: option2 / total
    };
}

function updateBars(data) {
    var calculatedProportions = calculatePercentage(data);

    var option1 = (calculatedProportions.option1 * 100).toFixed(1);
    var option2 = (calculatedProportions.option2 * 100).toFixed(1);

    $('#option1').height(MINHEIGHT + (MAXHEIGHT - MINHEIGHT) * calculatedProportions.option1);
    $('#option2').height(MINHEIGHT + (MAXHEIGHT - MINHEIGHT) * calculatedProportions.option2);

    $('#option1 > p:first-child').text(option1 + '%');
    $('#option2 > p:first-child').text(option2 + '%');

    if (option1 > option2) {
        $('#option1').removeClass('voting-option-loosing');
        $('#option1').addClass('voting-option-winning');
        $('#option2').removeClass('voting-option-winning');
        $('#option2').addClass('voting-option-loosing');

    } else if (option1 < option2) {
        $('#option2').removeClass('voting-option-loosing');
        $('#option2').addClass('voting-option-winning');
        $('#option1').removeClass('voting-option-winning');
        $('#option1').addClass('voting-option-loosing');

    } else {
        $('#option1').removeClass('voting-option-loosing');
        $('#option2').removeClass('voting-option-loosing');
        $('#option1').addClass('voting-option-winning');
        $('#option2').addClass('voting-option-winning');
    }
}