from ..core.database import db
from sqlalchemy import JSON

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(25))
    last_name = db.Column(db.String(40), default="")
    is_google = db.Column(db.Boolean(), default=False)
    password = db.Column(db.String(255))
    phone = db.Column(db.String(11), default="")
    email = db.Column(db.String(75))
    address = db.Column(db.String(50), default="")
    addresses = db.relationship('Address', backref='person', lazy=True, cascade="all, delete")
    favourites = db.Column(JSON, default=[])
    basket = db.Column(JSON, default=[])

    name_tg = db.Column(db.String)
    first_name_tg = db.Column(db.String)
    id_tg = db.Column(db.Integer)
    role = db.Column(db.String)
    
    def __init__(self, name: str | None = None, email: str | None = None, password: str | None = None, name_tg: str | None = None, first_name_tg: str | None = None, id_tg: int | None = None, role: str | None = None):
        self.name = name
        self.email = email
        self.password = password
        
        self.name_tg = name_tg
        self.first_name_tg = first_name_tg
        self.id_tg = id_tg
        self.role = role
    
    def __repr__(self) -> str:
        return f"{self.name, self.name_tg}"