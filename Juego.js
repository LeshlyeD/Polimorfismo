// Clase base para elementos del juego
class ElementoJuego {
    constructor(x, y, ancho, alto, velocidad) {
      this.x = x;
      this.y = y;
      this.ancho = ancho;
      this.alto = alto;
      this.velocidad = velocidad;
    }
  
    dibujar(ctx) {
      ctx.fillStyle = "black";
      ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    }
  
    actualizar(dt) {
      this.x -= this.velocidad * dt;
    }
  }
  
  // Clase para el pajaro protagonista
  class Pajaro extends ElementoJuego {
    constructor(x, y, ancho, alto, velocidad, salto) {
      super(x, y, ancho, alto, velocidad);
      this.salto = salto;
      this.velocidadY = 0;
    }
  
    dibujar(ctx) {
      ctx.fillStyle = "yellow";
      ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    }
  
    saltar() {
      this.velocidadY = -this.salto;
    }
  
    actualizar(dt) {
      super.actualizar(dt);
      this.velocidadY += 0.5;
      this.y += this.velocidadY;
    }
  }
  
  // Clase para los obstáculos que se mueven hacia la izquierda
  class Obstaculo extends ElementoJuego {
    constructor(x, y, ancho, alto, velocidad) {
      super(x, y, ancho, alto, velocidad);
    }
  
    dibujar(ctx) {
      ctx.fillStyle = "green";
      ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    }
  }
  
  // Clase para el suelo que se mueve hacia la izquierda
  class Suelo extends ElementoJuego {
    constructor(x, y, ancho, alto, velocidad) {
      super(x, y, ancho, alto, velocidad);
    }
  
    dibujar(ctx) {
      ctx.fillStyle = "brown";
      ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    }
  }
  
  // Clase para el juego y su logica 
  class Juego {
    constructor(canvas) {
      this.ctx = canvas.getContext("2d");
      this.pajaro = new Pajaro(50, 100, 30, 30, 100, 10);
      this.obstaculos = [
        new Obstaculo(400, 0, 30, 100, 100),
        new Obstaculo(600, 150, 30, 150, 100),
        new Obstaculo(800, 0, 30, 200, 100),
      ];
      this.suelo = new Suelo(0, 250, 400, 50, 100);
      this.ultimoTiempo = null;
      this.puntuacion = 0;
    }
  
    empezar() {
      this.ultimoTiempo = performance.now();
      this.bucleJuego();
    }
  
    dibujarFondo() {
      this.ctx.fillStyle = "lightblue";
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
  
    dibujarPuntuacion() {
      this.ctx.fillStyle = "black";
      this.ctx.font = "24px sans-serif";
      this.ctx.fillText(`Puntuación: ${this.puntuacion}`, 10, 30);
    }
  
    actualizar(dt) {
        super.actualizar(dt);
        this.pajaro.actualizar(dt);
      
        // Actualiza obstáculos
        for (let obstaculo of this.obstaculos) {
          obstaculo.actualizar(dt);
      
          // Verifica colisión con pájaro
          if (this.colision(this.pajaro, obstaculo)) {
            this.gameOver();
            return;
          }
      
          // Quitar  obstáculo si salió de la pantalla del juego 
          if (obstaculo.x + obstaculo.ancho < 0) {
            this.obstaculos.splice(this.obstaculos.indexOf(obstaculo), 1);
            this.puntuacion += 1;
          }
        }
      
        // Actualizar suelo
        this.suelo.actualizar(dt);
      
        // Verifica si el pájaro tocó el suelo
        if (this.pajaro.y + this.pajaro.alto >= this.suelo.y) {
          this.gameOver();
          return;
        }
      }
    }      