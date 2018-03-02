new Vue({
  el: "#app",

  data: {
    inGame: false,

    playerHealth: 100,
    cooldown: 0,
    monsterHealth: 200,

    log: []
  },

  methods: {
    rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    start() {
      this.inGame = true;
      this.cooldown = 0;
      this.playerHealth = 100;
      this.monsterHealth = 200;
      this.turns = [];
    },

    checkState() {
      if (this.log.length > 10) this.log.length = 10;

      if (this.monsterHealth <= 0) {
        this.monsterHealth = 0;

        if (confirm("You won! Play Again?")) this.start();
        else this.inGame = false;

        return true;
      } else if (this.playerHealth <= 0) {
        this.playerHealth = 0;

        if (confirm("You lost. Play Again?")) this.start();
        else this.inGame = false;

        return true;
      }

      return false;
    },

    monster() {
      if(this.checkState()) return;
      this.cooldown = Math.max(this.cooldown - 1, 0);
      var damage;
      if (Math.random() < 0.2) damage = this.rand(15, 20);
      else damage = this.rand(5, 10);
      this.playerHealth -= damage;
      this.log.unshift({
        player: false,
        text: `${ damage >= 15 ? "Critical Hit!" : "" } The monster hit you for ${ damage }.`
      });
      this.checkState();
    },

    attack() {
      var damage = this.rand(3, 10);
      this.monsterHealth -= damage;
      this.log.unshift({
        player: true,
        text: `You hit the monster for ${ damage }.`
      });
      this.monster();
    },
    special() {
      if (this.cooldown !== 0) return;
      this.cooldown = 4;

      var damage = this.rand(8, 15);
      this.monsterHealth -= damage;
      this.log.unshift({
        player: true,
        text: `You used a special attack on the monster for ${ damage }.`
      });

      this.monster();
    },
    heal() {
      this.playerHealth = Math.min(this.playerHealth + 15, 100);
      this.log.unshift({
        player: true,
        text: `You healed for 15.`
      });
      this.monster();
    },
    giveUp() {
      this.inGame = false;
      this.turns = [];
    }
  }
});