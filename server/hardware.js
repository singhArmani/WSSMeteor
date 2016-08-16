//water flow//
DEBUG=true;
if(DEBUG)
  return;
//var GPIO = require('onoff').Gpio;
var GPIO = require('pigpio').Gpio;
// var gpio = require("pi-gpio");
//
// var GPIO = function(pin, direction) {
//   this.pin = pin;
//   this.direction = direction;
//   gpio.open(pin, direction, function(err) {		// Open pin 16 for output
//
//   });
// }
//
// GPIO.prototype = {
//     digitalWrite: function(val) {
//       gpio.write(this.pin, val, function() {			// Set pin 16 high (1)
//
//     	});
//     },
//     digitalRead: function() {
//       return 1;
//     }
// }

input = new GPIO(4, {mode: GPIO.INPUT, alert: true});
led = new GPIO(14, {mode: GPIO.OUTPUT});

ss = new GPIO(8, {mode: GPIO.OUTPUT});
mosi = new GPIO(10, {mode: GPIO.OUTPUT});
miso = new GPIO(9, {mode: GPIO.INPUT});
sck = new GPIO(11, {mode: GPIO.OUTPUT});
/*
setInterval(function() {
    // data([63]); //Setting the TOF Difference Measurement Frequency as 0.5s
    // data([15]);
    // data([128]);
    // ss.digitalWrite(1);
    data([8]); // EVTMG2 start
    ss.digitalWrite(1);
    // manualSpi([254],3); //read interrupt register
    // AVGupin([209], 3); //read UP Average AVGUPInt
    // AVGupfrac([210], 3); // AVGUPFrac
    // AVGdnin([224], 3); //read DOWN Average AVGDNInt
    // AVGdnfrac([225], 3); // AVGDNFrac
}, 500);
*/

getAVGupin = function() {
    //read UP Average AVGUPInt
    return AVGupin([209], 3);;
}

getAVGupfrac = function() {
    // AVGUPFrac
    return AVGupfrac([210], 3);
}

getAVGdnin = function() {
    //read DOWN Average AVGDNInt
    return AVGdnin([224], 3);;
}

getAVGdnfrac = function() {
    // AVGDNFrac
    return AVGdnfrac([225], 3);
}

bin2dec = function(bin) {
    var decimal = 0;
    for (var index = bin.length - 1; index >= 0; index--) {
        decimal += parseInt(bin[index]) * Math.pow(2, bin.length - 1 - index);
    }
    return decimal;
}

 getBits = function(byte) {
    var bits = byte.toString(2).split("");
    var addZeros = 8 - bits.length;
    while (addZeros > 0) {
        bits.unshift("0");
        addZeros--;
    }
    return bits;
}

data = function(data) {
    ss.digitalWrite(0);
    data.forEach(function(byte) {
        bits = getBits(byte);
        bits.forEach(function(bit) {
            sck.digitalWrite(1);
            mosi.digitalWrite(parseInt(bit));
            sck.digitalWrite(0);
        });
    });
    mosi.digitalWrite(0);
    // ss.digitalWrite(1);
}

manualSpi = function (outArray, byteCount) {
    ss.digitalWrite(0);
    outArray.forEach(function(byte) {
        bits = getBits(byte);
        bits.forEach(function(bit) {
            sck.digitalWrite(1);
            mosi.digitalWrite(parseInt(bit));
            sck.digitalWrite(0);
        });
    });
    mosi.digitalWrite(0);
    var bitCount;
    var byteArray = [];
    while (byteCount > 0) {
        bitCount = 8;
        var bitArray = [];
        while (bitCount > 0) {
            sck.digitalWrite(1);
            sck.digitalWrite(0);
            bitArray.push(miso.digitalRead());

            bitCount--;
        }
        // console.log(bitArray);
        // console.log(bin2dec(bitArray));

        byteArray.push(bitArray);
        byteCount--;
    }

    ss.digitalWrite(1);
    var result = byteArray[0].concat(byteArray[1]);

    //console.log('ARRAY START');
    //console.log(byteArray[0],'Decimal =',bin2dec(byteArray[0]));
    //// console.log(bin2dec(byteArray[0]));
    //console.log(byteArray[1],'Decimal =',bin2dec(byteArray[1]));
    //// console.log(bin2dec(byteArray[1]));
    //console.log('sum',result,'Decimal =',bin2dec(result));
    //// console.log(bin2dec(result));

    return byteArray;
} // manualSpi(outArray, byteCount)
//Temperature sensor
// t1intresult = 0;
//
// function t1int(outArray, byteCount) {
//     ss.digitalWrite(0);
//     outArray.forEach(function(byte) {
//         bits = getBits(byte);
//         bits.forEach(function(bit) {
//             sck.digitalWrite(1);
//             mosi.digitalWrite(parseInt(bit));
//             sck.digitalWrite(0);
//         });
//     });
//     mosi.digitalWrite(0);
//     var bitCount;
//     var byteArray = [];
//     while (byteCount > 0) {
//         bitCount = 8;
//         var bitArray = [];
//         while (bitCount > 0) {
//             sck.digitalWrite(1);
//             sck.digitalWrite(0);
//             bitArray.push(miso.digitalRead());
//
//             bitCount--;
//         }
//         // console.log(bitArray);
//         // console.log(bin2dec(bitArray));
//
//         byteArray.push(bitArray);
//         byteCount--;
//     }
//
//     ss.digitalWrite(1);
//     t1intresult = byteArray[0].concat(byteArray[1]);
//
//     return t1intresult;
// }
// t3intresult = 0;
//
// function t3int(outArray, byteCount) {
//     ss.digitalWrite(0);
//     outArray.forEach(function(byte) {
//         bits = getBits(byte);
//         bits.forEach(function(bit) {
//             sck.digitalWrite(1);
//             mosi.digitalWrite(parseInt(bit));
//             sck.digitalWrite(0);
//         });
//     });
//     mosi.digitalWrite(0);
//     var bitCount;
//     var byteArray = [];
//     while (byteCount > 0) {
//         bitCount = 8;
//         var bitArray = [];
//         while (bitCount > 0) {
//             sck.digitalWrite(1);
//             sck.digitalWrite(0);
//             bitArray.push(miso.digitalRead());
//
//             bitCount--;
//         }
//         // console.log(bitArray);
//         // console.log(bin2dec(bitArray));
//
//         byteArray.push(bitArray);
//         byteCount--;
//     }
//
//     ss.digitalWrite(1);
//     t3intresult = byteArray[0].concat(byteArray[1]);
//     return t3intresult;
// }
//Temperature sensor

AVGupfrac =function (outArray, byteCount) {
    ss.digitalWrite(0);
    outArray.forEach(function(byte) {
        bits = getBits(byte);
        bits.forEach(function(bit) {
            sck.digitalWrite(1);
            mosi.digitalWrite(parseInt(bit));
            sck.digitalWrite(0);
        });
    });
    mosi.digitalWrite(0);
    var bitCount;
    var byteArray = [];
    while (byteCount > 0) {
        bitCount = 8;
        var bitArray = [];
        while (bitCount > 0) {
            sck.digitalWrite(1);
            sck.digitalWrite(0);
            bitArray.push(miso.digitalRead());

            bitCount--;
        }
        // console.log(bitArray);
        // console.log(bin2dec(bitArray));

        byteArray.push(bitArray);
        byteCount--;
    }

    ss.digitalWrite(1);
    var up = byteArray[0].concat(byteArray[1]);
    return up;
}

AVGdnfrac = function (outArray, byteCount) {
    ss.digitalWrite(0);
    outArray.forEach(function(byte) {
        bits = getBits(byte);
        bits.forEach(function(bit) {
            sck.digitalWrite(1);
            mosi.digitalWrite(parseInt(bit));
            sck.digitalWrite(0);
        });
    });
    mosi.digitalWrite(0);
    var bitCount;
    var byteArray = [];
    while (byteCount > 0) {
        bitCount = 8;
        var bitArray = [];
        while (bitCount > 0) {
            sck.digitalWrite(1);
            sck.digitalWrite(0);
            bitArray.push(miso.digitalRead());

            bitCount--;
        }
        // console.log(bitArray);
        // console.log(bin2dec(bitArray));

        byteArray.push(bitArray);
        byteCount--;
    }

    ss.digitalWrite(1);
    var dn = byteArray[0].concat(byteArray[1]);
    return dn;
}

AVGupin = function (outArray, byteCount) {
    ss.digitalWrite(0);
    outArray.forEach(function(byte) {
        bits = getBits(byte);
        bits.forEach(function(bit) {
            sck.digitalWrite(1);
            mosi.digitalWrite(parseInt(bit));
            sck.digitalWrite(0);
        });
    });
    mosi.digitalWrite(0);
    var bitCount;
    var byteArray = [];
    while (byteCount > 0) {
        bitCount = 8;
        var bitArray = [];
        while (bitCount > 0) {
            sck.digitalWrite(1);
            sck.digitalWrite(0);
            bitArray.push(miso.digitalRead());

            bitCount--;
        }
        // console.log(bitArray);
        // console.log(bin2dec(bitArray));

        byteArray.push(bitArray);
        byteCount--;
    }

    ss.digitalWrite(1);
    var upin = byteArray[0].concat(byteArray[1]);
    return upin;
}

AVGdnin = function (outArray, byteCount) {
    ss.digitalWrite(0);
    outArray.forEach(function(byte) {
        bits = getBits(byte);
        bits.forEach(function(bit) {
            sck.digitalWrite(1);
            mosi.digitalWrite(parseInt(bit));
            sck.digitalWrite(0);
        });
    });
    mosi.digitalWrite(0);
    var bitCount;
    var byteArray = [];
    while (byteCount > 0) {
        bitCount = 8;
        var bitArray = [];
        while (bitCount > 0) {
            sck.digitalWrite(1);
            sck.digitalWrite(0);
            bitArray.push(miso.digitalRead());

            bitCount--;
        }
        // console.log(bitArray);
        // console.log(bin2dec(bitArray));

        byteArray.push(bitArray);
        byteCount--;
    }

    ss.digitalWrite(1);
    var dnin = byteArray[0].concat(byteArray[1]);

    return dnin;
}
