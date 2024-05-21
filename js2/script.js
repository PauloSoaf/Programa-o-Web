let ganhador = 'jogador'
const regras = {
    1: 3,
    2: 1,
    3: 2
};
const opcoes = [
    'invalido',
    'Papel',
    'Pedra',
    'Tesoura',
]
let contador = 0
while (ganhador === 'jogador'){
    console.log('Escolha sua jogada:')
    console.log('1- Papel')
    console.log('2- Pedra')
    console.log('3- Tesoura')
    let jogador = parseInt(prompt('Escolha seu jogador, 1- papel, 2- Pedra, 3- tesoura'))
    console.log('Você jogou ' + opcoes[parseInt(jogador)])
    let computador = Math.floor(Math.random() * (3 -1) + 1)
    console.log('O computador jogou ' + opcoes[parseInt(computador)])
    if (jogador === computador) {
        console.log('Empate');
    } else if (regras[jogador - 1] == computador) {
        console.log('jogador vence');
        ganhador = 'jogador'
        contador++
    } else {
        console.log('computador vence');
        ganhador = 'computador'
    }
}
console.log("Game over! você ganhou " + contador + " veze(s)")