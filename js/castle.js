
Ext.namespace('territory','territory.unit');

territory.unit.Castle = Ext.extend( territory.unit.Gfx, {
    
    imgObjectURL: 'img/castle.png',
    cost: 0,
    
    initObject: function()
    {
        this.money = 0;
        this.cost = 0;
        this.box = Ext.get( Ext.query( 'div.layer.castle' )[0] );
        this.moneyBox = Ext.get( Ext.query( 'div.layer.castle div.money' )[0] );
        this.territoryBox = Ext.get( Ext.query( 'div.layer.castle div.territory' )[0] );
        this.buildingBox = Ext.get( Ext.query( 'div.layer.castle div.building' )[0] );
        this.unitBox = Ext.get( Ext.query( 'div.layer.castle div.unit' )[0] );
        this.prodBox = Ext.get( Ext.query( 'div.layer.castle div.prod' )[0] );
        this.cUnit = null;
    },
    
    getDefense: function()
    {
        return this.getBuildingNumber() + 1;
    },
    
    renderInformation: function( scroll )
    {   
        if ( this.getMoneyDifference() >= 0 )
            return;
            
        if ( !Ext.isEmpty( this.imgStatusObject ) )
        {
            this.context.drawImage(
                imgStatusObject,
                block.centerPosition[0] + scroll.left,
                block.centerPosition[1] - block.size/1.5 + scroll.top,
                16,
                16
            )
            return;
        }
        
        var imgStatusObject = new Image,
            ctx = this.context,
            block = this.block;
            
        imgStatusObject.src = 'img/icon/warning.png';
        imgStatusObject.onload = function() {
            ctx.drawImage(
                imgStatusObject,
                block.centerPosition[0] + scroll.left,
                block.centerPosition[1] - block.size/1.5 + scroll.top,
                16,
                16 
            );
        }
    },
    
    addMoney: function( money )
    {
        this.money += money;
    },
    
    refreshMoney: function()
    {
        this.money += this.getMoneyDifference();
        if ( this.money >= 0 )
            return;
        
        this.cleanUpArea();
    },
    
    hasEnoughtMoneyForNextRound: function()
    {
        return ( this.getMoney() + this.getMoneyDifference() >= 0 );
    },
    
    cleanUpArea: function()
    {
        var ns = this.block.getBlockAreaBlocks().asArray();
        for ( var i = 0; i < ns.length; i++ )
            if ( ns[i].hasUnit() && !ns[i].isCastle() )
                ns[i].setUnit( null );
                
        this.money = 0;
    },
    
    getTerritoryNumber: function()
    {
        return this.block.getBlockAreaBlocks().asArray().length;
    },
    
    getBuildingNumber: function()
    {
        var ns = this.block.getBlockAreaBlocks().asArray(),
            n = 0;
            
        for ( var i = 0; i < ns.length; i++ )
            if ( ns[i].isBuilding() )
                n++;
                
        return n;
    },
    
    getUnitNumber: function()
    {
        var ns = this.block.getBlockAreaBlocks().asArray(),
            n = 0;
            
        for ( var i = 0; i < ns.length; i++ )
            if ( ns[i].isUnit() )
                n++;
                
        return n;
    },
    
    getMoneyDifference: function()
    {
        var ns = this.block.getBlockAreaBlocks().asArray();
        var money = ns.length - 1;
        
        for ( var i = 0; i < ns.length; i++ )
            if ( ns[i].hasUnit() )
                money -= ns[i].getUnit().cost;

        return money;
    },
    
    getMoney: function()
    {
        return this.money;
    },
    
    onClickOnProduction: function()
    {
        var cls = eval( 'new ' + this.unit + '()' );
        if ( cls.getPrize() > this.scope.getMoney() )
            return;
                    
        this.scope.game.getController().hideBoxes();
        var ns = cls.getBuildableBlocks( this.scope.block );
        for ( var i = 0; i < ns.length; i++ )
            ns[i].setStatus('createArea');
               
        this.scope.cUnit = cls; 
        this.scope.game.render();
    },
    
    buy: function( unit )
    {
        this.money -= unit.getPrize();
    },
    
    hasCreateableUnit: function()
    {
        return !Ext.isEmpty( this.cUnit ); 
    },
    
    getCreateableUnit: function()
    {
        return this.cUnit;
    },
    
    showLightbox: function( scroll )
    {
        this.block.game.getController().hideBoxes();
        
        this.cUnit = null;
        this.moneyBox.update( this.getMoney() + ' arany <span class="change">' + this.getStringWithDifferenceSign( this.getMoneyDifference() ) + '/kör</span>' );
        this.territoryBox.update( this.getTerritoryNumber() + ' terület' );
        this.buildingBox.update( this.getBuildingNumber() + ' épület' );
        this.unitBox.update( this.getUnitNumber() + ' katona' );
        
        var unit_classes = [ 
            new territory.unit.Tower(),
            new territory.unit.Swordsman(),
            new territory.unit.Archer(),
            new territory.unit.Knight()
        ];
        var prodStr = '';
        for ( var i = 0; i < unit_classes.length; i++ )
            prodStr += unit_classes[i].getUnitProductionBox( this.getMoney(), this.block );

        this.prodBox.update( prodStr );
        for ( var i = 0; i < this.prodBox.dom.children.length; i++ )
        {
            var item = Ext.get( this.prodBox.dom.children[i] );
            item.on(
                'click',
                this.onClickOnProduction,
                {
                    scope: this,
                    unit: item.query('span[class=cls]')[0].innerHTML
                }
            );
        }
        
        var p = this.getVisiblePosition( scroll );
        this.box.setTop( p.top );
        this.box.setLeft( p.left );
        this.box.setVisible( true );
    }
} );