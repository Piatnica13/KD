from ..core.database import db

class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(40), nullable=False)
    city = db.Column(db.String(20), nullable=False)
    street = db.Column(db.String(20), nullable=False)
    home = db.Column(db.String(20), nullable=False)
    flat = db.Column(db.String(20), nullable=True)

    def __repr__(self) -> str:
        return f"<Address {self.name}, {self.city}, {self.street}>"