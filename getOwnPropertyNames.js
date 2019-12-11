/*
 * @description: getOwnPropertyNames  实现
 * @author: JXY
 * @Date: 2019-12-11 17:42:50
 * @Email: JXY001a@aliyun.com
 * @LastEditTime: 2019-12-11 17:49:01
 */

 Object.myGetOwnPropertyNames = function(o) {
    if(o !== Object(o)) throw TypeError('Object.getOwnPropertyNames called on non-object');
    var props = [];
    for(var key in o) {
        if(Object.prototype.hasOwnProperty.call(o,key)) {
            props.push(key);
        }
    }
    return props;
 }