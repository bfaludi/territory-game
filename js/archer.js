
Ext.namespace('territory','territory.unit');

territory.unit.Archer = Ext.extend( territory.unit.Item, {
    
    imgObjectURL: 'img/archer.png',
    unitName: 'Nyilas',
    unitClass: 'territory.unit.Archer',
    unitMsg: 'Nyíllövő egység területek és szorosok hatékony védelmére.',
    couldAttackCastle: false,
    
    initObject: function()
    {
        this.cost = 4;
        this.prize = 6;
        this.level = 1;
        
        this.attack = 2; // Elso szintu katonat megveri
        this.defense = 0; // Elso szintu katona leveri
        
        this.active = true;
    },
    
    attackToBlock: function( block )
    {
        block.setUnit( null );
        this.setStatus( false );
    },
    
    getAttackableBlocks: function()
    {
        var ns = this.block.getFilteredBlockForOtherUser( 
			this.block.getNeightbourBlocksWithRange( 2 ) 
		).concat( this.block.getNeightbourBlockForOtherUser() );
        var attackable = [];
        
        for ( var i = 0; i < ns.length; i++ )
            if ( ns[i].hasUnit() && ns[i].getUnit().getDefense() < this.getAttack() )
                if ( this.couldAttackCastle || ( !this.couldAttackCastle && !ns[i].isCastle() ) )
                    attackable.push( ns[i] );
                
        return attackable;
    },
} );