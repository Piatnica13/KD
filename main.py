from app.__init__ import create_app, create_oauth

app = create_app()
oauth = create_oauth(app=app)
    
if __name__ == '__main__':
    app.run(port=5000)