
Ext.namespace('territory');

territory.Player = Ext.extend( territory.Object, {

    color: [
        ["#00ff00","#009900"],
        ["#ffff00","#999900"],
		["#ffffff","#cccccc"],
        ["#ee82ee","#a75ba7"]
    ],
    
    selectedColor: [
        ["#009900","#009900"],
        ["#999900","#999900"],
		["#cccccc","#cccccc"],
        ["#a75ba7","#a75ba7"]
    ],
    
    areaColor: [
        ["#00e600","#008000"],
        ["#e6e600","#808000"],
		["#e6e6e6","#b2b2b2"],
        ["#d675d6","#8f4e8f"]
    ],
    
    createColor: [
        ["#00ff00","#00ff00"],
        ["#ffff00","#ffff00"],
		["#ffffff","#ffffff"],
        ["#ee82ee","#ee82ee"]
    ],
    
    targetColor: [
        ["#f08080","#c06666"],
        ["#f08080","#c06666"],
		["#f08080","#c06666"],
        ["#f08080","#c06666"]
    ],
    
    moveColor: [
        ["#00ff00","#00ff00"],
        ["#ffff00","#ffff00"],
		["#ffffff","#ffffff"],
        ["#ee82ee","#ee82ee"]
    ],
	
	hasCastle: function()
	{
		var m = this.game.getMap();
		for ( var i = 0; i < m.blocks.length; i++ )
			if ( m.blocks[i].isCastle() && m.blocks[i].getPlayer().getIdentifier() == this.getIdentifier() )
				return true;
				
		return false;
	},
    
    initObject: function()
    {
        this.resetCurrentTime();
    },
    
    resetCurrentTime: function()
    {
        this.currentTime = 90;
        var overlay = Ext.get( Ext.query('div.overlay.timeout')[0] );
        overlay.setVisible( false );
    },
    
    convertIntegerToTime: function()
    {
        var minutes = Math.floor( this.getCurrentTime() / 60 );
        var seconds = this.getCurrentTime() - minutes * 60;
        
        var mStr = ( minutes.toString().length == 1 )
            ? '0' + minutes
            : minutes;
            
        var sStr = ( seconds.toString().length == 1 )
            ? '0' + seconds
            : seconds;
        
        return mStr + ':' + sStr;
    },
    
    startTime: function()
    {
        if ( this.currentTime == 0 )
        {
            this.forceToChangePlayer();
            return;
        }
            
        this.currentTime -= 1;
        var clockSpan = Ext.get( Ext.query('nav span.clock')[0] );
        
        clockSpan.update( this.convertIntegerToTime() );
        
        this.clock = Ext.defer( this.startTime, 1000, this );
    },
    
    endTime: function()
    {
        clearTimeout( this.clock );
        this.clock = null;
    },
    
    forceToChangePlayer: function()
    {
        this.game.getController().hideBoxes();
        var overlay = Ext.get( Ext.query('div.overlay.timeout')[0] );
        overlay.setVisible( true );
    },
	
	win: function()
	{
		this.game.getController().hideBoxes();
		
		var winner = this.game.getMap().whoWinTheGame();
		
		var overperson = Ext.get( Ext.query('div.overlay.win span.winner')[0] );
		overperson.update( winner.name );
		overperson.dom.style.color = winner.getColor()[0];
		
		var overlay = Ext.get( Ext.query('div.overlay.win')[0] );
        overlay.setVisible( true );
		
		this.game.stop();
	},
    
    getCurrentTime: function()
    {
        return this.currentTime;
    },
    
    setNavigationInformation: function()
    {
        var playerSpan = Ext.get( Ext.query('nav span.player')[0] );
        playerSpan.update( this.name + '<span class="color" style="background: ' + this.getColor()[0] + '">&nbsp</span>' );
        
        var clockSpan = Ext.get( Ext.query('nav span.clock')[0] );
        clockSpan.update( '00:' + this.getCurrentTime() );
    },
    
    getColor: function()
    {
        return this.color[ this.getIdentifier() ];
    },
    
    getCreateColor: function()
    {
        return this.createColor[ this.getIdentifier() ];
    },
    
    getSelectedColor: function()
    {
        return this.selectedColor[ this.getIdentifier() ];
    },
    
    getAreaColor: function()
    {
        return this.areaColor[ this.getIdentifier() ];
    },
    
    getTargetColor: function()
    {
        return this.targetColor[ this.getIdentifier() ];
    },
    
    getMoveColor: function()
    {
        return this.moveColor[ this.getIdentifier() ];
    },
    
    getIdentifier: function()
    {
        return this.identifier;
    }
} );