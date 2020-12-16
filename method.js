// 过滤连续的点
function fileterContinuity(arr) {
    let newArr = []
    let index = 0
    newArr[index] = [arr[0]]
    arr.reduce((old, newNum) => {
        newNum - old == 1 ? newArr[index].push(newNum) : newArr[++index] = ([newNum])
        return newNum
    })
    return newArr
}

function filterPosition(top, right, bottom, left, img, constNum, compareArr) {

    // 纵向的线
    let cowArr = []
    // 第一条横线
    let row1Arr = []
    // 第二条横线
    let row2Arr = []

    // 计算纵向的坐标
    let crowNum = (((right % constNum) - (left % constNum)) / 2) % 4 == 0 ? ((((right % constNum) - (left % constNum)) / 2) + (left % constNum)) : (((((right % constNum) - (left % constNum)) / 2) + 2) + (left % constNum))
    let row1Num = Math.floor(Math.ceil(top / constNum) + ((Math.ceil(bottom / constNum) - Math.ceil(top / constNum)) / 3))
    let row2Num = Math.floor(Math.ceil(top / constNum) + (((Math.ceil(bottom / constNum) - Math.ceil(top / constNum)) / 3) * 2))

    compareArr.forEach(element => {
        // 获取中线相交的
        if ((element % constNum) == crowNum) {
            cowArr.push(element)
        }
        // 获取横线第一条相交的
        if (Math.floor(element / constNum) == row1Num) {
            row1Arr.push(element)
        }
        // 获取横线第二条相交的
        if (Math.floor(element / constNum) == row2Num) {
            row2Arr.push(element)
        }
    });



    let returnObj = {
        crow: fileterContinuity(cowArr.map(item => {
            return Math.floor(item / constNum)
        })).length,
        row1: fileterContinuity(row1Arr.map(item => {
            return Math.floor(item / 4)
        })).length,
        row2: fileterContinuity(row2Arr.map(item => {
            return Math.floor(item / 4)
        })).length
    }
    if (returnObj.crow == 3 && returnObj.row1 == 1 && returnObj.row2 == 1) {
        returnObj.r1Position = row1Arr[0] % constNum > crowNum ? 1 : 0
        returnObj.r2Position = row2Arr[0] % constNum > crowNum ? 1 : 0
    }
    return returnObj
}

// 数字特征
function numFeatures(pointObj) {
    switch (JSON.stringify(pointObj)) {
        case JSON.stringify({
            crow: 2,
            row1: 2,
            row2: 2
        }):
            return 0;
        case JSON.stringify({
            crow: 1,
            row1: 1,
            row2: 1
        }):
            return 1;
        case JSON.stringify({
            crow: 2,
            row1: 2,
            row2: 1
        }):
            return 4;
        case JSON.stringify({
            crow: 3,
            row1: 1,
            row2: 2
        }):
            return 6;
        case JSON.stringify({
            crow: 2,
            row1: 1,
            row2: 1
        }):
            return 7;
        case JSON.stringify({
            crow: 3,
            row1: 2,
            row2: 2
        }):
            return 8;
        case JSON.stringify({
            crow: 3,
            row1: 2,
            row2: 1
        }):
            return 9;
        default:
            if (pointObj.r1Position == 1 && pointObj.r2Position == 0) {
                return 2
            } else if (pointObj.r1Position == 1 && pointObj.r2Position == 1) {
                return 3
            } else if(pointObj.r1Position == 0 && pointObj.r2Position == 1){
                return 5
            }else{
                return 2
            }
    }
}