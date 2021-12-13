// 행, 열 개수 //
var row = 15, col = 15;

// 너비, 높이 //
var width = 600, height = 600;

var count = 0;
var board = [];

function reset() { // 초기화 //
    count = 0;
    for(var i = 0; i < row; i++){
        board[i] = [];
        for(var j = 0; j < col; j++){
            board[i][j] = 0;
        }
    }
    document.getElementById("start_button").innerHTML = "다시 시작"
    document.getElementById("status").innerHTML = count + " (흑 차례)";
}

function makeTable() { // 테이블 만들기 //
    var tableHTML = "<table id='board' width='"+width+"' height='"+height+"'>";
    for(var i = 0; i < row; i++){
        var rowHTML = "<tr>"
        for(var j = 0; j < col; j++){
            var id_num = i * col + j;
            rowHTML += "<td id='tile_"+id_num+"' onclick='tileClick("+id_num+")'></td>"
        }
        rowHTML += "</tr>"
        tableHTML += rowHTML;
    }
    tableHTML += "</table>"
    document.getElementById("board_area").innerHTML = tableHTML;
}

function tileClick(id_num) { // 타일 클릭시 //
    var x = parseInt(id_num / col) + 1;
    var y = id_num % col + 1;
    if(count % 2 == 0){ // 흑 차례
        if(board[x][y] == 0){
            document.getElementById("tile_"+id_num).style.backgroundColor = "black";
            board[x][y] = 1;
            count++;
            document.getElementById("status").innerHTML = count + " (백 차례)";
        }
    }
    else{ // 백 차례
        if(board[x][y] == 0){
            document.getElementById("tile_"+id_num).style.backgroundColor = "white";
            board[x][y] = 2;
            count++;
            document.getElementById("status").innerHTML = count + " (흑 차례)";
        }
    }
}