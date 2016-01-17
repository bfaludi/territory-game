
Ext.namespace('territory','territory.unit');

territory.unit.Item = Ext.extend( territory.unit.Gfx, {
    
    imgObjectURL: null,
    unitName: null,
    unitClass: null,
    unitMsg: null,
    couldAttackCastle: true,
    
    afterInitObject: function()
    {
        this.box = Ext.get( Ext.query( 'div.layer.unit' )[0] );
        this.headerBox = Ext.get( Ext.query( 'div.layer.unit div.header')[0] );
        this.msgBox = Ext.get( Ext.query( 'div.layer.unit div.msg' )[0] );
        this.moneyBox = Ext.get( Ext.query( 'div.layer.unit div.money' )[0] );
        this.prodBox = Ext.get( Ext.query( 'div.layer.unit div.prod' )[0] );
    },
    
    renderStatus: function( scroll )
    {
        if ( this.isActive() )
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
            
        imgStatusObject.src = 'img/icon/inactive.png';
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
    
    renderLevel: function( scroll )
    {    
        if ( !Ext.isEmpty( this.imgLevelObject ) )
        {
            this.context.drawImage(
                this.imgLevelObject,
                this.block.centerPosition[0] - this.block.size/2 - 5 + scroll.left,
                this.block.centerPosition[1] + scroll.top,
                20,
                20
            )
            return;
        }
        
        var imgLevelObject = new Image,
            ctx = this.context,
            block = this.block;
            
        imgLevelObject.src = 'img/rank/' + this.getLevel() + '.png';
        imgLevelObject.onload = function() {
            ctx.drawImage(
                imgLevelObject,
                block.centerPosition[0] - block.size/2 - 5 + scroll.left,
                block.centerPosition[1] + scroll.top,
                20,
                20 
            );
        }
    },
    
    renderInformation: function( scroll )
    {
        this.renderStatus( scroll );
        this.renderLevel( scroll );
    },
    
    attackToBlock: function( block )
    {
        this.ruleToBlock( block );
    },
    
    attackToCastleBlock: function( block )
    {
        var b = block.getBlockAreaBlocks().asArray();
        for ( var i = 0; i < b.length; i++ )
        {
            b[i].setPlayer( this.block.player );
			if ( !b[i].isTower() )
				b[i].setUnit( null );
        }
        this.attackToBlock( block );
    },
    
    ruleToBlock: function( block )
    {
        block.setPlayer( this.block.player );
        this.block.setUnit( null );
        block.setUnit( this );
        this.setStatus( false );
    },
    
    moveToBlock: function( block )
    {
        this.block.setUnit( null );
        block.setUnit( this );
        this.setStatus( false );
    },
    
    isActive: function()
    {
        return this.active;
    },
    
    getBuildableBlocks: function( castle_block )
    {
        var ns = castle_block.getNeightbourBlockForCurrentUser();
        var buildable = [];
        
        for ( var i = 0; i < ns.length; i++ )
            if ( !ns[i].isUnit() && !ns[i].isBuilding() )
                buildable.push( ns[i] );
                
        return buildable;
    },
    
    getMoveableBlocks: function()
    {
        return this.getBuildableBlocks( this.block );
    },
    
    isMoveableBlock: function( block )
    {
        var b = this.getMoveableBlocks();
        
        for ( var i = 0; i < b.length; i++ )
            if ( b[i].getIndex() == block.getIndex() )
                return true;
                
        return false;
    },
    
    getRuleableBlocks: function()
    {
        var ns = this.block.getNeightbourBlockForOtherUser();
        var ruleable = [];
        
        for ( var i = 0; i < ns.length; i++ )
            if ( !ns[i].isUnit() && !ns[i].isBuilding() )
                ruleable.push( ns[i] );
                
        return ruleable;
    },
    
    isRuleableBlock: function( block )
    {
        var b = this.getRuleableBlocks();
        
        for ( var i = 0; i < b.length; i++ )
            if ( b[i].getIndex() == block.getIndex() )
                return true;
                
        return false;
    },
    
    getAttackableBlocks: function()
    {
        var ns = this.block.getNeightbourBlockForOtherUser();
        var attackable = [];
        
        for ( var i = 0; i < ns.length; i++ )
            if ( ns[i].hasUnit() && ns[i].getUnit().getDefense() < this.getAttack() )
                if ( this.couldAttackCastle || ( !this.couldAttackCastle && !ns[i].isCastle() ) )
                    attackable.push( ns[i] );
                
        return attackable;
    },
    
    isAttackableBlock: function( block )
    {
        var b = this.getAttackableBlocks();
        
        for ( var i = 0; i < b.length; i++ )
            if ( b[i].getIndex() == block.getIndex() )
                return true;
                
        return false;
    },
    
    setStatus: function( active )
    {
        this.active = active;
    },
    
    levelUp: function()
    {
        this.cost *= 2;
        this.attack++;
		this.defense++;
        this.level++;
    },
    
    getLevelUpCost: function()
    {
        return this.cost*2;
    },
    
    getLevelUpPrize: function()
    {
        return this.prize * ( this.level + 1 );
    },
    
    getCost: function()
    {
        return this.cost;
    },
    
    getPrize: function()
    {
        return this.prize * this.level;
    },
    
    getLevel: function()
    {
        return this.level;
    },
    
    getAttack: function()
    {
        return this.attack;
    },
    
    getDefense: function()
    {
        return this.defense;
    },
    
    getUnitProductionBox: function( money, castle_block )
    {
        return '<div class="factory ' + ( ( money >= this.getPrize() && this.getBuildableBlocks( castle_block ).length > 0 ) ? 'active' : '' ) + '"><span class="cls">' + this.unitClass + '</span><div class="item"><img src="' + this.imgObjectURL + '" /></div><div class="info"><div class="name">' + this.unitName + '</div><div class="money">' + this.getPrize() + ' arany <span class="change">-' + this.getCost() + '/kör</span></div></div><div class="clear"></div></div>';
    },
    
    getUnitCurrentLevelBox: function()
    {
        return '<div class="factory"><div class="item"><img src="img/rank/' + this.getLevel() + '.png" /></div><div class="info"><div class="name">Akutális szint</div><div class="money">' + this.getPrize() + ' arany <span class="change">-' + this.getCost() + '/kör</span></div></div><div class="clear"></div></div>'
    },
    
    getUnitNextLevelBox: function( castle )
    {
        return '<div class="factory ' + ( ( castle.getMoney() >= this.getLevelUpPrize() ) ? 'active' : '' ) + '"><div class="item"><img src="img/rank/' + ( this.getLevel()+1 ) + '.png" /></div><div class="info"><div class="name">Következő szint</div><div class="money">' + this.getLevelUpPrize() + ' arany <span class="change">-' + this.getLevelUpCost() + '/kör</span></div></div><div class="clear"></div></div>'
    },
    
    showLightbox: function( scroll )
    {
        this.block.game.getController().hideBoxes();
        
        var castle = this.block.getCastleBlock().getUnit();
        this.headerBox.update( this.unitName );
        this.moneyBox.update( castle.getMoney() + ' arany <span class="change">' + this.getStringWithDifferenceSign( castle.getMoneyDifference() ) + '/kör</span>' );
        this.msgBox.update( '<img src="' + this.imgObjectURL + '"><span>' + this.unitMsg + '</span>' );
        
        var prodStr = this.getUnitCurrentLevelBox() + this.getUnitNextLevelBox( castle );
        
        this.prodBox.update( prodStr );
        for ( var i = 0; i < this.prodBox.dom.children.length; i++ )
        {
            var item = Ext.get( this.prodBox.dom.children[i] );
            item.on(
                'click',
                this.onClickOnUpdate,
                {
                    scope: this,
                    castle: castle
                }
            );
        }
        var p = this.getVisiblePosition( scroll );
        this.box.setTop( p.top );
        this.box.setLeft( p.left );
        this.box.setVisible( true );
    },
    
    onClickOnUpdate: function()
    {
        if ( this.scope.getLevelUpPrize() > this.castle.getMoney() )
            return;
            
        this.scope.levelUp();
        this.castle.buy( this.scope );
        if ( this.scope.isActive() )
        {
            this.scope.game.getMap().onClickOnItem( this.scope.block );
            this.scope.game.getMap().setSelectedBlock( this.scope.block );
        }
        this.scope.game.getController().hideBoxes();
        this.scope.game.render();
    }
} );