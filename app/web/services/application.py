class AppService:
    @staticmethod
    def show_error(error):
        code = getattr(error, 'code', 500)
        
        custom_msg = {
            400: "Похоже, вы отправили неправильные данные.",
            401: "Доступ доступен только после входа.",
            403: "У вас нет прав на просмотр этой страницы.",
            404: "Упс! Мы не смогли найти такую страницу.",
            405: "Этот метод не поддерживается для данного ресурса."
        }
        
        message = custom_msg.get(code, str(error))
        return {"code": code, "title": message}