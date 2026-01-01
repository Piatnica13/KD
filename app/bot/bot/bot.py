from telebot import TeleBot
from dotenv import load_dotenv
from flask import Flask
from ..services.bot import BotService
from ..services.user import UserService
from ..services.product import ProductService
from ..services.markup import MarkupService
from ..services.fsm.in_memory_fsm import InMemoryFSMStorage
import os


load_dotenv(".password.env")
TOKEN = os.getenv("BOT_TOKEN")

bot = TeleBot(TOKEN)

product_service = ProductService()

fsm = InMemoryFSMStorage()

markup = MarkupService()

print(bot.get_webhook_info())

def start_bot(app: Flask) -> None:
    bot_service = BotService(bot=bot, app=app, fsm=fsm, ps=product_service, markup=markup)

    @bot.message_handler(commands=['start'])
    def start(msg) -> None:
        print('start')
        try:
            with app.app_context():
                UserService.reg(msg)
                print(532)
            bot_service.callback_menu(msg)
        except Exception as e:
            bot.send_message(chat_id=msg.chat.id, text=f"Ошибка start: {e}")


    @bot.callback_query_handler(func=lambda call: True)
    def callbacks(call) -> None:
        try:
            bot_service.chek_callbacks(call)
        except Exception as e:
            bot.send_message(chat_id=call.message.chat.id, text=f"Ошибка callback: {e}")


    @bot.message_handler(content_types=['text'])
    def send_user_text(msg) -> None:
        try:
            bot_service.check_text_msg(msg)
        except Exception as e:
            bot.send_message(chat_id=msg.chat.id, text=f"Ошибка text: {e}")


    @bot.message_handler(content_types=['photo'])
    def send_user_image(msg) -> None:
        try:
            bot_service.load_imgs(msg)
        except Exception as e:
            bot.send_message(chat_id=msg.chat.id, text=f"Ошибка photo: {e}")