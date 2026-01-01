from logging.handlers import RotatingFileHandler
from flask import Flask
import logging
import os

class StatusCodeFilter(logging.Filter):
    """Фильтр для исключения 200 и 304 статусов"""
    def filter(self, record: logging.LogRecord) -> bool:
        message = record.getMessage()
        return not (' 200 ' in message or ' 304 ' in message)

def setup_logging(app: Flask) -> None:
    """Настройка логирования:
    - В терминал: все кроме 200/304
    - В файл: WARNING и выше (без INFO)
    """
    
    # Создаем папку для логов
    log_dir = "logs"
    os.makedirs(log_dir, exist_ok=True)

    # Общий формат логов
    log_format = "[%(asctime)s] %(levelname)s: %(message)s [in %(module)s]"

    # --- 1. Настройка записи в ФАЙЛ (WARNING и выше) ---
    file_handler_errors = RotatingFileHandler(
        filename=os.path.join(log_dir, "errors.log"),
        maxBytes=10 * 1024 * 1024,  # 10 MB
        backupCount=5,
        encoding="utf-8"
    )
    file_handler_errors.setLevel(logging.WARNING)  # Только WARNING и выше
    file_handler_errors.setFormatter(logging.Formatter(log_format))

    # --- 1.5. Настройка записи в ФАЙЛ (INFO и выше) ---


    file_handler_app = RotatingFileHandler(
        filename=os.path.join(log_dir, "app.log"),
        maxBytes=10*1024*1024,
        backupCount=5,
        encoding="utf-8"
    )
    file_handler_app.setLevel(logging.INFO)
    file_handler_app.setFormatter(logging.Formatter(log_format))

    # --- 2. Настройка вывода в ТЕРМИНАЛ (INFO и выше, но без 200/304) ---
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(logging.Formatter(log_format))
    console_handler.addFilter(StatusCodeFilter())  # Применяем фильтр

    # --- Настройка логгеров ---
    
    # Удаляем стандартные обработчики
    app.logger.handlers.clear()
    
    # Добавляем наши обработчики
    app.logger.addHandler(file_handler_errors)
    app.logger.addHandler(file_handler_app)
    app.logger.addHandler(console_handler)
    app.logger.setLevel(logging.INFO)  # Минимальный уровень

    # Настройка Werkzeug для вывода в терминал (с фильтром)
    werkzeug_logger = logging.getLogger('werkzeug')
    werkzeug_logger.handlers.clear()
    werkzeug_logger.addHandler(console_handler)
    werkzeug_logger.setLevel(logging.INFO)