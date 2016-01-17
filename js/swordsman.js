
Ext.namespace('territory','territory.unit');

territory.unit.Swordsman = Ext.extend( territory.unit.Item, {
    
    imgObjectURL: 'img/swordsman.png',
    unitName: 'Gyalogos',
    unitClass: 'territory.unit.Swordsman',
    unitMsg: 'Közelharcos, aki könyörtelenül lecsap áldozataira.',
    
    initObject: function()
    {
        this.cost = 2;
        this.prize = 4;
        this.level = 1;
        
        this.attack = 1;
        this.defense = 1;
        
        this.active = true;
    }
} );