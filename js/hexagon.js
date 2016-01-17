
Ext.namespace('territory','territory.draw');

territory.draw.Hexagon = Ext.extend( territory.draw.Polygon, {

    size: 50,
    centerPosition: [],
    
    afterInitObject: function() 
    {
        var x = this.centerPosition[0], 
            y = this.centerPosition[1],
            numberOfSides = 6;
        
        this.coords = [ 
            x + this.size * Math.cos(0), 
            y + this.size * Math.sin(0) 
        ];
        
        for ( var i = 1; i <= numberOfSides; i++ )
        {
            this.coords.push(
                x + this.size * Math.cos( i * 2 * Math.PI / numberOfSides )
            );
            this.coords.push(
               y + this.size * Math.sin( i * 2 * Math.PI / numberOfSides )
            );
        }
    },
    
    getWidth: function()
    {
        return this.size * 2;
    }
} );