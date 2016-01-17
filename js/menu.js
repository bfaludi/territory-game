
Ext.namespace('territory');

territory.Menu = Ext.extend( territory.Object, {
    
	mapSize: {
		XS: [10,5],
		S: [16,8],
		M: [24,12],
		L: [30,15],
		XL: [36, 18]
	},
	
    initObject: function()
	{
		this.navigation = Ext.get( Ext.query( 'nav' )[0] );
		this.overlayNew = Ext.get( Ext.query( 'div.overlay.new' )[0] );
		this.newBox = Ext.get( Ext.query( 'div.layer.new')[0] );
		this.playerBox = Ext.get( Ext.query( 'div.layer.new div.players' )[0] );
		this.playerNumberField = Ext.get( 'playerNumber' );
		this.mapSizeField = Ext.get( 'mapSize' );
		this.newGame();
		this.game = null;
	},
	
	initEvents: function()
	{
		this.playerNumberField.on(
			'change',
			this.changePlayerNumber,
			this
		);
		
		Ext.get( Ext.query( 'div.layer.new div.start span.button.start' )[0] ).on(
			'click',
			this.onClickedStartGate,
			this
		);
		
		Ext.get( Ext.query( 'nav span.button.new' )[0] ).on(
			'click',
			this.newGame,
			this
		);
		
		Ext.get( Ext.query( 'div.overlay.win span.button.new' )[0] ).on(
			'click',
			this.newGame,
			this
		);
	},
	
	hideGameLayouts: function()
	{
		this.navigation.setVisible( false );
		Ext.get( Ext.query( 'div.layer.castle' )[0] ).setVisible( false );
		Ext.get( Ext.query( 'div.layer.unit')[0] ).setVisible( false );
		Ext.get( Ext.query( 'div.overlay.timeout')[0] ).setVisible( false );
		Ext.get( Ext.query( 'div.overlay.win')[0] ).setVisible( false );
	},
	
	showGameLayouts: function()
	{
		this.navigation.setVisible( true );
		Ext.get( Ext.query( 'div.layer.castle' )[0] ).setVisible( true );
		Ext.get( Ext.query( 'div.layer.unit')[0] ).setVisible( false );
		Ext.get( Ext.query( 'div.overlay.timeout')[0] ).setVisible( false );
		Ext.get( Ext.query( 'div.overlay.win')[0] ).setVisible( false );
	},
	
	hideNewGameLayouts: function()
	{
		this.overlayNew.setVisible( false );
		this.newBox.setVisible( false );
	},
	
	showNewGameLayouts: function()
	{
		this.overlayNew.setVisible( true );
		this.newBox.setVisible( true );
		this.changePlayerNumber();
	},
	
	stopGame: function()
	{
		if ( !Ext.isEmpty( this.game ) )
			this.game.stop();
	},
	
	newGame: function()
	{
		this.stopGame();
		this.hideGameLayouts();
		this.showNewGameLayouts();
		this.newBox.setLeft( (window.innerWidth - this.newBox.getWidth())/2 );
		this.newBox.setTop( (window.innerHeight - this.newBox.getHeight())/2 );
	},
	
	changePlayerNumber: function()
	{
		var n = this.playerNumberField.getValue(),
			pl = new territory.Player(),
			returnStr = '';
			
		for ( var i = 0; i < n; i++ )
			returnStr += '<div><input type="text" name="playerName[' + i + ']" placeholder="' + (i+1).toString() + '. játékos neve" style="border: 2px solid '+ pl.color[i][0] +'"></div>';
			
		this.playerBox.update( returnStr );
	},
	
	getPlayerNames: function()
	{
		var playerName = [],
			inputFields = Ext.query('div.layer.new div.players div input');
			
		for ( var i = 0; i < inputFields.length; i++ )
		{
			var field = Ext.get( inputFields[i] );
			playerName.push( ( Ext.isEmpty( field.getValue() ) ) ? field.dom.placeholder : field.getValue() );
		}
		
		return playerName;
	},
	
	onClickedStartGate: function()
	{
		this.showGameLayouts();
		this.hideNewGameLayouts();
		this.game = new territory.Game({
			playerNumber: this.playerNumberField.getValue(),
			mapWidth: this.mapSize[ this.mapSizeField.getValue() ][0],
			mapHeight: this.mapSize[ this.mapSizeField.getValue() ][1],
			playerName: this.getPlayerNames(),
		});
		this.game.start();
		this.game.render();
	}
} );