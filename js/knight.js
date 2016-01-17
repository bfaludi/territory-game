
Ext.namespace('territory','territory.unit');

territory.unit.Knight = Ext.extend( territory.unit.Item, {
    
    imgObjectURL: 'img/knight.png',
    unitName: 'Lovag',
    unitClass: 'territory.unit.Knight',
    unitMsg: 'Gyors rohamegység, nagyszerű felmentő seregként.',
    
    initObject: function()
    {
        this.cost = 8;
        this.prize = 12;
        this.level = 1;
        
        this.attack = 1;
        this.defense = 1;
        
        this.active = true;
    },
	
	getMoveableBlocks: function()
    {
		var ns = this.block.getFilteredBlockForCurrentUser( 
			this.block.getNeightbourBlocksWithRange( 2 ) 
		).concat( this.block.getNeightbourBlockForCurrentUser() );
        var buildable = [];
        
        for ( var i = 0; i < ns.length; i++ )
            if ( !ns[i].isUnit() && !ns[i].isBuilding() )
                buildable.push( ns[i] );
                
        return buildable;
    }
} );