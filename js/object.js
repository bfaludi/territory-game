
Ext.namespace('territory');

Ext.define( 'territory.Object', {
    extend: 'Ext.util.Observable',
    constructor: function(config) {
        Ext.apply( this, config );
        this.init();
        this.callParent(arguments)
    },
    
    init: function() {
        this.preInit();
        this.preInitObject();
        this.initObject();
        this.afterInitObject();
        this.initEvents();
        this.afterInit();
    },
    
    preInit: Ext.emptyFn,
    afterInit: Ext.emptyFn,
    preInitObject: Ext.emptyFn,
    afterInitObject: Ext.emptyFn,
    initObject: Ext.emptyFn,
    initEvents: Ext.emptyFn
} );
