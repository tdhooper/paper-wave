define(['paper', 'underscore'], function(paper, _) {

    var Display = {};

    Display.create = function(spec) {
        var that = {},
            path;

        that.start = function() {
            spec.canvas.width = spec.width;
            spec.canvas.height = spec.height;
            paper.setup(spec.canvas);

            path = new paper.Path();
            path.strokeColor = 'black';
            var count = spec.segments + 1;
            while (count--) {
                path.add(new paper.Point(0, 0));
            }
        };

        that.draw = function(state) {
            _(state.edges).each(function(edge, i) {
                path.segments[i].point.x = edge.va.x;
                path.segments[i].point.y = edge.va.y;
            });
            paper.view.draw();
        };

        return that;
    };

    return Display;
});