from .fsm_storage import FSMStorage
from typing import Any

class InMemoryFSMStorage(FSMStorage):
    def __init__(self):
        self._data = {}
    
    def get(self, chat_id) -> dict[str, Any] | None:
        return self._data.get(chat_id)
    
    def set(self, chat_id, data: dict) -> None:
        self._data[chat_id] = data
    
    def clear(self, chat_id) -> None:
        self._data.pip(chat_id, None)