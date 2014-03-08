define(function() {

    var UpdateLoop = {};

    UpdateLoop.create = function(spec) {
        var that = {},
            tickerTimeout;

        that.start = function() {
            that.tick();
        };

        that.tick = function() {
            spec.update();
            tickerTimeout = setTimeout(that.tick, spec.timeout);
        };

        that.stop = function() {
            clearTimeout(tickerTimeout);
        };

        return that;
    };

    return UpdateLoop;
});