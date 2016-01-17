
Ext.namespace('territory','territory.unit');

territory.unit.Gfx = Ext.extend( territory.Object, {
    
    imgObjectURL: null,
    
    preInitObject: function()
    {
        this.canvas  = Ext.get('map').dom;
        this.context = this.canvas.getContext('2d');
    },
    
    getStringWithDifferenceSign: function( number )
    {
        if ( number >= 0 )
            return '+' + number.toString();
            
        return number.toString();
    },
    
    getVisiblePosition: function( scroll )
    {
        var left = this.block.centerPosition[0] + scroll.left + ( this.block.size * 3 ), 
            top = this.block.centerPosition[1] + scroll.top;
            
        var bottom = top + this.box.getHeight(),
            right = left + this.box.getWidth();
            
        if ( bottom > window.innerHeight )
        {
            bottom = window.innerHeight - 10;
            top = bottom - this.box.getHeight();
        }
        
        if ( top < 52 )
        {
            top = 52 + 10;
            bottom = top + this.box.getHeight();
        }
            
        if ( right > window.innerWidth )
        {
            right = this.block.centerPosition[0] + scroll.left - ( this.block.size * 3 );
            left = right - this.box.getWidth();
        }
            
        return {
            top: top,
            left: left
        };
    },
    
    renderInformation: function( scroll )
    {   
    },
    
    render: function( scroll )
    {        
        if ( !Ext.isEmpty( this.imgObject ) )
        {
            this.renderInformation( scroll );
            this.context.drawImage(
                this.imgObject,
                this.block.centerPosition[0] - this.block.size/2 * 1.25 + scroll.left,
                this.block.centerPosition[1] - this.block.size/2 * 1.25 + scroll.top,
                this.block.size * 1.25,
                this.block.size * 1.25 
            )
            return;
        }
        
        var imgObject = new Image,
            ctx = this.context,
            block = this.block,
            scope = this;
            
        imgObject.src = this.imgObjectURL;
        imgObject.onload = function() {
            scope.renderInformation( scroll );
            ctx.drawImage(
                imgObject,
                block.centerPosition[0] - block.size/2 * 1.25 + scroll.left,
                block.centerPosition[1] - block.size/2 * 1.25 + scroll.top,
                block.size * 1.25,
                block.size * 1.25 
            );
        }
        
        this.imgObject = imgObject;
    }
} );