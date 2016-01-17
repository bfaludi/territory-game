function Set() {
    this.content = {};
}

Set.prototype.add = function(val) {
    this.content[val] = true;
}

Set.prototype.remove = function(val) {
    delete this.content[val];
}

Set.prototype.contains = function(val) {
    return (val in this.content);
}

Set.prototype.asArray = function() {
    var res = [];
    for (var val in this.content) res.push(val);
    return res;
}

function AssocArray() {
    this.content = {};
}

AssocArray.prototype.add = function(idx,val) {
	if ( idx in this.content )
		return;
		
    this.content[idx] = val;
}

AssocArray.prototype.remove = function(idx) {
	if ( idx in this.content )
		delete this.content[idx];
}

AssocArray.prototype.contains = function(idx) {
    return (idx in this.content);
}

AssocArray.prototype.asArray = function() {
    var res = [];
    for (var idx in this.content) res.push(this.content[idx]);
    return res;
}

AssocArray.prototype.merge = function(aarray) {
    for ( var idx in aarray.content )
    {
        if ( !( idx in this.content ) )
        {
            this.content[ idx ] = aarray.content[ idx ];
        }
    }
}
