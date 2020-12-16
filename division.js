// 分割数字
function divisionNum(a, forArr, constNum) {
    // 临时数组,存储当前循环的连接像素
    let arr = []
    // 烧饼,记录当前存储的数字像素
    let shaobing = []
    // 最终筛选的结果
    let result = []
    // 广度优先遍历获取当前所有连接的像素
    function getGrap() {
        if (arr.length != 0) {
            // 当前循环的元素
            arr.forEach((item, index) => {
                shaobing.push(item)
                let objState = [
                    item - 4,
                    item + 4 + constNum,
                    item + constNum,
                    item + 4,
                    item - 4 + constNum,
                    item - 4 - constNum,
                    item - constNum,
                    item + 4 - constNum
                ]
                objState.forEach((inItem) => {
                    if (forArr.indexOf(inItem) != -1) {
                        arr.push(inItem)
                        forArr.splice(forArr.indexOf(inItem), 1)
                    }

                })
                arr.splice(index, 1)
            });
            getGrap()
        }

    }
    while (forArr.length != 0) {
        // 添加数字的第一个元素用于开始循环
        arr = [
            forArr[0]
        ]
        getGrap()
        // 删除掉第一个
        shaobing.splice(0, 1)
        // 将筛选完的数组添加到结果数组
        result.push(shaobing)
        // 置空
        shaobing = []
    }
    // 初始结果排序
    result.forEach(item => {
        item.sort(function (a, b) { //比较函数
            return a - b
        })
    })
    // 筛选最左侧的位置,然后排序
    let sortArr = result
    sortArr = sortArr.map((sortInItem, indexNum) => {
        return {
            num: sortInItem.map(inItem => {
                return inItem % constNum
            }).sort(function (a, b) { //比较函数
                return a - b
            })[0],
            index: indexNum
        }
    }).sort(function (a, b) {
        var val1 = a.num;
        var val2 = b.num;
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    })
    // 排序最终结果
    let resultArr = []
    for (let i = 0; i < sortArr.length; i++) {
        resultArr[i] = result[sortArr[i].index]
    }

    return resultArr

}