/*
 * @Author: gongxi33
 * @Date: 2022-04-30 18:17:20
 * @LastEditTime: 2022-04-30 18:17:20
 * @LastEditors: gongxi33
 * @Description:
 * @FilePath: /bio/src/utils/sleep.js
 */
export default function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
