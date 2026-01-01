from typing import Any

class FSMStorage:
    def get(self, chat_id) -> dict[str, Any] | None:
        raise NotImplementedError
    
    def set(self, chat_id, data: dict) -> None:
        raise NotImplementedError
    
    def clear(self, chat_id) -> None:
        raise NotImplementedError