from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, IntegerField, RadioField
from wtforms.validators import DataRequired, Email

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Sign In')

class RegisterForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Sign Up')

class ProfilSplitForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    last_name = StringField('LastName', validators=[DataRequired()])
    phone = IntegerField('Phone', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('Save')

class ProfilMainPassForm(FlaskForm):
    new_pass = PasswordField('NewPassword', validators=[DataRequired()])
    re_new_pass = PasswordField('ReNewPass', validators=[DataRequired()])
    submit = SubmitField('Save')

class ProfilAddSplit(FlaskForm):
    name = StringField('Name')
    city = StringField('City', validators=[DataRequired()])
    street = StringField('Street', validators=[DataRequired()])
    home = StringField('Home', validators=[DataRequired()])
    flat = StringField('Flat')
    submit = SubmitField('Add')
    
class ProfilAddressForm(FlaskForm):
    radio = RadioField('Radio', validators=[DataRequired()])