
Ext.namespace('territory','territory.unit');

territory.unit.Tower = Ext.extend( territory.unit.Item, {
    
    imgObjectURL: 'img/tower.png',
    unitName: 'Védőtorony',
    unitClass: 'territory.unit.Tower',
	unitMsg: 'Védelmezi a területet és véd a közelgő seregekkel szemben',
    couldAttackCastle: false,
    
    initObject: function()
    {
        this.cost = 1;
        this.prize = 8;
        this.level = 1;
        
        this.attack = 1;
        this.defense = 1;
        
        this.active = true;
    },
    
    attackToBlock: function( block )
    {
        block.setUnit( null );
    },
    
    getMoveableBlocks: function()
    {
        return [];
    },
    
    getRuleableBlocks: function()
    {
        return [];
    },
    
    getBuildableBlocks: function( castle_block )
    {
        var ns = castle_block.getBlockAreaBlocks().asArray();
        var buildable = [];
        
        for ( var i = 0; i < ns.length; i++ )
            if ( !ns[i].isUnit() && !ns[i].isBuilding() )
                buildable.push( ns[i] );
                
        return buildable;
    }
} );