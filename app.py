from flask import Flask, request, jsonify
from flask_cors import CORS
from usuarios import usuarios
from asientos import obtener_asientos_ocupados, reservar_asiento
from funciones import obtener_funcion, listar_funciones

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Test endpoint is working"}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    nombre_usuario = data.get('nombreUsuario')
    contrasenia = data.get('contrasenia')

    for usuario in usuarios:
        if usuario['nombreUsuario'] == nombre_usuario and usuario['contrasenia'] == contrasenia:
            return jsonify({"message": "Inicio de sesión exitoso"}), 200

    return jsonify({"error": "Los datos ingresados son incorrectos"}), 401

@app.route('/funciones/<int:funcion_id>', methods=['GET'])
def get_funcion(funcion_id):
    funcion = obtener_funcion(funcion_id)
    if funcion:
        asientos_ocupados = obtener_asientos_ocupados(funcion_id)
        return jsonify({"funcion": funcion, "asientosOcupados": asientos_ocupados}), 200
    return jsonify({"error": "Función no encontrada"}), 404

@app.route('/reservar', methods=['POST'])
def reservar():
    data = request.get_json()
    funcion_id = data.get('funcion_id')
    asiento_id = data.get('asiento_id')

    if funcion_id is None or asiento_id is None:
        return jsonify({"error": "ID de función y asiento son requeridos"}), 400

    # Asegúrate de que funcion_id sea un entero
    try:
        funcion_id = int(funcion_id)
        asiento_id = int(asiento_id)
    except ValueError:
        return jsonify({"error": "Los IDs deben ser números enteros"}), 400

    resultado = reservar_asiento(funcion_id, asiento_id)

    if "error" in resultado:
        return jsonify(resultado), 400
    return jsonify(resultado[0]), resultado[1]  # Desempaquetamos el mensaje y el código de estado


@app.route('/funciones', methods=['GET'])
def listar_todas_las_funciones():
    return jsonify(listar_funciones())

if __name__ == '__main__':
    app.run(debug=True, port=3000)
