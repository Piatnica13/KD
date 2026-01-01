from flask import request, Blueprint, Response
from telebot import types
from dotenv import load_dotenv
from app.__init__ import csrf
import app.bot.bot.bot as bot
import os


load_dotenv(".password.env")


bp_bot = Blueprint("bot", __name__, url_prefix="/api")


@bp_bot.route('/webhook', methods=['POST'])
@csrf.exempt
def webhook() -> Response:
    json_str = request.get_data().decode('utf-8')
    update = types.Update.de_json(json_str)
    bot.bot.process_new_updates([update])
        
    return "OK", 200


@bp_bot.route('/setwebhook')
@csrf.exempt
def set_webhook() -> Response:
    bot.bot.remove_webhook()
    bot.bot.set_webhook(os.getenv("WEBHOOK_URL"))
    return "Webhook set", 200