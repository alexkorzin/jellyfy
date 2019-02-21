// ==================
// Converts SVG path into JS array of dots with coordinates
// ==================

export default function SvgParse(SvgSelector, NumberOfPoints, leftOffset,topOffset, scale) {
    // Смещение картинки относительно левого верхнего угла в пикселях
    leftOffset = leftOffset || 0;
    topOffset = topOffset || 0;
    let XOFF = 0 + leftOffset; 
    let YOFF = 0 + topOffset;
    let RANDOM_OFFSET = false;
    // Итоговый размер картинки в ширину который мы хотим
    let SCALE = scale || 250;
    let path = document.querySelectorAll(SvgSelector);
    let points = [], pointsData = [], POINTS = [], point = [];
    let is = {
      arr: function(a) {
        return Array.isArray(a);
      },
      str: function(a) {
        return typeof a === "string";
      },
      fnc: function(a) {
        return typeof a === "function";
      }
    };
    function extendSingle(target, source) {
      for (var key in source)
        target[key] = is.arr(source[key]) ? source[key].slice(0) : source[key];
      return target;
    }
    function extend(target, source) {
      if (!target)
        target = {};
  
      for (var i = 1; i < arguments.length; i++)
        extendSingle(target, arguments[i]);
      return target;
    }
    function getPathPoints(path) {
      var pathLength = path.getTotalLength();
      var pointsNumber = NumberOfPoints;
      var margin = pathLength / pointsNumber;
      var currentPosition = 0;
      var pt = { xs: 0, ys: 0 };
      var p = [], point;
      while (pointsNumber--) {
        point = path.getPointAtLength(currentPosition);
        pt.x = point.x;
        pt.y = point.y;
        p.push(extend({ ox: pt.x, oy: pt.y }, pt));
        currentPosition += margin;
      }
      return p;
    }
    for (var i = 0; i < path.length; i++) {
      pointsData.push(getPathPoints(path[i]));
    }
    pointsData[0].map(xy => {
      point = []; // specify SCALE here
      point[0] = xy.x / 32;
      point[1] = xy.y / 32;
      POINTS.push(point);
  
      return point;
    });
    POINTS = POINTS.map(function(xy) {
      if (RANDOM_OFFSET) {
        xy[0] += Math.random() - 0.5;
        xy[1] += Math.random() - 0.5;
      }
      return [ xy[0] * SCALE + XOFF, xy[1] * SCALE + YOFF ];
    });
    return POINTS;
  }
  
  
  
  // WEBPACK FOOTER //
  // src/js/lib/SvgParse.js