let fileInput = document.querySelector("#chooseImg")
let imgTag = document.querySelector("#imgDis")
let canvasTag = document.querySelector("#canvasDis")
let changeImg = document.querySelector("#changeImg")
let distinguishBtn = document.querySelector("#distinguish")
var ctx = canvasTag.getContext("2d");
// 图片数据
let imgData
// input改变将图片转化为img标签可以显示的连接
fileInput.onchange = function () {
    // 转地址
    console.log(window.URL.createObjectURL(fileInput.files[0]));
    imgTag.src = window.URL.createObjectURL(fileInput.files[0])
    // 转base64
    // let fr = new FileReader();
    // fr.readAsDataURL(fileInput.files[0]);
    // fr.onloadend = function (e) {
    //     // backImg.src = e.target.result;
    //     console.log(e.target.result)
    //     imgTag.src=e.target.result
    // };
    imgTag.onload = function () {
        canvasTag.width = imgTag.naturalWidth
        canvasTag.height = imgTag.naturalHeight
        ctx.drawImage(imgTag, 0, 0);
        imgData = ctx.getImageData(0, 0, canvasTag.width, canvasTag.height);
    }
}
// 灰度化的构造函数
function GrayClass(ctx, imgData) {
    // 阀门
    let valve = 0
    // 总像素数
    let allpixel = 0
    // 总的灰度值
    let value = 0
    this.changeImgFun = function () {
        for (var i = 0; i < imgData.data.length; i += 4) {
            let gray = this.grayNum(imgData.data[i], imgData.data[i + 1], imgData.data[i + 2])
            imgData.data[i] = gray;
            imgData.data[i + 1] = gray;
            imgData.data[i + 2] = gray;

            allpixel++
            value += gray
        }
        valve = parseInt(value / allpixel)
        // ctx.putImageData(imgData, 0, 0);
    }
    // 计算某一像素的灰度值
    this.grayNum = function (rValue, gValue, bValue) {
        return parseInt(rValue * 0.299 + gValue * 0.587 + bValue * 0.114);
    }
    // 二值化
    this.Binarization = function () {
        for (var i = 0; i < imgData.data.length; i += 4) {
            if (imgData.data[i] > valve) {
                imgData.data[i] = 255;
                imgData.data[i + 1] = 255;
                imgData.data[i + 2] = 255;
            } else {
                imgData.data[i] = 0;
                imgData.data[i + 1] = 0;
                imgData.data[i + 2] = 0;
            }
        }
        ctx.putImageData(imgData, 0, 0);
    }
}

// 识别按钮点击
distinguishBtn.onclick = function () {
    // 二值化
    let p = new GrayClass(ctx, imgData)
    p.changeImgFun()
    p.Binarization()
    let whitePx = []
    let blackPx = []
    // 选出图片中较少的颜色
    for (var i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i] == 255) {
            whitePx.push(i)
        } else {
            blackPx.push(i)
        }
    }
    // 拆分的数字
    let numArr
    // if (whitePx.length > blackPx.length) {
    //     //拆分数字
    //     numArr = divisionNum(ctx, blackPx, ((canvasTag.width) * 4))
    // } else {
    //     //拆分数字
    //     numArr = divisionNum(ctx, whitePx, ((canvasTag.width) * 4))
    // }
    //拆分数字
    numArr = divisionNum(ctx, blackPx, ((canvasTag.width) * 4))
    let result = ''
    numArr.forEach(item => {
        // 将拆分完的数字循环调用识别数字边距位置方法
        result += getPositionPoint(item)

    })
    console.log(result)
}
// 获取图片的边距位置,调用识别方法
function getPositionPoint(forArr) {

    // 单行常量
    let constNum = ((canvasTag.width) * 4)
    // 等于图片边框的初始位置
    let shaobingLeft = constNum - 4
    let shaobingRight = 0
    let shaobingTop = imgData.data.length - 1
    let shaobingBottom = 0
    // -------------------------------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------------------------------
    forArr.forEach(item => {
        // 筛选最左边的下标
        if (item % constNum < shaobingLeft % constNum) {
            shaobingLeft = item
        }
        // 筛选最右边的下标
        if (item % constNum > shaobingRight % constNum) {
            shaobingRight = item
        }
        // 最上边的下标
        if (Math.ceil(item / constNum) < (shaobingTop / constNum)) {
            shaobingTop = item
        }
        // 最下边的下标
        if (Math.ceil(item / constNum) > (shaobingBottom / constNum)) {
            shaobingBottom = item
        }
    })

    // 过滤位置获取焦点
    let getFeatures = filterPosition(shaobingTop, shaobingRight, shaobingBottom, shaobingLeft, imgData, constNum, forArr)
    // 对比数字特征,返回结果
    return numFeatures(getFeatures)
}