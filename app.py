# app.py
from flask import Flask, request, jsonify
from usuarios import usuarios

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Obtener el nombre de usuario y la contraseña del cuerpo de la solicitud
    nombre_usuario = data.get('nombreUsuario')
    contrasenia = data.get('contrasenia')

    # Verificar si el usuario existe y si la contraseña es correcta
    for usuario in usuarios:
        if usuario['nombreUsuario'] == nombre_usuario and usuario['contrasenia'] == contrasenia:
            return jsonify({"message": "Inicio de sesión exitoso"}), 200

    # Si no se encuentra el usuario o la contraseña es incorrecta
    return jsonify({"message": "Los datos ingresados son incorrectos"}), 401

if __name__ == '__main__':
    app.run(debug=True)
