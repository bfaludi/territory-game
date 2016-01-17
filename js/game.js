
Ext.namespace('territory');

territory.Game = Ext.extend( territory.Object, {

    playerNumber: 2,
    mapWidth: 24,
    mapHeight: 12,
    playerName: [],
    
    start: function()
    {
        this.controller = new territory.Controller({
            playerNumber: this.playerNumber,
            playerName: this.playerName,
            game: this
        });
        
        this.unit = new territory.Unit({
            game: this
        });
        
        this.map = new territory.Map({
            mapWidth: this.mapWidth,
            mapHeight: this.mapHeight,
            game: this
        });
        this.map.generate();
    },
    
    reset: function()
    {
        if ( !Ext.isEmpty( this.map ) )
        {
            this.map.reset();
        }
    },
    
    getUnit: function()
    {
        return this.unit;
    },
    
    getMap: function()
    {
        return this.map;
    },
    
    getController: function()
    {
        return this.controller;
    },
    
	stop: function()
	{
		this.map.stop();
		this.controller.stop();
	},
	
    render: function() 
    {
        this.map.render();
    }
} );