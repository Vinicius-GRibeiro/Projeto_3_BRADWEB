document.addEventListener('DOMContentLoaded', () => { // executa o script apenas quando o html terminar de carregar (DOMContentLoaded)
    const assentos = document.querySelectorAll('.assento:not(.reservado)'); // seleciona todos os elementos que possuem a classe assento, mas não a classe reservado; ou seja, todos os assentos disponíveis
    const formularioReserva = document.getElementById('formulario-reserva'); // cria uma referência ao formulário de reserva
    const assentosReservados = JSON.parse(localStorage.getItem('assentosReservados')) || []; // obtém a lista dos assentos reservados armazenados no localStorage; SE NÃO houver, inicializa um array vazio
    let valorTotal = 0.0
    let assentosSelecionados = []; // array para armazenar os assentos selecionados

    // Função para atualizar as informações já presentes no localStorage
    function atualizarAssentosDoArmazenamento() {
        assentosReservados.forEach(numeroAssento => {
            const assento = document.querySelector(`.assento[data-numero-assento="${numeroAssento}"]`);
            console.log('const assento', assento);
            console.log('Atualizando assento ', numeroAssento);

            if (assento) {
                assento.classList.add("reservado");
                assento.classList.remove('selecionado');
            }else{
                console.log('Assento não encontrado, ', numeroAssento);
            }
        });
    }

    atualizarAssentosDoArmazenamento();

    // Função para selecionar/desselecionar assentos
    assentos.forEach(assento => { // percorre todos os elementos de assento da "const assentos" carregada anteriormente
        assento.addEventListener('click', () => { // adiciona um evento de click a cada assento, com as condições abaixo
            // se o assento tem a classe "selecionado", essa classe é removida, e o assento respectivo é removido da array assentosSelecionados
            // caso contrário (se o assento não tem a classe "selecionado"), a classe é adicionada a ele, e o número do assento é adicionado no array assentosSelecionados
            if (assento.classList.contains('reservado')) {
                return;
            }
            else if (assento.classList.contains('selecionado')) {
                assento.classList.remove('selecionado');
                assentosSelecionados = assentosSelecionados.filter(s => s !== assento.dataset.numeroAssento);
                valorTotal -= 34.15
            } else {
                if (assentosSelecionados.length === 4) {
                    alert('Selecione até 4 poltronas por trecho. Caso deseje selecionar mais poltronas, finalize sua compra e inicie uma nova. ');
                    return;
                }
                assento.classList.add('selecionado');
                assentosSelecionados.push(assento.dataset.numeroAssento);
                valorTotal += 34.15
            }
        });
    });

    // Enviar o formulário de reserva
    formularioReserva.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const nome = document.getElementById('nome').value; // coleta os valores inseridos em 'nome'
        const email = document.getElementById('email').value;

        //se nenhum assento foi selecionado
        if (assentosSelecionados.length === 0) {
            alert('Por favor, selecione pelo menos um assento.');
            return;
        }

        const detalhesReserva = {
            nome,
            email,
            assentos: assentosSelecionados
        };

        console.log('Reserva Confirmada:', detalhesReserva);
        valorTotal = (valorTotal).toFixed(2);
        alert(`Reserva Confirmada!\n\nNome: ${nome}\nEmail: ${email}\nAssentos: ${assentosSelecionados.join(', ')}\nValor final: R\$ ${valorTotal}`);
        
        // Adicionar os assentos selecionados aos reservados no localStorage
        assentosSelecionados.forEach(numeroAssento => {
            if (!assentosReservados.includes(numeroAssento)) {
                assentosReservados.push(numeroAssento);
            }
        });

        localStorage.setItem("assentosReservados", JSON.stringify(assentosReservados));

        console.log('assentosReservados', assentosReservados);

        // Resetar formulário e seleção de assentos
        formularioReserva.reset();
        assentos.forEach(assento => assento.classList.remove('selecionado'));
        assentosSelecionados = [];
        valorTotal = 0.0;
        atualizarAssentosDoArmazenamento();
    });
});
