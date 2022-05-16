//时间戳取当天0点
function get0(timestamp) {
    return timestamp - (timestamp + 3600 * 8) % 86400;
}

//中国时区导出标准时间格式
function goodtime(time, second = true) {
    time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
    return time.toJSON().substr(0, second ? 19 : 16).replace('T', ' ');
}
Date.prototype.Format = function(formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    let month = this.getMonth() + 1;
    str = str.replace(/MM/, month > 9 ? month.toString() : '0' + month);
    str = str.replace(/M/g, month);
    str = str.replace(/w|W/g, Week[this.getDay()]);
    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());
    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());
    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());
    return str;
}


function getToday() {
    var date = new Date();
    return date.Format('yyyy-MM-dd');
}

function getYesterday() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    return date.Format('yyyy-MM-dd');
}

function getThedaybeforeyesterday() {
    var date = new Date();
    date.setDate(date.getDate() - 2);
    return date.Format('yyyy-MM-dd');
}

function setdays() {
    var date = new Date();
    date.setDate(date.getDate());
    var setday = parseInt(date.Format('yyyyMMdd')) % 3;
    return setday;
}

function setHour() {
    var date = new Date();
    date.setDate(date.getDate());
    var setHour = parseInt(date.Format('yyyyMMdd')) % 6;
    return (Array(2).join('0') + setHour).slice(-2);
}

function setMinutes() {
    var date = new Date();
    date.setDate(date.getDate());
    var setMinutes = parseInt(date.Format('yyyyMMdd')) % 60;
    return (Array(2).join('0') + setMinutes).slice(-2);
}


function setDateTime() {
    var date = new Date();
    date.setDate(date.getDate() - setdays());
    date.setHours(setHour());
    date.setMinutes(setMinutes());
    return date.Format('yyyy-MM-dd hh:mm:ss');
}
console.log(setDateTime());
console.log(Date.parse(setDateTime()) / 1000);
var disDateTime = Date.parse(setDateTime()) / 1000;

console.log(goodtime(new Date(disDateTime * 1000), false));
console.log(goodtime(new Date((get0(disDateTime) - 4 * 3600 - 25 * 60 - 35) * 1000)));

// var body = {
//     "data": { records: [{ "显示时间": "", "申报时间": "", "检测日期": "", "采样日期": "" }, { "显示时间": "", "申报时间": "", "检测日期": "", "采样日期": "" }] },
// };

var body = JSON.parse($response.body);

try {
    body.data.records[0]["显示时间"] = goodtime(new Date(disDateTime * 1000), false);
    body.data.records[0]["申报时间"] = body.data.records[0]["检测日期"] = goodtime(new Date(disDateTime * 1000), false);
    body.data.records[0]["采样日期"] = goodtime(new Date((get0(disDateTime) - 4 * 3600 - 25 * 60 - 35) * 1000));
} catch (err) {
    console.log("没有数据");
}
try {
    disDateTime = disDateTime - 86400 * 2.8 + setMinutes() * 58;
    body.data.records[1]["显示时间"] = goodtime(new Date(disDateTime * 1000), false);
    body.data.records[1]["申报时间"] = body.data.records[0]["检测日期"] = goodtime(new Date(disDateTime * 1000), false);
    body.data.records[1]["采样日期"] = goodtime(new Date((get0(disDateTime) - 2.8 * 3600 - 25 * 55 - 30) * 1000));
} catch (err) {
    console.log("Record 2 没有数据");
}
// console.log(goodtime(new Date(disDateTime * 1000), false));
// console.log(goodtime(new Date((get0(disDateTime) - 2.8 * 3600 - 25 * 55 - 30) * 1000)));
console.log(JSON.stringify(body));
$done({ body: JSON.stringify(body) });