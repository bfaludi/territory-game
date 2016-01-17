
Ext.namespace('territory','territory.unit');

territory.Unit = Ext.extend( territory.Object, {
    
    createCastle: function( block )
    {
        var castle = new territory.unit.Castle({
            block: block,
            game: this.game
        });
        
        return castle;
    },
    
    createUnit: function( block, unit )
    {
        unit.game = this.game;
        unit.block = block;
        
        return unit;
    }
} );