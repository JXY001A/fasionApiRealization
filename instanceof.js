/*  
 * @description: instanceOf 实现
 * @author: JXY
 * @Date: 2019-12-11 17:22:59
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-11 17:31:51
 */

function instanceOf(L,R) {
    if(typeof L !== 'object' ||  L === null ||  R===null) return false;
    let O = R.prototype;
    while(true) {
        if(L.__proto__ === O) return true;
        L = L.__proto__;
    } 
}

/* 测试 */
function F() {}
const f1 = new F();
instanceOf(f1,F); // true 