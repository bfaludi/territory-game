
Ext.namespace('territory','territory.draw', 'territory.map', 'territory.unit');

territory.map.Block = Ext.extend( territory.draw.Hexagon, {

    fillColor: ["orange","yellow"],
    neutralFillColor: ["#999966","#5C5C3D"],
    strokeColor: "black",
    strokeWidth: 2,
    hidden: false,
    moveable: true,
    status: "normal",
    type: null,
    player: null,
    lineNumber: null,
    columnNumber: null,
    unit: null,
    area: false,
    
    preInitObject: function() 
    {
        this.getRandomType();
        this.player = this.game.getController().getRandomPlayer();
        this.setColor();
    },
    
    setNeutral: function()
    {
        this.player = null;
        this.setColor();
    },
    
    setPlayer: function( player )
    {
        this.player = player;
        this.setColor();
    },
    
    isNeutral: function()
    {
        return Ext.isEmpty( this.player );
    },
    
    setColor: function()
    {
        this.area = false;
        
        switch( this.status )
        {
            case "normal":
                if ( this.isNeutral() )
                {
                    this.fillColor = this.neutralFillColor;
                    return;
                }
                    
                this.fillColor = this.player.getColor();
                break;
            case "selected":
                this.fillColor = this.player.getSelectedColor();
                break;
            case "selectedArea":
                this.fillColor = this.player.getSelectedColor();
                this.area = true;
                break;
            case "createArea":
                this.fillColor = this.player.getCreateColor();
                this.area = true;
                break;
            case "area":
                this.fillColor = this.player.getAreaColor();
                this.area = true;
                break;
            case "markerArea":
                if ( !this.isNeutral() && !this.isCurrentPlayer() && this.hasUnit() )
                {
                    this.fillColor = this.player.getTargetColor();
                }
                else if ( !this.isNeutral() )
                {
                    this.fillColor = this.player.getMoveColor();
                }
                else
                {
                    this.fillColor = [ this.neutralFillColor[0], this.neutralFillColor[0] ];
                }
                this.area = true;
            case "target":
                if ( !this.isNeutral() && !this.isCurrentPlayer() && this.hasUnit() )
                {
                    this.fillColor = this.player.getTargetColor();
                }
                else if ( !this.isNeutral() )
                {
                    this.fillColor = this.player.getMoveColor();
                }
                else
                {
                    this.fillColor = [ this.neutralFillColor[0], this.neutralFillColor[0] ];
                }
                break;
        }
    },
    
    getCastleBlock: function()
    {
        var ns = this.getBlockAreaBlocks().asArray();
        for ( var i = 0; i < ns.length; i++ )
            if ( ns[i].isCastle() )
                return ns[i];
                
        return null;
    },
    
    getIndex: function()
    {
        return this.getLineNumber() + '-' + this.getColumnNumber();
    },
    
    setUnit: function( unit )
    {
        this.unit = unit;
        
        if ( !Ext.isEmpty( this.unit ) )
            this.unit.block = this;
    },
    
    setStatus: function( status )
    {
        this.status = status;
        this.setColor();
    },
    
    hasUnit: function()
    {
        return !Ext.isEmpty( this.unit );
    },
    
    isHidden: function()
    {
        return this.hidden;
    },
    
    isCurrentPlayer: function()
    {
        if ( this.isNeutral() )
            return false;
            
        return this.game.getController().getCurrentPlayer().getIdentifier() == this.player.getIdentifier();
    },
    
    isMoveable: function()
    {
        return this.moveable;
    },
    
    getLineNumber: function()
    {
        return this.lineNumber;
    },
    
    getColumnNumber: function()
    {
        return this.columnNumber;
    },
    
    getRandomType: function()
    {
        var rnd = Math.floor( Math.random() * 5 );

        switch( rnd )
        {
            case 0:
                this.moveable = false;
                break;
            case 1:
                this.hidden = true;
                this.moveable = false;
                break;
        };
        
        this.type = rnd;
    },
    
    getOwnerPlayer: function()
    {
        return this.player;
    },
    
    getBlockAreaBlockNumber: function()
    {
        return this.getBlockAreaBlocks().asArray().length;
    },
    
    getBlockAreaBlocks: function( rbs )
    {
        var bs = rbs || new AssocArray(), 
            ns = this.getNeightbourBlockForSameUser();
                
        var idx = this.getIndex();
        if ( bs.contains( idx ) )
        {
            return bs;
        }
        else
        {
            bs.add( idx, this );
        }   
        
        if ( ns.length == 0 )
            return bs;
        
        for ( var i = 0; i < ns.length; i++ )
            bs.merge( ns[i].getBlockAreaBlocks( bs ) );
        
        return bs;
    },
    
    getUnit: function()
    {
        return this.unit;
    },
    
    isCastle: function()
    {
        return ( 
                this.hasUnit() 
                && 
                this.unit instanceof territory.unit.Castle
        );
    },
    
    isTower: function()
    {
        return (
            this.hasUnit()
            &&
            this.unit instanceof territory.unit.Tower
        );
    },
    
    isBuilding: function()
    {
        return this.isTower() || this.isCastle();
    },
    
    isUnit: function()
    {
        if ( !this.hasUnit() )
            return false;
            
        if ( this.unit instanceof territory.unit.Swordsman )
            return true;
        
        if ( this.unit instanceof territory.unit.Archer )
            return true;
        
        if ( this.unit instanceof territory.unit.Knight )
            return true;
                    
        return false;
    },
    
    getPlayer: function()
    {
        return this.player;
    },
    
    getNeightbourBlockForSameUser: function()
    {
        var returnBlocks = [],
            neightbourBlocks = this.getNeightbourBlocks();
        
        for ( var i = 0; i < neightbourBlocks.length; i++ )
            if ( !neightbourBlocks[i].isNeutral() && !this.isNeutral() && neightbourBlocks[ i ].getPlayer().getIdentifier() == this.getPlayer().getIdentifier() )
                returnBlocks.push( neightbourBlocks[ i ] );
        
        return returnBlocks;
    },
    
	getFilteredBlockForCurrentUser: function( blocks )
	{
		var returnBlocks = [];
		
        for ( var i = 0; i < blocks.length; i++ )
            if ( blocks[ i ].isCurrentPlayer() )
                returnBlocks.push( blocks[ i ] );
        
        return returnBlocks;
	},
	
    getNeightbourBlockForCurrentUser: function()
    {
        return this.getFilteredBlockForCurrentUser( this.getNeightbourBlocks() );
    },
    
	getFilteredBlockForOtherUser: function( blocks )
	{
		var returnBlocks = [];
		for ( var i = 0; i < blocks.length; i++ )
        {
            if 
            ( 
                ( 
                    blocks[i].isNeutral() 
                    || ( 
                        !blocks[i].isNeutral() 
                        && blocks[ i ].getPlayer().getIdentifier() != this.getPlayer().getIdentifier() 
                    ) 
                ) 
                && !blocks[ i ].isHidden() 
            )
            {
                returnBlocks.push( blocks[ i ] );
            }
        }
        
        return returnBlocks;
	},
	
    getNeightbourBlockForOtherUser: function()
    {
		return this.getFilteredBlockForOtherUser( this.getNeightbourBlocks() );
    },
    
    getNeightbourHiddenBlock: function()
    {
        var returnBlocks = [],
            neightbourBlocks = this.getNeightbourBlocks( true );
        
        for ( var i = 0; i < neightbourBlocks.length; i++ )
            if ( neightbourBlocks[i].isHidden() )
                returnBlocks.push( neightbourBlocks[ i ] );
        
        return returnBlocks;
    },
    
	getNeightbourBlocksWithRange: function( range, hidden )
	{
		if ( range == 1 )
			return this.getNeightbourBlocks( hidden );
		
		var checkableBlocks = this.getNeightbourBlocksWithRange( range-1, hidden );		
		var rangedBlocks = new AssocArray();
		
		for ( var i = 0; i < checkableBlocks.length; i++ )
		{
			var nb = checkableBlocks[i].getNeightbourBlocks( hidden );
			for ( var j = 0; j < nb.length; j++ )
				rangedBlocks.add( nb[j].getIndex(), nb[j] );
		}
		
		for ( var i = 0; i < checkableBlocks.length; i++ )
			rangedBlocks.remove( checkableBlocks[i].getIndex() );
			
		rangedBlocks.remove( this.getIndex() );
		return rangedBlocks.asArray();
	},
	
    getNeightbourBlocks: function( hidden )
    {
        var map = this.game.getMap();
        
        if ( this.lineNumber % 2 == 1 && this.columnNumber % 2 == 1)
        {
            var p = [
                {
                    x: this.columnNumber,
                    y: this.lineNumber - 1
                },
                {
                    x: this.columnNumber - 1,
                    y: this.lineNumber + 1
                },
                {
                    x: this.columnNumber - 1,
                    y: this.lineNumber
                },
                {
                    x: this.columnNumber + 1,
                    y: this.lineNumber
                },
                {
                    x: this.columnNumber,
                    y: this.lineNumber + 1
                },
                {
                    x: this.columnNumber + 1,
                    y: this.lineNumber + 1
                }
            ];
        }
        else if ( this.lineNumber % 2 == 1 && this.columnNumber % 2 == 0 )
        {
            var p = [
                {
                    x: this.columnNumber,
                    y: this.lineNumber - 1
                },
                {
                    x: this.columnNumber - 1,
                    y: this.lineNumber - 1
                },
                {
                    x: this.columnNumber - 1,
                    y: this.lineNumber
                },
                {
                    x: this.columnNumber + 1,
                    y: this.lineNumber
                },
                {
                    x: this.columnNumber,
                    y: this.lineNumber + 1
                },
                {
                    x: this.columnNumber + 1,
                    y: this.lineNumber - 1
                }
            ];
        }
        else if ( this.lineNumber % 2 == 0 && this.columnNumber % 2 == 1 )
        {
            var p = [
                {
                    x: this.columnNumber + 1,
                    y: this.lineNumber + 1
                },
                {
                    x: this.columnNumber,
                    y: this.lineNumber - 1
                },
                {
                    x: this.columnNumber - 1,
                    y: this.lineNumber
                },
                {
                    x: this.columnNumber + 1,
                    y: this.lineNumber
                },
                {
                    x: this.columnNumber - 1,
                    y: this.lineNumber + 1
                },
                {
                    x: this.columnNumber,
                    y: this.lineNumber + 1
                }
            ];
        }
        else if ( this.lineNumber % 2 == 0 && this.columnNumber % 2 == 0 )
        {
            var p = [
                {
                    x: this.columnNumber + 1,
                    y: this.lineNumber - 1
                },
                {
                    x: this.columnNumber,
                    y: this.lineNumber - 1
                },
                {
                    x: this.columnNumber - 1,
                    y: this.lineNumber
                },
                {
                    x: this.columnNumber + 1,
                    y: this.lineNumber
                },
                {
                    x: this.columnNumber - 1,
                    y: this.lineNumber - 1
                },
                {
                    x: this.columnNumber,
                    y: this.lineNumber + 1
                }
            ];
        }
        
        var neightbours = [];
        for ( var i = 0; i < p.length; i++ )
        {
            var block = map.getBlockOnLineColumn( p[ i ].y, p[ i ].x );
            if ( !Ext.isEmpty( block ) && ( ( Ext.isEmpty( hidden ) && !block.isHidden() ) || ( !Ext.isEmpty( hidden ) && hidden ) ) )
                neightbours.push( block );
        }

        return neightbours;
    },
    
    getDirection: function( block )
    {
        var x = this.getColumnNumber() - block.getColumnNumber(),
            y = this.getLineNumber() - block.getLineNumber();
            
        var UPPER_LEFT = 6,
            UPPER = 8,
            UPPER_RIGHT = 10,
            LOWER_LEFT = 0,
            LOWER = 2,
            LOWER_RIGHT = 4;
        
        if ( x == 0 && y > 0 )
        {
            return UPPER;
        }
        else if ( x == 0 && y < 0 )
        {
            return LOWER;
        }
        else if ( this.getColumnNumber() % 2 == 1 && y == 0 && x > 0 )
        {
            return UPPER_LEFT;
        }
        else if ( this.getColumnNumber() % 2 == 1 && y == 0 && x < 0 )
        {
            return UPPER_RIGHT;
        }
        else if ( this.getColumnNumber() % 2 == 1 && y < 0 && x < 0 )
        {
            return LOWER_LEFT;
        }
        else if ( this.getColumnNumber() % 2 == 1 && y < 0 && x > 0 )
        {
            return LOWER_RIGHT;
        }
        else if ( this.getColumnNumber() % 2 == 0 && y > 0 && x > 0 )
        {
            return UPPER_LEFT;
        }
        else if ( this.getColumnNumber() % 2 == 0 && y > 0 && x < 0 )
        {
            return UPPER_RIGHT;
        }
        else if ( this.getColumnNumber() % 2 == 0 && y == 0 && x < 0 )
        {
            return LOWER_LEFT;
        }
        else if ( this.getColumnNumber() % 2 == 0 && y == 0 && x > 0 )
        {
            return LOWER_RIGHT;
        }
    },
    
    renderArea: function( scroll )
    {
        var ns = this.getNeightbourBlockForOtherUser().concat( this.getNeightbourHiddenBlock() );
        
        for ( var j = 0; j < ns.length; j++ )
        {                
                idx = this.getDirection( ns[j] );
                
                this.context.beginPath();
                this.context.moveTo( 
                    this.coords[idx % 12] + scroll.left, 
                    this.coords[idx+1 % 12] + scroll.top 
                );
                this.context.lineTo(
                    this.coords[idx+2 % 12] + scroll.left,
                    this.coords[idx+3 % 12] + scroll.top
                );
                this.context.closePath();
                this.context.strokeStyle = "black";
                this.context.lineWidth = 4;
                this.context.stroke();
        }
    },
    
    drawArea: function( scroll )
    {
        if ( !this.area )
            return;
            
        this.renderArea( scroll );
    },
    
    renderIndex: function( scroll )
    {
        this.context.fillStyle = "black";
        this.context.font = "13px Helvetica";
        this.context.fillText( 
            this.getIndex(), 
            this.centerPosition[0] - 14 + scroll.left, 
            this.centerPosition[1] + 4 + scroll.top
        );
    },
    
    renderUnit: function( scroll )
    {
        if ( this.hasUnit() )
            this.unit.render( scroll );
    },
    
    draw: function( scroll )
    {
        if ( this.hidden )
            return;
            
        this.render( scroll );
        this.renderUnit( scroll );   
        //this.renderIndex( scroll ); 
    }
} );