function generateTree() {
    const operation = document.getElementById('operation').value;
    const treeContainer = document.getElementById('graph-container');
    treeContainer.innerHTML = '';

    if (!validateExpression(operation)) {
        alert('Expresión inválida. Asegúrate de que no contenga números negativos y que sea una expresión matemática válida.');
        return;
    }

    const rootNode = parseOperation(operation);
    const nodes = [];
    const edges = [];
    buildGraph(rootNode, nodes, edges, 300, 50, 150);

    nodes.forEach(node => drawNode(node));
    edges.forEach(edge => {
        const fromNode = nodes.find(node => node.id === edge.from);
        const toNode = nodes.find(node => node.id === edge.to);
        drawLine(fromNode, toNode);
    });

    // Mostrar los recorridos en el contenedor de resultados
    document.getElementById('preorder-result').innerText = preorder(rootNode);
    document.getElementById('inorder-result').innerText = inorder(rootNode);
    document.getElementById('postorder-result').innerText = postorder(rootNode);
}

// Validación de expresión: permite letras y números, sin números negativos
function validateExpression(expression) {
    const invalidChars = /[^a-zA-Z0-9+\-*/() ]/.test(expression); // Solo letras, números y operadores
    const hasNegativeNumbers = /-\d/.test(expression); // No permite números negativos
    return !invalidChars && !hasNegativeNumbers;
}

// Parsear la operación y generar el árbol de expresiones
function parseOperation(operation) {
    // Permitir letras además de números y operadores
    const tokens = operation.match(/([a-zA-Z]+|\d+|\+|\-|\*|\/|\(|\))/g); 
    const outputQueue = [];
    const operatorStack = [];

    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    };

    tokens.forEach(token => {
        if (/^[a-zA-Z]|\d+$/.test(token)) { // Acepta letras (variables) o números
            outputQueue.push({ value: token });
        } else if (/\+|\-|\*|\//.test(token)) {
            while (operatorStack.length && precedence[operatorStack[operatorStack.length - 1].value] >= precedence[token]) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push({ value: token });
        } else if (token === '(') {
            operatorStack.push({ value: token });
        } else if (token === ')') {
            while (operatorStack.length && operatorStack[operatorStack.length - 1].value !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop();
        }
    });

    while (operatorStack.length) {
        outputQueue.push(operatorStack.pop());
    }

    const stack = [];
    outputQueue.forEach(token => {
        if (/^[a-zA-Z]|\d+$/.test(token.value)) { // Acepta letras o números
            stack.push(token);
        } else {
            const right = stack.pop();
            const left = stack.pop();
            stack.push({ value: token.value, left: left, right: right });
        }
    });

    return stack[0];
}

// Función para construir el grafo
function buildGraph(node, nodes, edges, x, y, offset) {
    if (!node) return;

    const nodeId = nodes.length + 1;
    nodes.push({ id: nodeId, label: node.value, x: x, y: y });

    if (node.left) {
        const leftId = nodes.length + 1;
        edges.push({ from: nodeId, to: leftId });
        buildGraph(node.left, nodes, edges, x - offset, y + 150, offset / 2);
    }

    if (node.right) {
        const rightId = nodes.length + 1;
        edges.push({ from: nodeId, to: rightId });
        buildGraph(node.right, nodes, edges, x + offset, y + 150, offset / 2);
    }
}

// Función para dibujar nodos
function drawNode(node) {
    const nodeElement = document.createElement('div');
    nodeElement.classList.add('node');
    nodeElement.style.left = `${node.x}px`;
    nodeElement.style.top = `${node.y}px`;
    nodeElement.innerHTML = node.label;
    document.getElementById('graph-container').appendChild(nodeElement);
    return nodeElement;
}

// Función para dibujar líneas
function drawLine(fromNode, toNode) {
    const line = document.createElement('div');
    line.classList.add('line');
    
    const deltaX = toNode.x - fromNode.x;
    const deltaY = toNode.y - fromNode.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    line.style.width = `${distance}px`;
    line.style.height = '1px';
    line.style.left = `${fromNode.x + 25}px`; 
    line.style.top = `${fromNode.y + 25}px`;  
    line.style.transform = `rotate(${Math.atan2(deltaY, deltaX)}rad)`;
    line.style.backgroundColor = '#4CAF50'; 

    document.getElementById('graph-container').appendChild(line);
}

// Funciones para recorridos en el árbol
function preorder(node) {
    if (!node) return '';
    return node.value + ' ' + preorder(node.left) + preorder(node.right);
}

function inorder(node) {
    if (!node) return '';
    return inorder(node.left) + node.value + ' ' + inorder(node.right);
}

function postorder(node) {
    if (!node) return '';
    return postorder(node.left) + postorder(node.right) + node.value + ' ';
}
