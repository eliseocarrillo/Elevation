///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'dijit/form/NumberTextBox',
    'dijit/form/TextBox',
    'dijit/form/CheckBox'
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      // Declaramos la clase CSS para los estilos
      baseClass: 'jimu-widget-in-panel-setting',

      startup: function() {
        this.inherited(arguments);
        var config = this.config;

        // Si no existe la configuración, la creamos
        config.params = config.params || {}
        config.params.elevLayer = config.params.elevLayer || {}

        this.setConfig(this.config);
      },

      // Al abrir la configuración del widget
      setConfig: function(config) {
        this.config = config;
        var options = config.params;

        // Cargamos los valores si existen
        if (options && options.elevLayer) {
          //this.elevLayer.set('value', options.elevLayer);
          document.getElementById("elevLayer").innerHTML = options.elevLayer;
        }
      },

      // Al cerrar la configuración del widget
      getConfig: function() {
        var options = this.config.params;

        // Almacenamos los valores
        //options.elevLayer = this.elevLayer.get("value");    
        options.elevLayer = document.getElementById("elevLayer").value
        return this.config;
      }
    });
  });
