define(['dojo/_base/declare', 
  'jimu/BaseWidget',
  'esri/units',
  'esri/dijit/ElevationProfile',
  'dojo/dom',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'esri/geometry/Circle',
  'esri/symbols/SimpleFillSymbol',
  'esri/graphic',
  'esri/symbols/SimpleLineSymbol',
  'esri/Color',
  'dojo/_base/lang'],
  function(declare, 
    BaseWidget,
    Units,
    ElevationsProfileWidget,
    dom,
    Query,
    QueryTask,
    Circle,
    SimpleFillSymbol,
    Graphic,
    SimpleLineSymbol,
    Color,
    lang) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-customwidget',
      epWidget: null,
      query: null,
      queryTask: null,
      onWidget: null,

      //this property is set by the framework when widget is loaded.
      name: 'Elevation Profile Widget',

      //methods to communication with app container:

      postCreate: function() {
        this.inherited(arguments);
        console.log('postCreate');
      },

      startup: function() {
        this.inherited(arguments);
        console.log('startup');
        //Elevation profile chart options
        var chartOptions = {
          title: "Perfil de elevación",
          chartTitleFontSize: 11,
          axisTitleFontSize: 9,
          axisLabelFontSize: 9,
          indicatorFontColor: '#eee',
          indicatorFillColor: '#666',
          titleFontColor: '#eee',
          axisFontColor: '#ccc',
          axisMajorTickColor: '#333',
          skyTopColor: "#B0E0E6",
          skyBottomColor: "#4682B4",
          waterLineColor: "#eee",
          waterTopColor: "#ADD8E6",
          waterBottomColor: "#0000FF",
          elevationLineColor: "#D2B48C",
          elevationTopColor: "#8B4513",
          elevationBottomColor: "#CD853F",
          elevationMarkerStrokeColor: "#FF0000",
          elevationMarkerSymbol: "m -6 -6, l 12 12, m 0 -12, l -12 12"
        };
        //Elevation profile constructor  
        this.epWidget = new ElevationsProfileWidget({
          map: this.map,
          profileTaskUrl: "http://elevation.arcgis.com/arcgis/rest/services/Tools/ElevationSync/GPServer",
          scalebarUnits: Units.KILOMETERS,
          chartOptions: chartOptions
        }, dom.byId("elevationProfileDOM"));
        //Start up elevation profile widget
        this.epWidget.startup();
        //Query constructor in order to select a track
        this.query = new Query();
        //Query parameters
        this.query.where = "1 = 1";
        this.query.outFields = ["NAME", "DENOMINACION", "Shape.STLength()"];
        this.query.returnGeometry = true;
        this.query.outSpatialReference = this.map.spatialReference;
        //Query Task constructor
        this.queryTask = new QueryTask(this.config.params.elevLayer);
      },

      onOpen: function(){
        console.log('onOpen');
        //Widget property built in order to control widget activity
        this.onWidget = true;
        //Elevation profile will be executed when user clicked on a track
        this.map.on("click", lang.hitch(this, this._query));
      },

      _query: function(evt){
        if(this.onWidget == true){
          //Circle constructor
          var circle = new Circle({
              center: evt.mapPoint,
              radius: 50 //50m around click point
          });
          //Circle symbol constructor
          var symCircle = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color([255,0,0,0.5]));
          //Last query parameters
          this.query.geometry = circle;
          this.query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
          //New graphic, with previous built circle
          var gr = new Graphic(circle, symCircle);
          //Clear and add a new graphic into graphics map layer
          this.map.graphics.clear();
          this.map.graphics.add(gr);
          //Query task execution
          this.queryTask.execute(this.query, lang.hitch(this, this._queryTask), this._error);
        }
      },

      _queryTask: function(evt){
        var result = evt.features;
        var symLine = new SimpleLineSymbol();
        symLine.setColor(new Color("#00FFFF"));
        for(var i = 0; i < result.length; i++){
          var graphic = result[i];
          graphic.setSymbol(symLine);
          var geo = graphic.geometry;
          this.epWidget.set("profileGeometry", geo);
          if (graphic.attributes.DENOMINACION === null || graphic.attributes.DENOMINACION.length > 40){
            this.epWidget.set("title", (graphic.attributes.NAME));
          }else{ 
            this.epWidget.set("title", (graphic.attributes.NAME + ". " + graphic.attributes.DENOMINACION));
          };
        };
        this.map.graphics.add(graphic);
      },

      _error: function(){
        alert("No se ha seleccionado ningún camino");
      },

      onClose: function(){
        console.log('onClose');
        this.epWidget.clearProfile();
        this.map.graphics.clear();
        this.onWidget = false;
      }
    });
  });