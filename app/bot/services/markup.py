from telebot import types

class MarkupService:
    def menu(self) -> types.InlineKeyboardMarkup:
        markup = types.InlineKeyboardMarkup(row_width=1)
        btn1 = types.InlineKeyboardButton("Каталог", callback_data="catalog")
        btn2 = types.InlineKeyboardButton("Роль", callback_data="role")
        btn3 = types.InlineKeyboardButton("Добавить фото", callback_data="add_imgs")
        btn4 = types.InlineKeyboardButton("Оповестить рабочих", callback_data="notify")
        markup.add(btn1, btn2, btn3, btn4)
        
        return markup
    
        
    def change_count_product(self) -> types.InlineKeyboardMarkup:
        markup = types.InlineKeyboardMarkup(row_width=2)
        
        btn1 = types.InlineKeyboardButton("-", callback_data='reduce')
        btn2 = types.InlineKeyboardButton("+", callback_data='increase')
        btn3 = types.InlineKeyboardButton("⬅️Меню", callback_data='menu')
        btn4 = types.InlineKeyboardButton("Свое число", callback_data='your_num')
        btn5 = types.InlineKeyboardButton("Gold", callback_data='gold')
        btn6 = types.InlineKeyboardButton("Silver", callback_data='silver')
        btn7 = types.InlineKeyboardButton("З. заготовки", callback_data='form_gold')
        btn8 = types.InlineKeyboardButton("С. заготовки", callback_data='form_silver')
                
        markup.add(btn2, btn1, btn5, btn6, btn7, btn8, btn3, btn4)
        
        return markup
    
    
    def role(self) -> types.InlineKeyboardMarkup:
        markup = types.InlineKeyboardMarkup(row_width=1)
        
        btn1 = types.InlineKeyboardButton("Продовец", callback_data="seller")
        btn2 = types.InlineKeyboardButton("Рабочий", callback_data="worker")
        
        markup.add(btn1, btn2)
        
        return markup