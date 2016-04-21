function ViewModel() {
  const COLOR_RED = 'red';
  const COLOR_BLUE = 'blue';
  const COLOR_LIGHTBLUE = 'lightblue';
  const COLOR_PINK = 'pink';
  const COLOR_PURPLE = 'purple'
  const COLOR_CYAN = 'cyan'

  var self = this;
  self.options = [
    'TL', 'DL', 'TW', 'DW', 'ST'
  ];

  self.change = ko.observable();

  self.selection = ko.observable('none');
  self.tiles = ko.observable({})

  // self.add = function(x, y, b) {
  //   var ds = self.tiles();
  //   if(!ds[x]) ds[x] = {};
  //   ds[x][y] = { type: b };
  //   self.tiles(ds);
  // };
  //
  self.set = function(opt) {
    self.selection(opt);
  }
  //
  // self.hasBonus = function(x, y) {
  //   var ds = self.tiles();
  //   return x in ds && y in ds[x]
  // };
  //
  // self.remove = function(x, y) {
  //   var ds = self.tiles();
  //   if(x in ds && y in ds[x]) {
  //     delete ds[x][y];
  //   }
  // }

  var layer = new Konva.Layer({
    draggable: true
  });
  var size = 15;
  var side = 25;
  for (var i = 0; i < size; i++) {
    for(var j = 0; j < size; j++) {
      (function(x, y){
        var r = new Konva.Rect({
          x: side * x,
          y: side * y,
          stroke: 'black',
          height: side,
          width: side,
          id: 'c' + x + '_' + y,
          name: ''
        });
        var set = function(a, b, color, type) {
          r.setAttr('name', 'bonus')
          r.setFill(color);
          r.setAttr('tag',{
            color: color,
            x: a,
            y: b,
            type: type
          });
        };

        var reset = function(a, b) {
          var id = 'c' + a + '_' + b;
          console.assert(id === r.id(), 'id mismatch');

          r.setAttr('name', '');
          r.setAttr('tag', null);
          r.setFill(COLOR_CYAN)
        };

        r.className = 'foo';
        r.on('mouseover', function(e){
          // console.log('mo',r.id());
          r.setFill('cyan');
          layer.draw();
        });

        r.on('mouseleave', function(e) {
          // console.log('ml', r.id());
          var name = r.getAttr('name');
          // console.log('name:', name);
          if(name.length) {
            var tag = r.getAttr('tag');
            r.setFill(tag.color);
          }
          else {
            r.setFill('');
          }
          layer.draw();
        });

        var apply = function(b, c){
          var name = r.getAttr('name');
          // console.log(typeof name);
          if(name.length === 0) {
            set(x, y, c, b);
          }
          else {
            //it contains name
            console.assert(name === 'bonus');
            reset(x, y);
          }
        };

        r.on('click', function(e) {
          // console.log('click', e.originalEvent);
          var selection = self.selection();
          var color;
          switch (selection) {
            case 'TW':
              color = COLOR_RED;
              break;
            case 'TL':
              color = COLOR_BLUE;
              break;
            case 'DL' :
              color = COLOR_LIGHTBLUE;
              break;
            case 'DW':
              color = COLOR_PINK;
              break;
            case 'ST':
              color = COLOR_PURPLE;
              break;
          }
          if (selection !== 'none') {
            apply(selection, color);
            self.change.notifySubscribers();
            layer.draw();
          }
        });
        layer.add(r);
      })(i,j);
    }
  }

  var ht = 400, wd = 400;
  var bounds = new Konva.Layer();
  var rect = new Konva.Rect({
    height: ht,
    width: wd,
    stroke: 'green'
  });
  bounds.add(rect);

  var stage = new Konva.Stage({
    height: ht,
    width: wd,
    container: '#board'
  });
  stage.add(bounds);
  stage.add(layer);

  self.bonuses = ko.computed(function(){
    // var ds = self.tiles();
    self.change();
    var rects = layer.find('.bonus');
    // console.assert(rects.length, 'has not items');
    var ds = {};
    var add = function(x, y, v) {
      if(!(x in ds)) ds[x] = {};
      if(!(y in ds[x])) ds[x][y] = {};
      ds[x][y]['type'] = v;
    };

    var result = rects.map(function(rect){
      var tag = rect.getAttr('tag');
      add(tag.x, tag.y, tag.type)
      return tag;
    });
    self.tiles(ds);
    return result;
  });

  // console.log(layer);
}

ko.applyBindings(new ViewModel())
