from pathlib import Path
from slugify import slugify
from ..services.user import UserService
from ..services.notification import NotificationService
from ..services.fsm.in_memory_fsm import InMemoryFSMStorage
from ..services.product import ProductService
from ..services.markup import MarkupService
from telebot.types import Message, CallbackQuery
from telebot import TeleBot
from flask import Flask
import os


class BotService:
    def __init__(self, bot: TeleBot, app: Flask, fsm: InMemoryFSMStorage, ps: ProductService, markup: MarkupService) -> None:
        self.bot = bot
        self.app = app
        self.fsm = fsm
        self.markup = markup
        self.ps = ps
        self.material = "gold"
    
    # CALLBACKS
    def chek_callbacks(self, call: CallbackQuery) -> None:
        if call.data == "reduce":
            self.callback_reduce(call)
        elif call.data == "increase":
            self.callback_increase(call)
        elif call.data == 'menu':
            self.callback_menu(call.message)
        elif call.data == 'your_num':
            self.callback_user_num_for_update(call)
        elif call.data == 'gold':
            self.callback_gold(call)
        elif call.data == 'silver':
            self.callback_silver(call)
        elif call.data == 'form_gold':
            self.callback_form_gold(call)
        elif call.data == 'form_silver':
            self.callback_form_silver(call)
        elif call.data == 'catalog':
            self.callback_catalog(call)
        elif call.data == 'role':
            self.callback_role(call)
        elif call.data == 'seller':
            self.callback_seller(call)
        elif call.data == 'worker':
            self.callback_worker(call)
        elif call.data == 'notify':
            self.callback_notify()
        elif call.data == 'add_imgs':
            self.callback_add_imgs(call)
    
    def callback_menu(self, msg: Message) -> None:
        self.fsm.set(msg.chat.id, {
            'state': "waitSelected"
        })
        
        self.bot.send_message(msg.chat.id, "Выберите действие:", reply_markup=self.markup.menu())
    
    
    def callback_reduce(self, call: CallbackQuery) -> None:
        self.change_product_count_call(call, -1, self.material)
        
        
    def callback_increase(self, call: CallbackQuery) -> None:
        self.change_product_count_call(call, 1, self.material)
    

    def callback_gold(self, call: CallbackQuery) -> None:
        if self.material != "gold":
            self.material = "gold"
            self.change_product_count_call(call, 0, self.material)
        else:
            return
    

    def callback_silver(self, call: CallbackQuery) -> None:
        if self.material != "silver":
            self.material = "silver"
            self.change_product_count_call(call, 0, self.material)
        else:
            return
    

    def callback_form_gold(self, call: CallbackQuery) -> None:
        if self.material != "form_gold":
            self.material = "form_gold"
            self.change_product_count_call(call, 0, self.material)
        else:
            return
        
        
    def callback_form_silver(self, call: CallbackQuery) -> None:
        if self.material != "form_silver":
            self.material = "form_silver"
            self.change_product_count_call(call, 0, self.material)
        else:
            return
        
    def callback_user_num_for_update(self, call: CallbackQuery) -> None:
        product_id = self.fsm.get(call.message.chat.id)['product_id']
        self.fsm.set(call.message.chat.id, {
            "state": 'waitCount',
            "product_id": product_id
        })
        
        self.bot.send_message(call.message.chat.id, "Введите число браслетов: ")
    
    def callback_catalog(self, call: CallbackQuery) -> None:
        with self.app.app_context():
            products = self.ps.get_all()
            
            
        result = ''
        count = 1
        
        for i in products:
            result += f"{count}. {i.name} {i.gold}/{i.silver}\n"
            count += 1
        
        self.bot.send_message(
            text=result,
            chat_id=call.message.chat.id,
        )
        self.bot.send_message(
            chat_id=call.message.chat.id,
            text="Введите номер браслета: "
        )
        self.fsm.set(call.message.chat.id, {
            "state": "waitProduct_show"
        })
    
    
    
    def callback_role(self, call: CallbackQuery) -> None:
        self.bot.edit_message_text(
            text=f"Выберите роль: ",
            chat_id=call.message.chat.id,
            message_id=call.message.message_id,
            reply_markup=self.markup.role()
        )
    
    
    def callback_seller(self, call: CallbackQuery) -> None:
        with self.app.app_context():
            user = UserService.change_user_role("seller", call.message)
        
            self.bot.edit_message_text(
                text=f"Ваша роль - {user.role}!",
                chat_id=call.message.chat.id,
                message_id=call.message.message_id,
                reply_markup=self.markup.menu()
            )
        
    
    def callback_worker(self, call: CallbackQuery) -> None:
        with self.app.app_context():
            user = UserService.change_user_role("worker", call.message)
        
            self.bot.edit_message_text(
                text=f"Ваша роль - {user.role}!",
                chat_id=call.message.chat.id,
                message_id=call.message.message_id,
                reply_markup=self.markup.menu()
            )
            
    
    def callback_notify(self) -> None:
        NotificationService.notify_workers(self.bot, self.app)
        
    
    def callback_add_imgs(self, call: CallbackQuery) -> None:
        self.callback_catalog(call)
        self.fsm.set(call.message.chat.id, {
            'state': 'waitProduct_imgs'
        })
    
    
    def change_product_count_call(self, call: CallbackQuery, count: int, material: str) -> None:
        product_id = self.fsm.get(call.message.chat.id)['product_id']

        result = self.ps._change_product_count_core(product_id, material, count, self.markup, self.app)

        self.bot.edit_message_text(
            chat_id=call.message.chat.id,
            message_id=call.message.message_id,
            text=result['text'],
            reply_markup=result['markup']
        )
    
    # MSG_TEXTS
    def check_text_msg(self, msg: Message) -> None:
        # if msg.text == "Show":
        #     with self.app.app_context():
        #         products = Product.query.order_by(Product.name.asc()).all()
        #         for p in products:
        #             print(p)
            
        
        state = self.fsm.get(msg.chat.id)
        
        if state and state['state'] == 'waitProduct_show':
            self.text_show_product(msg)
        elif state and state['state'] == 'waitCount':
            self.change_product_count_msg(msg, int(msg.text), self.material)
        elif state and state['state'] == 'waitProduct_imgs':
            self.add_imgs(msg)
        else:
            self.bot.send_message(chat_id=msg.chat.id, text="Некорректный ввод!")
    
    
    def text_show_product(self, msg: Message) -> None:
        with self.app.app_context():
            product = self.ps.get_by_id(msg.text)
        if product:
            markup = self.markup.change_count_product()
            
            self.fsm.set(msg.chat.id, {
                "state": 'waitProduct_show',
                "product_id": product.id
            })

            
            self.bot.send_message(chat_id=msg.chat.id, text=f"{product.id}. G{product.G} {product.name} \nЗолото: {product.gold}/{product.form_gold}\nСеребро: {product.silver}/{product.form_silver}\n{product.price}₸ {self.material.upper()}", reply_markup=markup)
        else:
            self.bot.send_message(chat_id=msg.chat.id, text="Некорректный ввод!") 
            
    
    def change_product_count_msg(self, msg: Message, count: int, material: str) -> None:
        product_id = self.fsm.get(msg.chat.id)['product_id']

        result = self.ps._change_product_count_core(product_id, material, count, self.markup, self.app)

        self.bot.send_message(
            chat_id=msg.chat.id,
            text=result['text'],
            reply_markup=result['markup'])

        self.fsm.set(msg.chat.id, {
            "state": "waitProduct_show",
            "product_id": product_id
        })
    
    
    def add_imgs(self, msg: Message) -> None:
        with self.app.app_context():
            product = self.ps.get_by_id(msg.text)
        self.fsm.set(msg.chat.id, {
            "state": 'waitProduct_imgs',
            "product_id": product.id,
            'imgs': []
        })
        
        self.bot.send_message(msg.chat.id, "Отправьте 4 фото")
        
    # MSG_IMGS
    
    def load_imgs(self, msg: Message) -> None:
        photo = msg.photo[-1]
        file_id = photo.file_id
        
        
        if self.fsm.get(msg.chat.id)['state'] != 'waitProduct_imgs':
            self.bot.send_message(
                msg.chat.id,
                f"Фото не ожидается!"
            )
            return
        product_id = self.fsm.get(msg.chat.id)['product_id']
        
        self.bot.send_message(
            msg.chat.id,
            f"Фото получено ✅\nfile_id: {file_id}"
        )
        
        imgs = self.fsm.get(msg.chat.id)['imgs']
        
        imgs.append(file_id)
        
        if len(imgs) == 4:
            self.fsm.set(msg.chat.id, {
                'state': 'waitSelected',
                'product_id': product_id,
                'imgs': imgs
            })
            
            self.add_imgs_to_product(msg=msg)
            
        elif len(imgs) < 4:
            self.fsm.set(msg.chat.id, {
                'state': 'waitProduct_imgs',
                'product_id': product_id,
                'imgs': imgs
            })
        else:
            self.fsm.set(msg.chat.id, {
                'state': 'waitSelected',
            })
            self.bot.send_message(
                msg.chat.id,
                f"Лишнее фото!"
            )

    
    def add_imgs_to_product(self, msg: Message) -> None:
        
        with self.app.app_context():
            product_id = self.fsm.get(msg.chat.id)['product_id']
            product = self.ps.get_by_id(product_id)
            name = slugify(product.slug)
            
            BASE_DIR = Path(__file__).resolve().parents[2]
            PRODUCT_IMG_DIR = BASE_DIR / "web" / "static" / "image" / "productImgs" / name
        
            self.bot.send_message(msg.chat.id, PRODUCT_IMG_DIR)
            try:
                PRODUCT_IMG_DIR.mkdir(parents=True, exist_ok=True)

                for i, file_id in enumerate(self.fsm.get(msg.chat.id)['imgs'], start=1):
                    file_info = self.bot.get_file(file_id)
                    downloaded = self.bot.download_file(file_info.file_path)

                    with open(PRODUCT_IMG_DIR / f"img{i}.webp", "wb") as f:
                        f.write(downloaded)

                self.bot.send_message(msg.chat.id, f"Фотографии успешно добавлены!", reply_markup=self.markup.menu())

            except Exception as e:
                self.bot.send_message(msg.chat.id, f"Фотографии не добавлены( {e}")