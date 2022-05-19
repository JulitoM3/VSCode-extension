'use strict';


import * as vscode from 'vscode'; //Importamos todas las funcionalidades y referencias de 'vscode' y se le asigna el alias de vscode

export function activate(context: vscode.ExtensionContext) { //Utilizamos la palabra export para indicar que la funcion activate se exportará del módulo
	/**
	 * 
	 * se declara la variable disposable que al mismo tiempo se inicializa  con el resultado de la funcion registerCommand que recibe 
	 * el nombre el identificador unico del comando y un callback
	 */
    let disposable = vscode.commands.registerCommand('extension.gapline', () => { 
		
        var editor = vscode.window.activeTextEditor; //Se declara globalmente la variable editor
        if (!editor) { return; } // se realiza la comprobacion de que la variable editor no se encuentre vacía
        var selection = editor.selection; //Declaracion e inicializacion de la variable selection
        var text = editor.document.getText(selection); //Declaracion e inicializacion de la variable text
		/**
		 * se usa el metodo showInputBox para preguntar al usuario una entrada por consola; aqui ocurre que el metodo .then() retorna una promesa
		 */
        vscode.window.showInputBox({ prompt: 'Lineas?' }).then(value => { 
            let numberOfLines = +value; //Declaramos e inicializamos la variable numberOfLines que a su vez actua como acumulador
			/**
			 * Declaramos e inicializamos globalmente la variable textInChuncks que actua como un arreglo de strings por el momento vacio
			 */
            var textInChunks: Array<string> = []; 
			/**
			 * la variable text al contener una seleccion del usuario y contener un string se utiliza el metodo split para "romper" el string 
			 * dado el separador que recibe como argumento a su vez iteramos esos substrings con el metodo forEach que contiene el indice y el elemento 
			 * en este caso la linea que se itera
			 */
            text.split('\n').forEach((currentLine: string, lineIndex) => {
                textInChunks.push(currentLine); //Se ingresa un elemento al arreglo antes declarado globalmente 
				/**
				 * Hacemos una comprobacion del siguiente indice si el modulo es estrictamente igual a 0
				 */
                if ((lineIndex+1) % numberOfLines === 0) textInChunks.push(''); 
            }); //finaliza nuestro ciclo
			/**
			 * A la variable text se iguala con el resultado del arreglo textInChunks que a su vez ejecuta el metodo .join()
			 * para unir sus elementos dado un separador
			 */
            text = textInChunks.join('\n');
			/**
			 * La variable editor en su metodo edit recibe un callback 
			 * en donde se declara globalmente la variable range que a su vez se inicializa un Range 
			 */
			editor.edit((editBuilder) => {
                var range = new vscode.Range(
                    selection.start.line, 
					0, 
                    selection.end.line,
                    editor.document.lineAt(selection.end.line).text.length
                );
				/**
				 * El metodo replace se ejecuta en el editBuilder para reemplazar una parte del texto con otra nueva
				 */
                editBuilder.replace(range, text);
            });
        }); // Termina el metodo then 
    }); //Finaliza el metodo activate;
    context.subscriptions.push(disposable);
}

export function deactivate() {}
