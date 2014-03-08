define(['underscore', 'newton'], function(_, Newton) {

    var Simulation = {};

    Simulation.create = function(spec) {
        var that = {},
            layout,
            particles,
            startAngleA,
            startAngleB;

        that.start = function() {
            var margin = 100;

            layout = createLayout({
                start: {
                    x: margin,
                    y: spec.height * 0.25
                },
                end: {
                    x: spec.width - margin,
                    y: spec.height * 0.75
                },
                count: spec.segments
            });

            var sim = createNewtonSimulation();
            sim.start();
        };

        var update = function(time, simulator, totalTime) {
            var step = totalTime * 0.001,
                scale = 1,
                angleA = layout.angle + (Math.sin(step) * scale),
                angleB = layout.angle + (Math.cos(step) * scale),
                startIndex = 0,
                endIndex = spec.segments - 1;

            rotateHandle(particles[startIndex + 1], layout.points[startIndex], angleA, layout.distance);
            rotateHandle(particles[startIndex], layout.points[startIndex], angleA, 0);

            rotateHandle(particles[endIndex - 1], layout.points[endIndex], angleB, layout.distance * -1);
            rotateHandle(particles[endIndex], layout.points[endIndex], angleB, 0);
        };

        var rotateHandle = function(handle, centerPoint, angle, distance) {
            var handlePoint = getCoordsForAngle(angle, centerPoint, distance),
                perpendicular = angle + Math.PI / 2,
                topCoords = getCoordsForAngle(perpendicular, handlePoint, layout.thickness * -0.5),
                bottomCoords = getCoordsForAngle(perpendicular, handlePoint, layout.thickness * 0.5);

            handle.top.pin(topCoords.x, topCoords.y);
            handle.bottom.pin(bottomCoords.x, bottomCoords.y);
        };

        var getCoordsForAngle = function(angle, center, distance) {
            return {
                x: center.x - distance * Math.cos(angle),
                y: center.y - distance * Math.sin(angle)
            }
        };

        var createLayout = function(spec) {
            var points = [],
                count = spec.count,
                xDistance = spec.end.x - spec.start.x,
                yDistance = spec.end.y - spec.start.y,
                totalDistance = Math.sqrt( Math.pow(xDistance, 2) + Math.pow(yDistance, 2) ),
                fraction = 0;

            while (count--) {
                fraction = count / (spec.count - 1);
                points.push({
                    x: spec.start.x + (xDistance * fraction),
                    y: spec.start.y + (yDistance * fraction)
                });
            }

            return {
                points: points,
                angle: getAngleBetweenPoints(points[0], points[spec.count - 1]),
                distance: totalDistance / spec.count,
                thickness: 10
            };
        };

        var createNewtonSimulation = function() {
            var renderer = Newton.Renderer(spec.canvas),
                sim = Newton.Simulator(update, renderer.callback),
                world = Newton.Body(),
                perpendicular = layout.angle + Math.PI / 2,
                distance = layout.distance * 1.2;
            
            particles = [];

            sim.add(world);

            _(layout.points).each(function(point, i) {
                var topCoords       = getCoordsForAngle(perpendicular, point, layout.thickness * -0.5),
                    bottomCoords    = getCoordsForAngle(perpendicular, point, layout.thickness * 0.5),
                    particle = {
                        top:    Newton.Particle(topCoords.x, topCoords.y),
                        bottom: Newton.Particle(bottomCoords.x, bottomCoords.y)
                    };

                particles.push(particle);
                
                world.addParticle(particle.top);
                world.addParticle(particle.bottom);

                world.DistanceConstraint(particle.top, particle.bottom, 1, layout.thickness);

                if (i < 2 || i > layout.points.length - 3) {
                    particle.top.pin();
                    particle.bottom.pin();
                }

                if (i > 0) {
                    world.DistanceConstraint(particle.top,      particles[i - 1].top,       1, distance);
                    world.DistanceConstraint(particle.bottom,   particles[i - 1].bottom,    1, distance);
                    world.DistanceConstraint(particle.bottom,   particles[i - 1].top,       1, distance);
                    world.DistanceConstraint(particle.top,      particles[i - 1].bottom,    1, distance);
                }
            });

            return sim;             
        };

        var getAngleBetweenPoints = function(pointA, pointB) {
            var xDiff = pointA.x - pointB.x;
            var yDiff = pointA.y - pointB.y;
            return Math.atan2(yDiff, xDiff);
        };

        return that;
    };

    return Simulation;
});