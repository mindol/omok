// 행, 열 개수 //
const row = 15, col = 15;

// 너비, 높이 //
const width = 500, height = 500;

var count = 0;
var board = [];

const dx = [0, -1, -1, -1, 0, 1, 1, 1];
const dy = [1, 1, 0, -1, -1, -1, 0, 1];

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
    var x = parseInt(id_num / col);
    var y = id_num % col;
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

function isInside(x, y) { // 판 내부에 있는지 확인 //
    return 0 <= x && x < row && 0 <= y && y < col;
}

/*
    (x, y)에서 dir방향으로 주어진 pattern과 일치하는지 확인
    (x, y)에는 돌이 있어야 하며, (x, y) 다음 위치부터 확인.
*/
function directionPatternMatching(x, y, dir, pattern) {
    if(!isInside(x, y)) return false;
    if(board[x][y] == 0) return false;
    var nx = x, ny = y;
    
    for(var i = 0; i < pattern.length; i++){
        nx += dx[dir];
        ny += dy[dir];
        if(pattern[i] == 'E'){
            if(!isInside(nx, ny)) return false;
            if(board[nx][ny] != 0) return false;
        }
        else if(pattern[i] == 'P'){
            if(isInside(nx, ny) && board[nx][ny] != 3-board[x][y]) return false;
        }
        else{ // pattern[i] == 'O'
            if(!isInside(nx, ny)) return false;
            if(board[nx][ny] != board[x][y]) return false;
        }
    }
    return true;
}

