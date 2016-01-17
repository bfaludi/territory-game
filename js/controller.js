
Ext.namespace('territory');

territory.Controller = Ext.extend( territory.Object, {
    
    currentPlayer: null,
    
    initObject: function()
    {
        this.players = [];
        this.currentPlayer = 0;
        
        for ( var i = 0; i < this.playerNumber; i++ )
        {
            this.players.push(
                new territory.Player({
                    identifier: i,
                    name: this.playerName[ i ],
                    game: this.game
                })
            );
        }
        
        this.getCurrentPlayer().setNavigationInformation();
        this.getCurrentPlayer().startTime();
        
        Ext.get( Ext.query('nav span.button.next' )[0] ).on(
            'click',
            this.nextPlayer,
            this
        );
        Ext.get( Ext.query('div.overlay.timeout span.button.next' )[0] ).on(
            'click',
            this.nextPlayer,
            this
        );
        
        this.hideBoxes();
    },
	
    hideBoxes: function()
    {
        this.castleBox = Ext.get( Ext.query( 'div.layer.castle' )[0] );
        this.castleBox.setVisible( false );
        
        this.unitBox = Ext.get( Ext.query('div.layer.unit')[0] );
        this.unitBox.setVisible( false );
    },
    
    getPlayer: function( idx )
    {
        return this.players[ idx ];
    },
    
    getCurrentPlayer: function()
    {
        return this.getPlayer( this.currentPlayer );
    },
    
    getRandomPlayer: function()
    {
        return this.getPlayer( Math.floor( ( Math.random() * this.playerNumber ) ) );
    },
    
    nextPlayer: function()
    {
        this.game.getMap().setSelectedBlock( null );
        this.game.getMap().setAllBlockToNormalStatus();
        this.game.getController().hideBoxes();
        this.getCurrentPlayer().endTime();
		
		var s = true;
		while ( s )
		{
			this.currentPlayer = ( this.currentPlayer + 1 ) % this.playerNumber;
			if ( this.getCurrentPlayer().hasCastle() )
				s = false;
        }
		
		this.getCurrentPlayer().resetCurrentTime();
        this.getCurrentPlayer().setNavigationInformation();
        this.getCurrentPlayer().startTime();
        this.game.getMap().refreshMoney();
        this.game.getMap().refreshMovement();        
        this.game.render();
		
		if ( this.game.getMap().isGameEnded() )
			this.getCurrentPlayer.win();
    },
	
	stop: function()
	{
		this.hideBoxes();
		this.getCurrentPlayer().endTime();
		this.getCurrentPlayer().resetCurrentTime();
		
		Ext.get( Ext.query('nav span.button.next' )[0] ).un(
            'click',
            this.nextPlayer,
            this
        );
        Ext.get( Ext.query('div.overlay.timeout span.button.next' )[0] ).un(
            'click',
            this.nextPlayer,
            this
        );
	}
} );