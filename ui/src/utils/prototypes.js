/* eslint no-extend-native: 0 */

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

