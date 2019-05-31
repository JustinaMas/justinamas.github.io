
Šiame aplankale yra Justinos Maslovaitės bakalaurinio darbo praktinės dalies realizacija.

## Žaidimo paleidimas:
    - 1. Programos aplankale atidaryti terminalą.
    - 2. Įvesti komandą npm install -g http-server (kompiuteryje turi būti sudiegtas node.js https://nodejs.org/en/download/)
    - 3. Programos aplankale paleisti komandą: ``` http-server ```
    - 4. Žaidimas pasiekiamas adresu ``` localhost:8080/index.html ``` (arba adresu nurodytu terminalo lange, po http-server komandos paleidimo).

## Žaidimo struktūra:
    - main.js - pagrindinis žaidimo logikos valdymo failas
    - geneticAlgorithm.js - genetinio algoritmo realizacijos funckijos.
    - agent.js - žaidimo veikėjo klasė.
    - obstacle.js - kliūčių klasė.
    - lib/neuralnetwork.js - neuroninio tinklo klasė.
    - lib/matrix.js - biblioteka operacijoms su matricomis atlikti.
