// Menu do jogo
class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    preload() {
        this.load.image('startButton', 'assets/start.png');
        this.load.image('backgroundMenu', 'assets/background_menu.png');
    }

    create() {
        this.add.image(400, 300, 'backgroundMenu');
        this.add.text(250, 100, "Jogo do Labirinto", { fontSize: "48px", fill: "#fff" });
        let startButton = this.add.image(400, 400, 'startButton').setInteractive();
        // Se o botão for pressionado, a primeira cena do jogo será carregada
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

// Tela da primeira fase
class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.score = 0;         // Valor do placar
        this.hasKey = false;    // Booleano que vai ser usado para verificar se o jogador tem a chave
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('key', 'assets/key.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('door', 'assets/door.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.image('tiles', 'assets/tileset.png');
        this.load.image('backgroundGame', 'assets/background_game.png');
    }

    create() {
        // Adicionar o fundo do jogo
        this.add.image(400, 300, 'backgroundGame');
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("tileset", "tiles");
        map.createLayer("Ground", tileset, 0, 0);
        
        // Adicionar o jogador
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        
        // Spawn a chave no jogo, criar a porta e adicionar colisão entre ela e o jogador
        this.spawnKey();
        this.door = this.physics.add.sprite(500, 200, 'door');
        this.physics.add.overlap(this.player, this.door, this.enterDoor, null, this);
        
        // Criar o inimigo e definir seu comportamento
        this.enemy = this.physics.add.sprite(400, 200, 'enemy');
        this.enemy.setVelocity(100, 100);
        this.enemy.setBounce(1, 1);
        this.enemy.setCollideWorldBounds(true);

        // Texto do placar
        this.scoreText = this.add.text(16, 16, 'Placar: 0', { fontSize: '32px', fill: '#fff' });

        // Colisões do jogador
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.physics.add.overlap(this.player, this.enemy, () => {
            this.scene.start('GameOverScene');
        });

        // Criar os controles
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Controle do personagem
    update() {
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
        }
    }

    // Spawn uma chave
    spawnKey() {
        if (this.keyItem) {
            this.keyItem.destroy();
        }
        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(50, 550);
        this.keyItem = this.physics.add.sprite(x, y, 'key');
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.hasKey = false;
    }

    // Coletar uma chave
    collectKey(player, key) {
        this.score += 10;
        this.scoreText.setText('Placar: ' + this.score);
        key.destroy();
        this.hasKey = true;
    }

    // Entrar na porta
    enterDoor(player, door) {
        if (this.hasKey) {
            this.scene.start('GameScene2');
        }
    }
}

// Criando a var player e a var score fora da classe para que ela possa ser chamada em qualquer ponto do código
var player;
var scoreD = 10;
var coinsCollected = 0;  // Conta as moedas coletadas
var evilplatform1;

// Cena da segunda fase do jogo, desenvolvida por mim
class GameScene2 extends Phaser.Scene {
    constructor() {
        super({key: 'GameScene2'}); // Essa key será usada no documento configJogo.js
    }

    preload() {
        // Adicionando as partes do cenários do jogo
        this.load.image('floor', 'assets/stage_floor.png');
        this.load.image('walls', 'assets/wall.png');
        this.load.image('gameBG', 'assets/game_bg.png');
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('coin', 'assets/coin.png');
        
        // Imagem do objetos do jogo: target e plataformas
        this.load.image('evil', 'assets/evil_platform1.png');
        this.load.image('plat', 'assets/platform.png');

        // Carregando as spritesheets do personagem, um objeto associado ao personagem e o inimigo
        this.load.spritesheet('duck', 'assets/ducc_sprites.png', {frameWidth: 90, frameHeight: 100});

    }

    create() {
        // Criando o fundo do jogo, o chão e as paredes e os classificando como grupo estático (que não se mexe)
        const fundo = this.add.image(400, 300, 'gameBG');
        fundo.setDepth(1);
        
        const ground = this.physics.add.staticGroup();
        ground.create(400, 600, 'floor');
        ground.setDepth(2);

        const walls = this.physics.add.staticGroup();
        walls.create(50, 300, 'walls');
        walls.create(750, 300, 'walls');
        walls.setDepth(3);

        // ----------------------------------------------------------------------------------------------------------------------------------------
        
        // Criando 5 canos diferentes uando um loop for
        for (let i = 0; i < 5; i++) {
            this.add.image(150 + i * 125, 50, 'pipe').setDepth(8);
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------


        // Criando 2 plataformas diferentes
        evilplatform1 = this.physics.add.image(600, 450, 'evil');
        evilplatform1.setDepth(5);
        evilplatform1.setImmovable(true);
        evilplatform1.body.setSize(evilplatform1.width, evilplatform1.height); // Dimensões do hitbox da platform1
        evilplatform1.body.setAllowGravity(false);                             // Permite que a plataforma não seja afetada pela gravidade. Impede que a plataforma cai assim que o jogo começar
        

        const platform = this.physics.add.image(200, 390, 'plat');
        platform.setDepth(5);
        platform.setImmovable(true);                              // Immovable quer dizer que a plataforma não será afetada pela física do jogo. Ex: ela não é movida por colisões (colisão entre plataforma e jogador é um exemplo)
        platform.body.setSize(platform.width, platform.height);   // Dimensões do hitbox da platform1
        platform.body.setAllowGravity(false);                     // Permite que a plataforma não seja afetada pela gravidade. Impede que a plataforma cai assim que o jogo começar

        // Animando as plataformas para mover de um lado para o outro
        this.tweens.add({
            targets: evilplatform1,      // O objeto que vai ser animado, platform1
            x: 200,                      // A posição final da plataforma no eixo x (vai de 600 para 200)
            duration: 9000,              // Duração da animação (9 segundos)
            ease: 'Linear',              // Movimento constante
            repeat: -1,                  // Repetir infinitamente
            yoyo: true                   // Depois que a plataforma chega na posição final (200), ela volta para sua posição inicial (600)
        });

        this.tweens.add({
            targets: platform,           // O objeto que vai ser animado, platform1
            x: 600,                      // A posição final da plataforma no eixo x (vai de 200 para 600)
            duration: 9000,              // Duração da animação (9 segundos)
            ease: 'Linear',              // Movimento constante
            repeat: -1,                  // Repetir infinitamente
            yoyo: true                   // Depois que a plataforma chega na posição final (600), ela volta para sua posição inicial (200)
        });
        
        // ----------------------------------------------------------------------------------------------------------------------------------------

        // Criação do pato
        player = this.physics.add.sprite(400, 450, 'duck');
        player.setDepth(7);
        player.setScale(0.7, 0.7);
        player.body.setSize(80, 80);                  // Mudando o tamanho do hitbox do pato
        player.body.setOffset(5, -5);                 // Mudando a posição do hitbox do pato
        player.setGravityY(300);
        // Colisões do pato
        this.physics.add.collider(player, ground);
        this.physics.add.collider(player, evilplatform1, this.platTouch, null, this);
        this.physics.add.collider(player, platform);
        this.physics.add.collider(player, walls);

        // Criação das animações do pato
        this.anims.create({
            key: 'idle',
            frames: [ { key: 'duck', frame: 0 } ],
            repeat: -1
        })
        
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('duck', { start: 1, end: 4 }), // Pegar as frames específicas
            frameRate: 10,  // Frames por segundo
            repeat: -1      // Repetir infinitamente
        });

        this.anims.create({
            key: 'jump',
            frames: [ { key: 'duck', frame: 5 } ],
            repeat: -1
        });

        this.anims.create({
            key: 'fall',
            frames: [ { key: 'duck', frame: 6 } ],
            repeat: -1
        });

        this.anims.create({
            key: 'hurt',
            frames: [ { key: 'duck', frame: 7 } ],
            repeat: 0
        })
    
        // ----------------------------------------------------------------------------------------------------------------------------------------

        // Criando as moedas que serão colecionadas
        this.coins = this.physics.add.group({
            key: 'coin',
            repeat: 4,  // Quantas moedas eu quero no jogo (serão 5 no total. O jogo vai spawn uma e depois repetir isso mais 4 vezes, trazendo o total de moedas para 5)
            setXY: { x: 150, y: 0, stepX: 125 }  // Posicionamento inicial das moedas e a distância (step) entre elas
        });
        
        this.coins.setDepth(7);

        this.coins.children.iterate(function(coin) {
            coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); // Faz as moedas quicarem
            coin.setScale(0.7);
            coin.setGravityY(300);
            coin.body.setAllowGravity(true); // Permite que as moedas não afetem o jogador
            coin.body.setImmovable(false);
        });

        // Colisões das moedas
        this.physics.add.overlap(player, this.coins, this.collectCoin, null, this);
        this.physics.add.collider(this.coins, platform);
        this.physics.add.collider(this.coins, evilplatform1);
        this.physics.add.collider(this.coins, ground);

        // ----------------------------------------------------------------------------------------------------------------------------------------

        // Criando texto de pontuação
        this.scoreText = this.add.text(275, 550, 'Pontuação: 0', {
            fontSize: '32px',
            fill: '#fff'
        });
        this.scoreText.setDepth(8);

    };

    // Função para coletar moedas
    collectCoin(player, coin) {
        coin.disableBody(true, true);  // Desativa a moeda
        coinsCollected += 1; // +1 moeda colecionada
        scoreD += 1; // Adiciona 1 ponto para o jogador
        console.log("Pontuação: " + scoreD);  // Exibe a pontuação no console
    }

    // Função de gameover quando o jogador interagir com a evilplatform1
    platTouch (player, evilplatform1)
    {
        this.physics.pause();
        scoreD = 0; // Reset da pontuação do jogo
        player.anims.play('hurt');
        this.scene.stop('GameScene2');
        this.scene.start('GameOverScene');
    }

    // Programa vai checar se o jogador tiver coletado 5 moedas. Caso sim, o jogo vai mudar para a tela de vitória.
    checkWin() {
        if (this.coins.countActive(true) === 0) {
            this.scene.stop('GameScene2');
            this.scene.start('WinScene');
        }
    }

    update() {

        // Toda hora que o programa atualizar, vai checar se o jogador ganhou ou não
        this.checkWin();
        

        // Possibilitando que o teclado seja pressionado
        this.cursors = this.input.keyboard.createCursorKeys();

        // Atualizar os pontos
        this.scoreText.setText('Pontuação: ' + scoreD);

        if (this.cursors.left.isDown) // [ <-- ]
            {                
                player.setVelocityX(-200);
    
                player.anims.play('walk', true);

                player.setScale(-0.7, 0.7);    // Inverte a sprite para a esquerda
                player.body.setOffset(85, -5); // Ajusta a posição do hitbox do player
            }
            else if (this.cursors.right.isDown) // [ --> ]
            {                
                player.setVelocityX(200);
                player.anims.play('walk', true);

                player.setScale(0.7, 0.7);     // Retorna para a direita
                player.body.setOffset(5, -5);  // Retorna a posição do hitbox ao normal
            }
            else
            {
                player.setVelocityX(0);
                player.anims.play('idle');
            }

        // Esse if checa se a tecla up está pressionada e se o jogador estiver encostado no chão
        if (player.body.touching.down)
            {
                if (this.cursors.up.isDown) {
                    player.setVelocityY(-300);       // Velocidade Y negativa = subida vertical
                    player.anims.play('jump', true); // Inicia a animação do pulo

                }
            } else {
                if (player.body.velocity.y < 0) {

                    player.anims.play('jump', true); // Velocidade Y negativa do player = player está subindo. Assim, a animação 'jump' é iniciada

                } else if (player.body.velocity.y > 0) {

                    player.anims.play('fall', true); // Velocidade Y positiva do player = player está caindo. Assim, a animação 'fall' é iniciada

                }
            }
        }
    }

// Classe da tela de gameover
class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    preload() {
        this.load.image('backgroundGameOver', 'assets/background_gameover.png');
    }

    create() {
        this.add.image(400, 300, 'backgroundGameOver');
        this.add.text(300, 100, "Game Over", { fontSize: "48px", fill: "#f00" });
        this.input.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}

// Tela de vitória
class WinScene extends Phaser.Scene {
    constructor() {
        super("WinScene");
    }

    preload() {
        this.load.image('backgroundWin', 'assets/background_win.png');
    }

    create() {
        this.add.image(400, 300, 'backgroundWin');
        this.add.text(300, 100, "Você Ganhou!", { fontSize: "48px", fill: "#0f0" });
        this.input.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}

// Configuração do jogo
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: [MenuScene, GameScene, GameScene2, GameOverScene, WinScene]
};

const game = new Phaser.Game(config);