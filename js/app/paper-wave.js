define(['app/display', 'app/simulation', 'app/update-loop'], function(Display, Simulation, UpdateLoop) {

    var PaperWave = {};

    PaperWave.create = function(spec) {
        var that = {};

        that.start = function() {
            that.simulation.start();
            that.display.start();
            that.updateLoop.start();
        };

        that.update = function() {
            that.simulation.update();
            that.display.draw(that.simulation.state);
        };

        that.display = Display.create(spec);

        that.simulation = Simulation.create(spec);

        that.updateLoop = UpdateLoop.create({
            timeout: 50,
            update: that.update
        });        

        return that;
    };

    return PaperWave;
});