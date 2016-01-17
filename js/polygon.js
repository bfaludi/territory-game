
Ext.namespace('territory','territory.draw');

territory.draw.Polygon = Ext.extend( territory.Object, {

    coords: [],
    fillColor: null,
    strokeColor: null,
    strokeWidth: 1,

    initObject: function() 
    {
        this.canvas  = Ext.get('map').dom;
        this.context = this.canvas.getContext('2d');
    },
    
    getCoord: function()
    {
        return this.coords;
    },
    
    isPointInPolygon: function( point, scroll )
    {
        var pt = point,
            poly = [];
            
        for ( var item = 0; item < this.coords.length - 1; item += 2 )
        {
            poly.push({
                x: this.coords[ item ] + scroll.left,
                y: this.coords[ item + 1 ] + scroll.top
            })
        }
            
        for( var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i )
            ( ( poly[i].y <= pt.y && pt.y < poly[j].y ) || ( poly[j].y <= pt.y && pt.y < poly[i].y ) )
            && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
            && (c = !c);
        return c;
    },
    
    getTopLeftCoord: function()
    {
        return [
            this.coords[6],
            this.coords[8]
        ]
    },
    
    getWidth: function()
    {
        return 0;
    },
    
    render: function( scroll )
    {   
        var linearGradient = this.context.createLinearGradient(
            this.getTopLeftCoord()[0] + scroll.left,
            this.getTopLeftCoord()[1] + scroll.top,
            this.getTopLeftCoord()[0] + this.getWidth() + scroll.left,
            this.getTopLeftCoord()[1] + scroll.top
        );
        linearGradient.addColorStop( 0, this.fillColor[0] );
        linearGradient.addColorStop( 1, this.fillColor[1] );

        this.context.fillStyle = linearGradient;        
        this.context.beginPath();
        this.context.moveTo( 
            this.coords[0] + scroll.left, 
            this.coords[1] + scroll.top 
        );
        for ( item = 2; item < this.coords.length - 1; item += 2 )
        {
            this.context.lineTo( 
                this.coords[ item ] + scroll.left, 
                this.coords[ item + 1 ] + scroll.top
            );
        }
        this.context.closePath();
        if ( !Ext.isEmpty( this.strokeColor ) )
        {
            this.context.strokeStyle = this.strokeColor;
            this.context.lineWidth = this.strokeWidth;
            this.context.stroke();
        }
        this.context.fill();
    }
} );