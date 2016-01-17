
Ext.namespace('territory','territory.draw','territory.map');

territory.Map = Ext.extend( territory.Object, {

    blockSize: 30,
    selectedBlock: null,
    blocks: [],
    scroll: null,
    dragHelper: {},
    
    initEvents: function() 
    {
        this.canvas = Ext.get('map');
        
        this.canvas.on(
            'click',
            this.onClickMapCanvas,
            this
        );
        
        this.canvas.on(
            'mousemove',
            this.onMouseMoveOnCanvas,
            this
        );
        
        this.canvas.on(
            'mousedown',
            this.onMouseDownOnCanvas,
            this
        );
        
        this.canvas.on(
            'mouseup',
            this.onMouseUpOnCanvas,
            this
        );
        
        Ext.EventManager.onWindowResize(
            this.render,
            this
        );
    },
    
    getMousePoint: function( e )
    {
        var position = this.canvas.dom.getBoundingClientRect();
        var point = {
            x: e.browserEvent.clientX - position.left,
            y: e.browserEvent.clientY - position.top
        };
        
        return point;
    },
    
    onMouseDownOnCanvas: function( e )
    {
        e.preventDefault();
        var point = this.getMousePoint( e );
        
        if ( this.canvas.dom.width > this.getMapWidth() && this.canvas.dom.height > this.getMapHeight() )
            return;
        
        this.dragHelper = {
            active: true,
            x: point.x - this.scroll.left,
            y: point.y - this.scroll.top,
            last: {
                left: point.x - this.scroll.left,
                top: point.y - this.scroll.top
            }
        };
        this.canvas.dom.style.cursor = 'move';
    },
    
    onMouseUpOnCanvas: function( e )
    {
        e.preventDefault();
        this.dragHelper.active = false;
        this.canvas.dom.style.cursor = 'pointer';
    },
    
    onMouseMoveOnCanvas: function( e )
    {
        if ( !this.dragHelper.active )
            return;
        
        this.game.getController().hideBoxes();
        
        var point = this.getMousePoint( e );
            
        var t = point.y - this.dragHelper.y,
            l = point.x - this.dragHelper.x;
                    
        if ( l < -1 * this.getMapWidth() + this.canvas.dom.width )
            l = -1 * this.getMapWidth() + this.canvas.dom.width;
            
        if ( t < -1 * this.getMapHeight() + this.canvas.dom.height )
            t = -1 * this.getMapHeight() + this.canvas.dom.height;
            
        if ( l > 0 )
            l = 0;

        if ( t > 0 )
            t = 0;
            
        if ( this.dragHelper.last.left == l && this.dragHelper.last.top == t )
            return;
        
        this.dragHelper.last = {
            left: l,
            top: t
        };
        
        this.scroll.left = l;
        this.scroll.top = t;
        
        this.render();
    },
    
    getMapHeight: function()
    {
        return this.mapHeight * this.blockSize * Math.sqrt(3) + 36;
    },
    
    getMapWidth: function()
    {
        return this.mapWidth * this.blockSize * 1.5 + 24;
    },
	
	whoWinTheGame: function()
	{
		var castleBlock = null;
		
		for ( var i = 0; i < this.blocks.length; i++ )
		{
			if ( !this.blocks[i].isCastle() )
				continue;
			
			if ( Ext.isEmpty( castleBlock ) )
			{
				castleBlock = this.blocks[i];
				continue;
			}
			
			if ( castleBlock.getPlayer().getIdentifier() != this.blocks[i].getPlayer().getIdentifier() )
				return null;
		}
		
		return castleBlock.getPlayer();
	},
	
	isGameEnded: function()
	{
		return ( !Ext.isEmpty( this.whoWinTheGame() ) );
	},
    
    onClickMapCanvas: function( e )
    {
        var click = this.getMousePoint( e );
        var block = this.getBlockOnPoint( click );
        
        this.game.getController().hideBoxes();
        
        if ( 
				Ext.isEmpty( block ) 
				|| 
				( 
					!Ext.isEmpty( block ) 
					&& 
					block.isHidden() 
				)
			)
        {
            this.game.getController().hideBoxes();
            return;
        }
        
        if ( 
                block.isCurrentPlayer() 
                && 
                block.isCastle() 
            )
        {
            this.onClickOnCastle( block );
            this.setSelectedBlock( block );
        }
            
        else if ( 
                block.isCurrentPlayer() 
                && 
                ( 
                    block.isUnit() 
                    || 
                    block.isTower() 
                ) 
                && 
                !block.getUnit().isActive() 
            )
            block.getUnit().showLightbox( this.scroll );
            
        else if ( 
                block.isCurrentPlayer() 
                && 
                ( 
                    block.isUnit() 
                    || 
                    block.isTower()
                ) 
                && 
                ( 
                    !Ext.isEmpty( this.selectedBlock )  
                    && 
                    this.selectedBlock.getIndex() == block.getIndex() 
                ) 
            )
            block.getUnit().showLightbox( this.scroll );
            
        else if ( 
                !Ext.isEmpty( this.selectedBlock ) 
                && 
                this.selectedBlock.isCurrentPlayer() 
                &&
                ( 
                    this.selectedBlock.isUnit() 
                    || 
                    this.selectedBlock.isTower() 
                )
                &&
                this.selectedBlock.getUnit().isActive()
                && 
                (
                    this.selectedBlock.getUnit().isMoveableBlock( block ) 
                    || 
                    this.selectedBlock.getUnit().isRuleableBlock( block ) 
                    || 
                    this.selectedBlock.getUnit().isAttackableBlock( block ) 
                )
            )
        {
            this.onClickOnAttackOrMove( block );
            this.setSelectedBlock( block );
        }
        
        else if ( 
                block.isCurrentPlayer() 
                && 
                ( 
                    block.isUnit() 
                    || 
                    block.isTower() 
                ) 
            )
        {
            this.onClickOnItem( block );
            this.setSelectedBlock( block );
        }
                    
        else if ( 
				!Ext.isEmpty( this.selectedBlock ) 
				&& 
				this.selectedBlock.isCastle() 
				&& 
				this.selectedBlock.getUnit().hasCreateableUnit() 
				&& 
				this.selectedBlock.isCurrentPlayer() 
			)
        {
            this.onClickOnCreateUnit( block );
            this.setSelectedBlock( null );
        }
        
        else if ( 
				!block.hasUnit() 
				&& 
				block.isCurrentPlayer() 
			)
        {
            this.onClickNothingBlock( block );
            this.setSelectedBlock( null );
        }
            
        else
        {
            this.game.getController().hideBoxes();
            this.setSelectedBlock( null );
        }
        
        this.render();
    },
    
    setSelectedBlock: function( block )
    {
        this.selectedBlock = block;
    },
    
    refreshMoney: function()
    {
        for ( var i = 0; i < this.blocks.length; i++ )
            if ( !this.blocks[i].isHidden() && this.blocks[i].isCurrentPlayer() && this.blocks[i].isCastle() )
                this.blocks[i].getUnit().refreshMoney();
    },
    
    refreshMovement: function()
    {
        for ( var i = 0; i < this.blocks.length; i++ )
            if ( !this.blocks[i].isHidden() && this.blocks[i].isUnit() )
                this.blocks[i].getUnit().setStatus( true );
    },
    
    onClickNothingBlock: function( block )
    {    
        this.setAllBlockToNormalStatus();
        var bs = block.getBlockAreaBlocks().asArray();
        for ( var i = 0; i < bs.length; i++ )
        {
            bs[i].setStatus("area");
            if ( bs[i].isCastle() )
                bs[i].setStatus("markerArea");
        }
            
        block.setStatus("selectedArea");
    },
    
    onClickOnCreateUnit: function( block )
    {
        this.setAllBlockToNormalStatus();
        
        var unit = this.game.getUnit().createUnit( 
            block,
            this.selectedBlock.getUnit().getCreateableUnit()
        );
        
        var blockKey = block.getIndex(),
            f = false,
            ns = unit.getBuildableBlocks( this.selectedBlock );
        
        if ( block.isUnit() || block.isBuilding() )
            return;

        for ( var i = 0; i < ns.length; i++ )
            if ( ns[i].getIndex() == blockKey )
                f = true;
        
        if (!f)
            return;
        
        block.setUnit( unit );
        this.selectedBlock.getUnit().buy( unit );
    },
    
    onClickOnItem: function( block )
    {
        this.setAllBlockToNormalStatus();
        block.setStatus("selected");
            
        var b = block.getUnit().getMoveableBlocks().concat( block.getUnit().getAttackableBlocks() ).concat( block.getUnit().getRuleableBlocks() );
        for ( var i = 0; i < b.length; i++ )
            b[i].setStatus('target');
    },
    
    onClickOnAttackOrMove: function( block )
    {
        this.setAllBlockToNormalStatus();
        var unit = this.selectedBlock.getUnit();
                        
        if ( unit.isMoveableBlock( block ) )
        {
            unit.moveToBlock( block );
        }
        else if ( unit.isRuleableBlock( block ) )
        {
            unit.ruleToBlock( block );
            this.generateNeutralBlocksAndCastleUnits();
        }
        else if ( unit.isAttackableBlock( block ) && !block.isCastle() )
        {
            unit.attackToBlock( block );
            this.generateNeutralBlocksAndCastleUnits();
        }
        else if ( unit.isAttackableBlock( block ) && block.isCastle() )
        {
            unit.attackToCastleBlock( block );
            this.generateNeutralBlocksAndCastleUnits();
        }
		
		if ( this.isGameEnded() )
			this.selectedBlock.getPlayer().win();
    },
    
    onClickOnCastle: function( block )
    {
        this.setAllBlockToNormalStatus();
        
        var bs = block.getBlockAreaBlocks().asArray();
        for ( var i = 0; i < bs.length; i++ )
            bs[i].setStatus("area");
            
        block.setStatus("selectedArea");
        block.getUnit().showLightbox( this.scroll );
    },
    
    setAllBlockToNormalStatus: function()
    {
        for ( var i = 0; i < this.blocks.length; i++ )
            this.blocks[ i ].setStatus("normal");
    },
    
    getBlockOnPoint: function( point )
    {
        for ( var i = 0; i < this.blocks.length; i++ )
            if ( this.blocks[ i ].isPointInPolygon( point, this.scroll ) )
                return this.blocks[ i ];
        
        return null;
    },
    
    getBlockOnLineColumn: function( line, column )
    {
        for ( var i = 0; i < this.blocks.length; i++ )
            if ( this.blocks[ i ].getLineNumber() == line && this.blocks[ i ].getColumnNumber() == column )
                return this.blocks[ i ];
        
        return null;
    },
    
    reset: function()
    {
        this.generate();
    },
    
    generate: function()
    {
        this.generateBlocks();
        this.generateNeutralBlocksAndCastleUnits();
        this.refreshMoney();
        this.refreshMovement();
        
        this.scroll = {
            top: 0,
            left: 0
        }
    },
    
    generateBlocks: function()
    {
        this.blocks = [];
        
        var x = this.blockSize,
            y = this.blockSize;
        
        for ( var i = 0; i < this.mapWidth; i++ )
        {
            for ( var j = 0; j < this.mapHeight; j ++ )
            {
                var newX = x + ( i * this.blockSize * 1.5 ),
                    newY = y + ( i % 2 ) * ( this.blockSize - 3 ) + ( j * this.blockSize * Math.sqrt(3) );
                
                this.blocks.push( 
                    new territory.map.Block({
                        size: this.blockSize,
                        centerPosition: [ newX, newY ],
                        game: this.game,
                        lineNumber: j,
                        columnNumber: i
                    })
                );
            }
        }
    },
    
    generateNeutralBlocksAndCastleUnits: function()
    {
        var bs = new AssocArray();
        for ( var i = 0; i < this.blocks.length; i++ )
        {
            if ( this.blocks[i].isHidden() )
                continue;
                
            if ( bs.contains( this.blocks[i].getIndex() ) )
                continue;

            var ns = this.blocks[i].getBlockAreaBlocks();
            if ( ns.asArray().length == 1 )
            {
                this.blocks[i].setNeutral();
                this.blocks[i].setUnit( null );
            }
            else
            {
                this.generateCastleInArea( ns )                
            }
                        
            bs.merge( ns );
        }
    },
    
    generateCastleInArea: function( area )
    {
        var ns = area.asArray(),   
            castle_idxs = [];
        
        for ( var i = 0; i < ns.length; i++ )
            if ( ns[ i ].isCastle() )
                castle_idxs.push( i );
        
        switch( castle_idxs.length )
        {
            case 0:        
                var idx = Math.floor(
                    Math.random() * ns.length
                );
                var block = ns[ idx ];
                block.setUnit(
                    this.game.getUnit().createCastle( block )
                );
                
                if ( !block.getUnit().hasEnoughtMoneyForNextRound() )
                    block.getUnit().cleanUpArea();
                    
                break;
                
            case 1:
                break;
                
            default:
                var remain = Math.floor(
                    Math.random() * castle_idxs.length
                );
                var money = 0;
                
                for ( var i = 0; i < castle_idxs.length; i++ )
                    if ( i != remain )
                    {
                        money += ns[ castle_idxs[i] ].getUnit().getMoney();
                        ns[ castle_idxs[i] ].setUnit( null );
                    }
                    
                ns[ castle_idxs[remain] ].getUnit().addMoney( money );
        }
    },
    
	stop: function()
	{
		this.canvas.dom.width  = window.innerWidth;
        this.canvas.dom.height = window.innerHeight - 32;
        this.canvas.dom.getContext('2d').clearRect( 0, 0, this.canvas.dom.width, this.canvas.dom.height );
		
		this.blocks = [];
		
		this.canvas.un(
            'click',
            this.onClickMapCanvas,
            this
        );
        
        this.canvas.un(
            'mousemove',
            this.onMouseMoveOnCanvas,
            this
        );
        
        this.canvas.un(
            'mousedown',
            this.onMouseDownOnCanvas,
            this
        );
        
        this.canvas.un(
            'mouseup',
            this.onMouseUpOnCanvas,
            this
        );
	},
	
    render: function()
    {
        this.canvas.dom.width  = window.innerWidth;
        this.canvas.dom.height = window.innerHeight - 32;
        this.canvas.dom.getContext('2d').clearRect( 0, 0, this.canvas.dom.width, this.canvas.dom.height );
        
        for ( var i = 0; i < this.blocks.length; i++ )
            this.blocks[ i ].draw( this.scroll );
        
        for ( var i = 0; i < this.blocks.length; i++ )
            this.blocks[ i ].drawArea( this.scroll );
    }
} );