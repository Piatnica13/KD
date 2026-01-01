from flask import session, current_app, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
from ...models.user import User
from ...models.address import Address
from ...core.database import db
import os


class UserService:
    @staticmethod
    def get_user(user_id: int) -> User | None:
        if not user_id:
            current_app.logger.error("Id пользователя не найдено")
            return None
        return User.query.get(user_id)
    
    @staticmethod
    def update_user(user: User, data):
        name = data.get("name")
        last_name = data.get("last_name", "")
        phone = data.get("phone", "")
        email = data.get("email", "")
        address = data.get("address", "")
        
        user.name = name.strip() if name else user.name
        user.last_name = last_name.strip() if last_name else user.last_name
        user.phone = phone.strip() if phone else user.phone
        user.email = email.strip() if email else user.email
        user.address = address.strip() if address else user.address
        
        flash("Информация о пользователе успешно обновлена.")
        
        current_app.logger.debug(f"Обновлена инофрмация для пользователя ID {user.id}")
    
    @staticmethod
    def update_password(user: User, data):
        new_pass = data.get("newPass")
        re_new_pass = data.get("reNewPass")
        
        min_len_password = 6

        if new_pass and new_pass == re_new_pass and len(new_pass) >= min_len_password:
            heshed_pass = generate_password_hash(new_pass)
            user.password = heshed_pass
            flash("Пароль успешно обновлен.")
            current_app.logger.debug(f"Пароль пользователя ID {user.id} успешно обновлён.")
        else:
            flash("Ошибка, пароли не совпадают или их длинна меньше 6 символов.")
            current_app.logger.warning(f"Ошибка при смене пароля у пользователя ID {user.id}: несовпадение или короткий пароль.")
    
    @staticmethod
    def change_address(user: User, data):
        deleted_addresses = data.get("deleted_addresses", "")
        deleted_ids = [int(id) for id in deleted_addresses.split(",") if id.isdigit()]

        if deleted_ids:
            Address.query.filter(Address.id.in_(deleted_ids), Address.user_id == user.id).delete(synchronize_session=False)
            current_app.logger.info(f"Пользователь ID {user.id} удалил адреса: {deleted_ids}")
        else:
            current_app.logger.debug(f"Нет адресов для удаления у пользователя ID {user.id}.")

        addressFromForm = data.get("addresses")

        if addressFromForm is not None:
            user.address = addressFromForm
            current_app.logger.debug(f"Пользователь ID {user.id} установил основной адрес: {addressFromForm}")
        else:
            user.address = ""
            current_app.logger.debug(f"Пользователь ID {user.id} очистил основной адрес.")
        
    @staticmethod
    def add_address(user: User, data):
        name = data.get("name")
        city = data.get("city")
        street = data.get("street")
        home = data.get("home")
        flat = data.get("flat")

        address = Address(name=name, city=city, street=street, home=home, flat=flat, user_id=user.id)
        
        db.session.add(address)

    @staticmethod
    def put_address(user: User, data):
        city = data.get("city")
        street = data.get("street")
        home = data.get("home")
        flat = data.get("flat")
        
        address_count = Address.query.filter_by(user_id=user.id).count()

        if address_count == 1:
            user.address = f"г.{city} ул.{street} д.{home} кв.{flat}"
            current_app.logger.debug(f"Основной адрес установлен для пользователя ID {user.id}.")
            
    @staticmethod
    def add_address(user, data):
        name = data.get("name")
        city = data.get("city")
        street = data.get("street")
        home = data.get("home")
        flat = data.get("flat")
        
        if not city or not street or not home:
            current_app.logger.warning("Не все обязательные поля заполнены при добавлении адреса.")
            return {"success": False, "error": "Не все обязательные поля заполнены"}
        
        new_address = Address(name=name, city=city, street=street, home=home, flat=flat, user_id=user.id)
        db.session.add(new_address)
        db.session.commit()
        
        address_count = Address.query.filter_by(user_id=user.id).count()
        if address_count == 1:
            user.address = f"г.{new_address.city} ул.{new_address.street} д.{new_address.home} кв.{new_address.flat}"
            db.session.commit()
            current_app.logger.debug(f"Основной адрес установлен для пользователя ID {user.id}.")

        return {
            "success": True,
            "message": "Адрес успешно добавлен",
            "address": f"г.{new_address.city} ул.{new_address.street} д.{new_address.home} кв.{new_address.flat}"
        }
    
    @staticmethod
    def add_user():
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']

        emails = db.session.query(User.email).all()
        emails = [email[0] for email in emails]

        if len(password) < 6:
            current_app.logger.warning("Регистрация не удалась: короткий пароль.")
            return {"success": False, "message": "Пароль меньше 6 символов."}

        if email in emails:
            current_app.logger.warning(f"Регистрация не удалась: Email {email} уже используется.")
            return {"success": False, "message": "Аккаунт с данным Email уже зарегистрирован."}

        hashed_password = generate_password_hash(password)
        person = User(name=name, email=email, password=hashed_password)
        try:
            db.session.add(person)
            db.session.commit()
            current_app.logger.info(f"Успешная регистрация: {email}")

            user = User.query.filter_by(email=email).first()
            if user and check_password_hash(user.password, password):
                session['user_id'] = user.id
                current_app.logger.debug(f"Пользователь {email} вошел после регистрации.")
            return {"success": True, "message": "Вы успешно зарегистрировались!"}
        except Exception as e:
            current_app.logger.error(f"Ошибка при регистрации пользователя {email}: {str(e)}")
            return {"success": False, "message": "Ошибка авторизации, повторите попытку."}
        
    @staticmethod
    def log_user(admin_email, admin_password):
        email = request.form['email']
        password = request.form['password']

        if not email or not password:
            current_app.logger.warning("Попытка входа с пустыми полями.")
            return {"success": False, "admin": False, "message": "Ошибка, обязательные поля пустые."}
        if len(password) < 6:
            current_app.logger.warning("Попытка входа с коротким паролем.")
            return {"success": False, "admin": False, "message": "Ошибка, длина пароля меньше 6 символов."}

        user = User.query.filter_by(email=email).first()
        if user:
            if not user.is_google:
                if email == admin_email and password == admin_password:
                    session['admin'] = True
                    session['user_id'] = user.id
                    current_app.logger.info(f"Администратор {email} вошел в систему.")
                    return {"success": True, "admin": True, "message": "Вы вошли в систему как Админ!"}


                if check_password_hash(user.password, password):
                    session['user_id'] = user.id
                    current_app.logger.info(f"Пользователь {email} успешно вошел.")
                    return {"success": True, "admin": False, "message": "Вы успешно вошли в аккаунт!"}
                else:
                    current_app.logger.warning(f"Неудачная попытка входа: {email}")
                    return {"success": False, "admin": False, "message": "Ошибка входа, неправильно введен пароль или email."}
            else:
                current_app.logger.warning("Попытка входа в аккаунт созданный при помощи Google")
                return {"success": False, "admin": False, "message": "Ошибка входа, Аккаунт создан через Google. Войдите через Google."}
        else:
            current_app.logger.warning(f"Неудачная попытка входа: {email}")
            return {"success": False, "admin": False, "message": "Ошибка входа, неправильно введен пароль или email."}
    
    @staticmethod
    def log_user_from_google():
        from main import oauth
        # 1. Завершаем авторизацию и получаем токен доступа
        token = oauth.google.authorize_access_token()

        # 2. Из токена ID получаем информацию о пользователе (email, name)
        user_info = oauth.google.get('https://www.googleapis.com/oauth2/v3/userinfo').json()

        google_email = user_info.get("email")
        google_name = user_info.get("name")

        user = User.query.filter_by(email=google_email).first()

        if user:
            session['user_id'] = user.id
            current_app.logger.info(f"Пользователь {google_email} успешно вошел.")
            return {'success': True, "message": "Вы успешно вошли в аккаунт!"}

        else:
            person = User(name=google_name, email=google_email)

            try:
                db.session.add(person)
                db.session.commit()

                user = User.query.filter_by(email=google_email).first()
                user.is_google = True

                db.session.add(user)
                db.session.commit()
                current_app.logger.info(f"Пользователь {google_email} успешно доавблен")

                session['user_id'] = user.id
                return {"success": True, "message": "Вы успешно авторизовались!"}


            except Exception as e:
                current_app.logger.error(f"Ошибка при регистрации пользователя {google_email}: {str(e)}")
                return {"success": False, "message": "Ошибка авторизации, повторите попытку"}
            
    @staticmethod
    def add_admin():
        admin = User.query.filter_by(email=os.getenv("ADMIN_EMAIL")).first()
        if not admin:
            new_admin = User(
                name="admin",
                password=generate_password_hash(os.getenv("ADMIN_PASSWORD")),
                email=os.getenv("ADMIN_EMAIL")
            )
            try:
                db.session.add(new_admin)
                db.session.commit()
                current_app.logger.info("Создан новый админ аккаунт.")
            except Exception as e:
                current_app.logger.error(f"Ошибка при создании админа: {str(e)}")
        else:
            current_app.logger.debug("Админ уже существует, создание не требуется.")