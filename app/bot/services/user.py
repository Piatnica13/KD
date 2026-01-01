from ...models.user import User
from ...core.database import db
from telebot.types import Message

class UserService:
    @staticmethod
    def reg(msg) -> User | None:
        id_tg = msg.chat.id
        
        user = User.query.filter_by(id_tg=id_tg).first()
        
        if not user:
            user = User(
                name_tg=msg.from_user.username,
                first_name_tg=msg.from_user.first_name,
                id_tg=id_tg,
                role='seller'
            )
            db.session.add(user)            
        elif msg.from_user.is_bot == False:
            user.name_tg = msg.from_user.username
            user.first_name_tg = msg.from_user.first_name
        
        db.session.commit()
        return user
    
    @staticmethod
    def change_user_role(role: str, msg: Message) -> User | None:
        user = UserService.reg(msg)
        
        user.role = role
        
        db.session.commit()
        return user