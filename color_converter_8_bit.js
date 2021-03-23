/**
 * Gets a given bit from a number
 * @param num an integer number
 * @param bit desired bit from the number
 * @returns Returns 0 or 1
 */
function getBit(num, bit) {
  let mask = 0b1 << bit;
  return (num & mask) >> bit;
}

/**
 * Gets a range of bits from a number
 * @param {number}num an integer number
 * @param {number}start the desired start bit
 * @param {number}end the desire end bit (exclusive)
 * @returns integer
 */
function getBitRange(num, start, end) {
  let mask = (2 ** (end - start) - 1) << start;
  return (num & mask) >> start;
}

/**
 * Converts 2 byte hexidecimal string input to 8 bit color rgb values
 * @param {string} byteIn up to 2 byte hexidecimal string
 * @returns an array of red green and blue between 0 and 255
 */
function hexToRGBArray(byteIn = "00") {
  byteIn = parseInt(byteIn, 16);
  let red = Math.round((getBitRange(byteIn, 5, 8) / 7.0) * 255.0);
  let green = Math.round((getBitRange(byteIn, 2, 5) / 7.0) * 255.0);
  let blue = Math.round((getBitRange(byteIn, 0, 2) / 3.0) * 255.0);
  return [red, green, blue];
}

/**
 * Converts 2 byte hexidecimal string input to 8 bit color hsl values 
 * @param {string} byteOg up to 2 byte hexidecimal string
 * @returns an array of hue, saturation, and lightness between 0 and 360, 0:100, and 0:100
 */
function hexToHSLArray(byteOg = "00") {
  let byteIn = parseInt(byteOg,16)
  let hue = Math.round((getBitRange(byteIn, 4, 8) / 16.0) * 360.0)
  let saturation = 40 + Math.round((( getBitRange(byteIn,0,3) / 7.0)) * 60.0)
  let lightness = 69 + Math.round(getBit(byteIn, 3) * 11.0)
  return [hue, saturation, lightness]
}

/**
 * Changes changes hex string input into css 8-bit color rgb string
 * @param {number[3]} hexIn up to 2 byte hexidecimal string
 * @returns formatted css rgb string
 */
function colorChangeRGB(hexIn) {
  hexOut = hexToRGBArray(hexIn);
  return `rgb(${hexOut[0]},${hexOut[1]},${hexOut[2]})`;
}

/**
 * Changes changes hex string input into css 8-bit color hsl string
 * @param {number[3]} hexIn up to 2 byte hexidecimal string
 * @returns formatted css hsl string
 */
function colorChangeHSL(hexIn) {
  hexOut = hexToHSLArray(hexIn);
  return `hsl(${hexOut[0]},${hexOut[1]}%,${hexOut[2]}%)`;
}

/**
 * Stores the current byte values as hex strings
 * @updateRGB changes the background color to an 8-bit color version of the current hex value
 */
let hex = {
  b1: "0",
  b2: "0",
  updateOutVal: function(i){
    if(i == 0){
      this.updateOutput = this.updateBinary
    }
    if(i == 1){
      this.updateOutput = this.updateColorCode
    }
    this.update()
  },
  updateOutput: function(temp){
    this.updateColorCode(temp)
  },
  updateBinary: function () {
    output.innerText = parseInt(this.b1 + this.b2, 16)
      .toString(2)
      .padStart(8, "0");
  },
  updateColorCode:function(temp){
    console.log("Updating Color Code")
    output.innerText = temp.toString();
  },
  updateRGB: function () {
    temp = colorChangeRGB(this.b1 + this.b2);
    document.body.style.backgroundColor = temp;
    this.updateOutput(temp)
  },
  updateHSL: function () {
    temp = colorChangeHSL(this.b1 + this.b2);
    document.body.style.backgroundColor = temp;
    // console.log(temp) 
    this.updateOutput(temp)
  },
  update: function () {
    hex.updateHSL();
  },
  setUpdateToRGB: function () {
    hex.update = hex.updateRGB;
    hex.update()
  },
  setUpdateToHSL: function () {
    hex.update = hex.updateHSL;
    hex.update()
  },
};

//byte 1 radio
let b1list = document.getElementsByName("byte1");

//byte 2 radio
let b2list = document.getElementsByName("byte2");

//binary value
let output = document.getElementById("binary");

// let backgroundColor = document.body.style.backgroundColor

//add an event listener to byte 1 radio that converts  the radio value to background color
for (let index = 0; index < b1list.length; index++) {
  const element = b1list[index];
  element.addEventListener("change", function () {
    hex.b1 = element.id.charAt(element.id.length - 1);
    hex.update();
  });
}

//add an event listener to byte 1 radio that converts  the radio value to background color
for (let index = 0; index < b2list.length; index++) {
  const element = b2list[index];
  element.addEventListener("change", function () {
    hex.b2 = element.id.charAt(element.id.length - 1);
    hex.update();
  });
}

hex.update();
b1list[0].click();
b2list[0].click();
