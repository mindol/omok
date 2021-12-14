// 행, 열 개수 //
const row = 15, col = 15;

// 너비, 높이 //
const width = 500, height = 500;

var count = 0;
var board = [];
var ban = [];
var finished = false;

const dx = [0, -1, -1, -1, 0, 1, 1, 1];
const dy = [1, 1, 0, -1, -1, -1, 0, 1];

function reset() { // 초기화 //
    count = 0;
    finished = false;
    for(var i = 0; i < row; i++){
        board[i] = [];
        ban[i] = [];
        for(var j = 0; j < col; j++){
            board[i][j] = 0;
            ban[i][j] = false;
        }
    }
    document.getElementById("start_button").innerHTML = "다시 시작"
    document.getElementById("status").innerHTML = count + " (흑 차례)";
    document.getElementById("status").style.color = "black";
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

function makeBorderRed(id_num) { // 해당 타일만 테두리를 빨갛게 만들기 //
    for(var i = 0; i < row*col; i++)
        document.getElementById("tile_"+i).style.border = "1px solid black";
    document.getElementById("tile_"+id_num).style.border = "1px solid red";
}

function tileClick(id_num) { // 타일 클릭시 //
    var x = parseInt(id_num / col);
    var y = id_num % col;
    if(finished) return;
    if(count % 2 == 0){ // 흑 차례
        if(board[x][y] == 0 && !ban[x][y]){
            eraseBannedArea();
            document.getElementById("tile_"+id_num).style.backgroundColor = "black";
            makeBorderRed(id_num);
            board[x][y] = 1;
            count++;
            document.getElementById("status").innerHTML = count + " (백 차례)";

            if(finishCheck(x, y)){
                document.getElementById("status").innerHTML = "흑 승리!";
                document.getElementById("status").style.color = "tomato";
                document.getElementById("tile_"+id_num).style.backgroundColor = "yellow";
                finished = true;
                return;
            }
        }
    }
    else{ // 백 차례
        if(board[x][y] == 0){
            document.getElementById("tile_"+id_num).style.backgroundColor = "white";
            makeBorderRed(id_num);
            board[x][y] = 2;
            count++;
            document.getElementById("status").innerHTML = count + " (흑 차례)";

            if(finishCheck(x, y)){
                document.getElementById("status").innerHTML = "백 승리!";
                document.getElementById("status").style.color = "tomato";
                document.getElementById("tile_"+id_num).style.backgroundColor = "yellow";
                finished = true;
                return;
            }
            displayBannedArea();
        }        
    }
}

function isInside(x, y) { // 판 내부에 있는지 확인 //
    return 0 <= x && x < row && 0 <= y && y < col;
}

/*
    (x, y)에서 dir방향으로 주어진 pattern과 일치하는지 확인
    (x, y)는 돌이 있는 판 내부의 위치여야 하며, (x, y) 다음 위치부터 확인.
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
        else if(pattern[i] == 'X'){
            if(isInside(nx, ny) && board[nx][ny] == board[x][y]) return false;
        }
        else{ // pattern[i] == 'O'
            if(!isInside(nx, ny)) return false;
            if(board[nx][ny] != board[x][y]) return false;
        }
    }
    return true;
}

/*
    (x, y)에서 각 방향을 바라보면서 patterns에 만족하는 pattern이 있는지 확인
    patterns에 만족하는 pattern이 있는 방향의 수 반환.
    자동으로 pattern을 대칭시켜서도 확인해본다.
    (x, y)는 돌이 있는 판 내부의 위치여야 한다.
*/
function autoPatternMatching(x, y, patterns) {
    if(!isInside(x, y)) return 0;
    if(board[x][y] == 0) return 0;

    var cnt = 0;
    for(var dir1 = 0, dir2 = 4; dir2 < 8; dir1++, dir2++){
        for(var i = 0; i < patterns.length; i++){
            if(directionPatternMatching(x, y, dir1, patterns[i][0]) &&
                directionPatternMatching(x, y, dir2, patterns[i][1])){
                cnt++;
                break;
            }
            if(directionPatternMatching(x, y, dir1, patterns[i][1]) &&
                directionPatternMatching(x, y, dir2, patterns[i][0])){
                cnt++;
                break;
            }
        }
    }
    return cnt;
}

/*
    해당 착수로 게임이 끝나는지 확인.
    (x, y)는 돌이 있는 판 내부의 위치여야 한다.
*/
function finishCheck(x, y) {
    if(!isInside(x, y)) return 0;
    if(board[x][y] == 0) return 0;

    if(board[x][y] == 1){ // black
        return autoPatternMatching(x, y, [["OOOOX", "X"], ["OOOX", "OX"], ["OOX", "OOX"]]) > 0;
    }
    else{ // white
        return autoPatternMatching(x, y, [["OOOO", ""], ["OOO", "O"], ["OO", "OO"]]) > 0;
    }
}

/*
    해당 위치에 color 색의 돌을 놓으면 다음 경우가 각각 몇 가지인지 확인
    0: 다음 경우에 포함되지 않는 경우(= 양쪽 막힌 1~4)
    1: 안막힌 1
    2: 한쪽 막힌 1
    3: 안막힌 2
    4: 안막힌 떨어진 2
    5: 한쪽 막힌 2
    6: 안막힌 3
    7: 안막힌 떨어진 3
    8: 한쪽 막힌 3
    9: 안막힌 4
    10: 안막힌 떨어진 4
    11: 한쪽 막힌 4
    12: (백) 5 이상
    13: (흑) 5
    14: (흑) 6 이상
    (x, y)는 돌이 없는 판 내부의 위치여야 한다.
*/
function calculateCase(x, y, color) {
    if(!isInside(x, y)) return;
    if(board[x][y] != 0) return;

    var ret = [];
    board[x][y] = color; // 임시

    // 끝 E 대신 EX로 바꿔야 함!! // [미완성]
    ret[1] = autoPatternMatching(x, y, [["EX", "EX"]]);
    ret[2] = autoPatternMatching(x, y, [["EX", "P"]]);
    ret[3] = autoPatternMatching(x, y, [["OEX", "EX"]]);
    ret[4] = autoPatternMatching(x, y, [["EOEX", "EX"]]);
    ret[5] = autoPatternMatching(x, y, [["OP", "EX"], ["EOP", "EX"], ["P", "OEX"], ["P", "EOEX"]]);
    ret[6] = autoPatternMatching(x, y, [["OOEX", "EX"], ["OEX", "OEX"]]);
    ret[7] = autoPatternMatching(x, y, [["OEOEX", "EX"], ["EOOEX", "EX"], ["EOEX", "OEX"]]);
    ret[8] = autoPatternMatching(x, y, [["OOP", "EX"], ["OEOP", "EX"], ["EOOP", "EX"], ["OP", "OEX"],
                                        ["EOP", "OEX"], ["OP", "EOEX"], ["P", "OOEX"], ["P", "OEOEX"], ["P", "EOOEX"]]);
    ret[9] = autoPatternMatching(x, y, [["OOOEX", "EX"], ["OOEX", "OEX"]]);
    ret[10] = autoPatternMatching(x, y, [["OOEOEX", "EX"], ["OEOOEX", "EX"], ["EOOOEX", "EX"],
                                        ["OEOEX", "OEX"], ["EOOEX", "OEX"], ["OOEX", "EOEX"]]);
    ret[11] = autoPatternMatching(x, y, [["OOOP", "EX"], ["OOP", "OEX"], ["OOEOP", "EX"], ["OEOOP", "EX"],
                                        ["EOOOP", "EX"], ["OEOP", "OEX"], ["EOOP", "OEX"], ["OOP", "EOEX"],
                                        ["OP", "OOEX"], ["OP", "OEOEX"], ["OP", "EOOEX"], ["EOP", "OOEX"],
                                        ["P", "OOOEX"], ["P", "OOEOEX"], ["P", "OEOOEX"], ["P", "EOOOEX"]]);
    ret[12] = ret[13] = ret[14] = 0;    
    if(color == 2) ret[12] = autoPatternMatching(x, y, [["OOOO", ""], ["OOO", "O"], ["OO", "OO"]])
    if(color == 1) ret[13] = autoPatternMatching(x, y, [["OOOOX", "X"], ["OOOX", "OX"], ["OOX", "OOX"]])
    if(color == 1) ret[14] = autoPatternMatching(x, y, [["OOOOO", ""], ["OOOO", "O"], ["OOO", "OO"]]);

    var sum = 0;
    for(var i = 1; i <= 14; i++)
        sum += ret[i];
    ret[0] = 4 - sum;

    if(ret[0] < 0){
        console.log(x, y, color, ret);
    }

    board[x][y] = 0; // 복구
    return ret;
}

function displayBannedArea() { // 흑이 놓을 수 없는 위치 표시 //
    for(var i = 0; i < row; i++){
        for(var j = 0; j < col; j++){
            if(board[i][j] == 0){
                var id_num = i*col+j;
                var ret = calculateCase(i, j, 1);
                if(ret[6] + ret[7] >= 2 || ret[14] > 0){
                    ban[i][j] = true;
                    document.getElementById("tile_"+id_num).style.backgroundColor = "red";
                }
            }
        }
    }
}

function eraseBannedArea() { // 흑이 높을 수 없는 위치 표시 해제 //
    for(var i = 0; i < row; i++){
        for(var j = 0; j < col; j++){
            if(ban[i][j]){
                var id_num = i*col+j;
                ban[i][j] = false;
                if(board[i][j] == 1)
                    document.getElementById("tile_"+id_num).style.backgroundColor = "black";
                else if(board[i][j] == 2)
                    document.getElementById("tile_"+id_num).style.backgroundColor = "white";
                else // board[i][j] == 0
                    document.getElementById("tile_"+id_num).style.backgroundColor = "gray";
            }
        }
    }
}