//water flow//
if (DEBUG) {
    input = {
        watch: function(err, value) {},
        writeSync: function(value) {},
        readSync: function() {}
    };
    led = input;
    ss = input;
    mosi = input;
    miso = input;
    sck = input;

    getAVGupin = function() {
        return 0;
    }

    getAVGupfrac = function() {
        return 0;
    }

    getAVGdnin = function() {
        return 0;
    }

    getAVGdnfrac = function() {
        return 0;
    }

    bin2dec = function(bin) {
        var decimal = 0;
        for (var index = bin.length - 1; index >= 0; index--) {
            decimal += parseInt(bin[index]) * Math.pow(2, bin.length - 1 - index);
        }
        return decimal;
    }

    getBits = function (byte) {
        var bits = byte.toString(2).split("");
        var addZeros = 8 - bits.length;
        while (addZeros > 0) {
            bits.unshift("0");
            addZeros--;
        }
        return bits;
    }

    data = function (data) {}

    manualSpi = function (outArray, byteCount) {
        return byteArray;
    }

    AVGupfrac = function (outArray, byteCount) {
        return 0;
    }

    AVGdnfrac = function (outArray, byteCount) {
        return;
    }

    AVGupin = function (outArray, byteCount) {
        return 0;
    }

    AVGdnin = function (outArray, byteCount) {
        return 0;
    }
}
