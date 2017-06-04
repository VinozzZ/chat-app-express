function Room(name, id, owner){
	this.name = name;
	this.id = id;
	this.owner = owner;
	this.userArray = [];
	this.status = "available";
}

Room.prototype.addPerson = function(personID){
	if(this.status = 'available'){
		this.userArray.push(personID);
	}
}

module.exports = Room;